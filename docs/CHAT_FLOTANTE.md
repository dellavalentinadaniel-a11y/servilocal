# 💬 Chat Flotante Estilo Messenger - ServiLocal

Sistema de mensajería en tiempo real con ventanas flotantes inspiradas en Facebook Messenger.

## ✨ Características

- **Icono de notificaciones**: Badge animado con contador de mensajes no leídos
- **Ventanas flotantes**: Hasta 3 chats abiertos simultáneamente en la parte inferior
- **Diseño Messenger**: Burbujas de chat con degradados, avatares circulares, animaciones suaves
- **Tiempo real**: WebSocket para mensajes instantáneos
- **Indicador de escritura**: Animación "está escribiendo..." en tiempo real
- **Sonidos**: Notificación sonora al recibir mensajes
- **Responsive**: Se adapta a móviles con ventanas full-screen
- **Minimizar/Maximizar**: Control completo de las ventanas

## 🎨 Estilo Visual

### Colores
- **Mensajes propios**: Gradiente azul (#4338CA → #0084ff)
- **Mensajes recibidos**: Fondo blanco sobre gris claro (#f0f2f5)
- **Badge notificaciones**: Gradiente rojo (#ff4458 → #ff0844)
- **Header ventanas**: Gradiente azul con efecto glassmorphism

### Animaciones
- Slide-in desde abajo al abrir ventana
- Slide-in desde derecha para lista de conversaciones
- Pulse en badge de notificaciones
- Animación de puntos "escribiendo..."
- Fade-in para mensajes nuevos

## 🚀 Uso

### Inclusión en páginas

Añade estos archivos al final del `<body>`:

```html
<!-- Socket.io para tiempo real -->
<script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>

<!-- Chat flotante -->
<link rel="stylesheet" href="css/chat-flotante.css">
<script src="js/chat-flotante.js"></script>
```

El chat se inicializa automáticamente si el usuario está logueado.

### Abrir chat programáticamente

```javascript
// Abrir ventana de chat con un usuario específico
ChatFlotante.abrirChat({
  id: '123',
  userName: 'Juan Pérez',
  userAvatar: '/imagenes/avatar.jpg',
  isOnline: true
});
```

### Actualizar badge de notificaciones

```javascript
// Actualizar contador de mensajes no leídos
ChatFlotante.actualizarBadge(5);
```

## 🔧 Configuración

### Variables de configuración en `js/chat-flotante.js`:

```javascript
const state = {
  API_URL: 'http://localhost:3000/api',  // URL del backend
  WS_URL: 'http://localhost:3000',       // URL WebSocket
  maxVentanas: 3,                        // Máximo de ventanas abiertas
  mensajesNoLeidos: 0                    // Contador de no leídos
};
```

### Backend requerido

El chat requiere un backend con:

- **API REST**:
  - `GET /api/conversations` - Listar conversaciones
  - `GET /api/messages/:id` - Obtener mensajes
  - `POST /api/messages` - Enviar mensaje

- **WebSocket** (Socket.io):
  - `conversation:join` - Unirse a conversación
  - `conversation:leave` - Salir de conversación
  - `message:send` - Enviar mensaje
  - `message:received` - Recibir mensaje
  - `typing:start` / `typing:stop` - Indicador de escritura

## 📱 Responsive

### Desktop (> 768px)
- Ventanas flotantes de 320px de ancho
- Hasta 3 ventanas simultáneas
- Lista de conversaciones: 360px de ancho

### Mobile (≤ 768px)
- Ventanas full-screen
- Lista de conversaciones: ancho completo
- Una ventana a la vez

## 🎯 Componentes

### 1. Icono de Mensajes (`.c-chat-icon`)
- Botón circular en navbar
- Badge animado con contador
- Click para abrir lista de conversaciones

### 2. Lista de Conversaciones (`.c-chat-lista`)
- Panel flotante con búsqueda
- Lista scrolleable de chats
- Indicador de estado (online/offline)
- Contador de no leídos por conversación

### 3. Ventana de Chat (`.c-chat-ventana`)
- Header con avatar, nombre y estado
- Área de mensajes con scroll
- Indicador "escribiendo..."
- Input con auto-resize
- Botón de envío

### 4. Mensajes (`.c-chat-mensaje`)
- Burbujas diferenciadas (propios vs recibidos)
- Timestamp
- Animación de entrada

## 🔐 Seguridad

- Requiere autenticación JWT
- Token almacenado en localStorage
- Escape automático de HTML en mensajes
- Validación de origen en backend (CORS)

## 🎨 Personalización CSS

Todas las variables están en `css/tokens.css`:

```css
--color-principal: #4338ca;
--color-principal-hover: #3730a3;
--espacio-pequeno: 0.5rem;
--espacio-medio: 1rem;
--borde-redondeado: 12px;
```

## 🐛 Troubleshooting

### El icono no aparece
- Verifica que el usuario esté logueado
- Revisa localStorage: `servilocal_token` y `servilocal_user`

### No se conecta WebSocket
- Verifica que Socket.io esté cargado
- Revisa la URL en `state.WS_URL`
- Chequea CORS en el backend

### No se cargan mensajes
- Verifica el token JWT en headers
- Revisa la consola por errores de CORS
- Confirma que el backend esté corriendo

## 📄 Estructura de Archivos

```
proyecto/
├── css/
│   └── chat-flotante.css      # Estilos completos del chat
├── js/
│   └── chat-flotante.js        # Lógica del chat
└── index.html                  # Incluye los scripts
```

## 🚀 Próximas Mejoras

- [ ] Envío de imágenes y archivos
- [ ] Reacciones a mensajes (❤️ 👍 😂)
- [ ] Mensajes de voz
- [ ] Videollamadas
- [ ] Stickers y GIFs
- [ ] Modo oscuro
- [ ] Cifrado end-to-end

## 📝 Licencia

MIT © 2025 ServiLocal
