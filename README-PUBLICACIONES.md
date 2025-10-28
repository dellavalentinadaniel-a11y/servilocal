# 📱 Sistema de Publicaciones - Guía Rápida

## ¿Qué es?

Sistema de publicaciones tipo Facebook/Instagram integrado en el perfil del usuario de ServiLocal.

## ¿Cómo usar?

1. Ve a **Perfil** (`perfil.html`)
2. Haz clic en el tab **"Publicaciones"**
3. Haz clic en **"¿Qué estás pensando?"**
4. Escribe tu texto y/o agrega fotos/videos
5. Haz clic en **"Publicar"**

## Características

✅ **Crear publicaciones** con texto, fotos y videos  
✅ **Ver feed** de publicaciones ordenadas por fecha  
✅ **Dar like** a publicaciones  
✅ **Eliminar** tus publicaciones  
✅ **Persistencia** con LocalStorage  
✅ **Diseño responsive** (móvil, tablet, desktop)  

## Archivos

```
perfil.html                    # HTML + Modal
css/publicaciones.css          # Estilos
js/publicaciones.js            # Funcionalidad
docs/PUBLICACIONES.md          # Documentación completa
```

## Límites

- **Tamaño máximo por archivo:** 50MB
- **Máximo de archivos:** 10
- **Formatos de imagen:** JPG, PNG, GIF, WebP
- **Formatos de video:** MP4, WebM, OGG

## Testing Rápido

```javascript
// Limpiar publicaciones
localStorage.removeItem('userPosts');
location.reload();
```

## Próximamente

🚧 Sistema de comentarios  
🚧 Compartir publicaciones  
🚧 Editar publicaciones  
🚧 Reacciones extendidas  
🚧 Integración con backend  

---

📖 **Documentación completa:** `docs/PUBLICACIONES.md`
