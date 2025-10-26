/**
 * Script de componentes interactivos para ServiLocal
 * Mejora modales, tabs, gallery y otros componentes con mejor accesibilidad y UX
 */

(function() {
  'use strict';

  /**
   * Mejorar funcionalidad de Tabs
   */
  function enhanceTabs() {
    const tabsContainers = document.querySelectorAll('.c-tabs');
    
    tabsContainers.forEach(container => {
      const tabList = container.querySelector('.c-tabs__nav');
      const tabs = container.querySelectorAll('.c-tabs__link');
      const panels = container.querySelectorAll('.c-tab-panel');

      if (!tabList || tabs.length === 0) return;

      // Configurar ARIA
      tabList.setAttribute('role', 'tablist');
      tabs.forEach((tab, index) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        tab.setAttribute('aria-controls', `panel-${index}`);
        tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
        tab.id = `tab-${index}`;
      });

      panels.forEach((panel, index) => {
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', `tab-${index}`);
        panel.id = `panel-${index}`;
        panel.setAttribute('tabindex', '0');
        panel.style.display = index === 0 ? 'block' : 'none';
      });

      // Navegación por teclado
      tabList.addEventListener('keydown', (e) => {
        const currentTab = e.target;
        const tabs = [...container.querySelectorAll('.c-tabs__link')];
        const currentIndex = tabs.indexOf(currentTab);

        let targetIndex;
        
        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault();
            targetIndex = (currentIndex + 1) % tabs.length;
            break;
          case 'ArrowLeft':
            e.preventDefault();
            targetIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
            break;
          case 'Home':
            e.preventDefault();
            targetIndex = 0;
            break;
          case 'End':
            e.preventDefault();
            targetIndex = tabs.length - 1;
            break;
          default:
            return;
        }

        // Activar nuevo tab
        activateTab(tabs[targetIndex], container);
      });

      // Click en tabs
      tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          activateTab(tab, container);
        });
      });
    });
  }

  /**
   * Activar un tab específico
   */
  function activateTab(targetTab, container) {
    const tabs = container.querySelectorAll('.c-tabs__link');
    const panels = container.querySelectorAll('.c-tab-panel');
    const targetIndex = [...tabs].indexOf(targetTab);

    // Desactivar todos los tabs
    tabs.forEach(tab => {
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
      tab.classList.remove('c-tabs__link--active');
    });

    // Ocultar todos los panels
    panels.forEach(panel => {
      panel.style.display = 'none';
    });

    // Activar el tab objetivo
    targetTab.setAttribute('aria-selected', 'true');
    targetTab.setAttribute('tabindex', '0');
    targetTab.classList.add('c-tabs__link--active');
    targetTab.focus();

    // Mostrar el panel correspondiente
    if (panels[targetIndex]) {
      panels[targetIndex].style.display = 'block';
    }

    // Anunciar cambio
    if (window.announceToScreenReader) {
      window.announceToScreenReader(`Pestaña ${targetTab.textContent} activada`);
    }
  }

  /**
   * Mejorar Gallery con modal
   */
  function enhanceGallery() {
    const galleries = document.querySelectorAll('.c-gallery');
    
    galleries.forEach(gallery => {
      const items = gallery.querySelectorAll('.c-gallery__item');
      
      items.forEach((item, index) => {
        const image = item.querySelector('.c-gallery__image');
        if (!image) return;

        // Hacer navegable por teclado
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Ver imagen ${index + 1} en pantalla completa`);

        // Event listeners
        item.addEventListener('click', () => openImageModal(image, index, items));
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openImageModal(image, index, items);
          }
        });
      });
    });
  }

  /**
   * Crear y abrir modal de imagen
   */
  function openImageModal(image, currentIndex, allItems) {
    // Crear modal si no existe
    let modal = document.querySelector('#image-modal');
    if (!modal) {
      modal = createImageModal();
    }

    const modalImage = modal.querySelector('.c-modal__image');
    const modalCounter = modal.querySelector('.c-modal__counter');
    const prevBtn = modal.querySelector('[data-action="prev"]');
    const nextBtn = modal.querySelector('[data-action="next"]');

    // Configurar imagen actual
    modalImage.src = image.src;
    modalImage.alt = image.alt || `Imagen ${currentIndex + 1}`;
    modalCounter.textContent = `${currentIndex + 1} de ${allItems.length}`;

    // Configurar navegación
    prevBtn.onclick = () => navigateModal(currentIndex - 1, allItems, modal);
    nextBtn.onclick = () => navigateModal(currentIndex + 1, allItems, modal);

    // Navegación por teclado en modal
    const handleModalKeydown = (e) => {
      switch (e.key) {
        case 'Escape':
          closeModal(modal);
          break;
        case 'ArrowLeft':
          navigateModal(currentIndex - 1, allItems, modal);
          break;
        case 'ArrowRight':
          navigateModal(currentIndex + 1, allItems, modal);
          break;
      }
    };

    modal.addEventListener('keydown', handleModalKeydown);
    modal.dataset.currentIndex = currentIndex;

    // Abrir modal
    openModal(modal);
  }

  /**
   * Crear estructura del modal de imagen
   */
  function createImageModal() {
    const modal = document.createElement('div');
    modal.id = 'image-modal';
    modal.className = 'c-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Visor de imagen en pantalla completa');

    modal.innerHTML = `
      <div class="c-modal__dialog">
        <button type="button" class="c-modal__close" data-action="close" aria-label="Cerrar visor de imagen">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
        <div class="c-modal__image-wrapper">
          <div class="c-modal__loader" aria-hidden="true">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
          <img src="" alt="" class="c-modal__image">
        </div>
        <div class="c-modal__nav">
          <button type="button" class="c-modal__nav-btn" data-action="prev" aria-label="Imagen anterior">
            <i class="fas fa-chevron-left" aria-hidden="true"></i>
          </button>
          <span class="c-modal__counter" aria-live="polite"></span>
          <button type="button" class="c-modal__nav-btn" data-action="next" aria-label="Imagen siguiente">
            <i class="fas fa-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listener para cerrar
    modal.querySelector('[data-action="close"]').onclick = () => closeModal(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });

    return modal;
  }

  /**
   * Navegar en el modal de imágenes
   */
  function navigateModal(newIndex, allItems, modal) {
    const maxIndex = allItems.length - 1;
    let targetIndex = newIndex;

    // Navegación circular
    if (targetIndex > maxIndex) targetIndex = 0;
    if (targetIndex < 0) targetIndex = maxIndex;

    const targetImage = allItems[targetIndex].querySelector('.c-gallery__image');
    if (targetImage) {
      openImageModal(targetImage, targetIndex, allItems);
    }
  }

  /**
   * Abrir modal con manejo de foco
   */
  function openModal(modal) {
    // Guardar elemento que tenía foco
    modal.dataset.previousFocus = document.activeElement.id || '';

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';

    // Mostrar modal
    modal.classList.add('is-open');
    
    // Foco en el modal
    setTimeout(() => {
      const firstFocusable = modal.querySelector('button, [tabindex="0"]');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }, 100);

    // Anunciar
    if (window.announceToScreenReader) {
      window.announceToScreenReader('Modal de imagen abierto. Usa las flechas para navegar o Escape para cerrar.');
    }
  }

  /**
   * Cerrar modal y restaurar foco
   */
  function closeModal(modal) {
    // Restaurar scroll del body
    document.body.style.overflow = '';

    // Ocultar modal
    modal.classList.remove('is-open');

    // Restaurar foco
    const previousFocusId = modal.dataset.previousFocus;
    if (previousFocusId) {
      const previousElement = document.getElementById(previousFocusId);
      if (previousElement) {
        previousElement.focus();
      }
    }

    // Anunciar
    if (window.announceToScreenReader) {
      window.announceToScreenReader('Modal cerrado');
    }
  }

  /**
   * Mejorar funcionalidad de Cards Interactivas
   */
  function enhanceInteractiveCards() {
    const cards = document.querySelectorAll('.c-feature-card, .c-service-card, .c-directory-card');
    
    cards.forEach(card => {
      // Solo para navegadores con soporte de focus-visible
      if ('focus' in card || card.tabIndex >= 0) {
        card.addEventListener('focus', () => {
          card.classList.add('has-focus-visible');
        });
        
        card.addEventListener('blur', () => {
          card.classList.remove('has-focus-visible');
        });
      }
    });
  }

  /**
   * Funcionalidad del Menú Hamburguesa Responsivo
   */
  function enhanceNavbarToggle() {
    const toggle = document.querySelector('.c-navbar__toggle');
    const menu = document.querySelector('.c-navbar__menu');
    const navbar = document.querySelector('.c-navbar');
    const links = document.querySelectorAll('.c-navbar__link');
    
    if (!toggle || !menu) return;

    // Función para alternar el menú
    function toggleMenu() {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      
      toggle.setAttribute('aria-expanded', !isOpen);
      menu.classList.toggle('is-open', !isOpen);
      
      // Prevenir scroll del body cuando el menú está abierto
      document.body.style.overflow = !isOpen ? 'hidden' : '';
      
      // Anunciar cambio a lectores de pantalla
      const announcement = !isOpen ? 'Menú abierto' : 'Menú cerrado';
      announceToScreenReader(announcement);
    }

    // Cerrar menú
    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    }

    // Event listeners
    toggle.addEventListener('click', toggleMenu);

    // Cerrar menú al hacer clic en un enlace
    links.forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(closeMenu, 150);
      });
    });

    // Cerrar menú con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        toggle.focus();
      }
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Manejar redimensionamiento de ventana
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /**
   * Anunciar mensajes a lectores de pantalla
   */
  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Inicializar todas las mejoras de componentes
   */
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    try {
      enhanceTabs();
      enhanceGallery();
      enhanceInteractiveCards();
      enhanceNavbarToggle();
      
      console.log('✓ Componentes interactivos mejorados');
    } catch (error) {
      console.error('Error al inicializar componentes interactivos:', error);
    }
  }

  // Inicializar
  init();

})();