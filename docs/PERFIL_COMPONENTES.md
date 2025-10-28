# Sistema de Componentes del Perfil - ServiLocal

## 📋 Descripción

Sistema modular de componentes para el perfil que permite reducir código HTML repetitivo y facilitar el mantenimiento.

## 🎯 Ventajas

- ✅ **Reduce código**: Menos HTML repetitivo
- ✅ **Reutilizable**: Usa los mismos componentes en múltiples lugares
- ✅ **Mantenible**: Actualiza un componente y se refleja en todos lados
- ✅ **Consistente**: Diseño uniforme en toda la aplicación
- ✅ **Escalable**: Fácil agregar nuevos componentes

## 📦 Archivos

```
js/
├── perfil-componentes.js  # Funciones de componentes
├── perfil-data.js         # Datos de ejemplo
└── perfil-moderno.js      # Lógica del perfil (existente)
```

## 🚀 Uso Básico

### 1. Incluir los scripts en tu HTML

```html
<!-- Antes del cierre de </body> -->
<script src="js/perfil-data.js"></script>
<script src="js/perfil-componentes.js"></script>
<script src="js/perfil-moderno.js"></script>
```

### 2. Crear un contenedor en el HTML

```html
<div class="perfil-gallery__grid" id="mi-galeria"></div>
```

### 3. Renderizar componentes con JavaScript

```javascript
// Opción 1: Usar el helper
PerfilComponentes.renderGallery('mi-galeria', PerfilData.projects);

// Opción 2: Usar la función genérica
PerfilComponentes.renderComponents(
  'mi-galeria',
  PerfilData.projects,
  PerfilComponentes.createGalleryCard
);
```

## 📚 Componentes Disponibles

### 1. Tarjeta de Galería

**Función:** `createGalleryCard(data)`

**Datos requeridos:**
```javascript
{
  image: 'ruta/imagen.jpg',
  alt: 'Descripción de la imagen',
  title: 'Título del proyecto'
}
```

**Helper:** `renderGallery(containerId, projects)`

**Ejemplo:**
```javascript
PerfilComponentes.renderGallery('galeria', [
  {
    image: 'imagenes/proyecto1.jpg',
    alt: 'Proyecto 1',
    title: 'Mi Proyecto'
  }
]);
```

---

### 2. Tarjeta de Publicación

**Función:** `createPublicationCard(data)`

**Datos requeridos:**
```javascript
{
  image: 'ruta/imagen.jpg',
  title: 'Título de la publicación',
  excerpt: 'Resumen corto',
  date: '2024-01-15',
  dateFormatted: 'Hace 2 semanas',
  link: '#'
}
```

**Helper:** `renderPublications(containerId, publications)`

---

### 3. Tarjeta de Servicio

**Función:** `createServiceCard(data)`

**Datos requeridos:**
```javascript
{
  icon: 'fas fa-palette',
  title: 'Diseño Creativo',
  subtitle: 'Soluciones Visuales'
}
```

**Helper:** `renderServices(containerId, services)`

---

### 4. Detalle de Servicio

**Función:** `createServiceDetail(data)`

**Datos requeridos:**
```javascript
{
  title: 'Diseño UX/UI',
  category: 'Diseño',
  price: '$1,500',
  unit: 'por proyecto',
  description: 'Descripción del servicio',
  features: ['Feature 1', 'Feature 2', 'Feature 3']
}
```

**Helper:** `renderServiceDetails(containerId, services)`

---

### 5. Badge

**Función:** `createBadge(text)`

**Datos requeridos:** Solo un string

**Helper:** `renderBadges(containerId, badges)`

**Ejemplo:**
```javascript
PerfilComponentes.renderBadges('badges-container', [
  'Diseño UX/UI',
  'Desarrollo Web',
  'Branding'
]);
```

---

### 6. Barra de Rating

**Función:** `createRatingBar(data)`

**Datos requeridos:**
```javascript
{
  label: 'Calidad',
  value: '4.9',
  percentage: '98'
}
```

**Helper:** `renderRatings(containerId, ratings)`

---

### 7. Tarjeta de Reseña

**Función:** `createReviewCard(data)`

**Datos requeridos:**
```javascript
{
  name: 'María González',
  avatar: 'https://ejemplo.com/avatar.jpg',
  rating: 5,
  date: '2024-01-20',
  dateFormatted: 'Hace 1 semana',
  comment: 'Excelente profesional...'
}
```

**Helper:** `renderReviews(containerId, reviews)`

---

### 8. Item de Contacto

**Función:** `createContactItem(data)`

**Datos requeridos:**
```javascript
{
  icon: 'fas fa-envelope',
  label: 'Email',
  value: 'contacto@ejemplo.com',
  link: 'mailto:contacto@ejemplo.com' // Opcional
}
```

**Helper:** `renderContactInfo(containerId, contactItems)`

---

### 9. Botón de Acción

**Función:** `createActionButton(data)`

**Datos requeridos:**
```javascript
{
  text: 'Enviar Mensaje',
  variant: 'primary', // primary, secondary, ghost
  size: 'medium',     // small, medium, large
  icon: 'fas fa-envelope',
  id: 'mi-boton',
  ariaLabel: 'Enviar mensaje'
}
```

## 🔄 Funciones Avanzadas

### Agregar componentes sin reemplazar

```javascript
PerfilComponentes.appendComponents(
  'mi-contenedor',
  nuevosItems,
  PerfilComponentes.createGalleryCard
);
```

### Crear un solo componente

```javascript
const html = PerfilComponentes.createGalleryCard({
  image: 'imagen.jpg',
  alt: 'Mi imagen',
  title: 'Mi título'
});

document.getElementById('contenedor').innerHTML = html;
```

## 💡 Ejemplos Prácticos

### Ejemplo 1: Galería Dinámica

```javascript
// HTML
<div class="perfil-gallery__grid" id="mi-galeria"></div>

// JavaScript
const proyectos = [
  { image: 'img1.jpg', alt: 'Proyecto 1', title: 'Proyecto 1' },
  { image: 'img2.jpg', alt: 'Proyecto 2', title: 'Proyecto 2' },
  { image: 'img3.jpg', alt: 'Proyecto 3', title: 'Proyecto 3' }
];

PerfilComponentes.renderGallery('mi-galeria', proyectos);
```

### Ejemplo 2: Servicios con Precios

```javascript
// HTML
<div id="servicios-lista"></div>

// JavaScript
const servicios = [
  {
    title: 'Diseño Web',
    category: 'Diseño',
    price: '$1,000',
    unit: 'por proyecto',
    description: 'Diseño completo de sitio web',
    features: ['Responsive', 'SEO', 'Optimizado']
  }
];

PerfilComponentes.renderServiceDetails('servicios-lista', servicios);
```

### Ejemplo 3: Badges Dinámicos

```javascript
// HTML
<div id="categorias"></div>

// JavaScript
const categorias = ['Diseño', 'Desarrollo', 'Consultoría'];
PerfilComponentes.renderBadges('categorias', categorias);
```

## 🎨 Personalización

Todos los componentes usan las clases CSS existentes de `perfil-moderno.css`, por lo que heredan automáticamente los estilos y el tema (claro/oscuro).

## 📊 Datos de Ejemplo

El archivo `perfil-data.js` incluye datos de ejemplo para todos los componentes. Puedes usar estos datos directamente o reemplazarlos con tus propios datos.

```javascript
// Acceder a los datos de ejemplo
console.log(PerfilData.projects);
console.log(PerfilData.serviceDetails);
console.log(PerfilData.reviews);
```

## 🔍 Demo

Abre `perfil-componentes-demo.html` en tu navegador para ver todos los componentes en acción con ejemplos interactivos.

```
http://localhost:8080/perfil-componentes-demo.html
```

## 🛠️ API Completa

```javascript
window.PerfilComponentes = {
  // Funciones de creación
  createGalleryCard(data),
  createPublicationCard(data),
  createServiceCard(data),
  createServiceDetail(data),
  createBadge(text),
  createRatingBar(data),
  createReviewCard(data),
  createContactItem(data),
  createActionButton(data),
  
  // Funciones de renderizado
  renderComponents(containerId, items, componentFunction),
  appendComponents(containerId, items, componentFunction),
  
  // Helpers
  renderGallery(containerId, projects),
  renderPublications(containerId, publications),
  renderServices(containerId, services),
  renderServiceDetails(containerId, services),
  renderBadges(containerId, badges),
  renderRatings(containerId, ratings),
  renderReviews(containerId, reviews),
  renderContactInfo(containerId, contactItems)
};
```

## 📝 Notas

- Los componentes se renderizan dinámicamente en el cliente
- Usa `loading="lazy"` en las imágenes para mejor rendimiento
- Los componentes son accesibles (ARIA labels)
- Compatible con el tema claro/oscuro existente

## 🚀 Próximos Pasos

1. Integrar los componentes en `perfil-moderno.html`
2. Reemplazar el HTML estático con llamadas a componentes
3. Crear componentes adicionales según sea necesario
4. Agregar animaciones y transiciones

---

**¿Preguntas?** Revisa `perfil-componentes-demo.html` para ejemplos prácticos de cada componente.
