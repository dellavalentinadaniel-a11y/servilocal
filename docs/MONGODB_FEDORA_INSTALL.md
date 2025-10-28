# 🐧 Instalar MongoDB en Fedora Linux (Local)

## ⚠️ Nota Importante

MongoDB cambió su licencia y ya no está en los repositorios oficiales de Fedora.
Tienes 3 opciones:

---

## 🎯 Opción A: MongoDB Community Edition (Recomendado)

### Paso 1: Agregar Repositorio de MongoDB

```bash
# Crear archivo de repositorio
sudo nano /etc/yum.repos.d/mongodb-org-7.0.repo
```

Pega este contenido:

```ini
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
```

Guarda y cierra (Ctrl+O, Enter, Ctrl+X)

### Paso 2: Instalar MongoDB

```bash
# Actualizar caché de repositorios
sudo dnf makecache

# Instalar MongoDB
sudo dnf install -y mongodb-org
```

### Paso 3: Iniciar MongoDB

```bash
# Iniciar el servicio
sudo systemctl start mongod

# Habilitar inicio automático
sudo systemctl enable mongod

# Verificar estado
sudo systemctl status mongod
```

Deberías ver:
```
● mongod.service - MongoDB Database Server
   Active: active (running)
```

### Paso 4: Verificar Instalación

```bash
# Conectar a MongoDB
mongosh

# Deberías ver:
# Current Mongosh Log ID:	...
# Connecting to:		mongodb://127.0.0.1:27017
# Using MongoDB:		7.0.x
```

Comandos de prueba en mongosh:
```javascript
// Ver bases de datos
show dbs

// Crear base de datos de prueba
use servilocal

// Insertar documento
db.test.insertOne({ mensaje: "Hola MongoDB!" })

// Ver documento
db.test.find()

// Salir
exit
```

### Paso 5: Configurar para el Backend

En `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/servilocal
```

---

## 🎯 Opción B: Docker (Más Fácil, Sin Instalar MongoDB)

Si tienes Docker instalado:

### Paso 1: Instalar Docker (si no lo tienes)

```bash
# Instalar Docker
sudo dnf install docker

# Iniciar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Agregar tu usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar:
newgrp docker
```

### Paso 2: Ejecutar MongoDB en Docker

```bash
# Descargar y ejecutar MongoDB
docker run -d \
  --name mongodb-servilocal \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -v mongodb_data:/data/db \
  mongo:latest
```

### Paso 3: Verificar

```bash
# Ver logs
docker logs mongodb-servilocal

# Conectar
docker exec -it mongodb-servilocal mongosh
```

### Paso 4: Configurar Backend

En `backend/.env`:
```env
MONGODB_URI=mongodb://admin:password123@localhost:27017/servilocal?authSource=admin
```

### Comandos útiles Docker:

```bash
# Detener MongoDB
docker stop mongodb-servilocal

# Iniciar MongoDB
docker start mongodb-servilocal

# Ver contenedores
docker ps

# Eliminar contenedor
docker rm -f mongodb-servilocal
```

---

## 🎯 Opción C: Podman (Alternativa a Docker en Fedora)

Fedora viene con Podman pre-instalado:

```bash
# Ejecutar MongoDB con Podman
podman run -d \
  --name mongodb-servilocal \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -v mongodb_data:/data/db:Z \
  mongo:latest

# Verificar
podman ps

# Logs
podman logs mongodb-servilocal

# Conectar
podman exec -it mongodb-servilocal mongosh
```

---

## 🔧 Configuración Post-Instalación

### Crear Usuario para la Aplicación

```bash
# Conectar a MongoDB
mongosh

# O si usas autenticación:
mongosh -u admin -p password123 --authenticationDatabase admin
```

En mongosh:
```javascript
// Cambiar a base de datos servilocal
use servilocal

// Crear usuario
db.createUser({
  user: "servilocal_user",
  pwd: "tu_password_segura",
  roles: [
    { role: "readWrite", db: "servilocal" }
  ]
})
```

### Configurar en Backend

```env
MONGODB_URI=mongodb://servilocal_user:tu_password_segura@localhost:27017/servilocal
```

---

## 🛠️ Herramientas Útiles

### 1. MongoDB Compass (GUI Visual)

```bash
# Descargar desde:
# https://www.mongodb.com/try/download/compass

# O instalar con snap:
sudo snap install mongodb-compass
```

### 2. mongosh (Shell Interactivo)

Ya viene incluido con MongoDB Community Edition.

### 3. Studio 3T (GUI Avanzado - Gratis para uso no comercial)

```bash
# Descargar desde:
# https://studio3t.com/download/
```

---

## 📊 Comandos Útiles

### Gestión del Servicio

```bash
# Ver estado
sudo systemctl status mongod

# Iniciar
sudo systemctl start mongod

# Detener
sudo systemctl stop mongod

# Reiniciar
sudo systemctl restart mongod

# Ver logs
sudo journalctl -u mongod -f

# Ver logs completos
sudo tail -f /var/log/mongodb/mongod.log
```

### Información del Sistema

```bash
# Versión de MongoDB
mongod --version

# Configuración actual
cat /etc/mongod.conf

# Ubicación de datos
ls -lh /var/lib/mongo/

# Espacio usado
du -sh /var/lib/mongo/
```

---

## 🔐 Habilitar Autenticación (Recomendado para Producción)

### Paso 1: Editar Configuración

```bash
sudo nano /etc/mongod.conf
```

Busca la sección `security` y descomenta:

```yaml
security:
  authorization: enabled
```

### Paso 2: Crear Usuario Administrador

```bash
# Conectar sin autenticación
mongosh

# Cambiar a admin
use admin

# Crear admin
db.createUser({
  user: "admin",
  pwd: "password_super_segura",
  roles: [ { role: "root", db: "admin" } ]
})

# Salir
exit
```

### Paso 3: Reiniciar MongoDB

```bash
sudo systemctl restart mongod
```

### Paso 4: Conectar con Autenticación

```bash
mongosh -u admin -p password_super_segura --authenticationDatabase admin
```

---

## 🚨 Problemas Comunes

### Error: "Failed to start mongod.service"

```bash
# Ver error específico
sudo journalctl -xeu mongod.service

# Posible solución: Permisos
sudo chown -R mongod:mongod /var/lib/mongo
sudo chown mongod:mongod /tmp/mongodb-27017.sock

# Reintentar
sudo systemctl start mongod
```

### Error: "Address already in use"

```bash
# Ver qué está usando el puerto 27017
sudo lsof -i :27017

# O
sudo netstat -tlnp | grep 27017

# Detener proceso
sudo kill -9 [PID]
```

### Error: "Permission denied"

```bash
# Arreglar permisos
sudo chown -R mongod:mongod /var/lib/mongo
sudo chown -R mongod:mongod /var/log/mongodb

# Verificar SELinux (en Fedora)
sudo setenforce 0  # Temporal, solo para probar

# Permanente: Configurar políticas de SELinux
sudo setsebool -P httpd_can_network_connect 1
```

---

## 📊 Backup y Restore

### Hacer Backup

```bash
# Backup de toda la base de datos
mongodump --uri="mongodb://localhost:27017/servilocal" --out=/backup/mongodb

# Backup comprimido
mongodump --uri="mongodb://localhost:27017/servilocal" --archive=/backup/servilocal.gz --gzip
```

### Restaurar Backup

```bash
# Restore desde directorio
mongorestore --uri="mongodb://localhost:27017" /backup/mongodb

# Restore desde archivo comprimido
mongorestore --uri="mongodb://localhost:27017" --archive=/backup/servilocal.gz --gzip
```

---

## 🎯 Resumen de Comandos Rápidos

```bash
# Instalación
sudo dnf install mongodb-org

# Gestión
sudo systemctl start mongod
sudo systemctl stop mongod
sudo systemctl status mongod

# Conectar
mongosh

# Con autenticación
mongosh -u admin -p password --authenticationDatabase admin

# Ver logs
sudo journalctl -u mongod -f

# Backup
mongodump --uri="mongodb://localhost:27017/servilocal" --out=/backup
```

---

## 💡 Recomendación Final

Para **desarrollo y aprendizaje**:
- ✅ **MongoDB Atlas** (cloud) - Más fácil, sin instalar nada
- ✅ **Docker/Podman** - Limpio, fácil de eliminar

Para **producción local**:
- ✅ **MongoDB Community Edition** - Control total

---

**¿Necesitas ayuda con algún paso específico? ¡Pregúntame! 🚀**
