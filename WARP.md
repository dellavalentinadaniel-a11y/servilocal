# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Comandos comunes

- Instalación (raíz, sitio estático):
```bash path=null start=null
npm install
npm run prepare   # instala hooks de Husky
```
- Lint de CSS (raíz):
```bash path=null start=null
npm run lint:css
npm run lint:css:fix
```
- Servir el sitio estático (raíz):
```bash path=null start=null
python -m http.server 8000
# o
npx http-server
```

- Backend (Node/Express + MongoDB):
```bash path=null start=null
cd backend
npm install
cp .env.example .env  # configurar variables
npm run check:db      # prueba de conexión a MongoDB
npm run dev           # nodemon
# producción
npm start
```
- Salud backend y prueba rápida:
```bash path=null start=null
curl -s http://localhost:${PORT:-3000}/api/health | jq .
```
- Tests (backend, Jest):
```bash path=null start=null
cd backend
npm test
# un solo archivo o test por nombre
npm test -- path/to/file.test.js -t "nombre del test"
```
- Ejemplo Next.js de portfolio (no integrado con el resto):
```bash path=null start=null
cd imagenes/perfilemuestra/portfolio-website
npm install
npm run dev    # desarrollo
npm run build && npm start
npm run lint
```

## Arquitectura y organización

- Visión general
  - Monorepo sencillo con tres áreas:
    - Raíz: sitio estático HTML/CSS/JS para ServiLocal, con Stylelint y Husky.
    - backend/: API REST en Express + tiempo real con Socket.IO + MongoDB/Mongoose.
    - imagenes/perfilemuestra/portfolio-website/: app de ejemplo Next.js (aislada).

- Frontend estático (raíz)
  - CSS con design tokens en `css/tokens.css` y componentes en `css/components.css` siguiendo BEM/kebab-case.
  - Scripts modulares en `js/` para funcionalidades: accesibilidad, formularios, componentes, PWA, chat, etc.
  - Integración de mensajería real con el backend en `js/mensajes-backend.js`:
    - REST: `http://localhost:3000/api` para auth, conversaciones y mensajes.
    - WebSocket: `ws://localhost:3000` con autenticación por JWT en el handshake.

- Backend (backend/)
  - Server: `server.js` monta Express y Socket.IO, seguridad con Helmet, CORS configurable, compresión y rate limiting.
  - Autenticación: JWT vía header `Authorization: Bearer <token>` para REST y `handshake.auth.token` en Socket.IO. Middleware en `middleware/auth.js` con helpers `authenticate` y `generateToken`.
  - Modelos Mongoose:
    - `models/User.js`: email/password con hash, `userName`, estado online, `toPublic()`.
    - `models/Conversation.js`: `participants[]`, `lastMessage`, `unreadCount` (Map), índices y helpers `getUserConversations()` y `findOrCreate()`.
    - `models/Message.js`: `conversationId`, `senderId`, `text`, `status` (sent/delivered/read), adjuntos; helpers `getConversationMessages()` y `markAsRead()`.
  - Rutas REST (todas bajo `/api/`):
    - `auth`: registro, login, logout.
    - `conversations`: listar, crear/obtener entre 2 usuarios, borrar.
    - `messages`: listar por conversación (paginado), enviar, marcar leídos, borrar lógico.
  - Eventos WebSocket relevantes:
    - `conversation:join` / `conversation:leave` para salas por conversación.
    - `message:send` emite `message:received` a la sala y `notification:newMessage` al destinatario conectado.
    - `message:read` emite `message:statusUpdate`.
    - `typing:start` / `typing:stop` emiten `typing:update`.
    - Presencia: `user:online` / `user:offline` broadcast.
  - Variables de entorno claves (`backend/.env.example`): `PORT`, `MONGODB_URI`, `JWT_SECRET`, `ALLOWED_ORIGINS`, `RATE_LIMIT_*`.
  - Utilidades:
    - `npm run check:db` valida conexión MongoDB (usa `test-mongo.js`).
    - `start.sh` hace verificación de entorno y lanza `npm run dev`.

- App Next.js de ejemplo
  - Ubicada en `imagenes/perfilemuestra/portfolio-website/`. Scripts estándar de Next (`dev`, `build`, `start`, `lint`). No forma parte del build del sitio raíz ni del backend.

## Reglas y convenciones relevantes (derivadas de .github/copilot-instructions.md y tooling)

- CSS
  - Usar tokens de diseño desde `css/tokens.css` (no hardcodear valores).
  - BEM/kebab-case para clases: `c-bloque__elemento--modificador`. Stylelint valida con `selector-class-pattern` y hooks de Husky ejecutan lint en pre-commit.
  - Diseño responsive mobile-first; color system moderno (p. ej. `color-mix()`), y variables CSS.

- Accesibilidad y HTML
  - Estructura semántica consistente, ARIA labels/roles, skip links, focus management y soporte de teclado.
  - Los módulos JS corresponden a responsabilidades claras: accesibilidad, componentes, formularios, cookies (GDPR), mapa, etc.

- Mensajería
  - En `js/mensajes-backend.js` se almacena el JWT en `localStorage` y se usa tanto para REST como para Socket.IO. La UI se alimenta de listas paginadas de mensajes y contadores de no leídos por conversación.

## Puntos operativos

- El backend escucha en `PORT` (por defecto 3000) y expone `/api/health` para chequeo.
- Para que la mensajería real funcione desde el frontend estático, iniciar el backend y configurar `ALLOWED_ORIGINS` para el origen del sitio.
- Si no hay tests aún en `backend/`, Jest está configurado y listo para agregar `*.test.js`.
