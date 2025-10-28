/**
 * Sistema de publicaciones estilo Facebook
 * Maneja la creación, visualización y gestión de publicaciones del usuario
 */

(function() {
  'use strict';

  // ============================================
  // CONFIGURACIÓN Y ESTADO
  // ============================================
  
  const CONFIG = {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    MAX_FILES: 10,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg']
  };

  let state = {
    posts: [],
    selectedFiles: [],
    currentUser: {
      name: 'Usuario Ejemplo',
      avatar: 'imagenes/perfile/avatar-default.svg'
    }
  };

  // ============================================
  // ELEMENTOS DOM
  // ============================================
  
  const elements = {
    // Creador de publicaciones
    openPostCreatorBtn: document.getElementById('openPostCreator'),
    createPostModal: document.getElementById('createPostModal'),
    createPostForm: document.getElementById('createPostForm'),
    postContent: document.getElementById('postContent'),
    postMediaInput: document.getElementById('postMediaInput'),
    mediaPreview: document.getElementById('mediaPreview'),
    mediaPreviewContainer: document.querySelector('.c-post-form__preview-container'),
    removeMediaBtn: document.querySelector('.c-post-form__remove-media'),
    mediaButtons: document.querySelectorAll('.c-post-form__media-btn'),
    submitPostBtn: document.getElementById('submitPostBtn'),
    
    // Feed
    postsFeed: document.getElementById('postsFeed'),
    
    // Avatares
    postCreatorAvatar: document.getElementById('postCreatorAvatar'),
    postFormAvatar: document.getElementById('postFormAvatar'),
    postFormUsername: document.getElementById('postFormUsername')
  };

  // ============================================
  // INICIALIZACIÓN
  // ============================================
  
  function init() {
    loadUserData();
    loadPosts();
    setupEventListeners();
    console.log('✅ Sistema de publicaciones inicializado');
  }

  function loadUserData() {
    // Intentar cargar datos del usuario desde localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        state.currentUser.name = user.name || state.currentUser.name;
        state.currentUser.avatar = user.avatar || state.currentUser.avatar;
      } catch (e) {
        console.warn('Error al cargar datos del usuario:', e);
      }
    }

    // Actualizar avatares y nombre en la interfaz
    if (elements.postCreatorAvatar) {
      elements.postCreatorAvatar.src = state.currentUser.avatar;
    }
    if (elements.postFormAvatar) {
      elements.postFormAvatar.src = state.currentUser.avatar;
    }
    if (elements.postFormUsername) {
      elements.postFormUsername.textContent = state.currentUser.name;
    }
  }

  function loadPosts() {
    // Intentar cargar publicaciones desde localStorage
    const savedPosts = localStorage.getItem('userPosts');
    if (savedPosts) {
      try {
        state.posts = JSON.parse(savedPosts);
        renderPosts();
      } catch (e) {
        console.warn('Error al cargar publicaciones:', e);
        state.posts = [];
      }
    }
  }

  function savePosts() {
    try {
      localStorage.setItem('userPosts', JSON.stringify(state.posts));
    } catch (e) {
      console.error('Error al guardar publicaciones:', e);
    }
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================
  
  function setupEventListeners() {
    // Abrir modal de crear publicación
    if (elements.openPostCreatorBtn) {
      elements.openPostCreatorBtn.addEventListener('click', openCreatePostModal);
    }

    // Botones de acción rápida en el creador
    document.querySelectorAll('.c-post-creator__action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.getAttribute('data-action');
        openCreatePostModal();
        if (action === 'photo' || action === 'video') {
          setTimeout(() => elements.postMediaInput?.click(), 300);
        }
      });
    });

    // Botones de media en el formulario
    elements.mediaButtons?.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.postMediaInput?.click();
      });
    });

    // Selector de archivos
    if (elements.postMediaInput) {
      elements.postMediaInput.addEventListener('change', handleFileSelect);
    }

    // Eliminar medios
    if (elements.removeMediaBtn) {
      elements.removeMediaBtn.addEventListener('click', clearSelectedFiles);
    }

    // Enviar formulario
    if (elements.createPostForm) {
      elements.createPostForm.addEventListener('submit', handleSubmitPost);
    }

    // Cerrar modal
    document.querySelectorAll('[data-dismiss="createPostModal"]').forEach(btn => {
      btn.addEventListener('click', closeCreatePostModal);
    });

    // Cerrar modal al hacer clic fuera
    if (elements.createPostModal) {
      elements.createPostModal.addEventListener('click', (e) => {
        if (e.target === elements.createPostModal) {
          closeCreatePostModal();
        }
      });
    }
  }

  // ============================================
  // GESTIÓN DEL MODAL
  // ============================================
  
  function openCreatePostModal() {
    if (elements.createPostModal) {
      elements.createPostModal.classList.remove('u-hidden');
      document.body.style.overflow = 'hidden';
      elements.postContent?.focus();
    }
  }

  function closeCreatePostModal() {
    if (elements.createPostModal) {
      elements.createPostModal.classList.add('u-hidden');
      document.body.style.overflow = '';
      resetForm();
    }
  }

  function resetForm() {
    if (elements.createPostForm) {
      elements.createPostForm.reset();
    }
    clearSelectedFiles();
  }

  // ============================================
  // GESTIÓN DE ARCHIVOS
  // ============================================
  
  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validar número de archivos
    if (files.length > CONFIG.MAX_FILES) {
      alert(`Solo puedes subir un máximo de ${CONFIG.MAX_FILES} archivos`);
      return;
    }

    // Validar cada archivo
    const validFiles = files.filter(file => {
      // Validar tamaño
      if (file.size > CONFIG.MAX_FILE_SIZE) {
        alert(`El archivo ${file.name} supera el tamaño máximo de 50MB`);
        return false;
      }

      // Validar tipo
      const isImage = CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type);
      const isVideo = CONFIG.ALLOWED_VIDEO_TYPES.includes(file.type);
      
      if (!isImage && !isVideo) {
        alert(`El archivo ${file.name} no es un tipo válido`);
        return false;
      }

      return true;
    });

    if (validFiles.length > 0) {
      state.selectedFiles = validFiles;
      renderMediaPreview();
    }
  }

  function renderMediaPreview() {
    if (!elements.mediaPreview || !elements.mediaPreviewContainer) return;

    elements.mediaPreviewContainer.innerHTML = '';

    if (state.selectedFiles.length === 0) {
      elements.mediaPreview.classList.add('u-hidden');
      return;
    }

    elements.mediaPreview.classList.remove('u-hidden');

    // Determinar el layout del grid
    const count = state.selectedFiles.length;
    let gridClass = 'c-post__media-grid--1';
    if (count === 2) gridClass = 'c-post__media-grid--2';
    else if (count === 3) gridClass = 'c-post__media-grid--3';
    else if (count >= 4) gridClass = 'c-post__media-grid--4';

    elements.mediaPreviewContainer.className = `c-post-form__preview-container c-post__media-grid ${gridClass}`;

    // Mostrar máximo 4 archivos en la preview
    const filesToShow = state.selectedFiles.slice(0, 4);

    filesToShow.forEach((file, index) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const isVideo = CONFIG.ALLOWED_VIDEO_TYPES.includes(file.type);
        const mediaElement = isVideo ? 
          `<video src="${e.target.result}" controls></video>` :
          `<img src="${e.target.result}" alt="Preview ${index + 1}">`;

        const moreIndicator = (index === 3 && state.selectedFiles.length > 4) ? 
          `<div class="c-post__media-more">+${state.selectedFiles.length - 4}</div>` : '';

        elements.mediaPreviewContainer.innerHTML += `
          <div class="c-post__media-item">
            ${mediaElement}
            ${moreIndicator}
          </div>
        `;
      };

      reader.readAsDataURL(file);
    });
  }

  function clearSelectedFiles() {
    state.selectedFiles = [];
    if (elements.postMediaInput) {
      elements.postMediaInput.value = '';
    }
    if (elements.mediaPreview) {
      elements.mediaPreview.classList.add('u-hidden');
    }
    if (elements.mediaPreviewContainer) {
      elements.mediaPreviewContainer.innerHTML = '';
    }
  }

  // ============================================
  // CREAR PUBLICACIÓN
  // ============================================
  
  function handleSubmitPost(e) {
    e.preventDefault();

    const content = elements.postContent?.value.trim();
    
    // Validar que haya contenido o medios
    if (!content && state.selectedFiles.length === 0) {
      alert('Debes escribir algo o agregar fotos/videos');
      return;
    }

    // Deshabilitar botón mientras se procesa
    if (elements.submitPostBtn) {
      elements.submitPostBtn.disabled = true;
      elements.submitPostBtn.textContent = 'Publicando...';
    }

    // Simular delay de subida
    setTimeout(() => {
      const post = createPost(content, state.selectedFiles);
      state.posts.unshift(post); // Agregar al inicio
      savePosts();
      renderPosts();
      closeCreatePostModal();

      // Restaurar botón
      if (elements.submitPostBtn) {
        elements.submitPostBtn.disabled = false;
        elements.submitPostBtn.textContent = 'Publicar';
      }

      // Scroll al feed
      setTimeout(() => {
        elements.postsFeed?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 500);
  }

  function createPost(content, files) {
    const media = files.map(file => ({
      type: CONFIG.ALLOWED_VIDEO_TYPES.includes(file.type) ? 'video' : 'image',
      url: URL.createObjectURL(file),
      name: file.name
    }));

    return {
      id: Date.now(),
      content: content,
      media: media,
      author: {
        name: state.currentUser.name,
        avatar: state.currentUser.avatar
      },
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false,
      comments: []
    };
  }

  // ============================================
  // RENDERIZAR PUBLICACIONES
  // ============================================
  
  function renderPosts() {
    if (!elements.postsFeed) return;

    if (state.posts.length === 0) {
      elements.postsFeed.innerHTML = `
        <div class="c-posts-feed__empty">
          <i class="fas fa-image"></i>
          <p>Aún no tienes publicaciones. ¡Crea tu primera publicación!</p>
        </div>
      `;
      return;
    }

    elements.postsFeed.innerHTML = state.posts.map(post => renderPost(post)).join('');
    
    // Agregar event listeners a las publicaciones
    setupPostEventListeners();
  }

  function renderPost(post) {
    const timeAgo = getTimeAgo(post.timestamp);
    const mediaHTML = post.media.length > 0 ? renderPostMedia(post.media) : '';

    return `
      <article class="c-post c-post--new" data-post-id="${post.id}">
        <div class="c-post__header">
          <div class="c-avatar c-avatar--small">
            <img src="${post.author.avatar}" alt="${post.author.name}" class="c-avatar__image">
          </div>
          <div class="c-post__user-info">
            <h3 class="c-post__username">${post.author.name}</h3>
            <time class="c-post__time" datetime="${post.timestamp}">${timeAgo}</time>
          </div>
          <button class="c-post__menu-btn" type="button" aria-label="Opciones de publicación" data-action="menu">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
        ${post.content ? `
        <div class="c-post__content">
          <p class="c-post__text">${escapeHtml(post.content)}</p>
        </div>
        ` : ''}
        ${mediaHTML}
        <div class="c-post__footer">
          <button class="c-post__action ${post.liked ? 'c-post__action--active' : ''}" type="button" data-action="like">
            <i class="${post.liked ? 'fas' : 'far'} fa-heart"></i>
            <span>${post.likes > 0 ? post.likes : 'Me gusta'}</span>
          </button>
          <button class="c-post__action" type="button" data-action="comment">
            <i class="far fa-comment"></i>
            <span>Comentar</span>
          </button>
          <button class="c-post__action" type="button" data-action="share">
            <i class="far fa-share-square"></i>
            <span>Compartir</span>
          </button>
        </div>
      </article>
    `;
  }

  function renderPostMedia(media) {
    if (media.length === 0) return '';

    const count = media.length;
    let gridClass = 'c-post__media-grid--1';
    if (count === 2) gridClass = 'c-post__media-grid--2';
    else if (count === 3) gridClass = 'c-post__media-grid--3';
    else if (count >= 4) gridClass = 'c-post__media-grid--4';

    const mediaToShow = media.slice(0, 4);

    const mediaItems = mediaToShow.map((item, index) => {
      const isVideo = item.type === 'video';
      const content = isVideo ? 
        `<video src="${item.url}" controls></video>
         <div class="c-post__media-play"><i class="fas fa-play"></i></div>` :
        `<img src="${item.url}" alt="Imagen ${index + 1}" loading="lazy">`;

      const moreIndicator = (index === 3 && media.length > 4) ? 
        `<div class="c-post__media-more">+${media.length - 4}</div>` : '';

      return `
        <div class="c-post__media-item" data-media-index="${index}">
          ${content}
          ${moreIndicator}
        </div>
      `;
    }).join('');

    return `
      <div class="c-post__media">
        <div class="c-post__media-grid ${gridClass}">
          ${mediaItems}
        </div>
      </div>
    `;
  }

  // ============================================
  // EVENT LISTENERS DE PUBLICACIONES
  // ============================================
  
  function setupPostEventListeners() {
    // Acciones de publicaciones (like, comment, share, menu)
    document.querySelectorAll('.c-post__action, .c-post__menu-btn').forEach(btn => {
      btn.addEventListener('click', handlePostAction);
    });

    // Abrir medios en modal (futuro)
    document.querySelectorAll('.c-post__media-item').forEach(item => {
      item.addEventListener('click', handleMediaClick);
    });
  }

  function handlePostAction(e) {
    const button = e.currentTarget;
    const action = button.getAttribute('data-action');
    const postElement = button.closest('.c-post');
    const postId = parseInt(postElement.getAttribute('data-post-id'));
    const post = state.posts.find(p => p.id === postId);

    if (!post) return;

    switch (action) {
      case 'like':
        toggleLike(post, button);
        break;
      case 'comment':
        alert('Función de comentarios próximamente');
        break;
      case 'share':
        alert('Función de compartir próximamente');
        break;
      case 'menu':
        showPostMenu(post, postElement);
        break;
    }
  }

  function toggleLike(post, button) {
    post.liked = !post.liked;
    post.likes = post.liked ? post.likes + 1 : Math.max(0, post.likes - 1);
    
    const icon = button.querySelector('i');
    const span = button.querySelector('span');
    
    if (post.liked) {
      button.classList.add('c-post__action--active');
      icon.classList.remove('far');
      icon.classList.add('fas');
    } else {
      button.classList.remove('c-post__action--active');
      icon.classList.remove('fas');
      icon.classList.add('far');
    }
    
    span.textContent = post.likes > 0 ? post.likes : 'Me gusta';
    
    savePosts();
  }

  function showPostMenu(post, postElement) {
    const confirmDelete = confirm('¿Deseas eliminar esta publicación?');
    if (confirmDelete) {
      deletePost(post.id);
    }
  }

  function deletePost(postId) {
    state.posts = state.posts.filter(p => p.id !== postId);
    savePosts();
    renderPosts();
  }

  function handleMediaClick(e) {
    // Aquí se puede implementar un visor de medios en modal
    console.log('Media clicked:', e.currentTarget);
    // Por ahora solo log, se puede expandir después
  }

  // ============================================
  // UTILIDADES
  // ============================================
  
  function getTimeAgo(timestamp) {
    const now = new Date();
    const postDate = new Date(timestamp);
    const seconds = Math.floor((now - postDate) / 1000);

    if (seconds < 60) return 'Justo ahora';
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} minutos`;
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} horas`;
    if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)} días`;
    
    return postDate.toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ============================================
  // INICIAR CUANDO EL DOM ESTÉ LISTO
  // ============================================
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
