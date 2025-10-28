# 📱 Iconos y Favicons Pendientes

Los siguientes archivos de iconos necesitan ser generados:

## Archivos requeridos:
- `favicon.ico` (16x16, 32x32, 48x48 en un solo archivo)
- `favicon-16x16.png` 
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `og-image.png` (1200x630 para redes sociales)

## Herramientas recomendadas:

### Opción 1: Favicon.io
1. Ve a https://favicon.io/
2. Sube el archivo `favicon.svg`
3. Descarga el paquete completo
4. Copia los archivos a la raíz del proyecto

### Opción 2: RealFaviconGenerator
1. Ve a https://realfavicongenerator.net/
2. Sube `favicon.svg`
3. Configura para todas las plataformas
4. Descarga y descomprime

### Opción 3: ImageMagick (comando manual)
```bash
# Convertir SVG a PNG
convert -background none favicon.svg -resize 180x180 apple-touch-icon.png
convert -background none favicon.svg -resize 32x32 favicon-32x32.png
convert -background none favicon.svg -resize 16x16 favicon-16x16.png

# Crear favicon.ico multi-resolución
convert favicon-16x16.png favicon-32x32.png favicon.ico
```

### Opción 4: Para og-image.png
```bash
# Convertir el og-image.svg a PNG de 1200x630
convert -background none imagenes/og-image.svg -resize 1200x630 imagenes/og-image.png
```

## Estado actual:
✅ `favicon.svg` - Creado (base para generar otros formatos)
✅ `imagenes/og-image.svg` - Creado (base para imagen social)
⏳ `favicon.ico` - Pendiente de generar
⏳ `favicon-16x16.png` - Pendiente de generar
⏳ `favicon-32x32.png` - Pendiente de generar
⏳ `apple-touch-icon.png` - Pendiente de generar
⏳ `imagenes/og-image.png` - Pendiente de generar

## Nota:
Los archivos SVG actuales son funcionales pero es mejor generar PNG/ICO 
para máxima compatibilidad con navegadores y redes sociales.
