# 🚀 Guía Rápida: MongoDB Atlas (Cloud)

## Paso 1: Crear Cuenta (5 minutos)

1. Ve a: **[mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)**

2. Regístrate con:
   - Email y contraseña, o
   - Cuenta de Google/GitHub

3. Completa el formulario inicial:
   - Nombre
   - Empresa (puedes poner "Personal" o "ServiLocal")
   - Objetivo: "Learning MongoDB"

---

## Paso 2: Crear Cluster Gratis (2 minutos)

1. Selecciona el plan **"FREE"** (M0 Sandbox)
   - 512 MB de almacenamiento
   - Compartido
   - **$0 USD/mes** 💰

2. Elige proveedor y región:
   - **Provider**: AWS (recomendado)
   - **Region**: Elegir la más cercana:
     - 🇧🇷 São Paulo (Brazil)
     - 🇺🇸 N. Virginia (USA)
   - Nombre del cluster: `ServiLocal` (o dejar por defecto)

3. Click en **"Create Deployment"**
   - Espera 3-5 minutos mientras se crea

---

## Paso 3: Configurar Acceso (3 minutos)

### A) Crear Usuario de Base de Datos

1. Te pedirá crear un usuario:

   ```text
   Username: admin_servilocal
   Password: [Generar contraseña segura]
   ```

2. **¡IMPORTANTE!** 🔴 Copia y guarda la contraseña en un lugar seguro
   - La necesitarás para conectarte
   - Ejemplo: `P@ssw0rd123!XyZ`

3. Click en **"Create Database User"**

### B) Configurar IP de Acceso

1. Te preguntará desde dónde te conectarás
2. Selecciona: **"My Local Environment"**
3. Click en **"Add My Current IP Address"**
   - Esto permite conexiones desde tu PC

4. **Para desarrollo**, puedes permitir todas las IPs:
   - IP Address: `0.0.0.0/0`
   - Description: `Permitir desde cualquier lugar`
   - ⚠️ Nota: En producción, limita esto

5. Click en **"Finish and Close"**

---

## Paso 4: Obtener Connection String (2 minutos)

1. En el dashboard, click en **"Connect"**

2. Selecciona: **"Connect your application"**

3. Configuración:
   - Driver: **Node.js**
   - Version: **5.5 or later**

4. Copia el connection string:
   ```text
   mongodb+srv://admin_servilocal:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Reemplaza `<password>`** con tu contraseña real:
   ```text
   mongodb+srv://admin_servilocal:P@ssw0rd123!XyZ@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Paso 5: Configurar en tu Backend (1 minuto)

1. Abre el archivo `.env` en la carpeta `backend/`

2. Pega tu connection string:

   ```env
   MONGODB_URI=mongodb+srv://admin_servilocal:TU_PASSWORD@cluster0.xxxxx.mongodb.net/servilocal?retryWrites=true&w=majority
   ```

3. **Nota:** Agrega `/servilocal` antes de `?retryWrites` para especificar la base de datos

---

## Paso 6: Probar Conexión

```bash
cd backend
npm install
npm run dev
```

Deberías ver:

```text
✅ Conectado a MongoDB
🚀 ServiLocal Backend Server
   Servidor:  http://localhost:3000
```

---

## 🎉 ¡Listo! Ya tienes MongoDB en la nube

### 📊 Explorar tus datos

1. En MongoDB Atlas, click en **"Browse Collections"**
2. Verás las colecciones:
   - `users`
   - `conversations`
   - `messages`

### 🔍 Ver datos en tiempo real

- Click en cualquier colección
- Verás los documentos JSON
- Puedes buscar, filtrar, editar

---

## 💡 Tips

### Crear más usuarios

1. Database Access (menú izquierdo)
2. Add New Database User

### Permitir más IPs

1. Network Access (menú izquierdo)
2. Add IP Address

### Monitorear uso

1. Dashboard → Metrics
2. Verás: Conexiones, Operaciones, Almacenamiento

### Backups gratuitos

- Atlas hace backups automáticos
- Puedes descargarlos cuando quieras

---

## ⚠️ Límites del Plan Gratuito

| Recurso | Límite |
|---------|--------|
| Almacenamiento | 512 MB |
| RAM | Compartida |
| Conexiones simultáneas | 500 |
| Transferencia de red | Sin límite* |

*Suficiente para miles de usuarios activos

---

## 🆙 ¿Cuándo actualizar a plan pagado?

Solo si:

- Superas 512 MB de datos (~100,000 mensajes)
- Necesitas backups avanzados
- Quieres mejor rendimiento

Plan básico: ~$9 USD/mes (1 GB)

---

## 🐛 Problemas Comunes

### "MongoNetworkError"

- Verifica que tu IP esté permitida
- Agrega `0.0.0.0/0` en Network Access

### "Authentication failed"

- Verifica usuario y contraseña
- Recuerda escapar caracteres especiales en la URL

### "Cannot connect"

- Verifica que el connection string sea correcto
- Asegúrate de tener internet

---

## 📱 App Móvil (Opcional)

MongoDB tiene app para iOS/Android:

- Ver datos en tu teléfono
- Monitorear rendimiento
- Alertas push

---

¡Con MongoDB Atlas tienes una base de datos profesional lista en 10 minutos! 🚀
