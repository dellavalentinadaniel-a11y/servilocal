# Sistema de Plantillas Globales - ServiLocal

## 📋 Descripción

Este sistema de plantillas globales garantiza consistencia visual y funcional en todas las páginas de ServiLocal. Todas las páginas comparten la misma estructura base, navegación, footer y estilos globales.

## 🏗️ Estructura del Sistema

### Archivos Principales

```
templates/
├── base-template.html      # Plantilla base con placeholders
├── page-generator.js       # Script para generar páginas
└── README.md              # Esta documentación

css/
├── global-base.css         # Estilos globales compartidos
├── linkedin-homepage.css   # Estilos específicos del homepage
├── linkedin-feed.css       # Estilos específicos del feed
├── linkedin-listings.css   # Estilos específicos de listings
└── linkedin-style.css      # Estilos específicos del perfil

js/
├── global-base.js          # JavaScript global compartido
├── homepage.js            # JavaScript específico del homepage
├── feed.js                # JavaScript específico del feed
└── profile.js             # JavaScript específico del perfil
```

## 🎯 Componentes Globales

### Header/Navegación
- **Logo consistente**: ServiLocal con icono handshake
- **Menú de navegación**: Inicio, Servicios, Productos, Feed, Mi Perfil
- **Menú móvil**: Hamburger menu responsivo
- **Acciones de usuario**: Notificaciones y menú de perfil
- **Estados activos**: Automático según la página actual

### Footer
- **5 secciones**: Marca, Servicios, Productos, Empresa, Soporte
- **Redes sociales**: Facebook, Twitter, Instagram, LinkedIn
- **Enlaces legales**: Privacidad, Términos, Cookies
- **Copyright**: Año actual automático

### Elementos Comunes
- **Scroll to top**: Botón flotante
- **Loading overlay**: Pantalla de carga
- **Skip links**: Accesibilidad para navegación por teclado
- **Notificaciones**: Sistema toast global

## 🎨 Variables CSS Globales

```css
:root {
    /* Colores principales */
    --primary-color: #0a66c2;
    --primary-dark: #004182;
    --primary-light: #3b82f6;
    
    /* Tipografía */
    --font-family: 'Poppins', sans-serif;
    --font-size-base: 1rem;
    
    /* Espaciado */
    --spacing-md: 1rem;
    --spacing-xl: 2rem;
    
    /* Layout */
    --header-height: 70px;
    --container-max-width: 1200px;
}
```

## 📝 Placeholders de la Plantilla

### HTML Placeholders
- `{{PAGE_TITLE}}` - Título específico de la página
- `{{BODY_CLASS}}` - Clase CSS del body
- `{{PAGE_SPECIFIC_CSS}}` - CSS específico de la página
- `{{PAGE_SPECIFIC_JS}}` - JavaScript específico de la página
- `{{MAIN_CONTENT}}` - Contenido principal de la página

### Navegación Activa
- `{{HOME_ACTIVE}}` - Marca "Inicio" como activo
- `{{SERVICES_ACTIVE}}` - Marca "Servicios" como activo
- `{{PRODUCTS_ACTIVE}}` - Marca "Productos" como activo
- `{{FEED_ACTIVE}}` - Marca "Feed" como activo
- `{{PROFILE_ACTIVE}}` - Marca "Mi Perfil" como activo

## 🚀 Cómo Usar el Sistema

### Método 1: Usar el Generador (Recomendado)

```bash
# Navegar a la carpeta templates
cd templates/

# Ejecutar el generador (requiere Node.js)
node page-generator.js
```

### Método 2: Manual

1. **Copiar la plantilla base**:
   ```bash
   cp templates/base-template.html nueva-pagina.html
   ```

2. **Reemplazar placeholders**:
   ```html
   <!-- Cambiar -->
   <title>{{PAGE_TITLE}} - ServiLocal</title>
   
   <!-- Por -->
   <title>Mi Nueva Página - ServiLocal</title>
   ```

3. **Agregar contenido específico**:
   ```html
   <!-- Reemplazar -->
   {{MAIN_CONTENT}}
   
   <!-- Por tu contenido -->
   <section class="mi-seccion">
       <h1>Mi contenido</h1>
   </section>
   ```

## 📄 Configuración de Páginas

### Ejemplo de Configuración

```javascript
const pageConfig = {
    title: 'Mi Página',
    bodyClass: 'mi-pagina-class',
    activeNav: 'HOME_ACTIVE',
    specificCSS: '<link rel="stylesheet" href="css/mi-pagina.css">',
    specificJS: '<script src="js/mi-pagina.js"></script>',
    content: `
        <section class="mi-seccion">
            <h1>Mi contenido aquí</h1>
        </section>
    `
};
```

### Páginas Configuradas

| Página | Título | Clase Body | Nav Activo |
|--------|--------|------------|------------|
| index.html | Inicio | home-page | HOME_ACTIVE |
| linkedin-servicios.html | Servicios | services-page | SERVICES_ACTIVE |
| linkedin-productos.html | Productos | products-page | PRODUCTS_ACTIVE |
| linkedin-feed.html | Feed Social | feed-page | FEED_ACTIVE |
| perfil-moderno.html | Mi Perfil | profile-page | PROFILE_ACTIVE |

## 🎯 Beneficios del Sistema

### ✅ Consistencia
- **Header idéntico** en todas las páginas
- **Footer unificado** con enlaces actualizados
- **Navegación coherente** con estados activos
- **Estilos globales** compartidos

### ✅ Mantenibilidad
- **Un solo lugar** para cambios globales
- **Actualizaciones automáticas** en todas las páginas
- **Código reutilizable** y organizado
- **Fácil escalabilidad** para nuevas páginas

### ✅ Performance
- **CSS compartido** se cachea una vez
- **JavaScript global** optimizado
- **Recursos preloadeados** correctamente
- **Lazy loading** implementado

### ✅ SEO y Accesibilidad
- **Meta tags consistentes** en todas las páginas
- **Estructura semántica** HTML5
- **Skip links** para navegación por teclado
- **ARIA labels** apropiados

## 🔧 Personalización

### Agregar Nueva Página

1. **Definir configuración**:
   ```javascript
   'mi-nueva-pagina.html': {
       title: 'Mi Nueva Página',
       bodyClass: 'nueva-pagina',
       activeNav: 'SERVICES_ACTIVE',
       specificCSS: '<link rel="stylesheet" href="css/nueva-pagina.css">',
       specificJS: '<script src="js/nueva-pagina.js"></script>',
       content: `<!-- Tu contenido aquí -->`
   }
   ```

2. **Ejecutar generador**:
   ```bash
   node page-generator.js
   ```

### Modificar Elementos Globales

#### Cambiar Logo
```html
<!-- En base-template.html -->
<i class="fas fa-handshake brand-icon"></i>
<span class="brand-text">ServiLocal</span>
```

#### Agregar Enlace al Menú
```html
<!-- En base-template.html -->
<li class="menu-item" role="none">
    <a href="nueva-seccion.html" class="menu-link" role="menuitem">
        <i class="fas fa-nuevo-icono"></i>
        <span>Nueva Sección</span>
    </a>
</li>
```

#### Modificar Footer
```html
<!-- En base-template.html, sección footer-top -->
<div class="footer-section">
    <h3 class="footer-title">Nueva Sección</h3>
    <ul class="footer-links">
        <li><a href="#">Nuevo Enlace</a></li>
    </ul>
</div>
```

## 🐛 Solución de Problemas

### Problema: Navegación no marca página activa
**Solución**: Verificar que el placeholder correcto esté configurado:
```javascript
activeNav: 'HOME_ACTIVE' // Para página de inicio
```

### Problema: Estilos no se aplican
**Solución**: Verificar que el CSS específico esté incluido:
```javascript
specificCSS: '<link rel="stylesheet" href="css/mi-pagina.css">'
```

### Problema: JavaScript no funciona
**Solución**: Verificar que el JS específico esté incluido:
```javascript
specificJS: '<script src="js/mi-pagina.js"></script>'
```

### Problema: Imágenes no cargan
**Solución**: Verificar rutas relativas desde la raíz del proyecto:
```html
<img src="imagenes/mi-imagen.jpg" alt="Descripción">
```

## 📱 Responsive Design

El sistema incluye breakpoints responsivos:

```css
/* Mobile */
@media (max-width: 768px) {
    .mobile-menu-toggle { display: flex; }
    .navbar-menu { display: none; }
}

/* Tablet */
@media (max-width: 1024px) {
    .footer-top { grid-template-columns: 1fr 1fr; }
}
```

## 🔄 Actualizaciones

### Para actualizar todas las páginas:
1. Modificar `base-template.html`
2. Ejecutar `node page-generator.js`
3. Todas las páginas se actualizarán automáticamente

### Para actualizar estilos globales:
1. Modificar `css/global-base.css`
2. Los cambios se reflejan inmediatamente en todas las páginas

### Para actualizar JavaScript global:
1. Modificar `js/global-base.js`
2. Los cambios se reflejan inmediatamente en todas las páginas

## 📊 Checklist de Implementación

- [x] ✅ Plantilla base creada
- [x] ✅ CSS global implementado
- [x] ✅ JavaScript global implementado
- [x] ✅ Sistema de generación configurado
- [x] ✅ Ejemplo de página actualizada (index-new.html)
- [ ] ⏳ Actualizar todas las páginas existentes
- [ ] ⏳ Probar navegación entre páginas
- [ ] ⏳ Validar responsive design
- [ ] ⏳ Verificar accesibilidad

## 🎉 Resultado Final

Con este sistema implementado:

1. **Todas las páginas** tendrán la misma estructura base
2. **Cualquier cambio global** se replica automáticamente
3. **La navegación** será consistente en todo el sitio
4. **El mantenimiento** será mucho más eficiente
5. **La experiencia de usuario** será uniforme

¡Tu plataforma ServiLocal ahora tiene un sistema de plantillas robusto y escalable! 🚀
