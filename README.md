# 🏘️ ServiLocal

Plataforma web que conecta vecinos con profesionales de servicios locales verificados.

## 📋 Descripción

ServiLocal es un marketplace local que permite a los usuarios encontrar y contratar profesionales de confianza en diversas categorías como jardinería, plomería, electricidad, limpieza, construcción, y más.

## 🚀 Características

- ✨ Búsqueda de profesionales por categoría y ubicación
- ⭐ Sistema de reseñas y calificaciones
- 🔐 Registro y autenticación de usuarios
- 📱 Diseño responsive
- 🍪 Gestión de cookies conforme a GDPR
- ♿ Accesibilidad (ARIA labels, roles semánticos)

## 🛠️ Tecnologías

- **Frontend:** HTML5, CSS3 (Custom Properties), JavaScript Vanilla
- **Fuentes:** Google Fonts (Inter)
- **Iconos:** Font Awesome 6.5
- **Herramientas:** Stylelint, Husky (pre-commit hooks)

## 📂 Estructura del proyecto

```
mi-plataforma-local/
├── css/
│   ├── components.css      # Componentes reutilizables
│   └── tokens.css          # Variables de diseño
├── js/
│   ├── cookies.js          # Banner de cookies
│   └── mapa.js             # Integración de mapas
├── imagenes/               # Assets de imágenes
├── *.html                  # Páginas del sitio
└── package.json            # Dependencias y scripts
```

## 🎯 Servicios disponibles

- 🌳 Jardinería
- 🔧 Plomería
- ⚡ Electricidad
- 🧹 Limpieza
- 🏗️ Construcción
- ⚖️ Abogacía
- 🧮 Contaduría
- 🐾 Veterinaria
- Y más...

## 💻 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/mi-plataforma-local.git

# Entrar al directorio
cd mi-plataforma-local

# Instalar dependencias
npm install

# Inicializar Husky
npm run prepare
```

## 🧪 Scripts disponibles

```bash
# Lintear CSS
npm run lint:css

# Corregir problemas de CSS automáticamente
npm run lint:css:fix
```

## 📖 Uso

Abrí `index.html` en tu navegador o usá un servidor local:

```bash
# Con Python
python -m http.server 8000

# Con Node.js (http-server)
npx http-server
```

## 🤝 Contribuir

1. Fork el proyecto
2. Creá una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abrí un Pull Request

## 📝 Roadmap

- [ ] Backend con API REST
- [ ] Sistema de autenticación real
- [ ] Integración con pasarelas de pago
- [ ] Chat en tiempo real
- [ ] Notificaciones push
- [ ] App móvil nativa

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial*
- **Tu Compañero** - *Colaborador*

## 📄 Licencia

Este proyecto es privado y de uso educativo/comercial.

## 🙏 Agradecimientos

- Comunidad de desarrolladores
- Recursos de diseño y UX
