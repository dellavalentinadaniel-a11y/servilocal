/**
 * PERFIL COMPONENTES - SERVILOCAL
 * Sistema modular de componentes para el perfil
 */

(function() {
  'use strict';

  // ============================================
  // COMPONENTE: TARJETA DE GALERÍA
  // ============================================
  
  /**
   * Crea una tarjeta de proyecto para la galería
   * @param {Object} data - Datos del proyecto
   * @returns {string} HTML del componente
   */
  function createGalleryCard(data) {
    return `
      <article class="perfil-gallery__item">
        <div class="perfil-gallery__item-image-wrapper">
          <img src="${data.image}" 
               alt="${data.alt}" 
               class="perfil-gallery__item-image"
               loading="lazy">
        </div>
        <div class="perfil-gallery__item-content">
          <h3 class="perfil-gallery__item-title">${data.title}</h3>
        </div>
      </article>
    `;
  }

  // ============================================
  // COMPONENTE: TARJETA DE PUBLICACIÓN
  // ============================================
  
  /**
   * Crea una tarjeta de publicación
   * @param {Object} data - Datos de la publicación
   * @returns {string} HTML del componente
   */
  function createPublicationCard(data) {
    return `
      <article class="perfil-publication">
        <div class="perfil-publication__image-wrapper">
          <img src="${data.image}" 
               alt="${data.title}" 
               class="perfil-publication__image"
               loading="lazy">
        </div>
        <div class="perfil-publication__content">
          <time class="perfil-publication__date" datetime="${data.date}">
            ${data.dateFormatted}
          </time>
          <h3 class="perfil-publication__title">${data.title}</h3>
          <p class="perfil-publication__excerpt">${data.excerpt}</p>
          <a href="${data.link}" class="perfil-publication__link">Leer más</a>
        </div>
      </article>
    `;
  }

  // ============================================
  // COMPONENTE: TARJETA DE SERVICIO
  // ============================================
  
  /**
   * Crea una tarjeta de servicio
   * @param {Object} data - Datos del servicio
   * @returns {string} HTML del componente
   */
  function createServiceCard(data) {
    return `
      <article class="perfil-service-card is-visible">
        <div class="perfil-service-card__icon-wrapper">
          <i class="${data.icon} perfil-service-card__icon"></i>
        </div>
        <h3 class="perfil-service-card__title">${data.title}</h3>
        <p class="perfil-service-card__subtitle">${data.subtitle}</p>
      </article>
    `;
  }

  // ============================================
  // COMPONENTE: DETALLE DE SERVICIO
  // ============================================
  
  /**
   * Crea un detalle de servicio con precio
   * @param {Object} data - Datos del servicio
   * @returns {string} HTML del componente
   */
  function createServiceDetail(data) {
    return `
      <article class="perfil-service-detail">
        <div class="perfil-service-detail__header">
          <div>
            <h3 class="perfil-service-detail__title">${data.title}</h3>
            <p class="perfil-service-detail__category">${data.category}</p>
          </div>
          <div class="perfil-service-detail__price">
            <span class="perfil-service-detail__price-amount">${data.price}</span>
            <span class="perfil-service-detail__price-unit">${data.unit}</span>
          </div>
        </div>
        <p class="perfil-service-detail__description">${data.description}</p>
        <div class="perfil-service-detail__footer">
          <div class="perfil-service-detail__features">
            ${data.features.map(feature => `
              <span class="perfil-service-detail__feature">
                <i class="fas fa-check"></i> ${feature}
              </span>
            `).join('')}
          </div>
        </div>
      </article>
    `;
  }

  // ============================================
  // COMPONENTE: BADGE
  // ============================================
  
  /**
   * Crea un badge/etiqueta
   * @param {string} text - Texto del badge
   * @returns {string} HTML del componente
   */
  function createBadge(text) {
    return `<span class="perfil-badge">${text}</span>`;
  }

  // ============================================
  // COMPONENTE: BARRA DE RATING
  // ============================================
  
  /**
   * Crea una barra de rating
   * @param {Object} data - Datos del rating
   * @returns {string} HTML del componente
   */
  function createRatingBar(data) {
    return `
      <div class="perfil-rating-item">
        <div class="perfil-rating-item__header">
          <span class="perfil-rating-item__label">${data.label}</span>
          <span class="perfil-rating-item__value">${data.value}</span>
        </div>
        <div class="perfil-rating-item__bar">
          <div class="perfil-rating-item__fill" data-width="${data.percentage}"></div>
        </div>
      </div>
    `;
  }

  // ============================================
  // COMPONENTE: RESEÑA
  // ============================================
  
  /**
   * Crea una tarjeta de reseña
   * @param {Object} data - Datos de la reseña
   * @returns {string} HTML del componente
   */
  function createReviewCard(data) {
    const stars = '★'.repeat(data.rating) + '☆'.repeat(5 - data.rating);
    
    return `
      <article class="perfil-review-card">
        <div class="perfil-review-card__header">
          <div class="perfil-review-card__avatar">
            <img src="${data.avatar}" alt="${data.name}">
          </div>
          <div>
            <h3 class="perfil-review-card__name">${data.name}</h3>
            <div class="perfil-review-card__rating" aria-label="${data.rating} de 5 estrellas">
              ${stars}
            </div>
          </div>
          <time class="perfil-review-card__date" datetime="${data.date}">
            ${data.dateFormatted}
          </time>
        </div>
        <p class="perfil-review-card__comment">${data.comment}</p>
      </article>
    `;
  }

  // ============================================
  // COMPONENTE: INFORMACIÓN DE CONTACTO
  // ============================================
  
  /**
   * Crea un item de información de contacto
   * @param {Object} data - Datos del contacto
   * @returns {string} HTML del componente
   */
  function createContactItem(data) {
    return `
      <div class="perfil-contact-item">
        <div class="perfil-contact-item__icon">
          <i class="${data.icon}"></i>
        </div>
        <div class="perfil-contact-item__content">
          <h3 class="perfil-contact-item__label">${data.label}</h3>
          ${data.link ? `
            <a href="${data.link}" class="perfil-contact-item__value">${data.value}</a>
          ` : `
            <p class="perfil-contact-item__value">${data.value}</p>
          `}
        </div>
      </div>
    `;
  }

  // ============================================
  // COMPONENTE: BOTÓN DE ACCIÓN
  // ============================================
  
  /**
   * Crea un botón de acción
   * @param {Object} data - Datos del botón
   * @returns {string} HTML del componente
   */
  function createActionButton(data) {
    const classes = ['perfil-button'];
    if (data.variant) classes.push(`perfil-button--${data.variant}`);
    if (data.size) classes.push(`perfil-button--${data.size}`);
    
    return `
      <button class="${classes.join(' ')}" 
              type="button"
              ${data.id ? `id="${data.id}"` : ''}
              ${data.ariaLabel ? `aria-label="${data.ariaLabel}"` : ''}>
        ${data.icon ? `<i class="${data.icon}"></i>` : ''}
        <span>${data.text}</span>
      </button>
    `;
  }

  // ============================================
  // RENDERIZADORES
  // ============================================
  
  /**
   * Renderiza múltiples componentes en un contenedor
   * @param {string} containerId - ID del contenedor
   * @param {Array} items - Array de items a renderizar
   * @param {Function} componentFunction - Función que crea el componente
   */
  function renderComponents(containerId, items, componentFunction) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`⚠️ Contenedor no encontrado: ${containerId}`);
      return;
    }
    
    const html = items.map(item => componentFunction(item)).join('');
    container.innerHTML = html;
    console.log(`✅ ${items.length} componentes renderizados en #${containerId}`);
  }

  /**
   * Agrega componentes a un contenedor existente
   * @param {string} containerId - ID del contenedor
   * @param {Array} items - Array de items a agregar
   * @param {Function} componentFunction - Función que crea el componente
   */
  function appendComponents(containerId, items, componentFunction) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`⚠️ Contenedor no encontrado: ${containerId}`);
      return;
    }
    
    const html = items.map(item => componentFunction(item)).join('');
    container.insertAdjacentHTML('beforeend', html);
    console.log(`✅ ${items.length} componentes agregados a #${containerId}`);
  }

  // ============================================
  // API PÚBLICA
  // ============================================
  
  window.PerfilComponentes = {
    // Funciones de creación
    createGalleryCard,
    createPublicationCard,
    createServiceCard,
    createServiceDetail,
    createBadge,
    createRatingBar,
    createReviewCard,
    createContactItem,
    createActionButton,
    
    // Funciones de renderizado
    renderComponents,
    appendComponents,
    
    // Helper: Renderizar galería completa
    renderGallery: (containerId, projects) => {
      renderComponents(containerId, projects, createGalleryCard);
    },
    
    // Helper: Renderizar publicaciones
    renderPublications: (containerId, publications) => {
      renderComponents(containerId, publications, createPublicationCard);
    },
    
    // Helper: Renderizar servicios
    renderServices: (containerId, services) => {
      renderComponents(containerId, services, createServiceCard);
    },
    
    // Helper: Renderizar detalles de servicios
    renderServiceDetails: (containerId, services) => {
      renderComponents(containerId, services, createServiceDetail);
    },
    
    // Helper: Renderizar badges
    renderBadges: (containerId, badges) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = badges.map(badge => createBadge(badge)).join('');
    },
    
    // Helper: Renderizar ratings
    renderRatings: (containerId, ratings) => {
      renderComponents(containerId, ratings, createRatingBar);
    },
    
    // Helper: Renderizar reseñas
    renderReviews: (containerId, reviews) => {
      renderComponents(containerId, reviews, createReviewCard);
    },
    
    // Helper: Renderizar contacto
    renderContactInfo: (containerId, contactItems) => {
      renderComponents(containerId, contactItems, createContactItem);
    }
  };

  console.log('✅ Sistema de componentes del perfil cargado');

})();
