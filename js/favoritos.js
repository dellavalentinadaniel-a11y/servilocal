/**
 * ServiLocal - Sistema de Favoritos
 * Gestiona la lista de profesionales favoritos del usuario con localStorage
 */

(function() {
  'use strict';

  const STORAGE_KEY = 'servilocal_favoritos';

  /**
   * Obtiene la lista de IDs de favoritos desde localStorage
   * @returns {Array<string>} Array de IDs de proveedores favoritos
   */
  function obtenerFavoritos() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error al leer favoritos:', error);
      return [];
    }
  }

  /**
   * Guarda la lista de favoritos en localStorage
   * @param {Array<string>} favoritos - Array de IDs
   */
  function guardarFavoritos(favoritos) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
    } catch (error) {
      console.error('Error al guardar favoritos:', error);
    }
  }

  /**
   * Verifica si un proveedor está en favoritos
   * @param {string} proveedorId - ID del proveedor
   * @returns {boolean}
   */
  function esFavorito(proveedorId) {
    const favoritos = obtenerFavoritos();
    return favoritos.includes(proveedorId);
  }

  /**
   * Agrega un proveedor a favoritos
   * @param {string} proveedorId - ID del proveedor
   * @returns {boolean} true si se agregó, false si ya estaba
   */
  function agregarFavorito(proveedorId) {
    const favoritos = obtenerFavoritos();
    
    if (favoritos.includes(proveedorId)) {
      return false; // Ya existe
    }
    
    favoritos.push(proveedorId);
    guardarFavoritos(favoritos);
    
    // Anunciar a lectores de pantalla
    if (window.announceToScreenReader) {
      window.announceToScreenReader('Agregado a favoritos');
    }
    
    return true;
  }

  /**
   * Quita un proveedor de favoritos
   * @param {string} proveedorId - ID del proveedor
   * @returns {boolean} true si se quitó, false si no estaba
   */
  function quitarFavorito(proveedorId) {
    const favoritos = obtenerFavoritos();
    const index = favoritos.indexOf(proveedorId);
    
    if (index === -1) {
      return false; // No existe
    }
    
    favoritos.splice(index, 1);
    guardarFavoritos(favoritos);
    
    // Anunciar a lectores de pantalla
    if (window.announceToScreenReader) {
      window.announceToScreenReader('Quitado de favoritos');
    }
    
    return true;
  }

  /**
   * Toggle favorito (agregar si no existe, quitar si existe)
   * @param {string} proveedorId - ID del proveedor
   * @returns {boolean} true si quedó como favorito, false si se quitó
   */
  function toggleFavorito(proveedorId) {
    if (esFavorito(proveedorId)) {
      quitarFavorito(proveedorId);
      return false;
    } else {
      agregarFavorito(proveedorId);
      return true;
    }
  }

  /**
   * Obtiene el contador total de favoritos
   * @returns {number}
   */
  function contarFavoritos() {
    return obtenerFavoritos().length;
  }

  /**
   * Limpia todos los favoritos (útil para desarrollo/testing)
   */
  function limpiarFavoritos() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      if (window.announceToScreenReader) {
        window.announceToScreenReader('Todos los favoritos eliminados');
      }
    } catch (error) {
      console.error('Error al limpiar favoritos:', error);
    }
  }

  /**
   * Actualiza el ícono de favorito en un botón
   * @param {HTMLElement} boton - Elemento del botón
   * @param {boolean} esFav - Si es favorito o no
   */
  function actualizarIconoFavorito(boton, esFav) {
    const icono = boton.querySelector('i');
    if (!icono) return;

    if (esFav) {
      // Favorito activo - corazón relleno
      icono.classList.remove('far');
      icono.classList.add('fas');
      boton.setAttribute('aria-pressed', 'true');
      boton.setAttribute('aria-label', 'Quitar de favoritos');
      boton.classList.add('is-favorite');
    } else {
      // No favorito - corazón vacío
      icono.classList.remove('fas');
      icono.classList.add('far');
      boton.setAttribute('aria-pressed', 'false');
      boton.setAttribute('aria-label', 'Agregar a favoritos');
      boton.classList.remove('is-favorite');
    }
  }

  /**
   * Inicializa los botones de favoritos en la página
   * Busca todos los botones con [data-favorito-id] y configura eventos
   */
  function inicializarBotonesFavoritos() {
    const botones = document.querySelectorAll('[data-favorito-id]');
    
    botones.forEach(boton => {
      const proveedorId = boton.getAttribute('data-favorito-id');
      
      // Establecer estado inicial
      const esFav = esFavorito(proveedorId);
      actualizarIconoFavorito(boton, esFav);
      
      // Configurar evento click
      boton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Evitar que active el card
        
        const nuevoEstado = toggleFavorito(proveedorId);
        actualizarIconoFavorito(boton, nuevoEstado);
        
        // Animación de feedback
        boton.style.transform = 'scale(1.3)';
        setTimeout(() => {
          boton.style.transform = 'scale(1)';
        }, 200);
        
        // Disparar evento custom para que otros componentes reaccionen
        const evento = new CustomEvent('favoritoChanged', {
          detail: { proveedorId, esFavorito: nuevoEstado }
        });
        document.dispatchEvent(evento);
      });
    });
  }

  /**
   * Obtiene datos completos de los profesionales favoritos
   * Busca en la base de datos de profesionales (si existe)
   * @returns {Array<Object>} Array de objetos con datos de proveedores
   */
  function obtenerDatosFavoritos() {
    const favoritosIds = obtenerFavoritos();
    
    // Intentar obtener datos de window.ServiLocalBusqueda.profesionalesDB (si existe)
    if (window.ServiLocalBusqueda && Array.isArray(window.ServiLocalBusqueda.profesionalesDB)) {
      return window.ServiLocalBusqueda.profesionalesDB.filter(prof => 
        favoritosIds.includes(prof.id.toString())
      );
    }
    
    // Si no hay datos, retornar solo IDs
    return favoritosIds.map(id => ({ id }));
  }

  /**
   * Renderiza la lista de favoritos en un contenedor
   * @param {string} containerId - ID del contenedor donde renderizar
   */
  function renderizarFavoritos(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Contenedor #${containerId} no encontrado`);
      return;
    }

    const favoritos = obtenerDatosFavoritos();
    
    if (favoritos.length === 0) {
      container.innerHTML = `
        <div class="c-empty-state">
          <i class="far fa-heart" style="font-size: 3rem; color: var(--color-neutro-400); margin-bottom: var(--espacio-medio);" aria-hidden="true"></i>
          <p class="texto-base">No tienes profesionales favoritos todavía</p>
          <a href="buscar.html" class="c-button">
            <i class="fas fa-search c-icon-left" aria-hidden="true"></i>
            Buscar profesionales
          </a>
        </div>
      `;
      return;
    }

    // Renderizar lista de favoritos
    const html = favoritos.map(prof => `
      <article class="c-result-card">
        ${prof.imagen ? `
          <img 
            src="${prof.imagen}" 
            alt="${prof.nombre || 'Profesional'}"
            class="c-result-card__media"
            loading="lazy"
          >
        ` : ''}
        <div class="c-result-card__content">
          <header class="c-result-card__header">
            <h3 class="c-result-card__title">${prof.nombre || 'Profesional'}</h3>
            <div class="c-result-card__meta">
              ${prof.calificacion ? `
                <span class="c-rating" aria-hidden="true">${'★'.repeat(Math.floor(prof.calificacion))}${'☆'.repeat(5 - Math.floor(prof.calificacion))}</span>
                <span class="c-rating__value">(${prof.calificacion})</span>
              ` : ''}
              ${prof.experiencia ? `<span>${prof.experiencia}</span>` : ''}
            </div>
          </header>
          <p class="texto-base u-no-margin">${prof.descripcion || ''}</p>
          <div class="c-result-card__actions">
            <a href="proveedor.html?id=${prof.id}" class="c-button">Ver perfil</a>
            <button 
              class="c-button c-button--secondary c-button--icon" 
              type="button"
              data-favorito-id="${prof.id}"
              aria-label="Quitar de favoritos"
              aria-pressed="true"
            >
              <i class="fas fa-heart" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </article>
    `).join('');

    container.innerHTML = html;
    
    // Re-inicializar botones de favoritos
    inicializarBotonesFavoritos();
  }

  /**
   * Actualiza el contador de favoritos en la UI
   * @param {string} elementId - ID del elemento contador
   */
  function actualizarContadorFavoritos(elementId) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
      const total = contarFavoritos();
      elemento.textContent = total;
      
      // Ocultar badge si es 0
      if (total === 0 && elemento.classList.contains('c-badge')) {
        elemento.style.display = 'none';
      } else if (elemento.classList.contains('c-badge')) {
        elemento.style.display = 'inline-block';
      }
    }
  }

  // Exponer API pública
  window.ServiLocalFavoritos = {
    obtenerFavoritos,
    esFavorito,
    agregarFavorito,
    quitarFavorito,
    toggleFavorito,
    contarFavoritos,
    limpiarFavoritos,
    inicializarBotonesFavoritos,
    obtenerDatosFavoritos,
    renderizarFavoritos,
    actualizarContadorFavoritos,
    actualizarIconoFavorito
  };

  // Auto-inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      inicializarBotonesFavoritos();
      
      // Actualizar contadores si existen
      actualizarContadorFavoritos('contador-favoritos');
      actualizarContadorFavoritos('badge-favoritos');
    });
  } else {
    inicializarBotonesFavoritos();
    actualizarContadorFavoritos('contador-favoritos');
    actualizarContadorFavoritos('badge-favoritos');
  }

  // Escuchar cambios en favoritos para actualizar contadores
  document.addEventListener('favoritoChanged', () => {
    actualizarContadorFavoritos('contador-favoritos');
    actualizarContadorFavoritos('badge-favoritos');
  });
})();
