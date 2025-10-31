# 🔗 Integración Chat Flotante con Botones "Contactar"

## 📝 Descripción

Los botones "Contactar" en todas las páginas (búsqueda, perfiles de proveedores, etc.) ahora abren directamente el **chat flotante** estilo Messenger, proporcionando una experiencia de mensajería instantánea sin salir de la página.

---

## ✨ Funcionalidades Implementadas

### 1. **Botones de Contactar en Resultados de Búsqueda**
- Cada tarjeta de proveedor en `buscar.html` tiene un botón "Contactar"
- Al hacer clic, abre el chat flotante con ese proveedor
- Icono: `fa-comment-dots` (burbujas de chat)

### 2. **Botones en Perfil de Proveedor**
- Botón principal en el header del perfil
- Botón CTA (Call to Action) al final de la página
- Ambos abren el mismo chat flotante

### 3. **Validación de Autenticación**
- Si el usuario NO está logueado → redirige a `login.html`
- Incluye parámetro `redirect` para volver después del login
- Si está logueado → abre el chat inmediatamente

---

## 🛠️ Implementación Técnica

### Estructura HTML de los Botones

```html
<button 
  class="c-button js-contactar-proveedor" 
  type="button"
  data-proveedor-id="1"
  data-proveedor-nombre="Carlos Martínez"
  data-proveedor-avatar="imagenes/perfile/images%20(1).png"
  aria-label="Contactar a Carlos Martínez">
  <i class="fas fa-comment-dots c-icon-left" aria-hidden="true"></i>
  Contactar
</button>
```

### Data Attributes Requeridos

| Atributo | Descripción | Ejemplo |
|----------|-------------|---------|
| `data-proveedor-id` | ID único del proveedor | `"1"` |
| `data-proveedor-nombre` | Nombre completo | `"Carlos Martínez"` |
| `data-proveedor-avatar` | Ruta de la imagen | `"imagenes/perfile/foto.png"` |

### Clase CSS

- **`.js-contactar-proveedor`**: Identificador para el event listener

---

## 📄 Archivos Modificados

### 1. **`js/busqueda.js`**

#### Función: `crearTarjetaResultado()`
- Agregado botón "Contactar" en las acciones de la tarjeta
- Botón con data attributes del proveedor
- Reordenado botones: Contactar → Ver perfil → Favorito

#### Función: `inicializarBotonesContactar()`
```javascript
function inicializarBotonesContactar() {
  const botonesContactar = document.querySelectorAll('.js-contactar-proveedor');
  
  botonesContactar.forEach(boton => {
    boton.addEventListener('click', function() {
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

      // Abrir chat flotante
      if (window.ChatFlotante && window.ChatFlotante.abrirChat) {
        window.ChatFlotante.abrirChat({
          id: proveedorId,
          userId: proveedorId,
          userName: proveedorNombre,
          userAvatar: proveedorAvatar,
          isOnline: Math.random() > 0.5
        });
      } else {
        // Fallback: página de mensajes
        window.location.href = `mensajes.html?usuario=${proveedorId}`;
      }
    });
  });
}
```

#### Llamada en `renderizarResultados()`
```javascript
// Re-inicializar botones después de renderizar
if (window.ServiLocalFavoritos) {
  window.ServiLocalFavoritos.inicializarBotonesFavoritos();
}
inicializarBotonesContactar(); // ← NUEVA LÍNEA
```

---

### 2. **`proveedor.html`**

#### Botón del Header
```html
<div class="c-profile-header__actions">
  <button 
    class="c-button js-contactar-proveedor" 
    type="button" 
    data-proveedor-id="1"
    data-proveedor-nombre="Carlos Martínez"
    data-proveedor-avatar="imagenes/perfile/images%20(1).png"
    aria-label="Contactar a Carlos">
    <i class="fas fa-comment-dots c-icon-left"></i>
    Contactar
  </button>
</div>
```

#### Botón del CTA (final de página)
```html
<button 
  class="c-button js-contactar-proveedor" 
  type="button"
  data-proveedor-id="1"
  data-proveedor-nombre="Carlos Martínez"
  data-proveedor-avatar="imagenes/perfile/images%20(1).png">
  <i class="fas fa-comment-dots c-icon-left"></i>
  Contactar a Carlos
</button>
```

#### Script de Inicialización (antes de `</body>`)
```javascript
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const botonesContactar = document.querySelectorAll('.js-contactar-proveedor');
    
    botonesContactar.forEach(boton => {
      boton.addEventListener('click', function() {
        // ... mismo código que busqueda.js
      });
    });
  });
</script>
```

---

## 🎯 Flujo de Usuario

### Escenario 1: Usuario NO autenticado
```
Usuario hace clic en "Contactar"
    ↓
Verifica localStorage['servilocal_token']
    ↓ (no existe)
Redirige a: login.html?redirect=/buscar.html
    ↓
Usuario se loguea
    ↓
Vuelve a la página original
    ↓
Puede contactar normalmente
```

### Escenario 2: Usuario autenticado
```
Usuario hace clic en "Contactar"
    ↓
Verifica localStorage['servilocal_token']
    ↓ (existe)
Verifica window.ChatFlotante
    ↓ (disponible)
Llama a ChatFlotante.abrirChat({...})
    ↓
Se abre ventana flotante con:
  - Avatar del proveedor
  - Nombre del proveedor
  - Estado online/offline
  - Input para escribir mensaje
```

### Escenario 3: Chat no disponible (fallback)
```
Usuario hace clic en "Contactar"
    ↓
Verifica window.ChatFlotante
    ↓ (no disponible)
Redirige a: mensajes.html?usuario=1
```

---

## 🎨 Aspecto Visual

### Botón Principal
- **Color**: Gradiente azul principal
- **Icono**: `fa-comment-dots` (burbujas)
- **Hover**: Escala 1.05, sombra más pronunciada
- **Texto**: "Contactar" o "Contactar a [Nombre]"

### Botón Secundario (Ver perfil)
- **Color**: Borde con fondo transparente
- **Jerarquía**: Menos prominente que "Contactar"

---

## ♿ Accesibilidad

### ARIA Labels
```html
aria-label="Contactar a Carlos Martínez"
```

### Anuncio para Lectores de Pantalla
```javascript
if (window.announceToScreenReader) {
  window.announceToScreenReader(`Abriendo chat con ${proveedorNombre}`);
}
```

### Navegación por Teclado
- Los botones son `<button>` (no `<a>`)
- Focusables con `Tab`
- Activables con `Enter` o `Espacio`

---

## 🔧 Configuración del Backend

### Endpoint Requerido
```
POST /api/conversations
{
  "participantId": "1" // ID del proveedor
}
```

**Respuesta:**
```json
{
  "conversationId": "conv_abc123",
  "participants": [
    { "id": "user_456", "name": "Usuario Actual" },
    { "id": "1", "name": "Carlos Martínez" }
  ]
}
```

---

## 🧪 Testing

### Casos de Prueba

1. **Usuario no logueado + clic en Contactar**
   - ✅ Redirige a login.html
   - ✅ Incluye parámetro redirect

2. **Usuario logueado + clic en Contactar**
   - ✅ Abre chat flotante
   - ✅ Muestra nombre y avatar correcto
   - ✅ Permite enviar mensajes

3. **Múltiples ventanas de chat**
   - ✅ Puede abrir hasta 3 chats simultáneos
   - ✅ Cierra la más antigua si se abre una 4ta

4. **Responsividad**
   - ✅ Desktop: ventana 320px en la esquina
   - ✅ Mobile: ventana full-screen

---

## 🚀 Próximas Mejoras

- [ ] **Indicador de disponibilidad real** del proveedor (online/offline)
- [ ] **Historial de conversaciones** previas con el mismo proveedor
- [ ] **Notificaciones push** cuando el proveedor responde
- [ ] **Typing indicators** (está escribiendo...)
- [ ] **Confirmación de lectura** (visto, doble check)
- [ ] **Envío de imágenes** en el chat

---

## 📝 Notas de Implementación

### Sincronización con Backend
El estado `isOnline` actualmente está simulado:
```javascript
isOnline: Math.random() > 0.5 // Temporal
```

**Debe reemplazarse por:**
```javascript
isOnline: response.data.isOnline // Del backend
```

### Manejo de Errores
Si el backend no responde:
```javascript
catch (error) {
  console.error('Error abriendo chat:', error);
  // Mostrar toast: "No se pudo conectar con el servidor"
}
```

---

## 🆘 Troubleshooting

### El chat no se abre
1. Verificar que `chat-flotante.js` esté cargado
2. Verificar que Socket.io esté disponible
3. Abrir consola y revisar errores

### El botón no hace nada
1. Verificar data attributes en HTML
2. Verificar que exista la clase `.js-contactar-proveedor`
3. Verificar que el script de inicialización esté ejecutándose

### Redirige a login constantemente
1. Verificar que el token esté en localStorage
2. Verificar que el token sea válido (no expirado)

---

## 📚 Recursos

- [Chat Flotante - Documentación Principal](./CHAT_FLOTANTE.md)
- [Sistema de Mensajería - Backend](./SISTEMA_MENSAJERIA_README.md)
- [Guía de Componentes UI](./componentes.md)

---

**Última actualización:** 27 de octubre de 2025  
**Autor:** Sistema de Integración ServiLocal
