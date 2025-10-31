/**
 * Sistema de Chat Flotante Estilo Messenger
 * Ventanas de chat minimalistas en la parte inferior
 */

const ChatFlotante = (() => {
  // Estado global del chat
  const state = {
    ventanas: new Map(), // Map<conversationId, WindowState>
    usuarioActual: null,
    socket: null,
    token: null,
    API_URL: 'http://localhost:3000/api',
    WS_URL: 'http://localhost:3000',
    maxVentanas: 3,
    mensajesNoLeidos: 0
  };

  // Inicializar
  function init() {
    cargarUsuario();
    if (state.usuarioActual) {
      crearIconoMensajes();
      conectarWebSocket();
      cargarMensajesNoLeidos();
    }
  }

  // Cargar usuario del localStorage
  function cargarUsuario() {
    const token = localStorage.getItem('servilocal_token');
    const userStr = localStorage.getItem('servilocal_user');
    
    if (token && userStr) {
      state.token = token;
      state.usuarioActual = JSON.parse(userStr);
    }
  }

  // Crear icono de mensajes en el navbar
  function crearIconoMensajes() {
    // Buscar el contenedor de links del navbar
    const navbarLinks = document.querySelector('.c-navbar__links');
    
    if (!navbarLinks) {
      console.warn('No se encontró .c-navbar__links para insertar el icono de chat');
      return;
    }

    // Verificar si ya existe el icono
    if (document.querySelector('.c-chat-icon')) {
      return; // Ya existe, no duplicar
    }

    const iconoContainer = document.createElement('div');
    iconoContainer.className = 'c-chat-icon';
    iconoContainer.innerHTML = `
      <button class="c-chat-icon__button" aria-label="Mensajes" title="Mensajes">
        <i class="fas fa-comment-dots"></i>
        <span class="c-chat-icon__badge" data-count="0" style="display: none;">0</span>
      </button>
    `;

    // Insertar antes del último botón de acción (Registrarse o último link)
    const botones = navbarLinks.querySelectorAll('.c-button, .c-navbar__link');
    const ultimoBoton = botones[botones.length - 1];
    
    if (ultimoBoton) {
      navbarLinks.insertBefore(iconoContainer, ultimoBoton);
    } else {
      navbarLinks.appendChild(iconoContainer);
    }

    // Click en el icono abre lista de conversaciones
    iconoContainer.querySelector('.c-chat-icon__button').addEventListener('click', (e) => {
      e.stopPropagation(); // Evitar que se cierre inmediatamente
      toggleListaConversaciones();
    });
  }

  // Actualizar contador de mensajes no leídos
  function actualizarBadge(count) {
    state.mensajesNoLeidos = count;
    const badge = document.querySelector('.c-chat-icon__badge');
    if (badge) {
      badge.textContent = count;
      badge.setAttribute('data-count', count);
      badge.style.display = count > 0 ? 'flex' : 'none';
    }

    // Actualizar título de la página
    if (count > 0) {
      document.title = `(${count}) ServiLocal`;
    } else {
      document.title = 'ServiLocal';
    }
  }

  // Toggle lista de conversaciones
  function toggleListaConversaciones() {
    let lista = document.querySelector('.c-chat-lista');
    
    if (lista) {
      lista.remove();
    } else {
      mostrarListaConversaciones();
    }
  }

  // Mostrar lista de conversaciones
  async function mostrarListaConversaciones() {
    const lista = document.createElement('div');
    lista.className = 'c-chat-lista';
    lista.innerHTML = `
      <div class="c-chat-lista__header">
        <h3>Chats</h3>
        <button class="c-chat-lista__close" aria-label="Cerrar">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="c-chat-lista__buscar">
        <input type="search" placeholder="Buscar conversaciones..." class="c-chat-lista__input">
      </div>
      <div class="c-chat-lista__conversaciones" id="chatListaConversaciones">
        <div class="c-chat-lista__loading">
          <i class="fas fa-spinner fa-spin"></i> Cargando...
        </div>
      </div>
    `;

    document.body.appendChild(lista);

    // Cerrar lista
    lista.querySelector('.c-chat-lista__close').addEventListener('click', () => {
      lista.remove();
    });

    // Cerrar al hacer click fuera
    setTimeout(() => {
      document.addEventListener('click', function cerrarFuera(e) {
        if (!lista.contains(e.target) && !e.target.closest('.c-chat-icon')) {
          lista.remove();
          document.removeEventListener('click', cerrarFuera);
        }
      });
    }, 100);

    // Cargar conversaciones
    await cargarConversaciones();
  }

  // Cargar conversaciones desde el backend
  async function cargarConversaciones() {
    try {
      const response = await fetch(`${state.API_URL}/conversations`, {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      });

      if (!response.ok) throw new Error('Error al cargar conversaciones');

      const conversaciones = await response.json();
      renderizarConversaciones(conversaciones);
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
      document.getElementById('chatListaConversaciones').innerHTML = `
        <div class="c-chat-lista__error">
          <i class="fas fa-exclamation-circle"></i>
          <p>Error al cargar conversaciones</p>
        </div>
      `;
    }
  }

  // Renderizar lista de conversaciones
  function renderizarConversaciones(conversaciones) {
    const container = document.getElementById('chatListaConversaciones');
    
    if (conversaciones.length === 0) {
      container.innerHTML = `
        <div class="c-chat-lista__empty">
          <i class="fas fa-comments"></i>
          <p>No hay conversaciones aún</p>
        </div>
      `;
      return;
    }

    container.innerHTML = conversaciones.map(conv => `
      <div class="c-chat-lista__item" data-id="${conv.id || conv._id}">
        <img src="${conv.userAvatar || 'imagenes/perfile/images%20(1).png'}" 
             alt="${conv.userName}" 
             class="c-chat-lista__avatar">
        <div class="c-chat-lista__info">
          <div class="c-chat-lista__nombre">${conv.userName}</div>
          <div class="c-chat-lista__preview">${conv.lastMessage || 'Sin mensajes'}</div>
        </div>
        ${conv.unreadCount > 0 ? `
          <span class="c-chat-lista__unread">${conv.unreadCount}</span>
        ` : ''}
        <span class="c-chat-lista__status ${conv.isOnline ? 'c-chat-lista__status--online' : ''}"></span>
      </div>
    `).join('');

    // Click en conversación abre ventana
    container.querySelectorAll('.c-chat-lista__item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.dataset.id;
        const conv = conversaciones.find(c => (c.id || c._id) === id);
        abrirVentanaChat(conv);
        document.querySelector('.c-chat-lista')?.remove();
      });
    });
  }

  // Abrir ventana de chat flotante
  function abrirVentanaChat(conversacion) {
    const id = conversacion.id || conversacion._id;
    
    // Si ya existe, solo la activamos
    if (state.ventanas.has(id)) {
      const ventana = document.getElementById(`chat-ventana-${id}`);
      if (ventana) {
        ventana.classList.remove('c-chat-ventana--minimizada');
        return;
      }
    }

    // Cerrar ventana más antigua si llegamos al límite
    if (state.ventanas.size >= state.maxVentanas) {
      const primeraKey = state.ventanas.keys().next().value;
      cerrarVentana(primeraKey);
    }

    // Crear nueva ventana
    const ventana = document.createElement('div');
    ventana.id = `chat-ventana-${id}`;
    ventana.className = 'c-chat-ventana';
    ventana.style.right = `${(state.ventanas.size * 340) + 20}px`;
    
    ventana.innerHTML = `
      <div class="c-chat-ventana__header">
        <img src="${conversacion.userAvatar || 'imagenes/perfile/images%20(1).png'}" 
             alt="${conversacion.userName}" 
             class="c-chat-ventana__avatar">
        <div class="c-chat-ventana__info">
          <span class="c-chat-ventana__nombre">${conversacion.userName}</span>
          <span class="c-chat-ventana__estado ${conversacion.isOnline ? 'c-chat-ventana__estado--activo' : ''}">
            ${conversacion.isOnline ? 'Activo' : 'Desconectado'}
          </span>
        </div>
        <div class="c-chat-ventana__actions">
          <button class="c-chat-ventana__btn" data-action="minimizar" title="Minimizar">
            <i class="fas fa-minus"></i>
          </button>
          <button class="c-chat-ventana__btn" data-action="cerrar" title="Cerrar">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="c-chat-ventana__body">
        <div class="c-chat-ventana__mensajes" id="mensajes-${id}">
          <div class="c-chat-ventana__loading">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
        </div>
        <div class="c-chat-ventana__typing" id="typing-${id}" style="display: none;">
          <span class="c-chat-ventana__typing-text">escribiendo</span>
          <span class="c-chat-ventana__typing-dots">
            <span></span><span></span><span></span>
          </span>
        </div>
      </div>
      <div class="c-chat-ventana__footer">
        <textarea 
          class="c-chat-ventana__input" 
          placeholder="Escribe un mensaje..."
          rows="1"
          id="input-${id}"></textarea>
        <button class="c-chat-ventana__send" data-id="${id}" title="Enviar">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    `;

    document.body.appendChild(ventana);

    // Guardar referencia
    state.ventanas.set(id, {
      conversacion,
      ventana,
      minimizada: false
    });

    // Event listeners
    configurarEventosVentana(id, ventana);

    // Cargar mensajes
    cargarMensajes(id);

    // Unirse a la conversación por WebSocket
    if (state.socket && state.socket.connected) {
      state.socket.emit('conversation:join', id);
    }
  }

  // Configurar eventos de una ventana
  function configurarEventosVentana(id, ventana) {
    // Minimizar
    ventana.querySelector('[data-action="minimizar"]').addEventListener('click', () => {
      ventana.classList.toggle('c-chat-ventana--minimizada');
      state.ventanas.get(id).minimizada = ventana.classList.contains('c-chat-ventana--minimizada');
    });

    // Cerrar
    ventana.querySelector('[data-action="cerrar"]').addEventListener('click', () => {
      cerrarVentana(id);
    });

    // Enviar mensaje
    const input = ventana.querySelector('.c-chat-ventana__input');
    const btnEnviar = ventana.querySelector('.c-chat-ventana__send');

    btnEnviar.addEventListener('click', () => enviarMensaje(id));
    
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensaje(id);
      }
    });

    // Auto-resize textarea
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });

    // Indicador de escritura
    let typingTimeout;
    input.addEventListener('input', () => {
      if (state.socket && state.socket.connected) {
        const conv = state.ventanas.get(id).conversacion;
        state.socket.emit('typing:start', {
          conversationId: id,
          recipientId: conv.userId
        });

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
          state.socket.emit('typing:stop', {
            conversationId: id,
            recipientId: conv.userId
          });
        }, 1000);
      }
    });
  }

  // Cerrar ventana
  function cerrarVentana(id) {
    const ventana = document.getElementById(`chat-ventana-${id}`);
    if (ventana) {
      ventana.remove();
    }
    
    if (state.socket && state.socket.connected) {
      state.socket.emit('conversation:leave', id);
    }
    
    state.ventanas.delete(id);
    reposicionarVentanas();
  }

  // Reposicionar ventanas después de cerrar una
  function reposicionarVentanas() {
    let index = 0;
    state.ventanas.forEach((data, id) => {
      const ventana = document.getElementById(`chat-ventana-${id}`);
      if (ventana) {
        ventana.style.right = `${(index * 340) + 20}px`;
      }
      index++;
    });
  }

  // Cargar mensajes de una conversación
  async function cargarMensajes(conversationId) {
    try {
      const response = await fetch(
        `${state.API_URL}/messages/${conversationId}?limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${state.token}`
          }
        }
      );

      if (!response.ok) throw new Error('Error al cargar mensajes');

      const data = await response.json();
      renderizarMensajes(conversationId, data.messages || []);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
      const container = document.getElementById(`mensajes-${conversationId}`);
      if (container) {
        container.innerHTML = `
          <div class="c-chat-ventana__error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Error al cargar mensajes</p>
          </div>
        `;
      }
    }
  }

  // Renderizar mensajes
  function renderizarMensajes(conversationId, mensajes) {
    const container = document.getElementById(`mensajes-${conversationId}`);
    if (!container) return;

    if (mensajes.length === 0) {
      container.innerHTML = `
        <div class="c-chat-ventana__empty">
          <i class="fas fa-comments"></i>
          <p>Inicia la conversación</p>
        </div>
      `;
      return;
    }

    container.innerHTML = mensajes.map(msg => {
      const esMio = msg.senderId === state.usuarioActual.id || 
                    msg.senderId._id === state.usuarioActual.id;
      const tiempo = new Date(msg.timestamp).toLocaleTimeString('es', {
        hour: '2-digit',
        minute: '2-digit'
      });

      return `
        <div class="c-chat-mensaje ${esMio ? 'c-chat-mensaje--propio' : ''}">
          <div class="c-chat-mensaje__bubble">
            <p class="c-chat-mensaje__text">${escapeHtml(msg.text)}</p>
            <span class="c-chat-mensaje__time">${tiempo}</span>
          </div>
        </div>
      `;
    }).join('');

    // Scroll al final
    container.scrollTop = container.scrollHeight;
  }

  // Enviar mensaje
  async function enviarMensaje(conversationId) {
    const input = document.getElementById(`input-${conversationId}`);
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    const conv = state.ventanas.get(conversationId).conversacion;

    try {
      // Enviar por WebSocket
      if (state.socket && state.socket.connected) {
        state.socket.emit('message:send', {
          conversationId,
          text,
          recipientId: conv.userId
        });
      }

      // También enviar por REST como backup
      await fetch(`${state.API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId,
          text,
          recipientId: conv.userId
        })
      });

      // Limpiar input
      input.value = '';
      input.style.height = 'auto';

      // Añadir mensaje a la ventana inmediatamente (optimistic UI)
      agregarMensajeAVentana(conversationId, {
        senderId: state.usuarioActual.id,
        text,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error enviando mensaje:', error);
      mostrarNotificacion('Error al enviar mensaje', 'error');
    }
  }

  // Agregar mensaje a ventana
  function agregarMensajeAVentana(conversationId, mensaje) {
    const container = document.getElementById(`mensajes-${conversationId}`);
    if (!container) return;

    const esMio = mensaje.senderId === state.usuarioActual.id;
    const tiempo = new Date(mensaje.timestamp).toLocaleTimeString('es', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const mensajeHTML = `
      <div class="c-chat-mensaje ${esMio ? 'c-chat-mensaje--propio' : ''} c-chat-mensaje--nuevo">
        <div class="c-chat-mensaje__bubble">
          <p class="c-chat-mensaje__text">${escapeHtml(mensaje.text)}</p>
          <span class="c-chat-mensaje__time">${tiempo}</span>
        </div>
      </div>
    `;

    // Eliminar mensaje vacío si existe
    const empty = container.querySelector('.c-chat-ventana__empty');
    if (empty) empty.remove();

    container.insertAdjacentHTML('beforeend', mensajeHTML);
    container.scrollTop = container.scrollHeight;

    // Reproducir sonido si no es mío
    if (!esMio) {
      reproducirSonidoMensaje();
    }
  }

  // Conectar WebSocket
  function conectarWebSocket() {
    if (typeof io === 'undefined') {
      console.warn('Socket.io no está cargado');
      return;
    }

    state.socket = io(state.WS_URL, {
      auth: {
        token: state.token
      },
      transports: ['websocket', 'polling']
    });

    state.socket.on('connect', () => {
      console.log('✅ WebSocket conectado');
    });

    state.socket.on('message:received', (data) => {
      agregarMensajeAVentana(data.conversationId, data);
      
      // Si la ventana no está abierta, incrementar contador
      if (!state.ventanas.has(data.conversationId)) {
        actualizarBadge(state.mensajesNoLeidos + 1);
      }
    });

    state.socket.on('typing:update', (data) => {
      const typingIndicator = document.getElementById(`typing-${data.conversationId}`);
      if (typingIndicator) {
        typingIndicator.style.display = data.isTyping ? 'flex' : 'none';
      }
    });
  }

  // Cargar mensajes no leídos
  async function cargarMensajesNoLeidos() {
    try {
      const response = await fetch(`${state.API_URL}/conversations`, {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      });

      if (response.ok) {
        const conversaciones = await response.json();
        const total = conversaciones.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
        actualizarBadge(total);
      }
    } catch (error) {
      console.error('Error cargando mensajes no leídos:', error);
    }
  }

  // Reproducir sonido de mensaje
  function reproducirSonidoMensaje() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCpz0fPTgjMGHm7A7+OZRQ0PVqzo7K1aGAk+ltrzxG8gBSZv0PLPfS0GJHLA7+OZRQ0PVqzo7K1aGAlGltj1w28fBilr0PPRfiwGJm/A7+CgRwwQVKvokatZGghAlt31yG4fByZq0/PRfiwGJnDA7eCgRwwQVKvo');
    audio.volume = 0.3;
    audio.play().catch(() => {});
  }

  // Mostrar notificación
  function mostrarNotificacion(mensaje, tipo = 'info') {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ServiLocal', {
        body: mensaje,
        icon: '/imagenes/logo.png'
      });
    }
  }

  // Utilidad: escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Exponer API pública
  return {
    init,
    abrirChat: abrirVentanaChat,
    actualizarBadge
  };
})();

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ChatFlotante.init);
} else {
  ChatFlotante.init();
}

// Exportar para uso global
window.ChatFlotante = ChatFlotante;
