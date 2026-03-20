# Setup Guide - Gigger

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- SQLite (dev) o PostgreSQL (prod)
- Discord Server (para testing)
- Discord Bot Token (para integración)
- Email SMTP (Arsys o similar)

---

## 🚀 Instalación Inicial

### 1. Clonar repositorio y instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configurar variables de entorno

**Backend** (`backend/.env`):
```env
# Database
DATABASE_URL=file:./data/data.db

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Discord
DISCORD_BOT_TOKEN=your-discord-bot-token
DISCORD_GUILD_ID=your-discord-server-id

# Email (Arsys)
EMAIL_HOST=smtp.arsys.com
EMAIL_PORT=465
EMAIL_USERNAME=your-email@domain.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@gigger.com
EMAIL_REPLY_TO=support@gigger.com

# Admin
ADMIN_JWT_SECRET=your-admin-secret-key
API_TOKEN_SALT=your-api-token-salt

# Node
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:1337/api
```

### 3. Crear usuario admin inicial

```bash
cd backend
npm run build
npm run develop

# En otra terminal, cuando Strapi esté listo:
# Accede a http://localhost:1337/admin
# Crea usuario admin
```

### 4. Crear usuario de test

Desde admin panel de Strapi:
1. Plugins → Users & Permissions
2. Roles → Public → Desactivar permisos
3. Roles → Authenticated → Activar:
   - Events (read, create, update, delete)
   - Profile (create, read, update)
   - Discord (read, create)
4. Users → Crear usuario:
   - Email: `test@gigger.com`
   - Username: `testuser`
   - Password: `TestPassword123`
   - Rol: `Authenticated`
   - Avatar: Se asigna automáticamente

### 5. Ejecutar frontend en desarrollo

```bash
cd frontend
npm run dev
# Accede a http://localhost:5173
```

---

## 🔐 Discord Bot Setup

### 1. Crear Discord Bot

1. Ir a [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Nombre: "Gigger"
4. Tab "Bot" → "Add Bot"
5. Copy token → Pegar en `DISCORD_BOT_TOKEN`

### 2. Activar Intents Necesarios

En Developer Portal, en tu bot:
- Settings → Bot → Privileged Gateway Intents
  - ✅ Message Content Intent
  - ✅ Server Members Intent (si es necesario)

### 3. Obtener Guild ID

```bash
# En Discord, activar Developer Mode
# (User Settings → App Settings → Advanced → Developer Mode)

# Click derecho en servidor → Copy Server ID
# Pegar en DISCORD_GUILD_ID
```

### 4. Invitar Bot al Servidor

En Developer Portal:
1. OAuth2 → URL Generator
2. Scopes: `bot`
3. Permissions:
   - ✅ Send Messages
   - ✅ Read Message History
   - ✅ Manage Channels
   - ✅ Manage Webhooks
4. Copy generated URL y abrir en navegador
5. Seleccionar servidor → Autorizar

---

## 📧 Email Setup (Arsys)

### 1. Configurar cuenta SMTP en Arsys

1. Acceder a panel de Arsys
2. Email → Cuentas de correo
3. Seleccionar correo
4. Activar SMTP:
   - Host: `smtp.arsys.com`
   - Puerto: `465`
   - Seguridad: `SSL/TLS`
5. Crear contraseña de aplicación (app-specific password)

### 2. Actualizar .env

```env
EMAIL_HOST=smtp.arsys.com
EMAIL_PORT=465
EMAIL_USERNAME=tu-email@tudominio.com
EMAIL_PASSWORD=tu-app-specific-password
EMAIL_FROM=noreply@tudominio.com
EMAIL_REPLY_TO=support@tudominio.com
```

### 3. Testear envío

```bash
# Desde frontend, ejecutar:
const { mutate } = useSendEmail();
mutate({
  email: 'tu-email@example.com',
  subject: 'Test',
  html: '<h1>Test</h1>'
});

# Verificar que email se recibe
```

---

## 🧪 Testing

### Testear Discord Categories

1. Crear evento
2. Ir a tab "Conversación"
3. Debería mostrar opciones para vincular canal

**Test 1: Seleccionar categoría existente**
- Si no hay categorías, crear una en Discord manualmente
- Debería aparecer en dropdown
- Crear canal en esa categoría
- Verificar en Discord que está dentro de la categoría

**Test 2: Crear categoría nueva**
- Click "Crear nueva"
- Escribir nombre (ej: "Mi Categoría")
- Click "Crear"
- Debería aparecer en dropdown automáticamente
- Seleccionarla y crear canal
- Verificar en Discord

### Testear Auth

```bash
# Login exitoso
POST http://localhost:1337/api/auth/local
{
  "identifier": "test@gigger.com",
  "password": "TestPassword123"
}
# Esperado: 200 + { jwt, user }

# Credenciales inválidas
POST http://localhost:1337/api/auth/local
{
  "identifier": "test@gigger.com",
  "password": "WrongPassword"
}
# Esperado: 401 + { error: { message: "Invalid identifier or password" } }

# Falta password
POST http://localhost:1337/api/auth/local
{
  "identifier": "test@gigger.com"
}
# Esperado: 400 + { error: { message: "..." } }
```

### Testear Discord Messages

1. Crear evento con canal de Discord vinculado
2. Tab "Conversación"
3. Escribir mensaje
4. Enviar
5. Verificaciones:
   - ✅ Mensaje aparece en Discord
   - ✅ Nombre es tu `displayName` (no nombre del bot)
   - ✅ Avatar es tu avatar personalizado (DiceBear)
   - ✅ En frontend, mensaje aparece en burbuja "sent" (derecha)
   - ✅ Los logs muestran: "Discord sendMessage - Sender: { displayName: '...', avatar: true }"

---

## 🛠️ Desarrollo

### Estructura del Proyecto

```
/var/www/gigger/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth/          (Login personalizado)
│   │   │   ├── discord/       (Discord integration)
│   │   │   ├── email/         (Email system)
│   │   │   ├── event/         (Events content type)
│   │   │   ├── profile/       (Profile endpoints)
│   │   │   └── ...
│   │   ├── config/
│   │   │   └── email.js       (SMTP config)
│   │   ├── policies/
│   │   │   └── isAuthenticated.ts
│   │   └── index.ts
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/          (Auth pages)
│   │   │   ├── dashboard/     (Dashboard)
│   │   │   ├── events/        (Events feature)
│   │   │   ├── tariffs/       (Tariffs feature)
│   │   │   └── ...
│   │   ├── shared/
│   │   │   ├── api/           (API client)
│   │   │   ├── components/    (Shared components)
│   │   │   ├── context/       (React contexts)
│   │   │   ├── hooks/         (Custom hooks)
│   │   │   ├── layouts/       (Layout components)
│   │   │   ├── types/         (TypeScript types)
│   │   │   └── utils/         (Utilities)
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   └── .env
│
├── CHANGELOG.md              ← Summary of changes
├── TECHNICAL_DOCS.md         ← Technical documentation
├── QUICK_REFERENCE.md        ← Quick reference guide
├── SETUP.md                  ← This file
└── README.md
```

### Scripts Útiles

**Backend:**
```bash
cd backend

# Desarrollo (hot reload)
npm run develop

# Producción
npm run build
npm run start

# Build sin iniciar
npm run build

# Limpiar build
npm run clean

# Ver tipos TypeScript
npm run type-check
```

**Frontend:**
```bash
cd frontend

# Desarrollo (Vite)
npm run dev

# Build producción
npm run build

# Preview build local
npm run preview

# Lint
npm run lint

# Storybook
npm run storybook
npm run build-storybook
```

---

## 🚨 Common Issues & Solutions

### Issue: Discord bot no responde

**Solución:**
1. Verificar `DISCORD_BOT_TOKEN` es válido
2. Verificar bot está en el servidor (`DISCORD_GUILD_ID`)
3. Verificar Message Content Intent está activado
4. Revisar logs: `Discord listChannels error`

### Issue: Email no se envía

**Solución:**
1. Verificar credenciales SMTP:
   ```bash
   # Test básico con nodemailer
   const transporter = nodemailer.createTransport({
     host: 'smtp.arsys.com',
     port: 465,
     secure: true,
     auth: { user, pass }
   });
   transporter.verify((err, success) => {
     console.log(err || success);
   });
   ```
2. Verificar puerto 465 está abierto
3. Verificar contraseña de aplicación (no contraseña principal)

### Issue: Frontend no se conecta al backend

**Solución:**
1. Verificar `VITE_API_URL` en `.env`
2. Verificar backend está corriendo (`npm run develop`)
3. Verificar puerto 1337 está abierto
4. Revisar CORS en Strapi

### Issue: TypeScript errors al compilar

**Solución:**
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Monitoring & Logs

### Backend Logs

```bash
# Ejecutar con logs en desarrollo
npm run develop

# Buscar errores específicos
npm run develop | grep -i error
npm run develop | grep -i "discord"
npm run develop | grep -i "email"
```

### Frontend Logs

```bash
# Abrir DevTools (F12)
# Console tab para ver logs del frontend
# Network tab para inspeccionar requests a API
```

---

## 🔒 Security Checklist

- [ ] `JWT_SECRET` es único y seguro (producción)
- [ ] `DISCORD_BOT_TOKEN` no está en control de versiones
- [ ] `EMAIL_PASSWORD` no está en control de versiones
- [ ] `.env` está en `.gitignore`
- [ ] Database URL es segura (PostgreSQL en producción)
- [ ] CORS está configurado correctamente
- [ ] Admin panel está protegido (contraseña fuerte)

---

## 📈 Performance Tips

### Backend
1. Usar caché de webhooks (implementado)
2. Paginación en endpoints de lista
3. Indexar campos de búsqueda en DB
4. Usar CDN para assets estáticos

### Frontend
1. Code splitting automático (Vite)
2. Lazy loading de rutas (React.lazy)
3. React Query caché (implementado)
4. Optimizar imágenes/avatares

---

## 🆘 Soporte

Para problemas específicos, revisar:
1. **CHANGELOG.md** - Qué fue implementado
2. **TECHNICAL_DOCS.md** - Cómo funciona internamente
3. **QUICK_REFERENCE.md** - Guía rápida
4. Logs del backend: `npm run develop`
5. Console del frontend: F12 → Console

---

**Última actualización:** 2026-03-20
**Versión:** 1.0.0
