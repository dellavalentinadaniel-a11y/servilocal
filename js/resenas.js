/**
 * Sistema de reseñas para ServiLocal
 * Maneja agregar, editar, votar y renderizar reseñas de profesionales
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'servilocal:reviews';
  const VOTES_KEY = 'servilocal:review_votes';
  
  let elementos = {};
  let proveedorId = null;
  let calificacionSeleccionada = 0;

  // Inicialización
  document.addEventListener('DOMContentLoaded', () => {
    proveedorId = obtenerProveedorIdDeURL();
    inicializarElementos();
    
    if (elementos.formulario) {
      configurarFormulario();
      configurarEstrellas();
      cargarYRenderizarResenas();
    }
  });

  /**
   * Obtiene el ID del proveedor de la URL
   */
  function obtenerProveedorIdDeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'proveedor-default';
  }

  /**
   * Inicializa referencias a elementos del DOM
   */
  function inicializarElementos() {
    elementos = {
      formulario: document.getElementById('formResena'),
      estrellas: document.querySelectorAll('.c-rating-input__star'),
      contenedorEstrellas: document.querySelector('.c-rating-input'),
      inputCalificacion: document.getElementById('calificacion'),
      inputComentario: document.getElementById('comentario'),
      botonEnviar: document.querySelector('#formResena button[type="submit"]'),
      listaResenas: document.querySelector('.c-review-list'),
      contadorResenas: document.getElementById('contador-resenas'),
      calificacionPromedio: document.getElementById('calificacion-promedio'),
      mensajeEstado: document.getElementById('mensaje-estado-resena')
    };
  }

  /**
   * Configura el formulario de reseñas
   */
  function configurarFormulario() {
    if (!elementos.formulario) return;

    elementos.formulario.addEventListener('submit', (e) => {
      e.preventDefault();
      enviarResena();
    });

    // Contador de caracteres para el comentario
    if (elementos.inputComentario) {
      elementos.inputComentario.addEventListener('input', () => {
        const length = elementos.inputComentario.value.length;
        const maxLength = elementos.inputComentario.getAttribute('maxlength') || 500;
        const contador = document.getElementById('contador-caracteres');
        if (contador) {
          contador.textContent = `${length}/${maxLength}`;
        }
      });
    }
  }

  /**
   * Configura las estrellas interactivas
   */
  function configurarEstrellas() {
    if (!elementos.estrellas || !elementos.estrellas.length) return;

    elementos.estrellas.forEach((estrella, index) => {
      // Hover
      estrella.addEventListener('mouseenter', () => {
        highlightEstrellas(index + 1);
      });

      // Click
      estrella.addEventListener('click', () => {
        calificacionSeleccionada = index + 1;
        if (elementos.inputCalificacion) {
          elementos.inputCalificacion.value = calificacionSeleccionada;
        }
        fijarEstrellas(calificacionSeleccionada);
        anunciarAccesibilidad(`Calificación seleccionada: ${calificacionSeleccionada} de 5 estrellas`);
      });

      // Teclado
      estrella.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          estrella.click();
        }
      });
    });

    // Mouse leave del contenedor
    if (elementos.contenedorEstrellas) {
      elementos.contenedorEstrellas.addEventListener('mouseleave', () => {
        if (calificacionSeleccionada > 0) {
          fijarEstrellas(calificacionSeleccionada);
        } else {
          resetEstrellas();
        }
      });
    }
  }

  /**
   * Resalta estrellas durante hover
   */
  function highlightEstrellas(cantidad) {
    elementos.estrellas.forEach((estrella, index) => {
      if (index < cantidad) {
        estrella.classList.add('is-hover');
        estrella.classList.remove('is-empty');
      } else {
        estrella.classList.remove('is-hover');
        estrella.classList.add('is-empty');
      }
    });
  }

  /**
   * Fija la selección de estrellas
   */
  function fijarEstrellas(cantidad) {
    elementos.estrellas.forEach((estrella, index) => {
      if (index < cantidad) {
        estrella.classList.add('is-selected');
        estrella.classList.remove('is-empty');
      } else {
        estrella.classList.remove('is-selected');
        estrella.classList.add('is-empty');
      }
    });
  }

  /**
   * Resetea las estrellas
   */
  function resetEstrellas() {
    elementos.estrellas.forEach(estrella => {
      estrella.classList.remove('is-hover', 'is-selected');
      estrella.classList.add('is-empty');
    });
  }

  /**
   * Envía una nueva reseña
   */
  function enviarResena() {
    // Validar usuario logueado
    const usuario = window.ServiLocalAuth ? window.ServiLocalAuth.getCurrentUser() : null;
    if (!usuario) {
      mostrarMensaje('Debes iniciar sesión para dejar una reseña', 'error');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);
      return;
    }

    // Validar calificación
    if (calificacionSeleccionada === 0) {
      mostrarMensaje('Por favor selecciona una calificación', 'error');
      return;
    }

    // Validar comentario
    const comentario = elementos.inputComentario.value.trim();
    if (comentario.length < 10) {
      mostrarMensaje('El comentario debe tener al menos 10 caracteres', 'error');
      return;
    }

    // Verificar si ya dejó reseña
    if (yaDejoResena(usuario.id)) {
      mostrarMensaje('Ya dejaste una reseña para este profesional', 'error');
      return;
    }

    // Crear reseña
    const resena = {
      id: generarId(),
      proveedorId: proveedorId,
      usuarioId: usuario.id,
      usuarioNombre: usuario.fullName || usuario.email,
      calificacion: calificacionSeleccionada,
      comentario: comentario,
      fecha: new Date().toISOString(),
      votosUtiles: 0,
      votosNoUtiles: 0,
      editada: false
    };

    // Guardar
    guardarResena(resena);

    // Feedback
    mostrarMensaje('¡Reseña publicada con éxito!', 'success');
    elementos.formulario.reset();
    calificacionSeleccionada = 0;
    resetEstrellas();

    // Recargar reseñas
    cargarYRenderizarResenas();
  }

  /**
   * Verifica si el usuario ya dejó reseña
   */
  function yaDejoResena(usuarioId) {
    const resenas = cargarResenas();
    return resenas.some(r => r.proveedorId === proveedorId && r.usuarioId === usuarioId);
  }

  /**
   * Carga todas las reseñas del localStorage
   */
  function cargarResenas() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Guarda una reseña en localStorage
   */
  function guardarResena(resena) {
    const resenas = cargarResenas();
    resenas.push(resena);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resenas));
  }

  /**
   * Carga y renderiza las reseñas del proveedor actual
   */
  function cargarYRenderizarResenas() {
    const todasLasResenas = cargarResenas();
    const resenasProveedor = todasLasResenas.filter(r => r.proveedorId === proveedorId);
    
    // Ordenar por fecha (más recientes primero)
    resenasProveedor.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    // Actualizar contador y promedio
    actualizarEstadisticas(resenasProveedor);

    // Renderizar
    renderizarResenas(resenasProveedor);
  }

  /**
   * Actualiza estadísticas (contador y promedio)
   */
  function actualizarEstadisticas(resenas) {
    const total = resenas.length;
    
    if (elementos.contadorResenas) {
      elementos.contadorResenas.textContent = total;
    }

    if (elementos.calificacionPromedio && total > 0) {
      const suma = resenas.reduce((acc, r) => acc + r.calificacion, 0);
      const promedio = (suma / total).toFixed(1);
      elementos.calificacionPromedio.textContent = promedio;
    }
  }

  /**
   * Renderiza la lista de reseñas
   */
  function renderizarResenas(resenas) {
    if (!elementos.listaResenas) return;

    if (resenas.length === 0) {
      elementos.listaResenas.innerHTML = `
        <div class="c-panel" style="text-align: center; padding: var(--espacio-grande);">
          <i class="fas fa-comment-slash" style="font-size: 3rem; color: var(--color-neutro-400); margin-bottom: var(--espacio-medio);"></i>
          <h3 class="texto-subtitulo">Sin reseñas aún</h3>
          <p class="texto-base">Sé el primero en dejar una reseña sobre este profesional.</p>
        </div>
      `;
      return;
    }

    const html = resenas.map(resena => crearTarjetaResena(resena)).join('');
    elementos.listaResenas.innerHTML = html;

    // Agregar event listeners a los botones de voto
    configurarBotonesVoto();
  }

  /**
   * Crea el HTML de una tarjeta de reseña
   */
  function crearTarjetaResena(resena) {
    const fecha = formatearFecha(resena.fecha);
    const estrellas = generarEstrellas(resena.calificacion);
    const votos = cargarVotos();
    const miVoto = votos[resena.id];
    
    const badgeEditada = resena.editada 
      ? '<span class="c-chip c-chip--neutral" style="font-size: 0.75rem;">Editada</span>' 
      : '';

    const iconoUtil = miVoto === 'util' ? 'fas' : 'far';
    const iconoNoUtil = miVoto === 'no-util' ? 'fas' : 'far';

    return `
      <article class="c-review" role="listitem" data-review-id="${resena.id}">
        <div class="c-review__header">
          <div>
            <strong>${resena.usuarioNombre}</strong>
            <div class="c-rating" role="img" aria-label="Calificación ${resena.calificacion} de 5 estrellas">
              <span aria-hidden="true">${estrellas}</span>
            </div>
            <div style="display: flex; align-items: center; gap: var(--espacio-pequeno); margin-top: calc(var(--espacio-pequeno) * 0.5);">
              <time class="c-review__date" datetime="${resena.fecha}">${fecha}</time>
              ${badgeEditada}
            </div>
          </div>
        </div>
        <blockquote class="c-review__text">${escapeHtml(resena.comentario)}</blockquote>
        <div class="c-review__actions">
          <span class="texto-base" style="color: var(--color-neutro-600);">¿Te resultó útil?</span>
          <button class="c-button c-button--secondary c-button--small" 
                  data-action="votar-util" 
                  data-review-id="${resena.id}"
                  aria-label="Marcar como útil"
                  ${miVoto ? 'disabled' : ''}>
            <i class="${iconoUtil} fa-thumbs-up" aria-hidden="true"></i>
            Útil (${resena.votosUtiles})
          </button>
          <button class="c-button c-button--secondary c-button--small" 
                  data-action="votar-no-util" 
                  data-review-id="${resena.id}"
                  aria-label="Marcar como no útil"
                  ${miVoto ? 'disabled' : ''}>
            <i class="${iconoNoUtil} fa-thumbs-down" aria-hidden="true"></i>
            No útil (${resena.votosNoUtiles})
          </button>
        </div>
      </article>
    `;
  }

  /**
   * Configura botones de votación
   */
  function configurarBotonesVoto() {
    document.querySelectorAll('[data-action^="votar-"]').forEach(boton => {
      boton.addEventListener('click', (e) => {
        const reviewId = e.currentTarget.dataset.reviewId;
        const accion = e.currentTarget.dataset.action;
        const esUtil = accion === 'votar-util';
        
        votarResena(reviewId, esUtil);
      });
    });
  }

  /**
   * Registra un voto en una reseña
   */
  function votarResena(reviewId, esUtil) {
    const votos = cargarVotos();
    
    // Verificar si ya votó
    if (votos[reviewId]) {
      mostrarMensaje('Ya votaste en esta reseña', 'error');
      return;
    }

    // Actualizar reseña
    const resenas = cargarResenas();
    const resena = resenas.find(r => r.id === reviewId);
    
    if (!resena) return;

    if (esUtil) {
      resena.votosUtiles++;
    } else {
      resena.votosNoUtiles++;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(resenas));

    // Registrar voto
    votos[reviewId] = esUtil ? 'util' : 'no-util';
    localStorage.setItem(VOTES_KEY, JSON.stringify(votos));

    // Recargar
    cargarYRenderizarResenas();
    mostrarMensaje('¡Gracias por tu voto!', 'success');
  }

  /**
   * Carga los votos del usuario
   */
  function cargarVotos() {
    try {
      const data = localStorage.getItem(VOTES_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
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
   * Formatea una fecha
   */
  function formatearFecha(isoString) {
    const fecha = new Date(isoString);
    const ahora = new Date();
    const diffMs = ahora - fecha;
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDias === 0) return 'Hoy';
    if (diffDias === 1) return 'Ayer';
    if (diffDias < 7) return `Hace ${diffDias} días`;
    if (diffDias < 30) return `Hace ${Math.floor(diffDias / 7)} semanas`;
    
    return fecha.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  /**
   * Genera un ID único
   */
  function generarId() {
    return `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Escapa HTML para prevenir XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Muestra un mensaje de estado
   */
  function mostrarMensaje(texto, tipo = 'success') {
    if (!elementos.mensajeEstado) {
      // Crear elemento si no existe
      elementos.mensajeEstado = document.createElement('div');
      elementos.mensajeEstado.id = 'mensaje-estado-resena';
      elementos.mensajeEstado.className = 'c-field-feedback';
      elementos.mensajeEstado.setAttribute('role', 'status');
      elementos.formulario?.prepend(elementos.mensajeEstado);
    }

    elementos.mensajeEstado.textContent = texto;
    elementos.mensajeEstado.className = `c-field-feedback c-field-feedback--${tipo === 'success' ? 'success' : 'error'}`;
    elementos.mensajeEstado.style.display = 'block';

    anunciarAccesibilidad(texto);

    setTimeout(() => {
      if (elementos.mensajeEstado) {
        elementos.mensajeEstado.style.display = 'none';
      }
    }, 5000);
  }

  /**
   * Anuncia mensajes para lectores de pantalla
   */
  function anunciarAccesibilidad(mensaje) {
    if (window.announceToScreenReader) {
      window.announceToScreenReader(mensaje);
    }
  }

  // Exportar para uso externo si es necesario
  window.ServiLocalResenas = {
    cargarResenas,
    cargarYRenderizarResenas
  };

})();
