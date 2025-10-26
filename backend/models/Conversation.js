/**
 * Modelo de Conversación
 */

const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    text: String,
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: Date
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índice para búsqueda rápida
conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

// Método para obtener conversaciones de un usuario
conversationSchema.statics.getUserConversations = async function(userId) {
  return this.find({ 
    participants: userId 
  })
  .populate('participants', 'userName avatar isOnline lastSeen')
  .sort({ updatedAt: -1 });
};

// Método para encontrar o crear conversación entre dos usuarios
conversationSchema.statics.findOrCreate = async function(userId1, userId2) {
  let conversation = await this.findOne({
    participants: { $all: [userId1, userId2] }
  });
  
  if (!conversation) {
    conversation = await this.create({
      participants: [userId1, userId2],
      lastMessage: {
        text: 'Nueva conversación',
        timestamp: new Date()
      }
    });
  }
  
  return conversation;
};

module.exports = mongoose.model('Conversation', conversationSchema);
