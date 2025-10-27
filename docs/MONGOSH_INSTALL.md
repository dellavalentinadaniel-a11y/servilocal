# Instalación de MongoDB Shell (mongosh) en Fedora

## Opción 1: Instalación directa con DNF (recomendado)

```bash
# Agregar el repositorio oficial de MongoDB
sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo <<EOF
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/9/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-7.0.asc
EOF

# Instalar mongosh
sudo dnf install -y mongodb-mongosh

# Verificar instalación
mongosh --version
```

## Opción 2: Instalación manual (alternativa)

```bash
# Descargar mongosh
cd ~/Descargas
wget https://downloads.mongodb.com/compass/mongosh-2.1.5-linux-x64.tgz

# Extraer
tar -zxvf mongosh-2.1.5-linux-x64.tgz

# Mover a directorio del sistema
sudo mv mongosh-2.1.5-linux-x64/bin/mongosh /usr/local/bin/
sudo mv mongosh-2.1.5-linux-x64/bin/mongosh_crypt_v1.so /usr/local/lib/

# Verificar
mongosh --version
```

## Opción 3: Usar MongoDB Compass (ya lo tienes instalado)

Compass incluye una shell integrada. Una vez conectado, ve a:
- Pestaña ">_ MongoSH" en la parte inferior

## Conectar a Atlas

### Paso 1: Agregar tu IP en Atlas
Tu IP pública actual es: **201.254.149.185**

1. Entra a [MongoDB Atlas](https://cloud.mongodb.com)
2. Security > Network Access
3. "Add IP Address"
4. Ingresa: `201.254.149.185` (o "Add My Current IP" si aparece)
5. Confirma y espera 1-2 minutos

### Paso 2: Obtener connection string

En tu clúster de Atlas:
1. Botón "Connect"
2. "Connect with MongoDB Shell"
3. Copia el string que se ve así:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>
   ```

### Paso 3: Conectar desde terminal

Reemplaza los valores entre `<>`:
- `<username>`: tu usuario de base de datos (no tu email de Atlas)
- `<password>`: la contraseña que te pedí cambiar
- `<dbname>`: nombre de la base (ej: `mensajeria`, `test`, o déjalo vacío para conectar sin DB específico)

```bash
mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/" --username TU_USUARIO
# Te pedirá la contraseña de forma segura (no se verá al escribir)
```

O todo en una línea (cuidado con el historial):
```bash
mongosh "mongodb+srv://TU_USUARIO:TU_CONTRASEÑA@cluster0.xxxxx.mongodb.net/mensajeria?retryWrites=true&w=majority"
```

### Errores comunes y soluciones

#### Error: "MongoServerError: bad auth"
- Usuario o contraseña incorrectos
- Verifica en Atlas > Security > Database Access que el usuario existe
- Cambia la contraseña y usa la nueva

#### Error: "IP address is not allowed"
- Tu IP no está en la allowlist
- Espera 1-2 minutos después de agregarla
- Verifica que agregaste `201.254.149.185` exactamente

#### Error: "getaddrinfo ENOTFOUND"
- Problema de DNS o firewall
- Prueba con otra red (ej: hotspot de celular)
- Verifica que no haya proxy corporativo bloqueando

#### Error: "command not found: mongosh"
- No está instalado o no está en el PATH
- Ejecuta `sudo dnf install -y mongodb-mongosh` o usa Compass

## Probar la conexión

Una vez conectado, verás un prompt como:
```
Current Mongosh Log ID: 65abc...
Connecting to: mongodb+srv://<host>
Using MongoDB: 7.0.5
Using Mongosh: 2.1.5

Atlas atlas-xyz-shard-0 [primary] test>
```

Comandos básicos para probar:
```javascript
// Ver bases de datos
show dbs

// Usar/crear una base
use mensajeria

// Insertar un documento de prueba
db.test.insertOne({ mensaje: "Hola desde mongosh!" })

// Consultar
db.test.find()

// Salir
exit
```

## Siguiente paso: Configurar tu app

Una vez que mongosh conecte correctamente, usa el mismo connection string en tu aplicación:

```bash
# En tu proyecto backend
cd backend
nano .env
```

Agrega:
```env
MONGODB_URI=mongodb+srv://TU_USUARIO:TU_CONTRASEÑA@cluster0.xxxxx.mongodb.net/mensajeria?retryWrites=true&w=majority
```

Guarda y arranca el servidor:
```bash
npm install
npm run dev
```
