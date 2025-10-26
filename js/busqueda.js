/**
 * Motor de búsqueda y filtrado para ServiLocal
 * Maneja filtros dinámicos, ordenamiento y persistencia de estado
 */
(function() {
  'use strict';

  // Base de datos simulada de profesionales
  const profesionalesDB = [
    {
      id: 1,
      nombre: 'Carlos Martínez',
      categoria: 'jardineria',
      categoriaDisplay: 'Jardinería',
      calificacion: 4.5,
      resenas: 28,
      experiencia: '+10 años de experiencia',
      ubicacion: 'Ciudad de México',
      descripcion: 'Podado, diseño de jardines y sistemas de riego automático. Servicio en barrios del norte y turnos express en 24 hs.',
      imagen: 'imagenes/perfile/images%20(1).png',
      distancia: 2.5,
      verificado: true,
      destacado: true
    },
    {
      id: 2,
      nombre: 'Laura Gómez',
      categoria: 'limpieza',
      categoriaDisplay: 'Limpieza',
      calificacion: 5.0,
      resenas: 45,
      experiencia: 'Servicios residenciales y oficinas',
      ubicacion: 'Monterrey',
      descripcion: 'Limpieza profunda, mudanzas y espacios comerciales. Planes con productos ecológicos y equipo propio.',
      imagen: '',
      distancia: 1.8,
      verificado: true,
      destacado: true
    },
    {
      id: 3,
      nombre: 'Mecánica Exprés',
      categoria: 'mecanica',
      categoriaDisplay: 'Mecánica del automotor',
      calificacion: 4.6,
      resenas: 33,
      experiencia: 'Responde en menos de 2 hs',
      ubicacion: 'Guadalajara',
      descripcion: 'Diagnóstico computarizado, eléctricos y mecánica ligera a domicilio. Cobertura en toda el área metropolitana.',
      imagen: '',
      distancia: 5.2,
      verificado: true,
      destacado: false
    },
    {
      id: 4,
      nombre: 'José Ramírez',
      categoria: 'plomeria',
      categoriaDisplay: 'Plomería',
      calificacion: 4.8,
      resenas: 52,
      experiencia: '+15 años de experiencia',
      ubicacion: 'Ciudad de México',
      descripcion: 'Instalaciones, reparaciones y mantenimiento preventivo. Emergencias 24/7 con garantía por escrito.',
      imagen: '',
      distancia: 3.1,
      verificado: true,
      destacado: true
    },
    {
      id: 5,
      nombre: 'Electricidad Total',
      categoria: 'electricidad',
      categoriaDisplay: 'Electricidad',
      calificacion: 4.7,
      resenas: 41,
      experiencia: 'Certificados oficiales',
      ubicacion: 'Puebla',
      descripcion: 'Instalaciones eléctricas, paneles solares y automatización. Trabajos certificados con garantía de 2 años.',
      imagen: '',
      distancia: 8.5,
      verificado: true,
      destacado: false
    },
    {
      id: 6,
      nombre: 'María Fernández',
      categoria: 'construccion',
      categoriaDisplay: 'Construcción',
      calificacion: 4.9,
      resenas: 67,
      experiencia: '+20 años en el rubro',
      ubicacion: 'Monterrey',
      descripcion: 'Remodelaciones, ampliaciones y obra nueva. Equipo multidisciplinario con arquitectos e ingenieros.',
      imagen: '',
      distancia: 2.2,
      verificado: true,
      destacado: true
    },
    {
      id: 7,
      nombre: 'Bufete Jurídico LegalPro',
      categoria: 'abogacia',
      categoriaDisplay: 'Abogacía',
      calificacion: 4.6,
      resenas: 38,
      experiencia: 'Derecho civil y mercantil',
      ubicacion: 'Ciudad de México',
      descripcion: 'Asesoría legal, contratos, y representación judicial. Primera consulta sin costo.',
      imagen: '',
      distancia: 4.0,
      verificado: true,
      destacado: false
    },
    {
      id: 8,
      nombre: 'Contadores Asociados',
      categoria: 'contaduria',
      categoriaDisplay: 'Contaduría',
      calificacion: 4.8,
      resenas: 29,
      experiencia: 'Contabilidad fiscal y financiera',
      ubicacion: 'Guadalajara',
      descripcion: 'Declaraciones fiscales, auditorías y constitución de empresas. Atención personalizada.',
      imagen: '',
      distancia: 6.7,
      verificado: true,
      destacado: false
    },
    {
      id: 9,
      nombre: 'Veterinaria Mascotas Felices',
      categoria: 'veterinaria',
      categoriaDisplay: 'Veterinaria',
      calificacion: 4.9,
      resenas: 88,
      experiencia: 'Clínica con quirófano',
      ubicacion: 'Puebla',
      descripcion: 'Consultas, vacunación, cirugías y emergencias. Servicio a domicilio disponible.',
      imagen: '',
      distancia: 3.8,
      verificado: true,
      destacado: true
    },
    {
      id: 10,
      nombre: 'Ferretería El Constructor',
      categoria: 'ferreteria',
      categoriaDisplay: 'Ferretería',
      calificacion: 4.4,
      resenas: 22,
      experiencia: 'Entregas a domicilio',
      ubicacion: 'Monterrey',
      descripcion: 'Materiales de construcción, herramientas y pintura. Envío gratis en compras mayores.',
      imagen: '',
      distancia: 1.5,
      verificado: true,
      destacado: false
    },
    {
      id: 11,
      nombre: 'Corralón San Miguel',
      categoria: 'corralon',
      categoriaDisplay: 'Corralón',
      calificacion: 4.3,
      resenas: 18,
      experiencia: 'Materiales de calidad',
      ubicacion: 'Ciudad de México',
      descripcion: 'Arena, grava, cemento y tabique. Precios al mayoreo y menudeo con entrega en 24 hrs.',
      imagen: '',
      distancia: 7.2,
      verificado: true,
      destacado: false
    },
    {
      id: 12,
      nombre: 'Pedro Sánchez - Jardines',
      categoria: 'jardineria',
      categoriaDisplay: 'Jardinería',
      calificacion: 4.2,
      resenas: 15,
      experiencia: '+5 años diseñando espacios',
      ubicacion: 'Guadalajara',
      descripcion: 'Diseño de jardines zen, mantenimiento de áreas verdes y paisajismo residencial.',
      imagen: '',
      distancia: 4.5,
      verificado: false,
      destacado: false
    }
  ];

  // Estado de la búsqueda
  let estadoBusqueda = {
    categoria: '',
    ubicacion: '',
    orden: 'recomendados',
    textoBusqueda: ''
  };

  // Referencias a elementos del DOM
  let elementos = {};

  // Inicialización
  document.addEventListener('DOMContentLoaded', () => {
    inicializarElementos();
    cargarEstadoDeURL();
    configurarEventos();
    aplicarFiltros();
    anunciarAccesibilidad('Página de búsqueda cargada. Utiliza los filtros para refinar los resultados.');
  });

  /**
   * Inicializa referencias a elementos del DOM
   */
  function inicializarElementos() {
    elementos = {
      form: document.querySelector('form[role="search"]'),
      categoriaSelect: document.getElementById('categoria'),
      ubicacionInput: document.getElementById('ubicacion'),
      ordenSelect: document.getElementById('orden'),
      resultadosList: document.querySelector('.c-result-list'),
      contadorResultados: document.getElementById('resultados-count')
    };
  }

  /**
   * Configura listeners de eventos
   */
  function configurarEventos() {
    if (!elementos.form) return;

    // Prevenir submit del formulario
    elementos.form.addEventListener('submit', (e) => {
      e.preventDefault();
      aplicarFiltros();
      actualizarURL();
      
      // Scroll suave a resultados
      const resultadosSection = document.getElementById('resultados');
      if (resultadosSection) {
        resultadosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Filtros en tiempo real
    if (elementos.categoriaSelect) {
      elementos.categoriaSelect.addEventListener('change', () => {
        estadoBusqueda.categoria = elementos.categoriaSelect.value;
        aplicarFiltros();
        actualizarURL();
      });
    }

    if (elementos.ordenSelect) {
      elementos.ordenSelect.addEventListener('change', () => {
        estadoBusqueda.orden = elementos.ordenSelect.value;
        aplicarFiltros();
        actualizarURL();
      });
    }

    if (elementos.ubicacionInput) {
      // Debounce para búsqueda por ubicación
      let timeoutId;
      elementos.ubicacionInput.addEventListener('input', () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          estadoBusqueda.ubicacion = elementos.ubicacionInput.value.trim().toLowerCase();
          aplicarFiltros();
          actualizarURL();
        }, 500);
      });
    }
  }

  /**
   * Carga el estado desde los parámetros de URL
   */
  function cargarEstadoDeURL() {
    const params = new URLSearchParams(window.location.search);
    
    const categoria = params.get('categoria');
    const ubicacion = params.get('ubicacion');
    const orden = params.get('orden');

    if (categoria && elementos.categoriaSelect) {
      elementos.categoriaSelect.value = categoria;
      estadoBusqueda.categoria = categoria;
    }

    if (ubicacion && elementos.ubicacionInput) {
      elementos.ubicacionInput.value = ubicacion;
      estadoBusqueda.ubicacion = ubicacion.toLowerCase();
    }

    if (orden && elementos.ordenSelect) {
      elementos.ordenSelect.value = orden;
      estadoBusqueda.orden = orden;
    }
  }

  /**
   * Actualiza la URL con los filtros actuales
   */
  function actualizarURL() {
    const params = new URLSearchParams();

    if (estadoBusqueda.categoria) {
      params.set('categoria', estadoBusqueda.categoria);
    }

    if (estadoBusqueda.ubicacion) {
      params.set('ubicacion', estadoBusqueda.ubicacion);
    }

    if (estadoBusqueda.orden && estadoBusqueda.orden !== 'recomendados') {
      params.set('orden', estadoBusqueda.orden);
    }

    const nuevaURL = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', nuevaURL);
  }

  /**
   * Aplica filtros y ordena resultados
   */
  function aplicarFiltros() {
    let resultados = [...profesionalesDB];

    // Filtrar por categoría
    if (estadoBusqueda.categoria) {
      resultados = resultados.filter(prof => 
        prof.categoria === estadoBusqueda.categoria
      );
    }

    // Filtrar por ubicación
    if (estadoBusqueda.ubicacion) {
      resultados = resultados.filter(prof =>
        prof.ubicacion.toLowerCase().includes(estadoBusqueda.ubicacion) ||
        prof.nombre.toLowerCase().includes(estadoBusqueda.ubicacion) ||
        prof.descripcion.toLowerCase().includes(estadoBusqueda.ubicacion)
      );
    }

    // Ordenar resultados
    resultados = ordenarResultados(resultados, estadoBusqueda.orden);

    // Renderizar
    renderizarResultados(resultados);
    actualizarContador(resultados.length);
  }

  /**
   * Ordena resultados según criterio
   */
  function ordenarResultados(resultados, criterio) {
    const copia = [...resultados];

    switch (criterio) {
      case 'calificados':
        return copia.sort((a, b) => {
          if (b.calificacion !== a.calificacion) {
            return b.calificacion - a.calificacion;
          }
          return b.resenas - a.resenas;
        });

      case 'cercanos':
        return copia.sort((a, b) => a.distancia - b.distancia);

      case 'recomendados':
      default:
        // Destacados primero, luego por calificación y reseñas
        return copia.sort((a, b) => {
          if (a.destacado !== b.destacado) {
            return b.destacado ? 1 : -1;
          }
          if (b.calificacion !== a.calificacion) {
            return b.calificacion - a.calificacion;
          }
          return b.resenas - a.resenas;
        });
    }
  }

  /**
   * Renderiza la lista de resultados
   */
  function renderizarResultados(resultados) {
    if (!elementos.resultadosList) return;

    // Fade out
    elementos.resultadosList.style.opacity = '0';
    elementos.resultadosList.style.transition = 'opacity 0.3s ease';

    setTimeout(() => {
      if (resultados.length === 0) {
        elementos.resultadosList.innerHTML = `
          <div class="c-panel" style="text-align: center; padding: var(--espacio-grande);">
            <i class="fas fa-search" style="font-size: 3rem; color: var(--color-neutro-400); margin-bottom: var(--espacio-medio);"></i>
            <h3 class="texto-subtitulo">No encontramos resultados</h3>
            <p class="texto-base">Intentá ajustar los filtros o explorá todas las categorías disponibles.</p>
            <a class="c-button" href="todos_los_servicios.html" style="margin-top: var(--espacio-medio);">
              Ver todos los servicios
            </a>
          </div>
        `;
      } else {
        elementos.resultadosList.innerHTML = resultados.map(prof => 
          crearTarjetaResultado(prof)
        ).join('');
        
        // Re-inicializar botones de favoritos después de renderizar
        if (window.ServiLocalFavoritos) {
          window.ServiLocalFavoritos.inicializarBotonesFavoritos();
        }
      }

      // Fade in
      elementos.resultadosList.style.opacity = '1';
    }, 300);
  }

  /**
   * Crea el HTML de una tarjeta de resultado
   */
  function crearTarjetaResultado(profesional) {
    const estrellas = generarEstrellas(profesional.calificacion);
    const imagenHTML = profesional.imagen 
      ? `<img src="${profesional.imagen}" alt="Foto de perfil de ${profesional.nombre}" class="c-result-card__media" loading="lazy">`
      : `<div class="c-result-card__media" aria-hidden="true"></div>`;

    const badgeVerificado = profesional.verificado 
      ? `<span class="c-chip c-chip--neutral" style="font-size: 0.75rem;">
           <i class="fas fa-check-circle" aria-hidden="true"></i> Verificado
         </span>`
      : '';

    const badgeDestacado = profesional.destacado
      ? `<span class="c-chip" style="font-size: 0.75rem; background: var(--gradiente-principal); color: white;">
           <i class="fas fa-star" aria-hidden="true"></i> Destacado
         </span>`
      : '';

    return `
      <article class="c-result-card" data-profesional-id="${profesional.id}">
        ${imagenHTML}
        <div class="c-result-card__body">
          <header class="c-result-card__header">
            <h3 class="c-result-card__title">
              <a href="proveedor.html?id=${profesional.id}" class="c-result-card__link">
                ${profesional.nombre} – ${profesional.categoriaDisplay}
              </a>
            </h3>
            <div class="c-result-card__meta">
              <div class="c-rating" role="img" aria-label="Calificación ${profesional.calificacion} de 5 estrellas">
                <span aria-hidden="true">${estrellas}</span>
              </div>
              <span class="c-rating__value" aria-label="Calificación numérica">(${profesional.calificacion})</span>
              <span>${profesional.resenas} reseñas</span>
              <span>•</span>
              <span>${profesional.experiencia}</span>
            </div>
            <div style="display: flex; gap: var(--espacio-pequeno); margin-top: calc(var(--espacio-pequeno) * 0.5);">
              ${badgeVerificado}
              ${badgeDestacado}
              <span class="c-chip c-chip--neutral" style="font-size: 0.75rem;">
                <i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${profesional.ubicacion} (${profesional.distancia} km)
              </span>
            </div>
          </header>
          <p class="texto-base u-no-margin" style="margin-top: var(--espacio-chico);">
            ${profesional.descripcion}
          </p>
          <div class="c-result-card__actions">
            <a class="c-button" href="proveedor.html?id=${profesional.id}" aria-label="Ver perfil completo de ${profesional.nombre}">
              Ver perfil
            </a>
            <button 
              class="c-button c-button--secondary c-button--icon" 
              type="button" 
              data-favorito-id="${profesional.id}"
              aria-label="Agregar a favoritos"
              aria-pressed="false"
            >
              <i class="far fa-heart" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  /**
   * Genera estrellas de calificación
   */
  function generarEstrellas(calificacion) {
    const llenas = Math.floor(calificacion);
    const media = calificacion % 1 >= 0.5;
    const vacias = 5 - llenas - (media ? 1 : 0);

    let estrellas = '★'.repeat(llenas);
    if (media) estrellas += '⯨';
    estrellas += '☆'.repeat(vacias);

    return estrellas;
  }

  /**
   * Actualiza el contador de resultados
   */
  function actualizarContador(cantidad) {
    if (!elementos.contadorResultados) return;

    const texto = cantidad === 0 
      ? 'No hay profesionales disponibles'
      : cantidad === 1 
        ? 'Mostrando 1 profesional'
        : `Mostrando ${cantidad} profesionales`;

    elementos.contadorResultados.textContent = texto;
    anunciarAccesibilidad(`Búsqueda actualizada. ${texto}.`);
  }

  /**
   * Anuncia mensajes para lectores de pantalla
   */
  function anunciarAccesibilidad(mensaje) {
    if (window.announceToScreenReader) {
      window.announceToScreenReader(mensaje);
    }
  }

  /**
   * Función global para toggle de favoritos
   */
  window.toggleFavorito = function(profesionalId) {
    // Aquí se implementaría la lógica real de favoritos
    // Por ahora solo mostramos un mensaje
    const profesional = profesionalesDB.find(p => p.id === profesionalId);
    if (profesional) {
      anunciarAccesibilidad(`${profesional.nombre} agregado a favoritos`);
      
      // Feedback visual temporal
      const button = event.target.closest('button');
      if (button) {
        const icon = button.querySelector('i');
        if (icon) {
          icon.classList.remove('far');
          icon.classList.add('fas');
          button.setAttribute('aria-label', 'Quitar de favoritos');
        }
      }
    }
  };

  // Exportar para uso externo si es necesario
  window.ServiLocalBusqueda = {
    aplicarFiltros,
    profesionalesDB
  };

})();
