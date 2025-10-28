#!/bin/bash
# Script para probar la conexión a MongoDB y arrancar el backend

echo "=================================================="
echo "🚀 ServiLocal Backend - Verificación Completa"
echo "=================================================="
echo ""

# Verificar Node.js
echo "1️⃣  Verificando Node.js..."
if command -v node &> /dev/null; then
    echo "✅ Node.js instalado: $(node --version)"
else
    echo "❌ Node.js no encontrado"
    exit 1
fi

# Verificar npm
echo ""
echo "2️⃣  Verificando npm..."
if command -v npm &> /dev/null; then
    echo "✅ npm instalado: $(npm --version)"
else
    echo "❌ npm no encontrado"
    exit 1
fi

# Verificar dependencias
echo ""
echo "3️⃣  Verificando dependencias..."
if [ -d "node_modules" ]; then
    echo "✅ Dependencias instaladas"
else
    echo "⚠️  Instalando dependencias..."
    npm install --no-audit --no-fund
fi

# Verificar archivo .env
echo ""
echo "4️⃣  Verificando configuración (.env)..."
if [ -f ".env" ]; then
    echo "✅ Archivo .env existe"
    echo ""
    echo "📋 Configuración actual:"
    echo "   - PORT: $(grep "^PORT=" .env | cut -d'=' -f2)"
    echo "   - NODE_ENV: $(grep "^NODE_ENV=" .env | cut -d'=' -f2)"
    echo "   - MONGODB_URI: $(grep "^MONGODB_URI=" .env | cut -d'=' -f2 | sed 's/:.@/ :****@/g' | head -c 50)..."
    echo "   - JWT_SECRET: $(grep "^JWT_SECRET=" .env | cut -d'=' -f2 | head -c 10)..."
else
    echo "❌ Archivo .env no encontrado"
    echo "   Copia .env.example a .env y configúralo"
    exit 1
fi

# Probar conexión a MongoDB
echo ""
echo "5️⃣  Probando conexión a MongoDB..."
npm run check:db

if [ $? -eq 0 ]; then
    echo ""
    echo "=================================================="
    echo "✅ ¡Todo listo! Iniciando servidor..."
    echo "=================================================="
    echo ""
    npm run dev
else
    echo ""
    echo "=================================================="
    echo "❌ Error de conexión a MongoDB"
    echo "=================================================="
    echo ""
    echo "💡 Soluciones:"
    echo "   1. Verifica tu MONGODB_URI en el archivo .env"
    echo "   2. Si usas Atlas, verifica:"
    echo "      - Usuario y contraseña correctos"
    echo "      - Tu IP está en la whitelist"
    echo "   3. Si es local, verifica que MongoDB esté corriendo:"
    echo "      sudo systemctl start mongod"
    echo ""
    exit 1
fi
