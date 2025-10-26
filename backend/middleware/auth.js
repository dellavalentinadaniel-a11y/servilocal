/**
 * Middleware de Autenticación JWT
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verificar token JWT y autenticar usuario
 */
const authenticate = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Token no proporcionado' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    // Agregar usuario a la request
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    
    res.status(500).json({ error: 'Error de autenticación' });
  }
};

/**
 * Generar token JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id,
      userName: user.userName,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = { authenticate, generateToken };
