const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * GET /api/users/me
 * Obtener perfil del usuario autenticado
 */
router.get('/me', async (req, res) => {
  try {
    // req.user viene desde el middleware authenticate
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user.toPublic());
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
});

/**
 * PATCH /api/users/me
 * Actualizar perfil del usuario autenticado
 */
router.patch('/me', async (req, res) => {
  try {
    const allowed = ['userName', 'avatar', 'phone', 'location', 'about', 'accountType', 'settings', 'gallery', 'social'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    // Normalizaciones básicas
    if (typeof updates.email !== 'undefined') delete updates.email; // no permitir cambio de email aquí
    if (typeof updates.userName === 'string') updates.userName = updates.userName.trim();
    if (typeof updates.location === 'string') updates.location = updates.location.trim();
    if (typeof updates.phone === 'string') updates.phone = updates.phone.trim();

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user.toPublic());
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
});

module.exports = router;