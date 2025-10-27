/**
 * Servidor Backend para Sistema de Mensajería - ServiLocal
 * Incluye REST API y WebSockets para tiempo real
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Importar rutas
const authRoutes = require('./routes/auth');
const conversationRoutes = require('./routes/conversations');
const messageRoutes = require('./routes/messages');

// Importar middleware
const { authenticate } = require('./middleware/auth');

// Crear aplicación Express
const app = express();
const server = http.createServer(app);

// Configurar Socket.io con CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ============================================
// MIDDLEWARE
// ============================================

// Seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Comprimir respuestas
app.use(compression());

// Parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: 'Demasiadas solicitudes, intenta de nuevo más tarde'
});
app.use('/api/', limiter);

// ============================================
// CONEXIÓN A BASE DE DATOS
// ============================================

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/servilocal', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error conectando a MongoDB:', err));

// ============================================
// RUTAS REST API
// ============================================

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas (requieren autenticación)
app.use('/api/conversations', authenticate, conversationRoutes);
app.use('/api/messages', authenticate, messageRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ============================================
// WEBSOCKET - MANEJO DE CONEXIONES EN TIEMPO REAL
// ============================================

// Almacenar usuarios conectados
const connectedUsers = new Map();

// Middleware de autenticación para Socket.io
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Token no proporcionado'));
    }
    
    // Verificar token JWT
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    socket.userId = decoded.userId;
    socket.userName = decoded.userName;
    
    next();
  } catch (error) {
    next(new Error('Autenticación fallida'));
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 Usuario conectado: ${socket.userName} (${socket.userId})`);
  
  // Registrar usuario conectado
  connectedUsers.set(socket.userId, {
    socketId: socket.id,
    userName: socket.userName,
    connectedAt: new Date()
  });
  
  // Notificar a otros usuarios que este usuario está en línea
  socket.broadcast.emit('user:online', {
    userId: socket.userId,
    userName: socket.userName
  });
  
  // ============================================
  // EVENTOS DE MENSAJES
  // ============================================
  
  // Unirse a una conversación (sala)
  socket.on('conversation:join', (conversationId) => {
    socket.join(`conversation:${conversationId}`);
    console.log(`👥 ${socket.userName} se unió a conversación ${conversationId}`);
  });
  
  // Salir de una conversación
  socket.on('conversation:leave', (conversationId) => {
    socket.leave(`conversation:${conversationId}`);
    console.log(`👋 ${socket.userName} salió de conversación ${conversationId}`);
  });
  
  // Enviar mensaje
  socket.on('message:send', async (data) => {
    try {
      const { conversationId, text, recipientId } = data;
      
      // Guardar mensaje en la base de datos
      const Message = require('./models/Message');
      const message = await Message.create({
        conversationId,
        senderId: socket.userId,
        text,
        timestamp: new Date(),
        status: 'sent'
      });
      
      // Emitir mensaje a la sala de la conversación
      io.to(`conversation:${conversationId}`).emit('message:received', {
        id: message._id,
        conversationId,
        senderId: socket.userId,
        senderName: socket.userName,
        text,
        timestamp: message.timestamp,
        status: 'delivered'
      });
      
      // Notificar al destinatario si está conectado
      const recipient = connectedUsers.get(recipientId);
      if (recipient) {
        io.to(recipient.socketId).emit('notification:newMessage', {
          conversationId,
          senderId: socket.userId,
          senderName: socket.userName,
          preview: text.substring(0, 50)
        });
      }
      
      console.log(`📨 Mensaje enviado en conversación ${conversationId}`);
      
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      socket.emit('message:error', { error: 'Error al enviar mensaje' });
    }
  });
  
  // Mensaje leído
  socket.on('message:read', async (data) => {
    try {
      const { messageId, conversationId } = data;
      
      // Actualizar estado en base de datos
      const Message = require('./models/Message');
      await Message.findByIdAndUpdate(messageId, { status: 'read' });
      
      // Notificar al remitente
      io.to(`conversation:${conversationId}`).emit('message:statusUpdate', {
        messageId,
        status: 'read'
      });
      
    } catch (error) {
      console.error('Error marcando mensaje como leído:', error);
    }
  });
  
  // Usuario escribiendo
  socket.on('typing:start', (data) => {
    const { conversationId, recipientId } = data;
    
    const recipient = connectedUsers.get(recipientId);
    if (recipient) {
      io.to(recipient.socketId).emit('typing:update', {
        conversationId,
        userId: socket.userId,
        userName: socket.userName,
        isTyping: true
      });
    }
  });
  
  // Usuario dejó de escribir
  socket.on('typing:stop', (data) => {
    const { conversationId, recipientId } = data;
    
    const recipient = connectedUsers.get(recipientId);
    if (recipient) {
      io.to(recipient.socketId).emit('typing:update', {
        conversationId,
        userId: socket.userId,
        isTyping: false
      });
    }
  });
  
  // ============================================
  // DESCONEXIÓN
  // ============================================
  
  socket.on('disconnect', () => {
    console.log(`🔴 Usuario desconectado: ${socket.userName}`);
    
    // Remover de usuarios conectados
    connectedUsers.delete(socket.userId);
    
    // Notificar a otros usuarios
    socket.broadcast.emit('user:offline', {
      userId: socket.userId
    });
  });
  
  // Manejo de errores
  socket.on('error', (error) => {
    console.error('Error en socket:', error);
  });
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 ServiLocal Backend Server                ║
║                                               ║
║   Servidor:  http://localhost:${PORT}          ║
║   API:       http://localhost:${PORT}/api     ║
║   Estado:    http://localhost:${PORT}/api/health ║
║                                               ║
║   WebSocket: ws://localhost:${PORT}            ║
║                                               ║
║   Entorno:   ${process.env.NODE_ENV || 'development'}                   ║
║                                               ║
╚═══════════════════════════════════════════════╝
  `);
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    mongoose.connection.close(false, () => {
      console.log('Conexión a MongoDB cerrada');
      process.exit(0);
    });
  });
});

module.exports = { app, server, io };
