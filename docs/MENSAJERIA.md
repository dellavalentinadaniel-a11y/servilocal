# 📬 Sistema de Mensajería - ServiLocal

## Descripción General

Sistema completo de mensajería en tiempo real (simulado) que permite a los usuarios de ServiLocal comunicarse entre sí de manera segura y eficiente.

## ✨ Características Principales

### 1. **Lista de Conversaciones**

- Vista de todas las conversaciones activas
- Indicadores de mensajes no leídos
- Estado en línea/desconectado de los usuarios
- Búsqueda de conversaciones
- Ordenamiento por última actividad
- Avatar y preview del último mensaje

### 2. **Chat en Tiempo Real**

- Mensajes instantáneos
- Indicador de "escribiendo..."
- Estados de mensaje (enviado, entregado, leído)
- Timestamps de mensajes
- Scroll automático a los nuevos mensajes
- Separadores de fecha

### 3. **Interfaz de Usuario**

- Diseño responsive (mobile y desktop)
- Modo oscuro compatible
- Animaciones suaves
- Notificaciones badge en navbar
- Envío con Enter (Shift+Enter para nueva línea)
- Textarea de altura auto-ajustable

### 4. **Almacenamiento Local**

- Persistencia de conversaciones en localStorage
- Sincronización automática
- Recuperación de datos al recargar

### 5. **Simulaciones (Demo)**

- Mensajes entrantes aleatorios
- Respuestas automáticas
- Estados de conexión
- Indicador de escritura

## 📁 Archivos del Sistema

```text
mi-plataforma-local/
├── mensajes.html          # Página principal de mensajería
├── js/
│   └── mensajes.js       # Lógica del sistema de mensajes
└── docs/
    └── MENSAJERIA.md     # Esta documentación
```

## 🚀 Uso del Sistema

### Abrir la página de mensajes

```html
<a href="mensajes.html">Mis Mensajes</a>
```

### Iniciar una nueva conversación desde cualquier página

```javascript
// Agregar al botón de contactar
function contactarProveedor(userId, userName, userAvatar) {
  let conversations = JSON.parse(localStorage.getItem('servilocal_conversations') || '[]');
  let messages = JSON.parse(localStorage.getItem('servilocal_messages') || '{}');
  
  let conversation = conversations.find(c => c.userId === userId);
  
  if (!conversation) {
    conversation = {
      id: `conv-${Date.now()}`,
      userId: userId,
      userName: userName,
      userAvatar: userAvatar,
      lastMessage: 'Nueva conversación',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      isOnline: Math.random() > 0.5
    };
    
    conversations.unshift(conversation);
    messages[conversation.id] = [];
    
    localStorage.setItem('servilocal_conversations', JSON.stringify(conversations));
    localStorage.setItem('servilocal_messages', JSON.stringify(messages));
  }
  
  window.location.href = `mensajes.html?conv=${conversation.id}`;
}
```

### Ejemplo en HTML

```html
<button 
  class="c-button" 
  onclick="contactarProveedor('user-123', 'Juan Pérez', 'ruta/avatar.jpg')">
  <i class="fas fa-envelope"></i>
  Contactar
</button>
```

## 🎨 Componentes CSS

### Clases Principales

- `.c-messaging` - Container principal del sistema
- `.c-messaging__sidebar` - Barra lateral de conversaciones
- `.c-conversation` - Item de conversación individual
- `.c-messaging__chat` - Área del chat
- `.c-message` - Mensaje individual
- `.c-message.is-own` - Mensaje del usuario actual
- `.c-typing-indicator` - Indicador de escritura

### Estados

- `.is-active` - Conversación actualmente seleccionada
- `.is-unread` - Conversación con mensajes sin leer
- `.is-online` - Usuario en línea
- `.is-offline` - Usuario desconectado

## 📊 Estructura de Datos

### Conversación

```javascript
{
  id: 'conv-1',              // ID único
  userId: 'user-2',          // ID del otro usuario
  userName: 'María González', // Nombre del usuario
  userAvatar: 'ruta.jpg',    // Avatar del usuario
  lastMessage: 'Texto...',   // Último mensaje
  lastMessageTime: Date,     // Timestamp
  unreadCount: 2,            // Mensajes sin leer
  isOnline: true            // Estado de conexión
}
```

### Mensaje

```javascript
{
  id: 'msg-1',              // ID único
  senderId: 'user-1',       // ID del remitente
  text: 'Hola!',           // Contenido del mensaje
  timestamp: Date,          // Fecha y hora
  status: 'read'           // sent | delivered | read
}
```

## 🔧 Funciones Principales

### `initializeMessaging()`

Inicializa el sistema completo al cargar la página.

### `loadSampleData()`

Carga datos de ejemplo o desde localStorage.

### `renderConversations(filter)`

Renderiza la lista de conversaciones con filtro opcional.

### `openConversation(conversationId)`

Abre una conversación específica.

### `renderMessages(conversationId)`

Renderiza los mensajes de una conversación.

### `handleSendMessage(e)`

Maneja el envío de un nuevo mensaje.

### `updateNotificationBadge()`

Actualiza el contador de mensajes no leídos en la navbar.

### `simulateResponse(conversationId)`

Simula una respuesta automática (solo para demo).

## 📱 Responsive Design

### Desktop (> 768px)

- Vista de dos columnas (sidebar + chat)
- Sidebar fijo de 360px
- Todas las funciones visibles

### Mobile (≤ 768px)

- Vista de una columna
- Sidebar ocupa toda la pantalla
- Chat ocupa toda la pantalla
- Botón "Volver" para regresar a conversaciones
- Transiciones suaves entre vistas

## 🎯 Mejoras Futuras (Opcional)

### Características Avanzadas

1. **WebSocket / Real-time**
   - Conexión con servidor en tiempo real
   - Sincronización entre dispositivos
   - Notificaciones push

2. **Multimedia**
   - Envío de imágenes
   - Envío de archivos
   - Mensajes de voz
   - Ubicación

3. **Funcionalidades Adicionales**
   - Mensajes destacados
   - Búsqueda dentro de conversaciones
   - Eliminar mensajes
   - Editar mensajes
   - Reacciones a mensajes

4. **Seguridad**
   - Encriptación de mensajes
   - Autenticación robusta
   - Bloqueo de usuarios
   - Reportar spam

5. **Llamadas**
   - Llamadas de voz
   - Videollamadas
   - Compartir pantalla

## 🔐 Seguridad y Privacidad

### Actual (Demo)

- Almacenamiento local en el navegador
- Sin encriptación
- Datos simulados

### Recomendado para Producción

- Backend con base de datos segura
- Autenticación JWT
- Encriptación end-to-end
- Rate limiting
- Validación de inputs
- Protección contra XSS
- HTTPS obligatorio

## 🧪 Testing

### Funciones a probar

1. Crear nueva conversación
2. Enviar mensaje
3. Recibir mensaje (simulado)
4. Marcar como leído
5. Buscar conversaciones
6. Responsive en diferentes dispositivos
7. Persistencia de datos

### Comandos de prueba en consola

```javascript
// Ver todas las conversaciones
console.log(JSON.parse(localStorage.getItem('servilocal_conversations')));

// Ver todos los mensajes
console.log(JSON.parse(localStorage.getItem('servilocal_messages')));

// Limpiar datos
localStorage.removeItem('servilocal_conversations');
localStorage.removeItem('servilocal_messages');
location.reload();
```

## 🎨 Personalización

### Cambiar colores

Las variables CSS están definidas en `css/tokens.css`:

```css
--color-primary-600: #4F46E5;  /* Color principal de mensajes propios */
--color-neutral-50: #F9FAFB;    /* Fondo del área de mensajes */
```

### Cambiar formato de hora

```javascript
// En js/mensajes.js, función formatMessageTime
function formatMessageTime(date) {
  return date.toLocaleTimeString('es-AR', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false  // Cambiar a true para formato 12h
  });
}
```

## 📖 Ejemplo de Integración

### En la página de perfil del proveedor

```html
<!-- HTML -->
<button 
  class="c-button" 
  onclick="contactarProveedor('user-789', 'Carlos Rodríguez', 'imagenes/avatar.jpg')">
  <i class="fas fa-envelope c-icon-left"></i>
  Enviar Mensaje
</button>

<!-- Script -->
<script>
function contactarProveedor(userId, userName, userAvatar) {
  let conversations = JSON.parse(localStorage.getItem('servilocal_conversations') || '[]');
  let messages = JSON.parse(localStorage.getItem('servilocal_messages') || '{}');
  
  let conversation = conversations.find(c => c.userId === userId);
  
  if (!conversation) {
    conversation = {
      id: `conv-${Date.now()}`,
      userId: userId,
      userName: userName,
      userAvatar: userAvatar,
      lastMessage: 'Nueva conversación',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      isOnline: Math.random() > 0.5
    };
    
    conversations.unshift(conversation);
    messages[conversation.id] = [];
    
    localStorage.setItem('servilocal_conversations', JSON.stringify(conversations));
    localStorage.setItem('servilocal_messages', JSON.stringify(messages));
  }
  
  window.location.href = `mensajes.html?conv=${conversation.id}`;
}
</script>
```

## 🐛 Problemas Comunes

### Los mensajes no se guardan

- Verificar que localStorage esté habilitado en el navegador
- Comprobar que no haya errores en la consola
- Revisar permisos del sitio

### El badge de notificaciones no se actualiza

- Recargar la página
- Verificar que el elemento con id `navMessageBadge` exista en todas las páginas

### Las imágenes de avatar no cargan

- Verificar rutas de las imágenes
- Usar el atributo `onerror` para fallback

## 📝 Notas de Desarrollo

- El sistema usa `localStorage` para persistencia
- Las respuestas automáticas son solo para demo
- Los timestamps usan formato ISO 8601
- El ID del usuario actual es 'user-1' (hardcoded para demo)

## 🤝 Contribuir

Para agregar nuevas funcionalidades:

1. Mantener la estructura de datos existente
2. Seguir las convenciones de nombres CSS (BEM)
3. Documentar nuevas funciones
4. Probar en mobile y desktop
5. Mantener la accesibilidad (ARIA labels)

## 📞 Soporte

Para dudas o problemas con el sistema de mensajería, revisar:

- Console del navegador (F12)
- localStorage en DevTools
- Network tab para errores de carga

---

¡Sistema de Mensajería listo para usar! 🚀
