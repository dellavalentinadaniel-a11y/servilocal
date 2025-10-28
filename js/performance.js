/**
 * ServiLocal - Optimizaciones de Performance
 * Lazy loading, resource hints, y optimizaciones de carga
 */

(function() {
  'use strict';

  /**
   * Lazy Loading de imágenes con Intersection Observer
   */
  function initLazyLoading() {
    // Verificar soporte de Intersection Observer
    if (!('IntersectionObserver' in window)) {
      console.log('Intersection Observer no soportado, cargando todas las imágenes');
      cargarTodasLasImagenes();
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          cargarImagen(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px', // Comenzar a cargar 50px antes de ser visible
      threshold: 0.01
    });

    // Observar todas las imágenes lazy
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }

  /**
   * Carga una imagen lazy
   */
  function cargarImagen(img) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
    
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
      img.removeAttribute('data-srcset');
    }
  }

  /**
   * Fallback: cargar todas las imágenes si no hay soporte
   */
  function cargarTodasLasImagenes() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => cargarImagen(img));
  }

  /**
   * Preconnect a dominios externos críticos
   */
  function addResourceHints() {
    const hints = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
      { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com' },
      { rel: 'dns-prefetch', href: 'https://unpkg.com' }
    ];

    hints.forEach(hint => {
      const existente = document.querySelector(`link[rel="${hint.rel}"][href="${hint.href}"]`);
      if (!existente) {
        const link = document.createElement('link');
        link.rel = hint.rel;
        link.href = hint.href;
        if (hint.crossorigin) {
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      }
    });
  }

  /**
   * Optimización de fuentes con font-display: swap
   */
  function optimizarFuentes() {
    // Verificar si Font Loading API está disponible
    if ('fonts' in document) {
      // Cargar fuentes críticas primero
      const fuentesCriticas = [
        { family: 'Inter', weight: '400' },
        { family: 'Inter', weight: '600' }
      ];

      fuentesCriticas.forEach(fuente => {
        document.fonts.load(`${fuente.weight} 1em ${fuente.family}`);
      });

      // Cuando todas las fuentes estén listas
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
      });
    }
  }

  /**
   * Defer de scripts no críticos
   */
  function deferScripts() {
    const scriptsToDefer = document.querySelectorAll('script[data-defer="true"]');
    
    scriptsToDefer.forEach(script => {
      const newScript = document.createElement('script');
      newScript.src = script.src;
      newScript.defer = true;
      
      if (script.dataset.module) {
        newScript.type = 'module';
      }
      
      script.parentNode.replaceChild(newScript, script);
    });
  }

  /**
   * Reducir motion para usuarios con preferencias de accesibilidad
   */
  function respectarPreferenciasMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
      document.documentElement.classList.add('reduce-motion');
      
      // Anunciar a lectores de pantalla
      if (window.announceToScreenReader) {
        window.announceToScreenReader('Animaciones reducidas activadas');
      }
    }

    // Escuchar cambios en la preferencia
    prefersReducedMotion.addEventListener('change', (e) => {
      if (e.matches) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    });
  }

  /**
   * Optimizar renderizado con requestIdleCallback
   */
  function optimizarRenderizado(callback, options = {}) {
    if ('requestIdleCallback' in window) {
      return requestIdleCallback(callback, options);
    } else {
      // Fallback para navegadores sin soporte
      return setTimeout(callback, 1);
    }
  }

  /**
   * Cargar recursos de baja prioridad cuando el navegador esté inactivo
   */
  function cargarRecursosBajaPrioridad() {
    optimizarRenderizado(() => {
      // Cargar imágenes decorativas no críticas
      const imagenesDecorativas = document.querySelectorAll('img[data-priority="low"]');
      imagenesDecorativas.forEach(img => {
        if (img.dataset.src) {
          cargarImagen(img);
        }
      });

      // Inicializar features no críticas
      if (window.ServiLocalAnalytics) {
        window.ServiLocalAnalytics.init();
      }
    }, { timeout: 2000 });
  }

  /**
   * Comprimir y optimizar requests con compresión
   */
  function verificarSoporteCompresion() {
    // Verificar Accept-Encoding en requests
    if (navigator.connection) {
      const connection = navigator.connection;
      
      // Adaptar calidad según conexión
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        document.documentElement.classList.add('slow-connection');
        console.log('Conexión lenta detectada - modo optimizado');
      }

      // Escuchar cambios en la conexión
      connection.addEventListener('change', () => {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          document.documentElement.classList.add('slow-connection');
        } else {
          document.documentElement.classList.remove('slow-connection');
        }
      });
    }
  }

  /**
   * Prefetch de páginas probables
   */
  function prefetchProbablePages() {
    const linksToPrefetch = [
      { url: '/buscar.html', probability: 0.8 },
      { url: '/perfil.html', probability: 0.5 }
    ];

    optimizarRenderizado(() => {
      linksToPrefetch.forEach(({ url, probability }) => {
        if (Math.random() < probability) {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = url;
          link.as = 'document';
          document.head.appendChild(link);
        }
      });
    }, { timeout: 3000 });
  }

  /**
   * Medir Web Vitals (Core Web Vitals)
   */
  function medirWebVitals() {
    // LCP - Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // FID - First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            console.log('FID:', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // CLS - Cumulative Layout Shift
        let clsScore = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
              console.log('CLS:', clsScore);
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.log('Error midiendo Web Vitals:', e);
      }
    }
  }

  /**
   * Debounce para optimizar eventos frecuentes
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Throttle para optimizar eventos muy frecuentes
   */
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Exponer API pública
  window.ServiLocalPerformance = {
    initLazyLoading,
    optimizarRenderizado,
    debounce,
    throttle,
    cargarImagen,
    medirWebVitals
  };

  // Auto-inicializar optimizaciones
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addResourceHints();
      initLazyLoading();
      optimizarFuentes();
      respectarPreferenciasMotion();
      verificarSoporteCompresion();
      cargarRecursosBajaPrioridad();
      prefetchProbablePages();
      
      if (process.env.NODE_ENV !== 'production') {
        medirWebVitals();
      }
    });
  } else {
    addResourceHints();
    initLazyLoading();
    optimizarFuentes();
    respectarPreferenciasMotion();
    verificarSoporteCompresion();
    cargarRecursosBajaPrioridad();
    prefetchProbablePages();
  }
})();
