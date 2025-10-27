/**
 * Sistema de Mensajería - ServiLocal
 * Gestiona las conversaciones y mensajes entre usuarios
 */

// Estado global de la aplicación
const state = {
  currentUserId: 'user-1', // ID del usuario actual (simulado)
  currentConversationId: null,
  conversations: [],
  messages: {},
  isTyping: {}
};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initializeMessaging();
});

/**
 * Inicializa el sistema de mensajería
 */
function initializeMessaging() {
  // Cargar datos de ejemplo
  loadSampleData();
  
  // Renderizar conversaciones
  renderConversations();
  
  // Configurar event listeners
  setupEventListeners();
  
  // Actualizar badge de notificaciones
  updateNotificationBadge();
  
  // Simular mensajes entrantes
  simulateIncomingMessages();
}

/**
 * Cargar datos de ejemplo
 */
function loadSampleData() {
  // Intentar cargar desde localStorage
  const savedConversations = localStorage.getItem('servilocal_conversations');
  const savedMessages = localStorage.getItem('servilocal_messages');
  
  if (savedConversations && savedMessages) {
    state.conversations = JSON.parse(savedConversations);
    state.messages = JSON.parse(savedMessages);
  } else {
    // Datos de ejemplo
    state.conversations = [
      {
        id: 'conv-1',
        userId: 'user-2',
        userName: 'María González',
        userAvatar: 'imagenes/perfilemuestra/images (2).png',
        lastMessage: '¡Perfecto! Nos vemos mañana a las 10:00',
        lastMessageTime: new Date(Date.now() - 5 * 60000), // Hace 5 minutos
        unreadCount: 0,
        isOnline: true
      },
      {
        id: 'conv-2',
        userId: 'user-3',
        userName: 'Carlos Rodríguez',
        userAvatar: 'imagenes/perfilemuestra/images (3).png',
        lastMessage: '¿Cuánto cobraría por el trabajo?',
        lastMessageTime: new Date(Date.now() - 30 * 60000), // Hace 30 minutos
        unreadCount: 2,
        isOnline: false
      },
      {
        id: 'conv-3',
        userId: 'user-4',
        userName: 'Ana Martínez',
        userAvatar: 'imagenes/perfilemuestra/images (4).png',
        lastMessage: 'Muchas gracias por tu ayuda',
        lastMessageTime: new Date(Date.now() - 2 * 60 * 60000), // Hace 2 horas
        unreadCount: 0,
        isOnline: true
      },
      {
        id: 'conv-4',
        userId: 'user-5',
        userName: 'Luis Fernández',
        userAvatar: 'imagenes/perfilemuestra/images (5).png',
        lastMessage: 'Te envié las fotos del proyecto',
        lastMessageTime: new Date(Date.now() - 24 * 60 * 60000), // Hace 1 día
        unreadCount: 1,
        isOnline: false
      },
      {
        id: 'conv-5',
        userId: 'user-6',
        userName: 'Laura Sánchez',
        userAvatar: 'imagenes/perfilemuestra/images (6).png',
        lastMessage: '¿Podrías venir el viernes?',
        lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60000), // Hace 3 días
        unreadCount: 0,
        isOnline: true
      }
    ];
    
    // Mensajes de ejemplo
    state.messages = {
      'conv-1': [
        {
          id: 'msg-1',
          senderId: 'user-2',
          text: 'Hola! Vi tu perfil y me interesa tu servicio de plomería',
          timestamp: new Date(Date.now() - 2 * 60 * 60000),
          status: 'read'
        },
        {
          id: 'msg-2',
          senderId: state.currentUserId,
          text: 'Hola María! Claro, con gusto. ¿Qué necesitas?',
          timestamp: new Date(Date.now() - 2 * 60 * 60000 + 5 * 60000),
          status: 'read'
        },
        {
          id: 'msg-3',
          senderId: 'user-2',
          text: 'Tengo una fuga en el baño y necesito que alguien venga a revisarlo',
          timestamp: new Date(Date.now() - 2 * 60 * 60000 + 10 * 60000),
          status: 'read'
        },
        {
          id: 'msg-4',
          senderId: state.currentUserId,
          text: 'Entiendo. Puedo ir mañana por la mañana. ¿Te parece bien a las 10:00?',
          timestamp: new Date(Date.now() - 1 * 60 * 60000),
          status: 'read'
        },
        {
          id: 'msg-5',
          senderId: 'user-2',
          text: '¡Perfecto! Nos vemos mañana a las 10:00',
          timestamp: new Date(Date.now() - 5 * 60000),
          status: 'read'
        }
      ],
      'conv-2': [
        {
          id: 'msg-6',
          senderId: 'user-3',
          text: 'Buenas tardes, necesito un servicio de electricidad',
          timestamp: new Date(Date.now() - 1 * 60 * 60000),
          status: 'delivered'
        },
        {
          id: 'msg-7',
          senderId: 'user-3',
          text: '¿Cuánto cobraría por el trabajo?',
          timestamp: new Date(Date.now() - 30 * 60000),
          status: 'delivered'
        }
      ],
      'conv-3': [
        {
          id: 'msg-8',
          senderId: 'user-4',
          text: 'Hola! Quería agradecerte por el excelente trabajo que hiciste',
          timestamp: new Date(Date.now() - 3 * 60 * 60000),
          status: 'read'
        },
        {
          id: 'msg-9',
          senderId: state.currentUserId,
          text: 'Muchas gracias Ana! Fue un placer trabajar contigo',
          timestamp: new Date(Date.now() - 2.5 * 60 * 60000),
          status: 'read'
        },
        {
          id: 'msg-10',
          senderId: 'user-4',
          text: 'Muchas gracias por tu ayuda',
          timestamp: new Date(Date.now() - 2 * 60 * 60000),
          status: 'read'
        }
      ],
      'conv-4': [
        {
          id: 'msg-11',
          senderId: 'user-5',
          text: 'Te envié las fotos del proyecto',
          timestamp: new Date(Date.now() - 24 * 60 * 60000),
          status: 'delivered'
        }
      ],
      'conv-5': [
        {
          id: 'msg-12',
          senderId: 'user-6',
          text: '¿Podrías venir el viernes?',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000),
          status: 'read'
        },
        {
          id: 'msg-13',
          senderId: state.currentUserId,
          text: 'Sí, el viernes puedo. ¿A qué hora te viene bien?',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000 + 60000),
          status: 'read'
        }
      ]
    };
    
    // Guardar en localStorage
    saveToLocalStorage();
  }
}

/**
 * Configurar event listeners
 */
function setupEventListeners() {
  // Búsqueda de conversaciones
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', handleSearch);
  
  // Formulario de envío de mensaje
  const messageForm = document.getElementById('messageForm');
  messageForm.addEventListener('submit', handleSendMessage);
  
  // Textarea del mensaje
  const messageTextarea = document.getElementById('messageTextarea');
  messageTextarea.addEventListener('input', handleTextareaInput);
  messageTextarea.addEventListener('keydown', handleTextareaKeydown);
  
  // Botón de volver (mobile)
  const backBtn = document.getElementById('backBtn');
  backBtn.addEventListener('click', closeChatOnMobile);
}

/**
 * Renderizar lista de conversaciones
 */
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
  filteredConversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
  
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
          <div class="c-conversation__time">${formatTime(conv.lastMessageTime)}</div>
        </div>
        <div class="c-conversation__preview">${conv.lastMessage}</div>
      </div>
      ${conv.unreadCount > 0 ? `<span class="c-conversation__badge">${conv.unreadCount}</span>` : ''}
    </div>
  `).join('');
  
  // Si no hay resultados
  if (filteredConversations.length === 0) {
    conversationsList.innerHTML = `
      <div style="padding: var(--spacing-4); text-align: center; color: var(--color-neutral-500);">
        <i class="fas fa-search" style="font-size: 32px; margin-bottom: var(--spacing-2); opacity: 0.5;"></i>
        <p>No se encontraron conversaciones</p>
      </div>
    `;
  }
}

/**
 * Abrir una conversación
 */
function openConversation(conversationId) {
  state.currentConversationId = conversationId;
  
  // Encontrar la conversación
  const conversation = state.conversations.find(c => c.id === conversationId);
  if (!conversation) return;
  
  // Marcar como leída
  conversation.unreadCount = 0;
  saveToLocalStorage();
  
  // Actualizar UI
  renderConversations();
  updateNotificationBadge();
  
  // Mostrar el chat
  showChatArea(conversation);
  
  // Renderizar mensajes
  renderMessages(conversationId);
  
  // En mobile, ocultar sidebar
  if (window.innerWidth <= 768) {
    document.getElementById('conversationsSidebar').classList.remove('is-active');
  }
}

/**
 * Mostrar área del chat
 */
function showChatArea(conversation) {
  // Ocultar estado vacío
  document.getElementById('emptyState').classList.add('u-hidden');
  
  // Mostrar elementos del chat
  document.getElementById('chatHeader').classList.remove('u-hidden');
  document.getElementById('messagesArea').classList.remove('u-hidden');
  document.getElementById('messageInput').classList.remove('u-hidden');
  
  // Actualizar header
  document.getElementById('chatHeaderAvatar').src = conversation.userAvatar;
  document.getElementById('chatHeaderAvatar').alt = conversation.userName;
  document.getElementById('chatHeaderName').textContent = conversation.userName;
  
  const statusEl = document.getElementById('chatHeaderStatus');
  if (conversation.isOnline) {
    statusEl.textContent = 'En línea';
    statusEl.classList.add('is-online');
  } else {
    statusEl.textContent = 'Desconectado';
    statusEl.classList.remove('is-online');
  }
}

/**
 * Renderizar mensajes de una conversación
 */
function renderMessages(conversationId) {
  const messagesArea = document.getElementById('messagesArea');
  const messages = state.messages[conversationId] || [];
  
  // Agrupar mensajes por fecha
  const messagesByDate = groupMessagesByDate(messages);
  
  let html = '';
  
  for (const [date, msgs] of Object.entries(messagesByDate)) {
    html += `
      <div class="c-message-date">
        <span class="c-message-date__text">${date}</span>
      </div>
    `;
    
    msgs.forEach(message => {
      const isOwn = message.senderId === state.currentUserId;
      const conversation = state.conversations.find(c => c.id === conversationId);
      const avatar = isOwn ? 'imagenes/perfile/images%20(1).png' : conversation.userAvatar;
      
      html += `
        <div class="c-message ${isOwn ? 'is-own' : ''}">
          <div class="c-message__avatar">
            <img src="${avatar}" alt="" onerror="this.src='imagenes/perfile/images%20(1).png'">
          </div>
          <div class="c-message__content">
            <div class="c-message__bubble">
              <div class="c-message__text">${escapeHtml(message.text)}</div>
            </div>
            <div class="c-message__meta">
              <span class="c-message__time">${formatMessageTime(message.timestamp)}</span>
              ${isOwn ? `<span class="c-message__status">${getStatusIcon(message.status)}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    });
  }
  
  messagesArea.innerHTML = html;
  
  // Scroll al final
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

/**
 * Agrupar mensajes por fecha
 */
function groupMessagesByDate(messages) {
  const groups = {};
  
  messages.forEach(message => {
    const dateKey = formatDateKey(message.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
  });
  
  return groups;
}

/**
 * Manejar envío de mensaje
 */
function handleSendMessage(e) {
  e.preventDefault();
  
  const textarea = document.getElementById('messageTextarea');
  const text = textarea.value.trim();
  
  if (!text || !state.currentConversationId) return;
  
  // Crear nuevo mensaje
  const newMessage = {
    id: `msg-${Date.now()}`,
    senderId: state.currentUserId,
    text: text,
    timestamp: new Date(),
    status: 'sent'
  };
  
  // Agregar a los mensajes
  if (!state.messages[state.currentConversationId]) {
    state.messages[state.currentConversationId] = [];
  }
  state.messages[state.currentConversationId].push(newMessage);
  
  // Actualizar conversación
  const conversation = state.conversations.find(c => c.id === state.currentConversationId);
  if (conversation) {
    conversation.lastMessage = text;
    conversation.lastMessageTime = new Date();
  }
  
  // Guardar en localStorage
  saveToLocalStorage();
  
  // Limpiar textarea
  textarea.value = '';
  textarea.style.height = 'auto';
  document.getElementById('sendBtn').disabled = true;
  
  // Re-renderizar
  renderConversations();
  renderMessages(state.currentConversationId);
  
  // Simular respuesta (solo para demo)
  setTimeout(() => simulateResponse(state.currentConversationId), 2000);
}

/**
 * Manejar input del textarea
 */
function handleTextareaInput(e) {
  const textarea = e.target;
  const sendBtn = document.getElementById('sendBtn');
  
  // Ajustar altura automáticamente
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  
  // Habilitar/deshabilitar botón
  sendBtn.disabled = !textarea.value.trim();
}

/**
 * Manejar teclas del textarea
 */
function handleTextareaKeydown(e) {
  // Enviar con Enter (sin Shift)
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (e.target.value.trim()) {
      document.getElementById('messageForm').dispatchEvent(new Event('submit'));
    }
  }
}

/**
 * Manejar búsqueda
 */
function handleSearch(e) {
  const filter = e.target.value;
  renderConversations(filter);
}

/**
 * Cerrar chat en mobile
 */
function closeChatOnMobile() {
  document.getElementById('conversationsSidebar').classList.add('is-active');
}

/**
 * Simular respuesta automática (solo para demo)
 */
function simulateResponse(conversationId) {
  const conversation = state.conversations.find(c => c.id === conversationId);
  if (!conversation) return;
  
  const responses = [
    'Entendido, gracias por la información.',
    'Perfecto, cuento con eso.',
    'Muchas gracias!',
    'De acuerdo, nos mantenemos en contacto.',
    'Excelente, te confirmo pronto.'
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Mostrar indicador de escritura
  showTypingIndicator(conversation);
  
  setTimeout(() => {
    // Ocultar indicador
    hideTypingIndicator();
    
    // Agregar mensaje
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: conversation.userId,
      text: randomResponse,
      timestamp: new Date(),
      status: 'delivered'
    };
    
    state.messages[conversationId].push(newMessage);
    conversation.lastMessage = randomResponse;
    conversation.lastMessageTime = new Date();
    
    // Si no estamos viendo esta conversación, marcar como no leído
    if (state.currentConversationId !== conversationId) {
      conversation.unreadCount++;
    }
    
    saveToLocalStorage();
    renderConversations();
    
    if (state.currentConversationId === conversationId) {
      renderMessages(conversationId);
    }
    
    updateNotificationBadge();
    
    // Reproducir sonido de notificación (opcional)
    playNotificationSound();
  }, 1500);
}

/**
 * Mostrar indicador de escritura
 */
function showTypingIndicator(conversation) {
  if (state.currentConversationId !== conversation.id) return;
  
  const messagesArea = document.getElementById('messagesArea');
  const typingHtml = `
    <div class="c-typing-indicator" id="typingIndicator">
      <div class="c-typing-indicator__avatar">
        <img src="${conversation.userAvatar}" alt="" onerror="this.src='imagenes/perfile/images%20(1).png'">
      </div>
      <div class="c-typing-indicator__bubble">
        <div class="c-typing-indicator__dot"></div>
        <div class="c-typing-indicator__dot"></div>
        <div class="c-typing-indicator__dot"></div>
      </div>
    </div>
  `;
  
  messagesArea.insertAdjacentHTML('beforeend', typingHtml);
  messagesArea.scrollTop = messagesArea.scrollHeight;
}

/**
 * Ocultar indicador de escritura
 */
function hideTypingIndicator() {
  const indicator = document.getElementById('typingIndicator');
  if (indicator) {
    indicator.remove();
  }
}

/**
 * Simular mensajes entrantes periódicamente
 */
function simulateIncomingMessages() {
  // Cada 30 segundos, simular un mensaje aleatorio
  setInterval(() => {
    const randomConv = state.conversations[Math.floor(Math.random() * state.conversations.length)];
    if (randomConv && Math.random() > 0.7) { // 30% de probabilidad
      simulateResponse(randomConv.id);
    }
  }, 30000);
}

/**
 * Actualizar badge de notificaciones
 */
function updateNotificationBadge() {
  const totalUnread = state.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
  const badge = document.getElementById('navMessageBadge');
  
  if (totalUnread > 0) {
    badge.textContent = totalUnread > 99 ? '99+' : totalUnread;
    badge.classList.remove('u-hidden');
  } else {
    badge.classList.add('u-hidden');
  }
}

/**
 * Reproducir sonido de notificación
 */
function playNotificationSound() {
  // En una implementación real, aquí se reproduciría un sonido
  // const audio = new Audio('/sounds/notification.mp3');
  // audio.play().catch(() => {}); // Silenciar errores si el usuario no ha interactuado
}

/**
 * Guardar en localStorage
 */
function saveToLocalStorage() {
  localStorage.setItem('servilocal_conversations', JSON.stringify(state.conversations));
  localStorage.setItem('servilocal_messages', JSON.stringify(state.messages));
}

/**
 * Formatear tiempo relativo
 */
function formatTime(date) {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}

/**
 * Formatear hora del mensaje
 */
function formatMessageTime(date) {
  return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formatear clave de fecha
 */
function formatDateKey(date) {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === now.toDateString()) {
    return 'Hoy';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Ayer';
  } else {
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}

/**
 * Obtener ícono de estado
 */
function getStatusIcon(status) {
  switch (status) {
    case 'sent':
      return '<i class="fas fa-check"></i> Enviado';
    case 'delivered':
      return '<i class="fas fa-check-double"></i> Entregado';
    case 'read':
      return '<i class="fas fa-check-double" style="color: var(--color-primary-600);"></i> Leído';
    default:
      return '';
  }
}

/**
 * Escapar HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Función para iniciar una nueva conversación (llamar desde otras páginas)
 */
function startNewConversation(userId, userName, userAvatar) {
  // Verificar si ya existe una conversación
  let conversation = state.conversations.find(c => c.userId === userId);
  
  if (!conversation) {
    // Crear nueva conversación
    conversation = {
      id: `conv-${Date.now()}`,
      userId: userId,
      userName: userName,
      userAvatar: userAvatar,
      lastMessage: 'Nueva conversación',
      lastMessageTime: new Date(),
      unreadCount: 0,
      isOnline: false
    };
    
    state.conversations.unshift(conversation);
    state.messages[conversation.id] = [];
    saveToLocalStorage();
  }
  
  // Redirigir a la página de mensajes
  window.location.href = `mensajes.html?conv=${conversation.id}`;
}

// Exportar funciones para uso global
window.startNewConversation = startNewConversation;

// Manejar parámetro de URL para abrir conversación directamente
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const convId = urlParams.get('conv');
  if (convId) {
    setTimeout(() => openConversation(convId), 500);
  }
});
