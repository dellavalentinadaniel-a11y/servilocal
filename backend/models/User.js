/**
 * Modelo de Usuario
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false // No incluir en queries por defecto
  },
  userName: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  avatar: {
    type: String,
    default: 'imagenes/perfile/images%20(1).png'
  },
  // Campos de perfil extendidos
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  about: {
    type: String,
    trim: true,
    default: ''
  },
  accountType: {
    type: String,
    enum: ['cliente', 'proveedor'],
    default: 'cliente'
  },
  settings: {
    notifyByEmail: { type: Boolean, default: true },
    showApproxLocation: { type: Boolean, default: true },
    allowDirectContact: { type: String, enum: ['nadie', 'clientes', 'verificados'], default: 'verificados' }
  },
  gallery: [{ type: String, trim: true }],
  social: {
    website: { type: String, trim: true, default: '' },
    twitter: { type: String, trim: true, default: '' },
    instagram: { type: String, trim: true, default: '' }
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener datos públicos del usuario
userSchema.methods.toPublic = function() {
  return {
    id: this._id,
    email: this.email,
    userName: this.userName,
    avatar: this.avatar,
    phone: this.phone,
    location: this.location,
    about: this.about,
    accountType: this.accountType,
    settings: this.settings,
    gallery: this.gallery,
    social: this.social,
    isOnline: this.isOnline,
    lastSeen: this.lastSeen
  };
};

module.exports = mongoose.model('User', userSchema);
