/**
 * Registro y gestión del Service Worker para PWA
 * Maneja instalación, actualizaciones y comunicación con el SW
 */

(function() {
  'use strict';

  // Verificar soporte de Service Worker
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker no soportado en este navegador');
    return;
  }

  /**
   * Registra el Service Worker
   */
  async function registrarServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      
      console.log('✅ Service Worker registrado:', registration.scope);
      
      // Verificar actualizaciones cada hora
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);
      
      // Escuchar actualizaciones
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            mostrarNotificacionActualizacion();
          }
        });
      });
      
      return registration;
    } catch (error) {
      console.error('❌ Error al registrar Service Worker:', error);
    }
  }

  /**
   * Muestra notificación de actualización disponible
   */
  function mostrarNotificacionActualizacion() {
    // Crear banner de actualización
    const banner = document.createElement('div');
    banner.className = 'c-update-banner';
    banner.setAttribute('role', 'alert');
    banner.innerHTML = `
      <div class="c-update-banner__content">
        <i class="fas fa-sync-alt" aria-hidden="true"></i>
        <div>
          <strong>Nueva versión disponible</strong>
          <p>Actualiza para obtener las últimas mejoras</p>
        </div>
      </div>
      <div class="c-update-banner__actions">
        <button id="updateBtn" class="c-button c-button--small">
          Actualizar ahora
        </button>
        <button id="dismissBtn" class="c-button c-button--secondary c-button--small">
          Más tarde
        </button>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // Animar entrada
    setTimeout(() => banner.classList.add('is-visible'), 100);
    
    // Botón actualizar
    document.getElementById('updateBtn').addEventListener('click', () => {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    });
    
    // Botón descartar
    document.getElementById('dismissBtn').addEventListener('click', () => {
      banner.classList.remove('is-visible');
      setTimeout(() => banner.remove(), 300);
    });
  }

  /**
   * Verifica si la app está instalada como PWA
   */
  function esAppInstalada() {
    // Verificar display-mode standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return true;
    }
    
    // Verificar en iOS
    if (window.navigator.standalone === true) {
      return true;
    }
    
    return false;
  }

  /**
   * Muestra prompt de instalación de PWA
   */
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir el prompt automático
    e.preventDefault();
    deferredPrompt = e;
    
    // No mostrar si ya está instalada
    if (esAppInstalada()) {
      return;
    }
    
    // Mostrar botón de instalación personalizado
    mostrarBotonInstalacion();
  });

  /**
   * Crea y muestra el botón de instalación
   */
  function mostrarBotonInstalacion() {
    // Evitar duplicados
    if (document.getElementById('installBanner')) {
      return;
    }
    
    const banner = document.createElement('div');
    banner.id = 'installBanner';
    banner.className = 'c-install-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Instalar aplicación');
    banner.innerHTML = `
      <div class="c-install-banner__content">
        <div class="c-install-banner__icon">
          <i class="fas fa-mobile-alt" aria-hidden="true"></i>
        </div>
        <div class="c-install-banner__text">
          <strong>Instala ServiLocal</strong>
          <p>Acceso rápido y funciona sin conexión</p>
        </div>
      </div>
      <div class="c-install-banner__actions">
        <button id="installBtn" class="c-button c-button--small">
          Instalar
        </button>
        <button id="closeInstallBtn" class="c-button c-button--secondary c-button--small" aria-label="Cerrar">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // Animar entrada después de 2 segundos
    setTimeout(() => banner.classList.add('is-visible'), 2000);
    
    // Botón instalar
    document.getElementById('installBtn').addEventListener('click', async () => {
      if (!deferredPrompt) return;
      
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`Resultado instalación: ${outcome}`);
      
      if (outcome === 'accepted') {
        if (window.announceToScreenReader) {
          window.announceToScreenReader('Aplicación instalada correctamente');
        }
      }
      
      deferredPrompt = null;
      banner.classList.remove('is-visible');
      setTimeout(() => banner.remove(), 300);
    });
    
    // Botón cerrar
    document.getElementById('closeInstallBtn').addEventListener('click', () => {
      banner.classList.remove('is-visible');
      setTimeout(() => banner.remove(), 300);
      
      // Guardar que el usuario rechazó (no mostrar por un tiempo)
      localStorage.setItem('installPromptDismissed', Date.now().toString());
    });
  }

  // Detectar cuando se instala la app
  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA instalada correctamente');
    
    if (window.announceToScreenReader) {
      window.announceToScreenReader('Aplicación instalada. Ahora puedes acceder desde tu pantalla de inicio');
    }
    
    // Limpiar prompt diferido
    deferredPrompt = null;
    
    // Remover banner si existe
    const banner = document.getElementById('installBanner');
    if (banner) {
      banner.remove();
    }
  });

  /**
   * Limpia el caché del Service Worker
   */
  async function limpiarCache() {
    if (!navigator.serviceWorker.controller) {
      console.log('No hay Service Worker activo');
      return;
    }
    
    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.success) {
          resolve();
        } else {
          reject(new Error('Error al limpiar caché'));
        }
      };
      
      navigator.serviceWorker.controller.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    });
  }

  /**
   * Verifica estado de conexión
   */
  function gestionarEstadoConexion() {
    const actualizarEstado = () => {
      if (!navigator.onLine) {
        mostrarBannerOffline();
      } else {
        ocultarBannerOffline();
      }
    };
    
    window.addEventListener('online', actualizarEstado);
    window.addEventListener('offline', actualizarEstado);
    
    // Estado inicial
    actualizarEstado();
  }

  let bannerOffline;
  
  function mostrarBannerOffline() {
    if (bannerOffline) return;
    
    bannerOffline = document.createElement('div');
    bannerOffline.className = 'c-offline-banner';
    bannerOffline.setAttribute('role', 'alert');
    bannerOffline.innerHTML = `
      <i class="fas fa-wifi-slash" aria-hidden="true"></i>
      <span>Sin conexión - Modo offline</span>
    `;
    
    document.body.appendChild(bannerOffline);
    
    setTimeout(() => bannerOffline.classList.add('is-visible'), 100);
    
    if (window.announceToScreenReader) {
      window.announceToScreenReader('Sin conexión a internet. Algunas funciones pueden no estar disponibles');
    }
  }

  function ocultarBannerOffline() {
    if (!bannerOffline) return;
    
    bannerOffline.classList.remove('is-visible');
    setTimeout(() => {
      if (bannerOffline) {
        bannerOffline.remove();
        bannerOffline = null;
      }
    }, 300);
    
    if (window.announceToScreenReader) {
      window.announceToScreenReader('Conexión restaurada');
    }
  }

  // Exponer API pública
  window.ServiLocalPWA = {
    esAppInstalada,
    limpiarCache,
    registrarServiceWorker
  };

  // Auto-inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      registrarServiceWorker();
      gestionarEstadoConexion();
    });
  } else {
    registrarServiceWorker();
    gestionarEstadoConexion();
  }
})();
