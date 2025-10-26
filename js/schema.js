/**
 * ServiLocal - Generador de Schema.org JSON-LD
 * Genera datos estructurados para mejorar el SEO y la visibilidad en buscadores
 */

(function() {
  'use strict';

  /**
   * Genera schema Organization para la empresa
   */
  function generarOrganizationSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ServiLocal',
      url: window.location.origin,
      logo: window.location.origin + '/imagen/favicon.svg',
      description: 'Plataforma que conecta vecinos con profesionales de servicios locales verificados',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'AR'
      },
      sameAs: [
        // Redes sociales (agregar cuando estén disponibles)
      ]
    };
  }

  /**
   * Genera schema WebSite con SearchAction
   */
  function generarWebSiteSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ServiLocal',
      url: window.location.origin,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: window.location.origin + '/buscar.html?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    };
  }

  /**
   * Genera schema LocalBusiness para un proveedor
   * @param {Object} datos - Datos del proveedor
   */
  function generarLocalBusinessSchema(datos) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: datos.nombre,
      description: datos.descripcion,
      image: datos.imagen ? [datos.imagen] : [],
      telephone: datos.telefono || '',
      address: {
        '@type': 'PostalAddress',
        addressLocality: datos.ubicacion || '',
        addressCountry: 'AR'
      }
    };

    // Agregar calificación agregada si hay reseñas
    if (datos.calificacionPromedio && datos.totalResenas > 0) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: datos.calificacionPromedio,
        reviewCount: datos.totalResenas,
        bestRating: 5,
        worstRating: 1
      };
    }

    // Agregar reseñas individuales
    if (datos.resenas && datos.resenas.length > 0) {
      schema.review = datos.resenas.map(resena => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: resena.nombreUsuario
        },
        datePublished: resena.fecha,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: resena.calificacion,
          bestRating: 5,
          worstRating: 1
        },
        reviewBody: resena.comentario
      }));
    }

    return schema;
  }

  /**
   * Genera schema Service para una categoría de servicio
   * @param {Object} datos - Datos del servicio
   */
  function generarServiceSchema(datos) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: datos.tipo,
      name: datos.nombre,
      description: datos.descripcion,
      provider: {
        '@type': 'Organization',
        name: 'ServiLocal',
        url: window.location.origin
      },
      areaServed: {
        '@type': 'Country',
        name: 'Argentina'
      },
      availableChannel: {
        '@type': 'ServiceChannel',
        serviceUrl: window.location.href
      }
    };
  }

  /**
   * Genera schema BreadcrumbList para navegación
   * @param {Array} items - Array de {nombre, url}
   */
  function generarBreadcrumbSchema(items) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.nombre,
        item: item.url
      }))
    };
  }

  /**
   * Genera schema FAQPage
   * @param {Array} faqs - Array de {pregunta, respuesta}
   */
  function generarFAQSchema(faqs) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.pregunta,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.respuesta
        }
      }))
    };
  }

  /**
   * Inserta schema JSON-LD en el head del documento
   * @param {Object|Array} schema - Schema o array de schemas
   */
  function insertarSchema(schema) {
    const schemas = Array.isArray(schema) ? schema : [schema];
    
    schemas.forEach(s => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(s, null, 2);
      document.head.appendChild(script);
    });
  }

  /**
   * Obtiene datos del proveedor desde localStorage y DOM
   * Solo funciona en proveedor.html
   */
  function obtenerDatosProveedor() {
    const urlParams = new URLSearchParams(window.location.search);
    const proveedorId = urlParams.get('id');
    
    if (!proveedorId) return null;

    // Obtener nombre e imagen del DOM
    const nombre = document.querySelector('h1')?.textContent?.trim() || 'Profesional';
    const descripcion = document.querySelector('.c-profile-description')?.textContent?.trim() || '';
    const imagenEl = document.querySelector('.c-avatar__image');
    const imagen = imagenEl ? new URL(imagenEl.src, window.location.href).href : '';

    // Obtener calificación y total de reseñas del DOM
    const calificacionEl = document.getElementById('calificacion-promedio');
    const contadorEl = document.getElementById('contador-resenas-header');
    const calificacionPromedio = calificacionEl ? parseFloat(calificacionEl.textContent) : 0;
    const totalResenas = contadorEl ? parseInt(contadorEl.textContent, 10) : 0;

    // Obtener reseñas desde localStorage
    const STORAGE_KEY = `servilocal_resenas_${proveedorId}`;
    let resenas = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        resenas = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error al leer reseñas:', error);
    }

    return {
      nombre,
      descripcion,
      imagen,
      calificacionPromedio,
      totalResenas,
      resenas,
      telefono: '', // TODO: agregar si está disponible
      ubicacion: 'Buenos Aires' // TODO: obtener del perfil
    };
  }

  /**
   * Inicializa schemas según la página actual
   */
  function inicializarSchemas() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';

    // Schema para index.html
    if (filename === 'index.html' || filename === '') {
      insertarSchema([
        generarOrganizationSchema(),
        generarWebSiteSchema()
      ]);
    }
    
    // Schema para proveedor.html
    else if (filename === 'proveedor.html') {
      const datosProveedor = obtenerDatosProveedor();
      if (datosProveedor) {
        insertarSchema([
          generarOrganizationSchema(),
          generarLocalBusinessSchema(datosProveedor),
          generarBreadcrumbSchema([
            { nombre: 'Inicio', url: window.location.origin },
            { nombre: 'Profesionales', url: window.location.origin + '/buscar.html' },
            { nombre: datosProveedor.nombre, url: window.location.href }
          ])
        ]);
      }
    }
    
    // Schema para páginas de servicios
    else if (filename.match(/^(jardineria|plomeria|electricidad|limpieza|construccion|abogacia|contaduria|veterinaria|mecanica)\.html$/)) {
      const servicios = {
        'jardineria.html': { tipo: 'Jardinería', nombre: 'Servicios de Jardinería', descripcion: 'Mantenimiento y diseño de jardines profesional' },
        'plomeria.html': { tipo: 'Plomería', nombre: 'Servicios de Plomería', descripcion: 'Instalación y reparación de sistemas de agua' },
        'electricidad.html': { tipo: 'Electricidad', nombre: 'Servicios de Electricidad', descripcion: 'Instalaciones y reparaciones eléctricas certificadas' },
        'limpieza.html': { tipo: 'Limpieza', nombre: 'Servicios de Limpieza', descripcion: 'Limpieza profesional de hogares y oficinas' },
        'construccion.html': { tipo: 'Construcción', nombre: 'Servicios de Construcción', descripcion: 'Construcción y remodelación profesional' },
        'abogacia.html': { tipo: 'Abogacía', nombre: 'Servicios Legales', descripcion: 'Asesoría y representación legal' },
        'contaduria.html': { tipo: 'Contaduría', nombre: 'Servicios Contables', descripcion: 'Contabilidad y asesoría financiera' },
        'veterinaria.html': { tipo: 'Veterinaria', nombre: 'Servicios Veterinarios', descripcion: 'Atención médica para mascotas' },
        'mecanica.html': { tipo: 'Mecánica', nombre: 'Servicios de Mecánica', descripcion: 'Reparación y mantenimiento de vehículos' }
      };

      const servicio = servicios[filename];
      if (servicio) {
        insertarSchema([
          generarOrganizationSchema(),
          generarServiceSchema(servicio),
          generarBreadcrumbSchema([
            { nombre: 'Inicio', url: window.location.origin },
            { nombre: 'Servicios', url: window.location.origin + '/todos_los_servicios.html' },
            { nombre: servicio.nombre, url: window.location.href }
          ])
        ]);
      }
    }

    // Schema para buscar.html
    else if (filename === 'buscar.html') {
      insertarSchema([
        generarOrganizationSchema(),
        generarBreadcrumbSchema([
          { nombre: 'Inicio', url: window.location.origin },
          { nombre: 'Buscar Profesionales', url: window.location.href }
        ])
      ]);
    }
  }

  // Exponer funciones públicas
  window.ServiLocalSchema = {
    generarOrganizationSchema,
    generarWebSiteSchema,
    generarLocalBusinessSchema,
    generarServiceSchema,
    generarBreadcrumbSchema,
    generarFAQSchema,
    insertarSchema,
    inicializarSchemas
  };

  // Auto-inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarSchemas);
  } else {
    inicializarSchemas();
  }
})();
