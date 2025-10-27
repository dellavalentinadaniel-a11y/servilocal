# 🚀 Backend Real para Sistema de Mensajería

## 📋 Resumen

Esta guía explica cómo configurar y usar el backend real con **Node.js + Express + MongoDB + Socket.io** para el sistema de mensajería de ServiLocal.

---

## 🏗️ Arquitectura

```text
┌──────────────────────────────────────────────────────────┐
│                      FRONTEND                            │
│  mensajes.html + mensajes-backend.js                     │
│  - Interface de usuario                                   │
│  - Manejo de estado local                                │
│  - Llamadas API REST                                     │
│  - Conexión WebSocket                                    │
└────────────┬─────────────────────────────────────────────┘
             │
             │ HTTP/HTTPS + WebSocket
             │
┌────────────▼─────────────────────────────────────────────┐
│                    BACKEND SERVER                         │
│  server.js (Node.js + Express + Socket.io)              │
│                                                           │
│  ┌──────────────────┐  ┌─────────────────────────────┐ │
│  │   REST API       │  │     WebSocket Server        │ │
│  │                  │  │                             │ │
│  │ /auth/login      │  │ connection                  │ │
│  │ /auth/register   │  │ message:send                │ │
│  │ /conversations   │  │ message:received            │ │
│  │ /messages        │  │ typing:start/stop           │ │
│  └──────────────────┘  └─────────────────────────────┘ │
│                                                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │            Middleware                             │  │
│  │  - Autenticación JWT                              │  │
│  │  - Rate Limiting                                  │  │
│  │  - CORS                                           │  │
│  │  - Helmet (Seguridad)                             │  │
│  └───────────────────────────────────────────────────┘  │
└────────────┬─────────────────────────────────────────────┘
             │
             │ MongoDB Driver
             │
┌────────────▼─────────────────────────────────────────────┐
│                    BASE DE DATOS                          │
│  MongoDB (Local o Atlas)                                  │
│                                                           │
│  Colecciones:                                            │
│  - users         (usuarios)                              │
│  - conversations (conversaciones)                         │
│  - messages      (mensajes)                              │
└───────────────────────────────────────────────────────────┘
```

---

## 📦 Instalación

### Paso 1 — Instalar MongoDB

#### Opción A — MongoDB Local

```bash
# En Fedora/RHEL
sudo dnf install mongodb-org

# Iniciar servicio
sudo systemctl start mongod
sudo systemctl enable mongod

# Verificar
mongo --version
```

#### Opción B — MongoDB Atlas (Cloud recomendado)

1. Ir a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cuenta gratuita
3. Crear un cluster (Free tier disponible)
4. Obtener connection string
5. Configurar en `.env`

### Paso 2 — Instalar Node.js

```bash
# Verificar si ya está instalado
node --version
npm --version

# Si no está instalado (Fedora):
sudo dnf install nodejs npm
```

### Paso 3 — Configurar el Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus datos
nano .env
```

### Paso 4 — Configurar Variables de Entorno

Editar `backend/.env`:

```env
PORT=3000
NODE_ENV=development

# MongoDB - Elegir una opción:
# Local:
MONGODB_URI=mongodb://localhost:27017/servilocal

# O Cloud (MongoDB Atlas):
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/servilocal

# JWT Secret - CAMBIAR en producción!
JWT_SECRET=mi_secreto_super_seguro_12345

# CORS (URLs del frontend)
ALLOWED_ORIGINS=http://localhost:8080,http://localhost:5500,http://127.0.0.1:5500
```

---

## 🚀 Ejecutar el Servidor

```bash
# Modo desarrollo (con auto-reload)
npm run dev

# O modo producción
npm start
```

Deberías ver:

```text
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 ServiLocal Backend Server                ║
║                                               ║
║   Servidor:  http://localhost:3000            ║
║   API:       http://localhost:3000/api        ║
║   Estado:    http://localhost:3000/api/health ║
║                                               ║
║   WebSocket: ws://localhost:3000              ║
║                                               ║
║   Entorno:   development                      ║
║                                               ║
╚═══════════════════════════════════════════════╝

✅ Conectado a MongoDB
```

---

## 🔌 API REST Endpoints

### Autenticación

#### Registrar Usuario

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "userName": "Juan Pérez"
}

Response 201:
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "email": "usuario@ejemplo.com",
    "userName": "Juan Pérez",
    "avatar": "imagenes/perfile/images%20(1).png",
    "isOnline": false
  }
}
```

#### Iniciar Sesión

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}

Response 200:
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

#### Cerrar Sesión

```http
POST /api/auth/logout
Content-Type: application/json

{
  "userId": "65abc123..."
}

Response 200:
{
  "message": "Sesión cerrada exitosamente"
}
```

### Conversaciones

#### Obtener Conversaciones

```http
GET /api/conversations
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "65def456...",
    "userId": "65abc123...",
    "userName": "María González",
    "userAvatar": "imagenes/avatar.jpg",
    "isOnline": true,
    "lastMessage": "Hola, ¿cómo estás?",
    "lastMessageTime": "2025-10-26T10:30:00.000Z",
    "unreadCount": 2
  },
  ...
]
```

#### Crear Conversación

```http
POST /api/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "65abc123..."
}

Response 201:
{
  "id": "65def456...",
  "userId": "65abc123...",
  "userName": "María González",
  ...
}
```

### Mensajes

#### Obtener Mensajes

```http
GET /api/messages/:conversationId?page=1&limit=50
Authorization: Bearer <token>

Response 200:
{
  "messages": [
    {
      "_id": "65ghi789...",
      "conversationId": "65def456...",
      "senderId": {
        "_id": "65abc123...",
        "userName": "Juan Pérez",
        "avatar": "..."
      },
      "text": "Hola!",
      "status": "read",
      "timestamp": "2025-10-26T10:30:00.000Z"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 125,
    "pages": 3
  }
}
```

#### Enviar Mensaje (API)

```http
POST /api/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "conversationId": "65def456...",
  "text": "Hola, ¿cómo estás?",
  "recipientId": "65abc123..."
}

Response 201:
{
  "_id": "65ghi789...",
  "conversationId": "65def456...",
  "senderId": "...",
  "text": "Hola, ¿cómo estás?",
  "status": "sent",
  "timestamp": "2025-10-26T10:30:00.000Z"
}
```

#### Marcar como Leído

```http
PATCH /api/messages/:conversationId/read
Authorization: Bearer <token>

Response 200:
{
  "message": "Mensajes marcados como leídos"
}
```

---

## 🔌 WebSocket Events

### Cliente → Servidor

#### Unirse a Conversación

```javascript
socket.emit('conversation:join', conversationId);
```

#### Enviar Mensaje (WebSocket)

```javascript
socket.emit('message:send', {
  conversationId: '65def456...',
  text: 'Hola!',
  recipientId: '65abc123...'
});
```

#### Empezar a Escribir

```javascript
socket.emit('typing:start', {
  conversationId: '65def456...',
  recipientId: '65abc123...'
});
```

#### Dejar de Escribir

```javascript
socket.emit('typing:stop', {
  conversationId: '65def456...',
  recipientId: '65abc123...'
});
```

### Servidor → Cliente

#### Mensaje Recibido

```javascript
socket.on('message:received', (data) => {
  console.log('Nuevo mensaje:', data);
  // data = { id, conversationId, senderId, text, timestamp, status }
});
```

#### Estado de Mensaje Actualizado

```javascript
socket.on('message:statusUpdate', (data) => {
  console.log('Estado actualizado:', data);
  // data = { messageId, status }
});
```

#### Usuario Escribiendo

```javascript
socket.on('typing:update', (data) => {
  console.log('Usuario escribiendo:', data);
  // data = { conversationId, userId, userName, isTyping }
});
```

#### Usuario En Línea/Offline

```javascript
socket.on('user:online', (data) => {
  console.log('Usuario conectado:', data);
});

socket.on('user:offline', (data) => {
  console.log('Usuario desconectado:', data);
});
```

---

## 🔐 Autenticación JWT

### Cómo Funciona

1. Usuario hace login
2. Servidor genera un JWT token
3. Cliente guarda el token (localStorage)
4. Cliente incluye el token en cada request:
   - REST API: Header `Authorization: Bearer <token>`
   - WebSocket: En `socket.handshake.auth.token`

### Estructura del Token

```javascript
{
  userId: "65abc123...",
  userName: "Juan Pérez",
  email: "juan@ejemplo.com",
  iat: 1698334800,  // Issued at
  exp: 1698939600   // Expires (7 días)
}
```

---

## 🧪 Probar la API

### Con cURL

```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456","userName":"Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Obtener conversaciones (reemplazar TOKEN)
curl -X GET http://localhost:3000/api/conversations \
  -H "Authorization: Bearer TOKEN_AQUI"
```

### Con Postman/Insomnia

1. Importar colección de requests
2. Configurar variable de entorno `baseUrl = http://localhost:3000/api`
3. Después del login, guardar token
4. Usar token en requests protegidas

---

## 🌐 Actualizar Frontend

### 1. Agregar Socket.io Client

En `mensajes.html`, antes del cierre de `</body>`:

```html
<!-- Socket.io Client -->
<script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>

<!-- Cliente de mensajería con backend -->
<script src="js/mensajes-backend.js"></script>
```

### 2. Configurar URL del Backend

En `js/mensajes-backend.js`, línea 6-9:

```javascript
const CONFIG = {
  API_URL: 'http://localhost:3000/api',  // Cambiar en producción
  WS_URL: 'http://localhost:3000',        // Cambiar en producción
  TOKEN_KEY: 'servilocal_token',
  USER_KEY: 'servilocal_user'
};
```

---

## 🚀 Deployment (Producción)

### Opciones de Hosting

#### 1. Backend — Railway/Render/Heroku

```bash
# Ejemplo con Railway
railway login
railway init
railway up
```

#### 2. Base de Datos — MongoDB Atlas

Ya configurado con el connection string en `.env`

#### 3. Frontend — Vercel/Netlify

```bash
# Ejemplo con Vercel
vercel login
vercel --prod
```

### Variables de Entorno en Producción

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=cambiar_por_secreto_seguro_aleatorio
ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com
```

---

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

```bash
# Con PM2
pm2 logs servilocal-backend

# O directo
tail -f logs/app.log
```

### Endpoint de Salud

```http
GET /api/health

Response:
{
  "status": "ok",
  "timestamp": "2025-10-26T10:30:00.000Z",
  "uptime": 3600
}
```

---

## 🔒 Seguridad

### Implementado

- ✅ JWT para autenticación
- ✅ Bcrypt para hash de contraseñas
- ✅ Helmet para headers de seguridad
- ✅ CORS configurado
- ✅ Rate limiting (100 requests/15min)
- ✅ Validación de inputs
- ✅ MongoDB injection protection

### Recomendaciones Adicionales

1. **HTTPS**: Usar siempre en producción
2. **Variables de entorno**: Nunca commitear `.env`
3. **Secrets**: Usar secretos aleatorios fuertes
4. **Firewall**: Configurar reglas apropiadas
5. **Backups**: Hacer backups regulares de la BD
6. **Logs**: Monitorear logs de errores
7. **Updates**: Mantener dependencias actualizadas

---

## 🐛 Troubleshooting

### Error — No se puede conectar a MongoDB

```bash
# Verificar que MongoDB esté corriendo
sudo systemctl status mongod

# O verificar connection string en .env
```

### Error — CORS

```env
# Agregar URL del frontend a ALLOWED_ORIGINS en .env
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
```

### Error — Token inválido

- Verificar que el token sea correcto
- Verificar que JWT_SECRET sea el mismo
- El token expira en 7 días por defecto

### WebSocket no conecta

- Verificar firewall
- Verificar que el servidor esté corriendo
- Verificar URL en CONFIG.WS_URL
- Revisar console del navegador

---

## 📈 Escalabilidad

### Para grandes volúmenes de usuarios

1. **Redis**: Para caché y sesiones

    ```javascript
    const redis = require('redis');
    const client = redis.createClient();
    ```

2. **Load Balancer**: Nginx o similar

3. **Múltiples instancias**: Con PM2 cluster mode

4. **CDN**: Para archivos estáticos

5. **Database sharding**: Para millones de mensajes

---

## 📚 Próximos Pasos

1. ✅ Backend funcionando localmente
2. ⬜ Agregar envío de imágenes (Multer)
3. ⬜ Implementar notificaciones push
4. ⬜ Agregar mensajes de voz
5. ⬜ Deploy a producción
6. ⬜ Tests automatizados
7. ⬜ CI/CD pipeline

---

¡Backend listo para usar! 🎉

Para dudas o problemas, revisar los logs del servidor o la consola del navegador.
