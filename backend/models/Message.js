/**
 * Modelo de Mensaje
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'El mensaje no puede estar vacío'],
    maxlength: [5000, 'El mensaje es demasiado largo']
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent'
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'file', 'audio', 'location']
    },
    url: String,
    filename: String,
    size: Number
  }],
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  deletedFor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Índices para búsqueda eficiente
messageSchema.index({ conversationId: 1, timestamp: -1 });
messageSchema.index({ senderId: 1 });

// Método para obtener mensajes de una conversación con paginación
messageSchema.statics.getConversationMessages = async function(conversationId, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  return this.find({ conversationId })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate('senderId', 'userName avatar')
    .lean();
};

// Método para marcar mensajes como leídos
messageSchema.statics.markAsRead = async function(conversationId, userId) {
  return this.updateMany(
    {
      conversationId,
      senderId: { $ne: userId },
      status: { $ne: 'read' }
    },
    {
      $set: { status: 'read' }
    }
  );
};

module.exports = mongoose.model('Message', messageSchema);
