/**
 * Rutas de Mensajes
 */

const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');

/**
 * GET /api/messages/:conversationId
 * Obtener mensajes de una conversación
 */
router.get('/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    
    // Verificar que el usuario pertenece a la conversación
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.userId
    });
    
    if (!conversation) {
      return res.status(404).json({ 
        error: 'Conversación no encontrada' 
      });
    }
    
    // Obtener mensajes
    const messages = await Message.getConversationMessages(conversationId, page, limit);
    
    // Contar total
    const total = await Message.countDocuments({ conversationId });
    
    res.json({
      messages: messages.reverse(), // Ordenar de más antiguo a más nuevo
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    res.status(500).json({ 
      error: 'Error al obtener mensajes' 
    });
  }
});

/**
 * POST /api/messages
 * Enviar mensaje
 */
router.post('/', async (req, res) => {
  try {
    const { conversationId, text, recipientId } = req.body;
    
    if (!conversationId || !text) {
      return res.status(400).json({ 
        error: 'conversationId y text son requeridos' 
      });
    }
    
    // Verificar que el usuario pertenece a la conversación
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.userId
    });
    
    if (!conversation) {
      return res.status(404).json({ 
        error: 'Conversación no encontrada' 
      });
    }
    
    // Crear mensaje
    const message = await Message.create({
      conversationId,
      senderId: req.userId,
      text,
      timestamp: new Date()
    });
    
    // Actualizar conversación
    conversation.lastMessage = {
      text,
      senderId: req.userId,
      timestamp: message.timestamp
    };
    
    // Incrementar contador de no leídos para el otro usuario
    if (recipientId) {
      const currentUnread = conversation.unreadCount.get(recipientId) || 0;
      conversation.unreadCount.set(recipientId, currentUnread + 1);
    }
    
    conversation.updatedAt = new Date();
    await conversation.save();
    
    // Poblar información del remitente
    await message.populate('senderId', 'userName avatar');
    
    res.status(201).json(message);
    
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    res.status(500).json({ 
      error: 'Error al enviar mensaje' 
    });
  }
});

/**
 * PATCH /api/messages/:conversationId/read
 * Marcar mensajes como leídos
 */
router.patch('/:conversationId/read', async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    // Verificar conversación
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.userId
    });
    
    if (!conversation) {
      return res.status(404).json({ 
        error: 'Conversación no encontrada' 
      });
    }
    
    // Marcar mensajes como leídos
    await Message.markAsRead(conversationId, req.userId);
    
    // Resetear contador
    conversation.unreadCount.set(req.userId.toString(), 0);
    await conversation.save();
    
    res.json({ message: 'Mensajes marcados como leídos' });
    
  } catch (error) {
    console.error('Error marcando mensajes como leídos:', error);
    res.status(500).json({ 
      error: 'Error al marcar mensajes como leídos' 
    });
  }
});

/**
 * DELETE /api/messages/:id
 * Eliminar mensaje
 */
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      senderId: req.userId
    });
    
    if (!message) {
      return res.status(404).json({ 
        error: 'Mensaje no encontrado' 
      });
    }
    
    // Agregar usuario a deletedFor en lugar de eliminar
    if (!message.deletedFor.includes(req.userId)) {
      message.deletedFor.push(req.userId);
      await message.save();
    }
    
    res.json({ message: 'Mensaje eliminado' });
    
  } catch (error) {
    console.error('Error eliminando mensaje:', error);
    res.status(500).json({ 
      error: 'Error al eliminar mensaje' 
    });
  }
});

module.exports = router;
