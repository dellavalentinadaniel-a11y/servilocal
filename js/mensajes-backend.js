/**
 * Cliente de Mensajería con Backend Real
 * Conecta con API REST y WebSockets
 */

// Configuración
const CONFIG = {
  API_URL: 'http://localhost:3000/api',
  WS_URL: 'http://localhost:3000',
  TOKEN_KEY: 'servilocal_token',
  USER_KEY: 'servilocal_user'
};

// Estado global
const state = {
  socket: null,
  token: null,
  currentUser: null,
  currentConversationId: null,
  conversations: [],
  messages: {},
  typingUsers: new Set()
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

async function initializeApp() {
  // Cargar token y usuario del localStorage
  state.token = localStorage.getItem(CONFIG.TOKEN_KEY);
  const userStr = localStorage.getItem(CONFIG.USER_KEY);
  
  if (userStr) {
    state.currentUser = JSON.parse(userStr);
  }
  
  if (!state.token) {
    // Redirigir a login si no hay token
    window.location.href = 'login.html';
    return;
  }
  
  try {
    // Conectar WebSocket
    await connectWebSocket();
    
    // Cargar conversaciones
    await loadConversations();
    
    // Renderizar conversaciones
    renderConversations();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Actualizar badge de notificaciones
    updateNotificationBadge();
    
  } catch (error) {
    console.error('Error inicializando app:', error);
    handleAuthError();
  }
}

// ============================================
// WEBSOCKET
// ============================================

function connectWebSocket() {
  return new Promise((resolve, reject) => {
    // Importar Socket.io client (agregar en HTML: <script src="https://cdn.socket.io/4.6.1/socket.io.min.js"></script>)
    state.socket = io(CONFIG.WS_URL, {
      auth: {
        token: state.token
      },
      transports: ['websocket', 'polling']
    });
    
    // Eventos de conexión
    state.socket.on('connect', () => {
      console.log('✅ Conectado al servidor WebSocket');
      resolve();
    });
    
    state.socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión:', error);
      reject(error);
    });
    
    state.socket.on('disconnect', () => {
      console.log('🔴 Desconectado del servidor');
    });
    
    // Eventos de mensajería
    state.socket.on('message:received', handleMessageReceived);
    state.socket.on('message:statusUpdate', handleMessageStatusUpdate);
    state.socket.on('typing:update', handleTypingUpdate);
    state.socket.on('notification:newMessage', handleNewMessageNotification);
    state.socket.on('user:online', handleUserOnline);
    state.socket.on('user:offline', handleUserOffline);
  });
}

// ============================================
// API REST - AUTENTICACIÓN
// ============================================

async function login(email, password) {
  try {
    const response = await fetch(`${CONFIG.API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    
    const data = await response.json();
    
    // Guardar token y usuario
    localStorage.setItem(CONFIG.TOKEN_KEY, data.token);
    localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
    
    state.token = data.token;
    state.currentUser = data.user;
    
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
}

async function logout() {
  try {
    await fetch(`${CONFIG.API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: state.currentUser?.id })
    });
  } catch (error) {
    console.error('Error en logout:', error);
  } finally {
    // Limpiar datos locales
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    localStorage.removeItem(CONFIG.USER_KEY);
    
    // Desconectar socket
    if (state.socket) {
      state.socket.disconnect();
    }
    
    // Redirigir a login
    window.location.href = 'login.html';
  }
}

// ============================================
// API REST - CONVERSACIONES
// ============================================

async function loadConversations() {
  try {
    const response = await fetch(`${CONFIG.API_URL}/conversations`, {
      headers: {
        'Authorization': `Bearer ${state.token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al cargar conversaciones');
    }
    
    state.conversations = await response.json();
    return state.conversations;
  } catch (error) {
    console.error('Error cargando conversaciones:', error);
    handleAuthError();
    throw error;
  }
}

async function createConversation(userId, userName, userAvatar) {
  try {
    const response = await fetch(`${CONFIG.API_URL}/conversations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    });
    
    if (!response.ok) {
      throw new Error('Error al crear conversación');
    }
    
    const conversation = await response.json();
    
    // Agregar a la lista
    state.conversations.unshift(conversation);
    renderConversations();
    
    return conversation;
  } catch (error) {
    console.error('Error creando conversación:', error);
    throw error;
  }
}

// ============================================
// API REST - MENSAJES
// ============================================

async function loadMessages(conversationId, page = 1) {
  try {
    const response = await fetch(
      `${CONFIG.API_URL}/messages/${conversationId}?page=${page}&limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${state.token}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Error al cargar mensajes');
    }
    
    const data = await response.json();
    state.messages[conversationId] = data.messages;
    
    return data;
  } catch (error) {
    console.error('Error cargando mensajes:', error);
    throw error;
  }
}

async function sendMessage(conversationId, text, recipientId) {
  try {
    // Enviar por WebSocket para tiempo real
    state.socket.emit('message:send', {
      conversationId,
      text,
      recipientId
    });
    
    // También guardar por REST API como respaldo
    const response = await fetch(`${CONFIG.API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${state.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversationId,
        text,
        recipientId
      })
    });
    
    if (!response.ok) {
      throw new Error('Error al enviar mensaje');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    throw error;
  }
}

async function markMessagesAsRead(conversationId) {
  try {
    await fetch(`${CONFIG.API_URL}/messages/${conversationId}/read`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${state.token}`
      }
    });
  } catch (error) {
    console.error('Error marcando mensajes como leídos:', error);
  }
}

// ============================================
// MANEJADORES DE EVENTOS WEBSOCKET
// ============================================

function handleMessageReceived(data) {
  console.log('📨 Mensaje recibido:', data);
  
  // Agregar mensaje a la lista
  if (!state.messages[data.conversationId]) {
    state.messages[data.conversationId] = [];
  }
  state.messages[data.conversationId].push(data);
  
  // Actualizar conversación
  const conversation = state.conversations.find(c => c.id === data.conversationId);
  if (conversation) {
    conversation.lastMessage = data.text;
    conversation.lastMessageTime = data.timestamp;
    
    // Si no estamos viendo esta conversación, incrementar contador
    if (state.currentConversationId !== data.conversationId) {
      conversation.unreadCount++;
    }
  }
  
  // Re-renderizar
  renderConversations();
  
  if (state.currentConversationId === data.conversationId) {
    renderMessages(data.conversationId);
  }
  
  updateNotificationBadge();
  
  // Reproducir sonido
  playNotificationSound();
}

function handleMessageStatusUpdate(data) {
  const { messageId, status } = data;
  
  // Actualizar estado del mensaje
  for (const conversationId in state.messages) {
    const message = state.messages[conversationId].find(m => m.id === messageId);
    if (message) {
      message.status = status;
      
      if (state.currentConversationId === conversationId) {
        renderMessages(conversationId);
      }
      break;
    }
  }
}

function handleTypingUpdate(data) {
  if (data.isTyping) {
    state.typingUsers.add(data.userId);
    showTypingIndicator(data.userName);
  } else {
    state.typingUsers.delete(data.userId);
    hideTypingIndicator();
  }
}

function handleNewMessageNotification(data) {
  // Mostrar notificación del sistema si está permitido
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`Nuevo mensaje de ${data.senderName}`, {
      body: data.preview,
      icon: '/imagenes/logo.png'
    });
  }
}

function handleUserOnline(data) {
  const conversation = state.conversations.find(c => c.userId === data.userId);
  if (conversation) {
    conversation.isOnline = true;
    renderConversations();
  }
}

function handleUserOffline(data) {
  const conversation = state.conversations.find(c => c.userId === data.userId);
  if (conversation) {
    conversation.isOnline = false;
    renderConversations();
  }
}

// ============================================
// UI - RENDERIZADO
// ============================================

function renderConversations(filter = '') {
  const conversationsList = document.getElementById('conversationsList');
  
  // Filtrar conversaciones
  let filteredConversations = state.conversations;
  if (filter) {
    filteredConversations = state.conversations.filter(conv =>
      conv.userName.toLowerCase().includes(filter.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(filter.toLowerCase())
    );
  }
  
  // Ordenar por última actividad
  filteredConversations.sort((a, b) => 
    new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
  );
  
  // Generar HTML
  conversationsList.innerHTML = filteredConversations.map(conv => `
    <div class="c-conversation ${conv.id === state.currentConversationId ? 'is-active' : ''} ${conv.unreadCount > 0 ? 'is-unread' : ''}" 
         data-conversation-id="${conv.id}"
         onclick="openConversation('${conv.id}')">
      <div class="c-conversation__avatar">
        <img src="${conv.userAvatar}" alt="${conv.userName}" onerror="this.src='imagenes/perfile/images%20(1).png'">
        <div class="c-conversation__avatar-status ${conv.isOnline ? '' : 'is-offline'}"></div>
      </div>
      <div class="c-conversation__content">
        <div class="c-conversation__header">
          <div class="c-conversation__name">${conv.userName}</div>
          <div class="c-conversation__time">${formatTime(new Date(conv.lastMessageTime))}</div>
        </div>
        <div class="c-conversation__preview">${conv.lastMessage}</div>
      </div>
      ${conv.unreadCount > 0 ? `<span class="c-conversation__badge">${conv.unreadCount}</span>` : ''}
    </div>
  `).join('');
  
  if (filteredConversations.length === 0) {
    conversationsList.innerHTML = `
      <div style="padding: var(--spacing-4); text-align: center; color: var(--color-neutral-500);">
        <i class="fas fa-search" style="font-size: 32px; margin-bottom: var(--spacing-2); opacity: 0.5;"></i>
        <p>No se encontraron conversaciones</p>
      </div>
    `;
  }
}

async function openConversation(conversationId) {
  state.currentConversationId = conversationId;
  
  // Encontrar la conversación
  const conversation = state.conversations.find(c => c.id === conversationId);
  if (!conversation) return;
  
  // Unirse a la sala de WebSocket
  state.socket.emit('conversation:join', conversationId);
  
  // Marcar como leída
  if (conversation.unreadCount > 0) {
    conversation.unreadCount = 0;
    await markMessagesAsRead(conversationId);
  }
  
  // Actualizar UI
  renderConversations();
  updateNotificationBadge();
  
  // Mostrar el chat
  showChatArea(conversation);
  
  // Cargar mensajes
  await loadMessages(conversationId);
  renderMessages(conversationId);
  
  // En mobile, ocultar sidebar
  if (window.innerWidth <= 768) {
    document.getElementById('conversationsSidebar').classList.remove('is-active');
  }
}

// ... (resto de funciones de UI similares al código anterior)

// Exportar funciones globales
window.login = login;
window.logout = logout;
window.openConversation = openConversation;
window.createConversation = createConversation;
