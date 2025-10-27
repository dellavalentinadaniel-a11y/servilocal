/**
 * Rutas de Conversaciones
 */

const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const User = require('../models/User');

/**
 * GET /api/conversations
 * Obtener todas las conversaciones del usuario
 */
router.get('/', async (req, res) => {
  try {
    const conversations = await Conversation.getUserConversations(req.userId);
    
    // Formatear respuesta
    const formattedConversations = conversations.map(conv => {
      const otherParticipant = conv.participants.find(
        p => p._id.toString() !== req.userId.toString()
      );
      
      return {
        id: conv._id,
        userId: otherParticipant._id,
        userName: otherParticipant.userName,
        userAvatar: otherParticipant.avatar,
        isOnline: otherParticipant.isOnline,
        lastSeen: otherParticipant.lastSeen,
        lastMessage: conv.lastMessage?.text || '',
        lastMessageTime: conv.lastMessage?.timestamp || conv.createdAt,
        unreadCount: conv.unreadCount?.get(req.userId.toString()) || 0,
        updatedAt: conv.updatedAt
      };
    });
    
    res.json(formattedConversations);
    
  } catch (error) {
    console.error('Error obteniendo conversaciones:', error);
    res.status(500).json({ 
      error: 'Error al obtener conversaciones' 
    });
  }
});

/**
 * POST /api/conversations
 * Crear o obtener conversación con otro usuario
 */
router.post('/', async (req, res) => {
  try {
    const { userId: otherUserId } = req.body;
    
    if (!otherUserId) {
      return res.status(400).json({ 
        error: 'userId es requerido' 
      });
    }
    
    // Verificar que el otro usuario existe
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    // Encontrar o crear conversación
    const conversation = await Conversation.findOrCreate(req.userId, otherUserId);
    
    // Poblar participantes
    await conversation.populate('participants', 'userName avatar isOnline lastSeen');
    
    const otherParticipant = conversation.participants.find(
      p => p._id.toString() !== req.userId.toString()
    );
    
    res.status(201).json({
      id: conversation._id,
      userId: otherParticipant._id,
      userName: otherParticipant.userName,
      userAvatar: otherParticipant.avatar,
      isOnline: otherParticipant.isOnline,
      lastMessage: conversation.lastMessage?.text || 'Nueva conversación',
      lastMessageTime: conversation.lastMessage?.timestamp || conversation.createdAt,
      unreadCount: 0
    });
    
  } catch (error) {
    console.error('Error creando conversación:', error);
    res.status(500).json({ 
      error: 'Error al crear conversación' 
    });
  }
});

/**
 * DELETE /api/conversations/:id
 * Eliminar conversación
 */
router.delete('/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.userId
    });
    
    if (!conversation) {
      return res.status(404).json({ 
        error: 'Conversación no encontrada' 
      });
    }
    
    await conversation.deleteOne();
    
    res.json({ message: 'Conversación eliminada' });
    
  } catch (error) {
    console.error('Error eliminando conversación:', error);
    res.status(500).json({ 
      error: 'Error al eliminar conversación' 
    });
  }
});

module.exports = router;
