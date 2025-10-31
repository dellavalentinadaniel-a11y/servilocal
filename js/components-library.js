/**
 * ServiLocal - Biblioteca de Componentes Reutilizables
 * Sistema híbrido: Templates JS + Web Components
 * @version 1.0.0
 */

(function(window) {
  'use strict';

  const ServiLocalComponents = {
    version: '1.0.0'
  };

  // ============================================
  // UTILIDADES
  // ============================================

  /**
   * Escapa HTML para prevenir XSS
   */
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Genera estrellas de rating
   */
  function generateStars(rating, maxStars = 5) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
    
    let html = '';
    for (let i = 0; i < fullStars; i++) {
      html += '<i class="fas fa-star" aria-hidden="true"></i>';
    }
    if (hasHalfStar) {
      html += '<i class="fas fa-star-half-alt" aria-hidden="true"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      html += '<i class="far fa-star" aria-hidden="true"></i>';
    }
    return html;
  }

  /**
   * Formatea precio
   */
  function formatPrice(min, max, currency = 'MXN') {
    if (!min && !max) return 'A consultar';
    if (min && !max) return `Desde $${min.toLocaleString()} ${currency}`;
    if (!min && max) return `Hasta $${max.toLocaleString()} ${currency}`;
    return `$${min.toLocaleString()} – $${max.toLocaleString()} ${currency}`;
  }

  // ============================================
  // COMPONENTE: SERVICE CARD
  // ============================================

  /**
   * Crea una tarjeta de servicio
   * @param {Object} data - Datos del servicio
   * @param {string} data.id - ID único del servicio
   * @param {string} data.title - Título del servicio
   * @param {string} data.description - Descripción
   * @param {string} data.category - Categoría
   * @param {number} data.rating - Calificación (0-5)
   * @param {number} data.reviewCount - Número de reseñas
   * @param {number} data.priceMin - Precio mínimo
   * @param {number} data.priceMax - Precio máximo
   * @param {string} data.image - URL de la imagen
   * @param {string} data.providerName - Nombre del proveedor
   * @param {string} data.providerAvatar - Avatar del proveedor
   * @param {string} data.status - Estado: 'active', 'inactive'
   * @param {boolean} data.featured - Si es destacado
   * @param {string} data.link - URL del servicio
   */
  ServiLocalComponents.createServiceCard = function(data) {
    const {
      id = '',
      title = 'Servicio',
      description = '',
      category = '',
      rating = 0,
      reviewCount = 0,
      priceMin = null,
      priceMax = null,
      image = 'imagenes/placeholder-service.jpg',
      providerName = '',
      providerAvatar = 'imagenes/avatar-default.svg',
      status = 'active',
      featured = false,
      link = '#'
    } = data;

    const statusClass = status === 'active' ? 'c-chip' : 'c-chip c-chip--neutral';
    const statusText = status === 'active' ? 'Activo' : 'Inactivo';
    const featuredBadge = featured ? '<span class="c-badge c-badge--featured">Destacado</span>' : '';

    return `
      <article class="c-card c-service-card" data-service-id="${escapeHtml(id)}">
        ${featuredBadge}
        <div class="c-card__image-wrapper">
          <img 
            src="${escapeHtml(image)}" 
            alt="${escapeHtml(title)}" 
            class="c-card__image"
            loading="lazy"
          >
          ${category ? `<span class="c-card__category">${escapeHtml(category)}</span>` : ''}
        </div>
        <div class="c-card__content">
          <div class="c-card__header">
            <h3 class="c-card__title">
              <a href="${escapeHtml(link)}" class="c-card__link">${escapeHtml(title)}</a>
            </h3>
            <span class="${statusClass}">${statusText}</span>
          </div>
          ${description ? `<p class="c-card__body">${escapeHtml(description)}</p>` : ''}
          <div class="c-card__meta">
            <div class="c-card__rating" aria-label="${rating} de 5 estrellas">
              ${generateStars(rating)}
              <span class="c-card__rating-text">${rating.toFixed(1)} • ${reviewCount} reseñas</span>
            </div>
            <div class="c-card__price">${formatPrice(priceMin, priceMax)}</div>
          </div>
          ${providerName ? `
          <div class="c-card__provider">
            <img src="${escapeHtml(providerAvatar)}" alt="${escapeHtml(providerName)}" class="c-card__provider-avatar">
            <span class="c-card__provider-name">${escapeHtml(providerName)}</span>
          </div>
          ` : ''}
        </div>
      </article>
    `;
  };

  // ============================================
  // COMPONENTE: PROFILE CARD
  // ============================================

  /**
   * Crea una tarjeta de perfil de proveedor
   * @param {Object} data - Datos del proveedor
   * @param {string} data.id - ID único
   * @param {string} data.name - Nombre completo
   * @param {string} data.avatar - URL del avatar
   * @param {string} data.profession - Profesión/Especialidad
   * @param {string} data.location - Ubicación
   * @param {number} data.rating - Calificación
   * @param {number} data.reviewCount - Número de reseñas
   * @param {string} data.bio - Biografía corta
   * @param {number} data.serviceCount - Número de servicios
   * @param {number} data.completedJobs - Trabajos completados
   * @param {boolean} data.verified - Si está verificado
   * @param {string} data.link - URL del perfil
   * @param {Array} data.badges - Insignias ['pro', 'verified', 'top']
   */
  ServiLocalComponents.createProfileCard = function(data) {
    const {
      id = '',
      name = 'Usuario',
      avatar = 'imagenes/avatar-default.svg',
      profession = '',
      location = '',
      rating = 0,
      reviewCount = 0,
      bio = '',
      serviceCount = 0,
      completedJobs = 0,
      verified = false,
      link = '#',
      badges = []
    } = data;

    const verifiedBadge = verified ? '<i class="fas fa-check-circle c-profile-card__verified" title="Verificado"></i>' : '';
    
    const badgesHtml = badges.map(badge => {
      const badgeConfig = {
        pro: { icon: 'fa-crown', text: 'PRO', class: 'c-badge--pro' },
        verified: { icon: 'fa-shield-alt', text: 'Verificado', class: 'c-badge--verified' },
        top: { icon: 'fa-trophy', text: 'TOP', class: 'c-badge--top' }
      };
      const config = badgeConfig[badge];
      return config ? `<span class="c-badge ${config.class}"><i class="fas ${config.icon}"></i> ${config.text}</span>` : '';
    }).join('');

    return `
      <article class="c-card c-profile-card" data-provider-id="${escapeHtml(id)}">
        <div class="c-profile-card__header">
          <div class="c-profile-card__avatar-wrapper">
            <img 
              src="${escapeHtml(avatar)}" 
              alt="${escapeHtml(name)}" 
              class="c-profile-card__avatar"
              loading="lazy"
            >
            ${verifiedBadge}
          </div>
          <div class="c-profile-card__info">
            <h3 class="c-profile-card__name">
              <a href="${escapeHtml(link)}" class="c-profile-card__link">${escapeHtml(name)}</a>
            </h3>
            ${profession ? `<p class="c-profile-card__profession">${escapeHtml(profession)}</p>` : ''}
            ${location ? `
            <p class="c-profile-card__location">
              <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
              ${escapeHtml(location)}
            </p>
            ` : ''}
          </div>
        </div>
        
        ${badgesHtml ? `<div class="c-profile-card__badges">${badgesHtml}</div>` : ''}
        
        <div class="c-profile-card__rating" aria-label="${rating} de 5 estrellas">
          ${generateStars(rating)}
          <span class="c-profile-card__rating-text">${rating.toFixed(1)} (${reviewCount})</span>
        </div>
        
        ${bio ? `<p class="c-profile-card__bio">${escapeHtml(bio)}</p>` : ''}
        
        <div class="c-profile-card__stats">
          ${serviceCount > 0 ? `
          <div class="c-profile-card__stat">
            <span class="c-profile-card__stat-value">${serviceCount}</span>
            <span class="c-profile-card__stat-label">Servicios</span>
          </div>
          ` : ''}
          ${completedJobs > 0 ? `
          <div class="c-profile-card__stat">
            <span class="c-profile-card__stat-value">${completedJobs}</span>
            <span class="c-profile-card__stat-label">Trabajos</span>
          </div>
          ` : ''}
        </div>
        
        <div class="c-profile-card__actions">
          <a href="${escapeHtml(link)}" class="c-button c-button--secondary">Ver perfil</a>
          <button type="button" class="c-button c-button--primary" data-action="contact" data-provider-id="${escapeHtml(id)}">
            Contactar
          </button>
        </div>
      </article>
    `;
  };

  // ============================================
  // COMPONENTE: SEARCH BAR
  // ============================================

  /**
   * Crea una barra de búsqueda
   * @param {Object} options - Opciones de configuración
   * @param {string} options.id - ID único
   * @param {string} options.placeholder - Texto del placeholder
   * @param {string} options.value - Valor inicial
   * @param {boolean} options.withLocation - Incluir campo de ubicación
   * @param {boolean} options.withCategory - Incluir selector de categoría
   * @param {Array} options.categories - Lista de categorías
   */
  ServiLocalComponents.createSearchBar = function(options = {}) {
    const {
      id = 'search',
      placeholder = 'Buscar servicios...',
      value = '',
      withLocation = false,
      withCategory = false,
      categories = []
    } = options;

    const locationField = withLocation ? `
      <div class="c-search-bar__field">
        <i class="fas fa-map-marker-alt c-search-bar__icon"></i>
        <input 
          type="text" 
          id="${id}-location"
          class="c-search-bar__input" 
          placeholder="Ubicación"
          aria-label="Ubicación"
        >
      </div>
    ` : '';

    const categoryField = withCategory ? `
      <div class="c-search-bar__field">
        <i class="fas fa-th-large c-search-bar__icon"></i>
        <select 
          id="${id}-category"
          class="c-search-bar__select" 
          aria-label="Categoría"
        >
          <option value="">Todas las categorías</option>
          ${categories.map(cat => `<option value="${escapeHtml(cat.value)}">${escapeHtml(cat.label)}</option>`).join('')}
        </select>
      </div>
    ` : '';

    return `
      <form class="c-search-bar" role="search" id="${id}-form">
        <div class="c-search-bar__field c-search-bar__field--main">
          <i class="fas fa-search c-search-bar__icon"></i>
          <input 
            type="search" 
            id="${id}-input"
            class="c-search-bar__input" 
            placeholder="${escapeHtml(placeholder)}"
            value="${escapeHtml(value)}"
            aria-label="Buscar"
            autocomplete="off"
          >
        </div>
        ${locationField}
        ${categoryField}
        <button type="submit" class="c-button c-button--primary c-search-bar__button">
          <i class="fas fa-search" aria-hidden="true"></i>
          <span>Buscar</span>
        </button>
      </form>
    `;
  };

  // ============================================
  // COMPONENTE: STATS CARD
  // ============================================

  /**
   * Crea una tarjeta de estadística
   * @param {Object} data - Datos de la estadística
   * @param {string|number} data.value - Valor principal
   * @param {string} data.label - Etiqueta descriptiva
   * @param {string} data.icon - Clase del icono FontAwesome
   * @param {string} data.color - Color del tema: 'primary', 'success', 'warning', 'danger'
   * @param {string} data.trend - Tendencia: 'up', 'down', 'neutral'
   * @param {string} data.trendValue - Valor de la tendencia (ej: '+12%')
   */
  ServiLocalComponents.createStatsCard = function(data) {
    const {
      value = '0',
      label = 'Estadística',
      icon = 'fa-chart-bar',
      color = 'primary',
      trend = null,
      trendValue = ''
    } = data;

    const trendIcon = trend === 'up' ? 'fa-arrow-up' : trend === 'down' ? 'fa-arrow-down' : 'fa-minus';
    const trendClass = trend === 'up' ? 'c-stat-card__trend--up' : trend === 'down' ? 'c-stat-card__trend--down' : 'c-stat-card__trend--neutral';

    return `
      <div class="c-stat-card c-stat-card--${color}">
        ${icon ? `<i class="fas ${icon} c-stat-card__icon" aria-hidden="true"></i>` : ''}
        <div class="c-stat-card__content">
          <span class="c-stat-card__value">${escapeHtml(String(value))}</span>
          <span class="c-stat-card__label">${escapeHtml(label)}</span>
          ${trend ? `
          <span class="c-stat-card__trend ${trendClass}">
            <i class="fas ${trendIcon}" aria-hidden="true"></i>
            ${escapeHtml(trendValue)}
          </span>
          ` : ''}
        </div>
      </div>
    `;
  };

  // ============================================
  // COMPONENTE: REVIEW CARD
  // ============================================

  /**
   * Crea una tarjeta de reseña
   * @param {Object} data - Datos de la reseña
   * @param {string} data.id - ID único
   * @param {string} data.userName - Nombre del usuario
   * @param {string} data.userAvatar - Avatar del usuario
   * @param {number} data.rating - Calificación (0-5)
   * @param {string} data.date - Fecha de la reseña
   * @param {string} data.text - Texto de la reseña
   * @param {boolean} data.verified - Si es compra verificada
   * @param {Array} data.images - URLs de imágenes adjuntas
   */
  ServiLocalComponents.createReviewCard = function(data) {
    const {
      id = '',
      userName = 'Usuario',
      userAvatar = 'imagenes/avatar-default.svg',
      rating = 0,
      date = '',
      text = '',
      verified = false,
      images = []
    } = data;

    const verifiedBadge = verified ? '<span class="c-review-card__verified"><i class="fas fa-check-circle"></i> Verificado</span>' : '';
    
    const imagesHtml = images.length > 0 ? `
      <div class="c-review-card__images">
        ${images.map(img => `
          <img src="${escapeHtml(img)}" alt="Imagen de reseña" class="c-review-card__image" loading="lazy">
        `).join('')}
      </div>
    ` : '';

    return `
      <article class="c-review-card" data-review-id="${escapeHtml(id)}">
        <div class="c-review-card__header">
          <img src="${escapeHtml(userAvatar)}" alt="${escapeHtml(userName)}" class="c-review-card__avatar">
          <div class="c-review-card__user-info">
            <h4 class="c-review-card__user-name">${escapeHtml(userName)}</h4>
            <div class="c-review-card__meta">
              <div class="c-review-card__rating" aria-label="${rating} de 5 estrellas">
                ${generateStars(rating)}
              </div>
              ${date ? `<time class="c-review-card__date" datetime="${date}">${escapeHtml(date)}</time>` : ''}
            </div>
          </div>
          ${verifiedBadge}
        </div>
        ${text ? `<p class="c-review-card__text">${escapeHtml(text)}</p>` : ''}
        ${imagesHtml}
      </article>
    `;
  };

  // ============================================
  // UTILIDAD: RENDERIZAR MÚLTIPLES COMPONENTES
  // ============================================

  /**
   * Renderiza múltiples componentes en un contenedor
   * @param {string} containerId - ID del contenedor
   * @param {Array} items - Array de datos
   * @param {Function} componentFn - Función de componente a usar
   */
  ServiLocalComponents.renderMultiple = function(containerId, items, componentFn) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Contenedor #${containerId} no encontrado`);
      return;
    }

    const html = items.map(item => componentFn(item)).join('');
    container.innerHTML = html;
  };

  /**
   * Agrega un componente a un contenedor
   * @param {string} containerId - ID del contenedor
   * @param {string} html - HTML del componente
   * @param {string} position - Posición: 'beforeend', 'afterbegin', etc.
   */
  ServiLocalComponents.append = function(containerId, html, position = 'beforeend') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Contenedor #${containerId} no encontrado`);
      return;
    }

    container.insertAdjacentHTML(position, html);
  };

  // Exponer la biblioteca globalmente
  window.ServiLocalComponents = ServiLocalComponents;
  window.SLC = ServiLocalComponents; // Alias corto

  console.log('✓ ServiLocal Components Library v' + ServiLocalComponents.version + ' cargada');

})(window);
