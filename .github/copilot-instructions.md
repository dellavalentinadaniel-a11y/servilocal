# ServiLocal - AI Coding Instructions

## Project Overview
ServiLocal is a **Spanish-language local marketplace** connecting neighbors with verified service professionals. Built as a **vanilla HTML/CSS/JS static site** with modern design tokens and component-based architecture.

## Architecture & Design System

### CSS Architecture
- **Design tokens**: All colors, spacing, typography defined in `css/tokens.css` as CSS custom properties
- **Component library**: Modular BEM-style components in `css/components.css` (prefix `c-`)
- **Color system**: Uses modern `color-mix()` functions with transparency fallbacks
- **Responsive design**: Mobile-first with breakpoints at 600px and 768px

### Component Naming Convention
```css
.c-component__element--modifier
.c-navbar, .c-button, .c-hero, .c-card, .c-modal, etc.
```

### HTML Patterns
- **Semantic structure**: `c-page` wrapper, `c-main` content, consistent `container` classes
- **Accessibility first**: ARIA labels, semantic roles, proper heading hierarchy
- **Service pages**: Each service has dedicated HTML file (jardineria.html, plomeria.html, etc.)

## Development Workflow

### CSS Linting
- **Stylelint** enforces BEM naming and modern CSS patterns
- **Commands**: `npm run lint:css` (check) and `npm run lint:css:fix` (auto-fix)
- **Git hooks**: Pre-commit automatically runs CSS linting via Husky

### JavaScript Architecture
- **Modular approach**: Separate scripts for specific functionality
- **`js/accesibilidad.js`**: Focus management, skip links, keyboard navigation
- **`js/formularios.js`**: Form validation, live feedback, UX enhancements
- **`js/componentes.js`**: Interactive components (modals, tabs, gallery)
- **`js/cookies.js`**: GDPR-compliant cookie consent banner
- **`js/mapa.js`**: Leaflet map integration

### Key Dependencies
- **Font Awesome 6.5**: Icons throughout the interface
- **Google Fonts**: Inter font family (400, 500, 600, 700 weights)
- **Leaflet**: Maps integration (see `proveedor.html`)

## Project-Specific Patterns

### Accessibility Implementation
- **Skip links**: Automatic generation for keyboard navigation
- **Focus management**: Visual indicators and proper tab order
- **ARIA labels**: Comprehensive screen reader support
- **Live regions**: Real-time announcements for dynamic content
- **Form validation**: Accessible error messages and feedback

### Interactive Components
- **Modular gallery**: Keyboard-navigable with modal view
- **Enhanced forms**: Live validation with visual feedback
- **Accessible tabs**: ARIA-compliant with keyboard navigation
- **Interactive cards**: Keyboard navigation and proper focus states

### Cookie Consent
- Self-contained IIFE in `js/cookies.js`
- Uses localStorage with error handling for privacy modes
- Banner component with fade transitions

### Design Tokens Usage
Always use design tokens from `css/tokens.css` instead of hardcoded values:
- ✅ `color: var(--color-principal);`
- ✅ `padding: var(--espacio-medio);`
- ✅ `border-radius: var(--borde-suave);`
- ❌ Avoid hardcoded color hex values

### Service Categories
Core services: jardinería, plomería, electricidad, limpieza, construcción, abogacía, contaduría, veterinaria. Each has dedicated page with consistent structure.

### Component Variations
- **Buttons**: `c-button` (primary), `c-button--secondary`
- **Sections**: `c-section`, `c-section--light`, `c-section--tight`
- **Cards**: `c-card`, `c-service-card`, `c-feature-card`, `c-result-card`

## File Structure
- **Pages**: Root-level HTML files for each page/service
- **Styles**: `css/tokens.css` (variables) + `css/components.css` (all components)
- **Scripts**: `js/` directory for modular JavaScript
- **Assets**: `imagenes/` for images, organized by type

## When Adding New Features
1. Use existing design tokens from `css/tokens.css`
2. Follow BEM naming: `c-component__element--modifier`
3. Test CSS changes with `npm run lint:css`
4. **Include accessibility scripts**: Add relevant JS modules (`accesibilidad.js`, `componentes.js`, etc.)
5. **Implement ARIA properly**: Use semantic HTML, proper roles, and labels
6. **Test keyboard navigation**: Ensure all interactive elements are accessible via keyboard
7. Maintain Spanish language throughout content
8. Use consistent `container` wrapper for content width

## Accessibility Standards
- **Skip links**: Always include for keyboard users
- **Focus indicators**: Use `.has-focus-visible` class for enhanced focus states
- **Screen reader support**: Include `.sr-only` elements and `aria-live` regions
- **Form feedback**: Use `.c-field-feedback` classes for validation states
- **Interactive elements**: Ensure proper `role`, `aria-label`, and keyboard support

## Testing
- **CSS**: Automated via Stylelint + Husky pre-commit hooks
- **Manual**: Open HTML files in browser or use local server (`python -m http.server 8000`)