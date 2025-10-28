# 📚 Librería de Componentes ServiLocal

## Versión 1.0.0

Esta librería proporciona componentes reutilizables para construir páginas consistentes en ServiLocal de forma rápida y eficiente.

## 🚀 Instalación

Agrega estos archivos en el `<head>` de tu página HTML:

```html
<link rel="stylesheet" href="css/components-library.css">
<script src="js/components-library.js"></script>
```

## 📦 Componentes Disponibles

### 1. Service Card (Tarjeta de Servicio)

Tarjeta para mostrar servicios con rating, precio y proveedor.

**Uso:**
```javascript
SLC.createServiceCard({
  title: 'Plomería General',
  category: 'Plomería',
  rating: 4.8,
  reviewCount: 127,
  price: 350,
  providerName: 'Juan Pérez',
  providerImage: '/imagenes/perfil.jpg',
  featured: true,  // Opcional: muestra badge "DESTACADO"
  link: '/servicio.html'
});
```

**Parámetros:**
- `title` (string) - Título del servicio
- `category` (string) - Categoría del servicio
- `rating` (number) - Calificación (0-5)
- `reviewCount` (number) - Número de reseñas
- `price` (number) - Precio del servicio
- `providerName` (string) - Nombre del proveedor
- `providerImage` (string) - URL de la imagen del proveedor
- `featured` (boolean, opcional) - Si es destacado
- `link` (string) - URL de destino

---

### 2. Profile Card (Tarjeta de Perfil)

Tarjeta para mostrar perfiles de proveedores con badges y estadísticas.

**Uso:**
```javascript
SLC.createProfileCard({
  name: 'Ana Martínez',
  category: 'Veterinaria',
  rating: 5.0,
  reviewCount: 156,
  image: '/imagenes/perfil.jpg',
  verified: true,
  isPro: true,
  isTop: true,
  stats: [
    { label: 'Clientes', value: '250+' },
    { label: 'Años exp.', value: '12' }
  ],
  link: '/perfil.html'
});
```

**Parámetros:**
- `name` (string) - Nombre del proveedor
- `category` (string) - Categoría del servicio
- `rating` (number) - Calificación (0-5)
- `reviewCount` (number) - Número de reseñas
- `image` (string) - URL de la imagen
- `verified` (boolean, opcional) - Muestra badge "Verificado"
- `isPro` (boolean, opcional) - Muestra badge "PRO"
- `isTop` (boolean, opcional) - Muestra badge "TOP"
- `stats` (array, opcional) - Array de objetos `{label, value}`
- `link` (string) - URL de destino

---

### 3. Search Bar (Barra de Búsqueda)

Barra de búsqueda con filtros opcionales de ubicación y categoría.

**Uso:**
```javascript
SLC.createSearchBar({
  placeholder: 'Buscar servicios...',
  showLocation: true,
  showCategory: true,
  onSearch: (query) => {
    console.log('Búsqueda:', query);
    // Lógica de búsqueda
  }
});
```

**Parámetros:**
- `placeholder` (string, opcional) - Texto placeholder
- `showLocation` (boolean, opcional) - Mostrar selector de ubicación
- `showCategory` (boolean, opcional) - Mostrar selector de categoría
- `onSearch` (function, opcional) - Callback cuando se hace búsqueda

---

### 4. Stats Card (Tarjeta de Estadística)

Tarjeta para mostrar métricas con indicadores de tendencia.

**Uso:**
```javascript
SLC.createStatsCard({
  title: 'Servicios Activos',
  value: '1,234',
  icon: 'fa-briefcase',
  trend: 'up',
  trendValue: '+12%',
  variant: 'primary'
});
```

**Parámetros:**
- `title` (string) - Título de la estadística
- `value` (string) - Valor a mostrar
- `icon` (string) - Clase de Font Awesome (ej: 'fa-users')
- `trend` (string, opcional) - 'up', 'down', o 'neutral'
- `trendValue` (string, opcional) - Valor de la tendencia
- `variant` (string, opcional) - 'primary', 'success', 'warning', 'danger'

---

### 5. Review Card (Tarjeta de Reseña)

Tarjeta para mostrar reseñas de usuarios con imágenes opcionales.

**Uso:**
```javascript
SLC.createReviewCard({
  userName: 'Laura González',
  userImage: '/imagenes/perfil.jpg',
  rating: 5,
  date: '15 de octubre, 2025',
  comment: 'Excelente servicio, muy profesional.',
  images: [
    '/imagenes/trabajo1.jpg',
    '/imagenes/trabajo2.jpg'
  ],
  verified: true
});
```

**Parámetros:**
- `userName` (string) - Nombre del usuario
- `userImage` (string) - URL de la imagen del usuario
- `rating` (number) - Calificación (0-5)
- `date` (string) - Fecha de la reseña
- `comment` (string) - Comentario de la reseña
- `images` (array, opcional) - Array de URLs de imágenes
- `verified` (boolean, opcional) - Muestra badge "Verificada"

---

## 🛠️ Funciones Utilitarias

### renderMultiple()

Renderiza múltiples componentes de forma eficiente.

```javascript
const servicios = [
  { title: 'Servicio 1', category: 'Plomería', ... },
  { title: 'Servicio 2', category: 'Electricidad', ... }
];

SLC.renderMultiple(
  'container-id',
  servicios,
  (data) => SLC.createServiceCard(data)
);
```

### append()

Agrega componentes a un contenedor.

```javascript
SLC.append('container-id', [
  SLC.createServiceCard({...}),
  SLC.createProfileCard({...}),
  SLC.createStatsCard({...})
]);
```

### Utilidades internas

- `escapeHtml(text)` - Escapa HTML para prevenir XSS
- `generateStars(rating)` - Genera estrellas de rating
- `formatPrice(price)` - Formatea precios con símbolo de moneda

---

## 📝 Ejemplos Completos

### Página de Servicios

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/components-library.css">
</head>
<body>
  <div id="servicios-container"></div>
  
  <script src="js/components-library.js"></script>
  <script>
    const servicios = [
      {
        title: 'Plomería 24/7',
        category: 'Plomería',
        rating: 4.9,
        reviewCount: 156,
        price: 400,
        providerName: 'Juan Pérez',
        providerImage: '/imagenes/perfil1.jpg',
        featured: true,
        link: '/servicio-1.html'
      },
      // ... más servicios
    ];
    
    SLC.renderMultiple(
      'servicios-container',
      servicios,
      (data) => SLC.createServiceCard(data)
    );
  </script>
</body>
</html>
```

### Página de Búsqueda

```html
<div class="search-section">
  <div id="buscador"></div>
</div>

<script>
  document.getElementById('buscador').innerHTML = SLC.createSearchBar({
    placeholder: 'Buscar servicios en tu zona...',
    showLocation: true,
    showCategory: true,
    onSearch: (query) => {
      // Realizar búsqueda
      fetch(`/api/buscar?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(resultados => mostrarResultados(resultados));
    }
  });
</script>
```

### Dashboard con Estadísticas

```html
<div class="stats-grid" id="stats"></div>

<script>
  const stats = [
    { title: 'Total Servicios', value: '1,234', icon: 'fa-briefcase', variant: 'primary' },
    { title: 'Usuarios', value: '856', icon: 'fa-users', variant: 'success' },
    { title: 'Solicitudes', value: '342', icon: 'fa-clock', variant: 'warning' },
    { title: 'Pendientes', value: '12', icon: 'fa-exclamation', variant: 'danger' }
  ];
  
  SLC.renderMultiple('stats', stats, (data) => SLC.createStatsCard(data));
</script>
```

---

## 🎨 Personalización

Los componentes usan tokens CSS definidos en `css/tokens.css`:

```css
:root {
  --color-primario: #4F46E5;
  --color-secundario: #10B981;
  --espacio-grande: 2rem;
  --espacio-medio: 1rem;
  --borde-suave: 0.5rem;
}
```

Puedes personalizar los estilos modificando estos tokens o creando clases CSS adicionales.

---

## 🔒 Seguridad

Todos los componentes usan `escapeHtml()` para prevenir ataques XSS. Nunca renderices HTML sin escapar.

---

## 📱 Responsive

Todos los componentes son completamente responsive y se adaptan a móviles, tablets y escritorio.

---

## 🌐 Accesibilidad

Los componentes incluyen:
- Etiquetas ARIA apropiadas
- Navegación por teclado
- Contraste de colores adecuado
- Textos alternativos

---

## 🧪 Testing

Puedes ver todos los componentes en acción en:
```
/ejemplos-componentes.html
```

---

## 📄 Licencia

© 2025 ServiLocal. Todos los derechos reservados.

---

## 🤝 Contribuir

Para agregar nuevos componentes:

1. Agrega la función en `js/components-library.js`
2. Agrega los estilos en `css/components-library.css`
3. Documenta el uso en este README
4. Agrega un ejemplo en `ejemplos-componentes.html`

---

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, contacta al equipo de desarrollo.
