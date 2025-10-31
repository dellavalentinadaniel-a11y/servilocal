/**
 * NAVBAR MODERNO - SERVILOCAL
 * JavaScript para funcionalidad del navbar responsive
 */

(function() {
  'use strict';

  // ============================================
  // VARIABLES GLOBALES
  // ============================================
  let lastScrollY = 0;
  let ticking = false;

  // ============================================
  // MENÚ MÓVIL
  // ============================================
  function initMobileMenu() {
    const toggle = document.querySelector('.navbar-moderno__toggle');
    const menu = document.querySelector('.navbar-moderno__menu-mobile');
    const links = document.querySelectorAll('.navbar-moderno__menu-mobile-links .navbar-moderno__link');

    if (!toggle || !menu) return;

    // Toggle menú
    toggle.addEventListener('click', function() {
      const isActive = toggle.classList.contains('navbar-moderno__toggle--active');
      
      if (isActive) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Cerrar al hacer click en un link
    links.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', function(e) {
      if (menu.classList.contains('navbar-moderno__menu-mobile--active')) {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
          closeMenu();
        }
      }
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('navbar-moderno__menu-mobile--active')) {
        closeMenu();
      }
    });

    function openMenu() {
      toggle.classList.add('navbar-moderno__toggle--active');
      menu.classList.add('navbar-moderno__menu-mobile--active');
      document.body.style.overflow = 'hidden';
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      toggle.classList.remove('navbar-moderno__toggle--active');
      menu.classList.remove('navbar-moderno__menu-mobile--active');
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  // ============================================
  // BÚSQUEDA
  // ============================================
  function initSearch() {
    const searchForm = document.querySelector('.navbar-moderno__search');
    const searchInput = document.querySelector('.navbar-moderno__search-input');
    const searchButton = document.querySelector('.navbar-moderno__search-button');

    if (!searchForm || !searchInput) return;

    // Prevenir submit del form (manejarlo con JS)
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      performSearch();
    });

    // Click en botón de búsqueda
    if (searchButton) {
      searchButton.addEventListener('click', function(e) {
        e.preventDefault();
        performSearch();
      });
    }

    // Búsqueda con Enter
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        performSearch();
      }
    });

    function performSearch() {
      const query = searchInput.value.trim();
      
      if (query.length === 0) {
        // Feedback visual si está vacío
        searchInput.style.borderColor = '#ef4444';
        setTimeout(() => {
          searchInput.style.borderColor = '';
        }, 300);
        return;
      }

      // Redirigir a página de búsqueda con query
      window.location.href = `buscar.html?q=${encodeURIComponent(query)}`;
    }

    // Limpiar borde rojo al escribir
    searchInput.addEventListener('input', function() {
      this.style.borderColor = '';
    });
  }

  // ============================================
  // BÚSQUEDA MÓVIL
  // ============================================
  function initMobileSearch() {
    const mobileSearchForm = document.querySelector('.navbar-moderno__menu-mobile-search');
    const mobileSearchInput = mobileSearchForm?.querySelector('.navbar-moderno__search-input');

    if (!mobileSearchForm || !mobileSearchInput) return;

    mobileSearchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const query = mobileSearchInput.value.trim();
      
      if (query.length > 0) {
        window.location.href = `buscar.html?q=${encodeURIComponent(query)}`;
      }
    });
  }

  // ============================================
  // SCROLL EFFECTS
  // ============================================
  function initScrollEffects() {
    const navbar = document.querySelector('.navbar-moderno');
    if (!navbar) return;

    function updateNavbar() {
      const scrollY = window.scrollY;

      if (scrollY > 50) {
        navbar.classList.add('navbar-moderno--scrolled');
      } else {
        navbar.classList.remove('navbar-moderno--scrolled');
      }

      lastScrollY = scrollY;
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
  }

  // ============================================
  // PÁGINA ACTIVA
  // ============================================
  function setActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.navbar-moderno__link');

    links.forEach(link => {
      const href = link.getAttribute('href');
      
      if (href === currentPage || 
          (currentPage === 'index.html' && href === '/') ||
          (currentPage === '' && href === 'index.html')) {
        link.classList.add('navbar-moderno__link--active');
      }
    });
  }

  // ============================================
  // NOTIFICACIONES (SIMULADO)
  // ============================================
  function updateNotificationBadge() {
    // Aquí podrías hacer una llamada a tu API para obtener notificaciones
    // Por ahora es solo un ejemplo
    const badge = document.querySelector('.navbar-moderno__badge');
    
    if (badge) {
      // Simular: obtener número de mensajes no leídos desde localStorage o API
      const unreadCount = localStorage.getItem('unreadMessages') || 0;
      
      if (unreadCount > 0) {
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  // ============================================
  // CERRAR MENÚ AL CAMBIAR TAMAÑO
  // ============================================
  function initResponsiveHandler() {
    let resizeTimer;
    
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      
      resizeTimer = setTimeout(function() {
        if (window.innerWidth > 768) {
          // Cerrar menú móvil si se agranda la ventana
          const menu = document.querySelector('.navbar-moderno__menu-mobile');
          const toggle = document.querySelector('.navbar-moderno__toggle');
          
          if (menu && menu.classList.contains('navbar-moderno__menu-mobile--active')) {
            menu.classList.remove('navbar-moderno__menu-mobile--active');
            toggle.classList.remove('navbar-moderno__toggle--active');
            document.body.style.overflow = '';
          }
        }
      }, 250);
    });
  }

  // ============================================
  // ATAJOS DE TECLADO
  // ============================================
  function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // Ctrl/Cmd + K para enfocar búsqueda
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.navbar-moderno__search-input');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    });
  }

  // ============================================
  // ANIMACIÓN DE CARGA
  // ============================================
  function initLoadAnimation() {
    const navbar = document.querySelector('.navbar-moderno');
    if (navbar) {
      navbar.style.opacity = '0';
      
      setTimeout(() => {
        navbar.style.transition = 'opacity 0.3s ease';
        navbar.style.opacity = '1';
      }, 100);
    }
  }

  // ============================================
  // INICIALIZACIÓN
  // ============================================
  function init() {
    console.log('🎯 Navbar Moderno - ServiLocal inicializado');

    // Inicializar todas las funcionalidades
    initMobileMenu();
    initSearch();
    initMobileSearch();
    initScrollEffects();
    setActivePage();
    updateNotificationBadge();
    initResponsiveHandler();
    initKeyboardShortcuts();
    initLoadAnimation();

    // Actualizar notificaciones cada 30 segundos
    setInterval(updateNotificationBadge, 30000);
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exponer funciones públicas
  window.NavbarModerno = {
    updateNotifications: updateNotificationBadge,
    closeMenu: function() {
      const menu = document.querySelector('.navbar-moderno__menu-mobile');
      const toggle = document.querySelector('.navbar-moderno__toggle');
      if (menu && toggle) {
        menu.classList.remove('navbar-moderno__menu-mobile--active');
        toggle.classList.remove('navbar-moderno__toggle--active');
        document.body.style.overflow = '';
      }
    }
  };

})();
