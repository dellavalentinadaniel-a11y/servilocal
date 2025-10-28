# Sistema de Publicaciones - ServiLocal

## 📱 Descripción General

Sistema de publicaciones estilo Facebook integrado en el perfil del usuario, que permite crear, visualizar y gestionar publicaciones con texto, imágenes y videos.

## ✨ Características Principales

### 1. **Crear Publicaciones**
- ✍️ Texto con formato de párrafos
- 📷 Subir múltiples imágenes (hasta 10)
- 🎥 Subir videos (hasta 10)
- 📎 Combinar texto + imágenes + videos
- 🖼️ Vista previa antes de publicar

### 2. **Visualización**
- 📰 Feed cronológico (publicaciones más recientes primero)
- 🎨 Diseño estilo Facebook/Instagram
- 🖼️ Grid inteligente para múltiples imágenes
  - 1 imagen: aspecto 4:3
  - 2 imágenes: grid 2 columnas
  - 3 imágenes: grid 3 columnas
  - 4+ imágenes: grid 2x2 con indicador "+N" para más

### 3. **Interacciones**
- ❤️ Me gusta (like/unlike)
- 💬 Comentar (próximamente)
- 🔄 Compartir (próximamente)
- 🗑️ Eliminar publicación propia

### 4. **Almacenamiento**
- 💾 LocalStorage para persistencia
- 🔄 Carga automática al abrir el perfil
- 🚀 Sin necesidad de backend (por ahora)

## 🎯 Ubicación en la Aplicación

**Ruta:** Perfil de Usuario → Tab "Publicaciones"

**Navegación:**
1. Ve a `perfil.html`
2. Haz clic en el tab "Publicaciones"
3. Aparecerá el creador de publicaciones + feed

## 🏗️ Arquitectura del Sistema

### Archivos Involucrados

```
mi-plataforma-local/
├── perfil.html              # Estructura HTML + Modal
├── css/
│   └── publicaciones.css    # Estilos del sistema
└── js/
    └── publicaciones.js     # Lógica y funcionalidad
```

### Componentes HTML

#### 1. **Creador de Publicaciones** (`.c-post-creator`)
```html
<article class="c-post-creator">
  <div class="c-post-creator__header">
    <!-- Avatar + Input trigger -->
  </div>
  <div class="c-post-creator__actions">
    <!-- Botones rápidos: Foto | Video -->
  </div>
</article>
```

#### 2. **Feed de Publicaciones** (`.c-posts-feed`)
```html
<div id="postsFeed" class="c-posts-feed">
  <!-- Publicaciones se renderizan dinámicamente -->
</div>
```

#### 3. **Modal Crear Publicación** (`#createPostModal`)
- Campo de texto (textarea)
- Selector de archivos (oculto)
- Preview de medios
- Botones de media
- Botones Cancelar/Publicar

### Clases CSS Principales

#### Estructura de Publicación
- `.c-post` - Contenedor principal
- `.c-post__header` - Avatar + Nombre + Timestamp
- `.c-post__content` - Texto de la publicación
- `.c-post__media` - Contenedor de imágenes/videos
- `.c-post__footer` - Acciones (Like, Comentar, Compartir)

#### Grid de Medios
- `.c-post__media-grid--1` - 1 imagen (4:3)
- `.c-post__media-grid--2` - 2 imágenes
- `.c-post__media-grid--3` - 3 imágenes
- `.c-post__media-grid--4` - 4+ imágenes (2x2)

## 🔧 Configuración

### Límites y Validaciones

```javascript
const CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024,  // 50MB por archivo
  MAX_FILES: 10,                      // Máximo 10 archivos
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp'
  ],
  ALLOWED_VIDEO_TYPES: [
    'video/mp4',
    'video/webm',
    'video/ogg'
  ]
};
```

### Estructura de Datos

```javascript
const post = {
  id: 1698765432100,           // Timestamp único
  content: "Texto de la publicación",
  media: [
    {
      type: 'image',             // 'image' o 'video'
      url: 'blob:...',           // URL del archivo
      name: 'foto1.jpg'
    }
  ],
  author: {
    name: 'Usuario Ejemplo',
    avatar: 'imagenes/perfile/avatar.svg'
  },
  timestamp: '2025-10-27T10:30:00',
  likes: 5,
  liked: true,                   // Si el usuario dio like
  comments: []                   // Próximamente
};
```

## 🎨 Diseño Visual

### Paleta de Colores
- **Botón Foto**: `#45bd62` (Verde)
- **Botón Video**: `#f3425f` (Rojo/Rosa)
- **Principal**: `var(--color-principal)` (Azul del sistema)
- **Fondo**: `var(--color-blanco)`
- **Bordes**: `var(--color-gris-claro)`

### Espaciados
- Usa tokens CSS del sistema: `var(--espacio-pequeno)`, `var(--espacio-medio)`, `var(--espacio-grande)`

### Transiciones
- Hover en botones: `0.2s ease`
- Animación de nueva publicación: `slideInPost 0.3s`

## 🚀 Funcionalidades JavaScript

### Inicialización
```javascript
function init() {
  loadUserData();      // Carga avatar y nombre
  loadPosts();         // Carga publicaciones de localStorage
  setupEventListeners(); // Configura eventos
}
```

### Flujo de Creación de Publicación

1. **Usuario hace clic en "¿Qué estás pensando?"**
   → Abre modal `#createPostModal`

2. **Usuario escribe texto y/o selecciona archivos**
   → Muestra preview de archivos
   → Valida tamaño y tipo

3. **Usuario hace clic en "Publicar"**
   → Crea objeto `post`
   → Guarda en `state.posts`
   → Persiste en `localStorage`
   → Re-renderiza feed
   → Cierra modal
   → Scroll al feed

### Eventos Principales

```javascript
// Abrir modal
openPostCreatorBtn.click → openCreatePostModal()

// Seleccionar archivos
postMediaInput.change → handleFileSelect() → renderMediaPreview()

// Enviar formulario
createPostForm.submit → handleSubmitPost() → createPost() → savePosts()

// Like en publicación
post__action[like].click → toggleLike() → savePosts()

// Eliminar publicación
post__menu-btn.click → showPostMenu() → deletePost()
```

## 📊 Almacenamiento en LocalStorage

### Claves Usadas

```javascript
// Publicaciones del usuario
localStorage.getItem('userPosts')  
localStorage.setItem('userPosts', JSON.stringify(posts))

// Datos del usuario (nombre y avatar)
localStorage.getItem('userData')
localStorage.setItem('userData', JSON.stringify(user))
```

### Formato de `userPosts`
```json
[
  {
    "id": 1698765432100,
    "content": "Mi primera publicación",
    "media": [],
    "author": {
      "name": "Usuario Ejemplo",
      "avatar": "imagenes/perfile/avatar-default.svg"
    },
    "timestamp": "2025-10-27T10:30:00.000Z",
    "likes": 0,
    "liked": false,
    "comments": []
  }
]
```

## 🔐 Seguridad

### Validaciones Implementadas
- ✅ Tipo de archivo (solo imágenes y videos permitidos)
- ✅ Tamaño máximo por archivo (50MB)
- ✅ Número máximo de archivos (10)
- ✅ Escape HTML en texto (`escapeHtml()`)
- ✅ Prevención de XSS al renderizar contenido

### Validaciones Pendientes
- ⏳ Autenticación de usuario
- ⏳ Moderación de contenido
- ⏳ Límite de publicaciones por día

## 📱 Responsive Design

### Breakpoints

#### Mobile (< 480px)
- Padding reducido en publicaciones
- Formulario de medios en columna
- Oculta texto de botones (solo iconos)

#### Tablet (480px - 768px)
- Oculta texto de acciones en publicaciones
- Mantiene iconos visibles

#### Desktop (> 768px)
- Layout completo con texto e iconos
- Grid de medios optimizado

## 🎯 Próximas Mejoras

### Funcionalidades Pendientes
- [ ] **Sistema de comentarios**
  - Agregar comentarios a publicaciones
  - Responder comentarios
  - Contador de comentarios

- [ ] **Compartir publicaciones**
  - Compartir en redes sociales
  - Copiar enlace
  - Compartir por WhatsApp

- [ ] **Editar publicaciones**
  - Editar texto después de publicar
  - Agregar/eliminar medios
  - Historial de ediciones

- [ ] **Reacciones extendidas**
  - Emoji reactions (😍 😂 😮 😢 😡)
  - Contador por tipo de reacción

- [ ] **Visor de medios**
  - Modal para ver imágenes en grande
  - Carrusel de medios
  - Zoom y navegación

- [ ] **Filtros y ordenamiento**
  - Filtrar por tipo (solo fotos, solo videos)
  - Ordenar por fecha, likes, comentarios

- [ ] **Integración con Backend**
  - Guardar en MongoDB
  - Subir archivos a servidor/cloud
  - Sincronización en tiempo real

- [ ] **Privacidad**
  - Publicaciones públicas/privadas
  - Audiencia personalizada
  - Bloqueo de usuarios

## 🐛 Solución de Problemas

### Problema: No se muestran las publicaciones
**Solución:** 
1. Verifica que `publicaciones.js` esté cargado
2. Abre DevTools → Console para ver errores
3. Verifica que el tab "Publicaciones" esté visible
4. Limpia localStorage: `localStorage.removeItem('userPosts')`

### Problema: No se pueden subir archivos
**Solución:**
1. Verifica que el input `#postMediaInput` exista
2. Confirma que los archivos sean del tipo correcto
3. Verifica el tamaño (máximo 50MB)
4. Revisa permisos del navegador

### Problema: El modal no se abre
**Solución:**
1. Verifica que `#createPostModal` exista en el HTML
2. Confirma que el botón tenga el ID correcto
3. Revisa la consola por errores de JavaScript

### Problema: Las imágenes no se muestran correctamente
**Solución:**
1. Verifica que las rutas de los archivos sean correctas
2. Confirma que `URL.createObjectURL()` funcione
3. Revisa las clases CSS del grid

## 📚 Referencias

### Inspiración de Diseño
- Facebook Feed
- Instagram Posts
- Twitter Cards

### Tecnologías Usadas
- **HTML5**: Semantic markup
- **CSS3**: Grid, Flexbox, Custom Properties
- **JavaScript ES6+**: Modules, Arrow Functions, Template Literals
- **LocalStorage API**: Persistencia de datos
- **FileReader API**: Lectura de archivos
- **URL API**: Creación de Object URLs

## 👨‍💻 Desarrollo

### Para agregar nuevas funcionalidades:

1. **HTML**: Edita `perfil.html` → sección `#tab-publicaciones`
2. **CSS**: Edita `css/publicaciones.css` → agrega nuevas clases
3. **JS**: Edita `js/publicaciones.js` → agrega nueva función

### Testing Rápido

```javascript
// Desde la consola del navegador:

// Ver publicaciones almacenadas
JSON.parse(localStorage.getItem('userPosts'))

// Limpiar todas las publicaciones
localStorage.removeItem('userPosts')

// Agregar publicación de prueba
const testPost = {
  id: Date.now(),
  content: "Test post",
  media: [],
  author: { name: "Test", avatar: "imagenes/perfile/avatar-default.svg" },
  timestamp: new Date().toISOString(),
  likes: 0,
  liked: false,
  comments: []
};
let posts = JSON.parse(localStorage.getItem('userPosts')) || [];
posts.push(testPost);
localStorage.setItem('userPosts', JSON.stringify(posts));
location.reload();
```

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, por favor:
1. Revisa esta documentación
2. Consulta los logs en la consola del navegador
3. Verifica que todos los archivos estén en su lugar
4. Limpia el caché y recarga la página

---

**Última actualización:** 27 de octubre de 2025
**Versión:** 1.0.0
**Estado:** ✅ Funcional - 🚧 En desarrollo activo
