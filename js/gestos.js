/**
 * ServiLocal - Gestos táctiles avanzados
 * Maneja swipe, long-press, pull-to-refresh y otros gestos móviles
 */

(function() {
  'use strict';

  /**
   * Detector de gestos táctiles
   */
  class GestureDetector {
    constructor(element, options = {}) {
      this.element = element;
      this.options = {
        swipeThreshold: options.swipeThreshold || 50,
        longPressDelay: options.longPressDelay || 500,
        doubleTapDelay: options.doubleTapDelay || 300,
        preventScroll: options.preventScroll || false,
        ...options
      };
      
      this.startX = 0;
      this.startY = 0;
      this.startTime = 0;
      this.isLongPress = false;
      this.longPressTimer = null;
      this.lastTap = 0;
      
      this.init();
    }
    
    init() {
      this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: !this.options.preventScroll });
      this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: !this.options.preventScroll });
      this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
      this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this));
    }
    
    handleTouchStart(e) {
      const touch = e.touches[0];
      this.startX = touch.clientX;
      this.startY = touch.clientY;
      this.startTime = Date.now();
      this.isLongPress = false;
      
      // Detectar long press
      this.longPressTimer = setTimeout(() => {
        this.isLongPress = true;
        this.trigger('longpress', { x: this.startX, y: this.startY });
      }, this.options.longPressDelay);
    }
    
    handleTouchMove(e) {
      // Cancelar long press si hay movimiento
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
        this.longPressTimer = null;
      }
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.startX;
      const deltaY = touch.clientY - this.startY;
      
      // Trigger swipe move
      this.trigger('swipemove', { deltaX, deltaY, x: touch.clientX, y: touch.clientY });
      
      if (this.options.preventScroll) {
        e.preventDefault();
      }
    }
    
    handleTouchEnd(e) {
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
      }
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - this.startX;
      const deltaY = touch.clientY - this.startY;
      const deltaTime = Date.now() - this.startTime;
      
      // Detectar tap/double tap
      if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
        const now = Date.now();
        if (now - this.lastTap < this.options.doubleTapDelay) {
          this.trigger('doubletap', { x: touch.clientX, y: touch.clientY });
        } else {
          this.trigger('tap', { x: touch.clientX, y: touch.clientY });
        }
        this.lastTap = now;
        return;
      }
      
      // Detectar swipe
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      
      if (absX > this.options.swipeThreshold || absY > this.options.swipeThreshold) {
        let direction;
        
        if (absX > absY) {
          direction = deltaX > 0 ? 'right' : 'left';
        } else {
          direction = deltaY > 0 ? 'down' : 'up';
        }
        
        this.trigger('swipe', { direction, deltaX, deltaY, duration: deltaTime });
        this.trigger(`swipe${direction}`, { deltaX, deltaY, duration: deltaTime });
      }
    }
    
    handleTouchCancel() {
      if (this.longPressTimer) {
        clearTimeout(this.longPressTimer);
      }
    }
    
    trigger(eventName, data) {
      const event = new CustomEvent(`gesture:${eventName}`, {
        detail: data,
        bubbles: true
      });
      this.element.dispatchEvent(event);
    }
    
    destroy() {
      this.element.removeEventListener('touchstart', this.handleTouchStart);
      this.element.removeEventListener('touchmove', this.handleTouchMove);
      this.element.removeEventListener('touchend', this.handleTouchEnd);
      this.element.removeEventListener('touchcancel', this.handleTouchCancel);
    }
  }

  /**
   * Swipe para cerrar modales
   */
  function initSwipeToCloseModals() {
    document.querySelectorAll('.c-modal').forEach(modal => {
      let startY = 0;
      let currentY = 0;
      let isDragging = false;
      
      const modalContent = modal.querySelector('.c-modal__content');
      if (!modalContent) return;
      
      const gesture = new GestureDetector(modalContent, {
        swipeThreshold: 100,
        preventScroll: false
      });
      
      modalContent.addEventListener('gesture:swipemove', (e) => {
        const { deltaY } = e.detail;
        
        // Solo permitir swipe hacia abajo
        if (deltaY > 0) {
          isDragging = true;
          modalContent.style.transform = `translateY(${deltaY}px)`;
          modalContent.style.transition = 'none';
          
          // Reducir opacidad mientras se arrastra
          const opacity = 1 - (deltaY / 300);
          modal.style.backgroundColor = `rgba(0, 0, 0, ${opacity * 0.5})`;
        }
      });
      
      modalContent.addEventListener('gesture:swipedown', (e) => {
        const { deltaY } = e.detail;
        
        if (deltaY > 100) {
          // Cerrar modal
          modalContent.style.transition = 'transform 0.3s ease-out';
          modalContent.style.transform = 'translateY(100%)';
          
          setTimeout(() => {
            modal.classList.remove('is-visible');
            modal.style.backgroundColor = '';
            modalContent.style.transform = '';
            modalContent.style.transition = '';
          }, 300);
        } else {
          // Volver a posición original
          modalContent.style.transition = 'transform 0.3s ease-out';
          modalContent.style.transform = 'translateY(0)';
          modal.style.backgroundColor = '';
          
          setTimeout(() => {
            modalContent.style.transition = '';
          }, 300);
        }
        
        isDragging = false;
      });
    });
  }

  /**
   * Pull to refresh
   */
  function initPullToRefresh() {
    let startY = 0;
    let isPulling = false;
    let refreshThreshold = 80;
    
    // Crear indicador de refresh
    const refreshIndicator = document.createElement('div');
    refreshIndicator.className = 'c-pull-refresh';
    refreshIndicator.innerHTML = `
      <div class="c-pull-refresh__spinner">
        <i class="fas fa-sync-alt" aria-hidden="true"></i>
      </div>
      <span class="c-pull-refresh__text">Suelta para actualizar</span>
    `;
    document.body.insertBefore(refreshIndicator, document.body.firstChild);
    
    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        isPulling = false;
      }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
      if (window.scrollY === 0 && startY > 0) {
        const currentY = e.touches[0].clientY;
        const pullDistance = currentY - startY;
        
        if (pullDistance > 0) {
          isPulling = true;
          const distance = Math.min(pullDistance, refreshThreshold * 1.5);
          const scale = Math.min(distance / refreshThreshold, 1);
          
          refreshIndicator.style.transform = `translateY(${distance}px)`;
          refreshIndicator.style.opacity = scale;
          
          if (distance >= refreshThreshold) {
            refreshIndicator.classList.add('is-ready');
          } else {
            refreshIndicator.classList.remove('is-ready');
          }
        }
      }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
      if (isPulling) {
        const hasReachedThreshold = refreshIndicator.classList.contains('is-ready');
        
        if (hasReachedThreshold) {
          // Activar refresh
          refreshIndicator.style.transform = `translateY(${refreshThreshold}px)`;
          refreshIndicator.classList.add('is-refreshing');
          refreshIndicator.classList.remove('is-ready');
          
          // Simular refresh (reemplazar con lógica real)
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          // Volver a esconder
          refreshIndicator.style.transform = 'translateY(-100%)';
          refreshIndicator.style.opacity = '0';
        }
        
        isPulling = false;
        startY = 0;
      }
    });
  }

  /**
   * Feedback táctil mejorado (ripple effect)
   */
  function initTapFeedback() {
    document.body.addEventListener('touchstart', (e) => {
      const button = e.target.closest('.c-button, .c-card, .c-result-card, [role="button"]');
      
      if (button && !button.classList.contains('no-ripple')) {
        const ripple = document.createElement('span');
        ripple.className = 'c-ripple';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.touches[0].clientX - rect.left - size / 2;
        const y = e.touches[0].clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      }
    }, { passive: true });
  }

  /**
   * Prevenir zoom en double-tap (iOS)
   */
  function preventDoubleTapZoom() {
    let lastTouchEnd = 0;
    
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }

  /**
   * Agregar clase touch-active para feedback visual
   */
  function initTouchActiveStates() {
    document.body.addEventListener('touchstart', (e) => {
      const target = e.target.closest('.c-button, .c-card, .c-result-card, a');
      if (target) {
        target.classList.add('is-touch-active');
      }
    }, { passive: true });
    
    document.body.addEventListener('touchend', (e) => {
      const target = e.target.closest('.c-button, .c-card, .c-result-card, a');
      if (target) {
        setTimeout(() => {
          target.classList.remove('is-touch-active');
        }, 150);
      }
    }, { passive: true });
    
    document.body.addEventListener('touchcancel', (e) => {
      const target = e.target.closest('.c-button, .c-card, .c-result-card, a');
      if (target) {
        target.classList.remove('is-touch-active');
      }
    }, { passive: true });
  }

  // Exponer API pública
  window.ServiLocalGestures = {
    GestureDetector,
    initSwipeToCloseModals,
    initPullToRefresh,
    initTapFeedback,
    preventDoubleTapZoom,
    initTouchActiveStates
  };

  // Auto-inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSwipeToCloseModals();
      initPullToRefresh();
      initTapFeedback();
      preventDoubleTapZoom();
      initTouchActiveStates();
    });
  } else {
    initSwipeToCloseModals();
    initPullToRefresh();
    initTapFeedback();
    preventDoubleTapZoom();
    initTouchActiveStates();
  }
})();
