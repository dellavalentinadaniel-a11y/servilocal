/**
 * Script de accesibilidad para ServiLocal
 * Mejora la navegación por teclado, focus management y anuncios para lectores de pantalla
 */

(function() {
  'use strict';

  // Configuración global
  const SKIP_LINK_TEXT = 'Saltar al contenido principal';
  const FOCUS_CLASS = 'has-focus-visible';

  /**
   * Crear skip link para navegación por teclado
   */
  function createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'c-skip-link';
    skipLink.textContent = SKIP_LINK_TEXT;
    skipLink.setAttribute('aria-label', 'Saltar navegación e ir al contenido principal');

    // Insertar al inicio del body
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Manejar el clic
    skipLink.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector('#main-content, main, .c-main');
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.addEventListener('blur', function() {
          target.removeAttribute('tabindex');
        }, { once: true });
      }
    });
  }

  /**
   * Mejorar el focus management para navegación por teclado
   */
  function enhanceFocusManagement() {
    // Detectar navegación por teclado vs mouse
    let hadKeyboardEvent = true;
    let hadMouseEvent = false;

    const keyboardEvents = ['keydown', 'keyup'];
    const mouseEvents = ['mousedown', 'mouseup'];

    keyboardEvents.forEach(event => {
      document.addEventListener(event, () => {
        hadKeyboardEvent = true;
        hadMouseEvent = false;
      });
    });

    mouseEvents.forEach(event => {
      document.addEventListener(event, () => {
        hadKeyboardEvent = false;
        hadMouseEvent = true;
      });
    });

    // Aplicar focus visible solo para navegación por teclado
    document.addEventListener('focus', (e) => {
      if (hadKeyboardEvent || e.target.classList.contains('c-button')) {
        e.target.classList.add(FOCUS_CLASS);
      }
    }, true);

    document.addEventListener('blur', (e) => {
      e.target.classList.remove(FOCUS_CLASS);
    }, true);
  }

  /**
   * Mejorar navegación en componentes específicos
   */
  function enhanceComponentNavigation() {
    // Navegación en cards/links
    const interactiveCards = document.querySelectorAll('.c-service-card, .c-result-card, .c-feature-card');
    
    interactiveCards.forEach(card => {
      // Hacer cards navegables por teclado si contienen links
      const link = card.querySelector('a');
      if (link && !card.hasAttribute('tabindex')) {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Ir a ${link.textContent || link.getAttribute('aria-label')}`);

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            link.click();
          }
        });
      }
    });

    // Mejorar navegación en formularios
    const forms = document.querySelectorAll('form, .c-form-card');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea, button');
      
      inputs.forEach((input, index) => {
        input.addEventListener('keydown', (e) => {
          // Navegación con flechas en formularios horizontales
          if (e.key === 'ArrowRight' && !['textarea'].includes(input.type)) {
            const nextInput = inputs[index + 1];
            if (nextInput) {
              e.preventDefault();
              nextInput.focus();
            }
          } else if (e.key === 'ArrowLeft' && !['textarea'].includes(input.type)) {
            const prevInput = inputs[index - 1];
            if (prevInput) {
              e.preventDefault();
              prevInput.focus();
            }
          }
        });
      });
    });
  }

  /**
   * Announcer para lectores de pantalla
   */
  function createLiveRegion() {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    
    // Estilos para screen reader only
    Object.assign(liveRegion.style, {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      border: '0'
    });
    
    document.body.appendChild(liveRegion);
    
    // Función global para anunciar mensajes
    window.announceToScreenReader = function(message, urgent = false) {
      const region = document.getElementById('live-region');
      if (region) {
        region.setAttribute('aria-live', urgent ? 'assertive' : 'polite');
        region.textContent = message;
        
        // Limpiar después de un tiempo
        setTimeout(() => {
          region.textContent = '';
        }, 1000);
      }
    };
  }

  /**
   * Mejorar labels e identificación de controles
   */
  function enhanceLabels() {
    // Asegurar que todos los inputs tengan labels apropiados
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label && input.placeholder) {
          input.setAttribute('aria-label', input.placeholder);
        }
      }
    });

    // Mejorar botones con iconos
    const iconButtons = document.querySelectorAll('button:not([aria-label]), a:not([aria-label])');
    iconButtons.forEach(button => {
      const icon = button.querySelector('[class*="fa-"]');
      if (icon && !button.textContent.trim()) {
        const iconClass = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
        if (iconClass) {
          const action = iconClass.replace('fa-', '').replace('-', ' ');
          button.setAttribute('aria-label', `${action}`);
        }
      }
    });
  }

  /**
   * Inicializar todas las mejoras de accesibilidad
   */
  function init() {
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    try {
      createSkipLink();
      enhanceFocusManagement();
      enhanceComponentNavigation();
      createLiveRegion();
      enhanceLabels();

      // Anunciar que la página está lista
      setTimeout(() => {
        if (window.announceToScreenReader) {
          const pageTitle = document.title;
          window.announceToScreenReader(`Página ${pageTitle} cargada`);
        }
      }, 500);

    } catch (error) {
      console.error('Error al inicializar mejoras de accesibilidad:', error);
    }
  }

  // Inicializar
  init();

})();