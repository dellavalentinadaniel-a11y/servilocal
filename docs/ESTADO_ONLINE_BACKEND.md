# 🟢 Sistema de Estado Online (isOnline)

## ¿Qué es `isOnline`?

`isOnline` es un **indicador booleano** que muestra si un proveedor está **conectado y disponible en tiempo real** para recibir mensajes instantáneos.

### Estados posibles:

- **`true` (verde 🟢)**: El proveedor está conectado al sistema
  - Verá los mensajes inmediatamente
  - Puede responder en tiempo real
  - El cliente sabrá que puede esperar una respuesta rápida

- **`false` (gris ⚪)**: El proveedor está desconectado
  - Recibirá los mensajes cuando vuelva a conectarse
  - El sistema puede enviar notificaciones push/email
  - El cliente verá que la respuesta puede demorar

---

## 🔴 Implementación Actual (TEMPORAL)

### Frontend (simulado)
```javascript
// En js/busqueda.js y proveedor.html
isOnline: Math.random() > 0.5  // ⚠️ TEMPORAL: 50% de probabilidad
```

**Problema:** Esto genera un estado aleatorio cada vez, no refleja la realidad.

---

## ✅ Implementación Correcta con Backend

### 1. Backend con Socket.io

#### Tracking de conexiones activas
```javascript
// backend/server.js
const connectedUsers = new Map(); // Map<userId, socketId>

io.on('connection', (socket) => {
  const userId = socket.user.id; // Del token JWT
  
  // Marcar usuario como online
  connectedUsers.set(userId, socket.id);
  
  // Notificar a todos que este usuario está online
  io.emit('user:online', { userId, isOnline: true });
  
  socket.on('disconnect', () => {
    // Marcar como offline
    connectedUsers.delete(userId);
    io.emit('user:online', { userId, isOnline: false });
  });
});
```

#### API para consultar estado
```javascript
// Endpoint REST para obtener estado de múltiples usuarios
app.get('/api/users/status', async (req, res) => {
  const userIds = req.query.ids.split(','); // ?ids=1,2,3,4,5
  
  const statuses = userIds.map(id => ({
    userId: id,
    isOnline: connectedUsers.has(id),
    lastSeen: !connectedUsers.has(id) ? getLastSeenFromDB(id) : null
  }));
  
  res.json(statuses);
});
```

---

### 2. Frontend - Cargar estado real

#### Al renderizar resultados de búsqueda
```javascript
// js/busqueda.js
async function renderizarResultados(resultados) {
  // 1. Renderizar tarjetas primero
  container.innerHTML = resultados.map(crearTarjetaResultado).join('');
  
  // 2. Obtener IDs de todos los proveedores
  const proveedorIds = resultados.map(p => p.id).join(',');
  
  // 3. Consultar estado online desde backend
  try {
    const response = await fetch(
      `${API_URL}/users/status?ids=${proveedorIds}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    const statuses = await response.json();
    
    // 4. Actualizar indicadores visuales
    statuses.forEach(status => {
      const indicator = document.querySelector(
        `[data-proveedor-id="${status.userId}"] .status-indicator`
      );
      if (indicator) {
        indicator.classList.toggle('online', status.isOnline);
        indicator.title = status.isOnline 
          ? 'Conectado ahora' 
          : `Última vez: ${status.lastSeen}`;
      }
    });
  } catch (error) {
    console.error('Error obteniendo estados online:', error);
  }
}
```

#### Actualización en tiempo real con WebSocket
```javascript
// js/chat-flotante.js
state.socket.on('user:online', (data) => {
  // Actualizar indicadores en todas las tarjetas
  const indicators = document.querySelectorAll(
    `[data-proveedor-id="${data.userId}"] .status-indicator`
  );
  
  indicators.forEach(indicator => {
    indicator.classList.toggle('online', data.isOnline);
  });
  
  // Actualizar en ventanas de chat abiertas
  const ventana = state.ventanas.get(data.userId);
  if (ventana) {
    const estado = ventana.ventana.querySelector('.c-chat-ventana__estado');
    if (estado) {
      estado.textContent = data.isOnline ? 'Activo' : 'Desconectado';
      estado.classList.toggle('c-chat-ventana__estado--activo', data.isOnline);
    }
  }
});
```

---

### 3. Botón "Contactar" con estado real

#### Modificar `js/busqueda.js`
```javascript
function inicializarBotonesContactar() {
  const botonesContactar = document.querySelectorAll('.js-contactar-proveedor');
  
  botonesContactar.forEach(boton => {
    boton.addEventListener('click', async function() {
      const proveedorId = this.dataset.proveedorId;
      const proveedorNombre = this.dataset.proveedorNombre;
      const proveedorAvatar = this.dataset.proveedorAvatar;

      // Verificar autenticación
      const token = localStorage.getItem('servilocal_token');
      if (!token) {
        const returnUrl = encodeURIComponent(window.location.href);
        window.location.href = `login.html?redirect=${returnUrl}`;
        return;
      }

      // ✅ OBTENER ESTADO REAL del backend
      let isOnline = false;
      try {
        const response = await fetch(
          `${API_URL}/users/status?ids=${proveedorId}`,
          {
            headers: { 'Authorization': `Bearer ${token}` }
          }
        );
        const [status] = await response.json();
        isOnline = status.isOnline;
      } catch (error) {
        console.warn('No se pudo obtener estado online:', error);
      }

      // Abrir chat flotante
      if (window.ChatFlotante && window.ChatFlotante.abrirChat) {
        window.ChatFlotante.abrirChat({
          id: proveedorId,
          userId: proveedorId,
          userName: proveedorNombre,
          userAvatar: proveedorAvatar,
          isOnline: isOnline  // ✅ Estado real del backend
        });
      }
    });
  });
}
```

---

## 🎨 Indicadores Visuales

### En tarjetas de resultados
```html
<div class="c-result-card__header">
  <img src="..." alt="..." class="c-result-card__avatar">
  <span class="status-indicator" 
        data-status="online"
        title="Conectado ahora">
  </span>
</div>
```

### CSS para indicador
```css
.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-gris-claro);
  border: 2px solid var(--color-blanco);
  transition: background 0.3s ease;
}

.status-indicator.online {
  background: #44b700; /* Verde brillante */
  box-shadow: 0 0 0 2px rgba(68, 183, 0, 0.3);
}
```

---

## 📊 Base de Datos

### Modelo User (MongoDB)
```javascript
const userSchema = new mongoose.Schema({
  _id: ObjectId,
  name: String,
  email: String,
  // ... otros campos ...
  
  // Estado de conexión
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isOnline: {
    type: Boolean,
    default: false
  }
});

// Actualizar lastSeen al desconectarse
userSchema.methods.setOffline = function() {
  this.isOnline = false;
  this.lastSeen = new Date();
  return this.save();
};
```

---

## 🔄 Flujo Completo

### 1. Usuario se conecta
```
Cliente carga página → Socket.io conecta → Backend recibe connection
    ↓
Backend marca userId como online en Map
    ↓
Backend emite evento 'user:online' a todos los conectados
    ↓
Todos los frontends actualizan indicadores visuales
```

### 2. Usuario abre chat
```
Click en "Contactar" → Frontend consulta estado actual
    ↓
GET /api/users/status?ids=1
    ↓
Backend responde { userId: 1, isOnline: true }
    ↓
Frontend abre ventana con indicador correcto
```

### 3. Usuario se desconecta
```
Cliente cierra pestaña → Socket.io desconecta → Backend recibe disconnect
    ↓
Backend elimina userId del Map
    ↓
Backend actualiza DB: lastSeen = now, isOnline = false
    ↓
Backend emite 'user:online' con isOnline: false
    ↓
Todos los frontends actualizan a gris
```

---

## ⚡ Optimizaciones

### 1. Caché en memoria (Redis)
```javascript
// Usar Redis para estados online (más rápido que DB)
const redis = require('redis');
const client = redis.createClient();

// Al conectar
client.sadd('online_users', userId);

// Al desconectar
client.srem('online_users', userId);

// Consultar estado
const isOnline = await client.sismember('online_users', userId);
```

### 2. Batch requests
```javascript
// En lugar de consultar uno por uno:
// ❌ GET /status/1, GET /status/2, GET /status/3...

// Consultar en batch:
// ✅ GET /status?ids=1,2,3,4,5,6,7,8,9,10
```

### 3. Heartbeat para detectar desconexiones
```javascript
// Backend - detectar clientes inactivos
setInterval(() => {
  io.sockets.sockets.forEach((socket) => {
    if (Date.now() - socket.lastActivity > 60000) { // 1 min sin actividad
      socket.disconnect();
    }
  });
}, 30000); // Cada 30 segundos
```

---

## 🐛 Casos Edge

### Usuario con múltiples pestañas/dispositivos
```javascript
// Usar Set en lugar de Map
const connectedUsers = new Map(); // Map<userId, Set<socketId>>

io.on('connection', (socket) => {
  const userId = socket.user.id;
  
  if (!connectedUsers.has(userId)) {
    connectedUsers.set(userId, new Set());
  }
  connectedUsers.get(userId).add(socket.id);
  
  // Solo emitir 'online' si era la primera conexión
  if (connectedUsers.get(userId).size === 1) {
    io.emit('user:online', { userId, isOnline: true });
  }
  
  socket.on('disconnect', () => {
    connectedUsers.get(userId).delete(socket.id);
    
    // Solo emitir 'offline' si fue la última conexión
    if (connectedUsers.get(userId).size === 0) {
      connectedUsers.delete(userId);
      io.emit('user:online', { userId, isOnline: false });
    }
  });
});
```

---

## 📝 Checklist de Implementación

- [ ] Backend: Instalar y configurar Socket.io
- [ ] Backend: Implementar tracking de conexiones
- [ ] Backend: Crear endpoint GET /api/users/status
- [ ] Backend: Emit eventos 'user:online' en connect/disconnect
- [ ] Backend: Actualizar DB con lastSeen en disconnect
- [ ] Frontend: Remover `Math.random()` de todos los archivos
- [ ] Frontend: Implementar fetch a /api/users/status
- [ ] Frontend: Escuchar eventos WebSocket 'user:online'
- [ ] Frontend: Actualizar indicadores visuales en tiempo real
- [ ] CSS: Agregar estilos para `.status-indicator.online`
- [ ] Testing: Probar con múltiples dispositivos
- [ ] Testing: Probar desconexión repentina (cerrar pestaña)

---

## 🎯 Resultado Final

**Antes (simulado):**
```javascript
isOnline: Math.random() > 0.5  // ⚠️ Aleatorio
```

**Después (real):**
```javascript
isOnline: status.isOnline  // ✅ Estado real desde backend
```

El usuario verá:
- 🟢 **Verde** = "Este proveedor está conectado AHORA, me responderá rápido"
- ⚪ **Gris** = "Este proveedor está offline, puede demorar en responder"

---

**Última actualización:** 27 de octubre de 2025  
**Estado:** Pendiente de implementación en backend
