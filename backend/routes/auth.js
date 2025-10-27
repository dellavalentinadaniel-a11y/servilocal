/**
 * Rutas de Autenticación
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, userName } = req.body;
    
    // Validar datos
    if (!email || !password || !userName) {
      return res.status(400).json({ 
        error: 'Todos los campos son requeridos' 
      });
    }
    
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'El email ya está registrado' 
      });
    }
    
    // Crear usuario
    const user = await User.create({
      email,
      password,
      userName
    });
    
    // Generar token
    const token = generateToken(user);
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: user.toPublic()
    });
    
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error al registrar usuario' 
    });
  }
});

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y contraseña son requeridos' 
      });
    }
    
    // Buscar usuario (incluir password)
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }
    
    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }
    
    // Actualizar estado en línea
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();
    
    // Generar token
    const token = generateToken(user);
    
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: user.toPublic()
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error al iniciar sesión' 
    });
  }
});

/**
 * POST /api/auth/logout
 * Cerrar sesión
 */
router.post('/logout', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date()
      });
    }
    
    res.json({ message: 'Sesión cerrada exitosamente' });
    
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ 
      error: 'Error al cerrar sesión' 
    });
  }
});

module.exports = router;
