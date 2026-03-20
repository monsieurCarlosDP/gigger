# Quick Reference Guide - Gigger

## 🎯 Lo Que Se Implementó Hoy

### 1️⃣ Discord Category Selection
**Qué hace:** Permite seleccionar o crear categorías de Discord al crear un canal para un evento.

**Dónde está:**
- Evento → Tab "Conversación" → Cuando no hay canal vinculado
- UI con dropdown de categorías existentes
- Opción "Crear nueva" para crear categorías inline

**Archivos clave:**
- Backend: `backend/src/api/discord/`
- Frontend: `frontend/src/features/events/pages/EventDetailPage.tsx`

---

### 2️⃣ Email System
**Qué hace:** Sistema para enviar emails vía SMTP (Arsys).

**Dónde se usa:**
- Share buttons en presupuestos (UI lista, backend pendiente de conectar)

**Configuración requerida:**
```env
EMAIL_HOST=smtp.arsys.com
EMAIL_PORT=465
EMAIL_USERNAME=your-email@domain.com
EMAIL_PASSWORD=your-app-specific-password
```

**Archivos:**
- Backend: `backend/src/api/email/`
- Frontend hook: `frontend/src/shared/hooks/useSendEmail.ts`

---

### 3️⃣ Fixed: Login Returns Correct Status Code
**Antes:** Credenciales inválidas devolvían `500 Internal Server Error`
**Ahora:** Devuelven `401 Unauthorized` (correcto)

**Archivos:**
- Backend: `backend/src/api/auth/`

---

### 4️⃣ Fixed: Messages Show User Identity
**Antes:** Los mensajes en Discord no mostraban tu nombre/avatar
**Ahora:** Los mensajes se envían con tu identidad correcta

**Archivos:**
- Backend: `backend/src/api/discord/controllers/discord.ts` (mejorado)

---

## 📋 Nuevos Endpoints

```bash
# Obtener categorías
GET /api/discord/categories
Response: { data: [{ id: string, name: string }, ...] }

# Crear categoría
POST /api/discord/categories
Body: { name: string }
Response: { data: { id: string, name: string } }

# Enviar email
POST /api/email/send
Body: {
  email: string,
  subject: string,
  html: string,
  attachments?: Array<{ filename, content, contentType }>
}
Response: { message: string }

# Login (mejorado)
POST /api/auth/local
Body: { identifier: string, password: string }
Response: { jwt: string, user: {...} }
Status codes:
  - 200: OK
  - 400: Missing identifier or password
  - 401: Invalid credentials
```

---

## 🪝 Nuevos Hooks Frontend

```typescript
// Obtener categorías de Discord
const { data: categories } = useDiscordCategories();

// Crear categoría
const { mutateAsync: createCategory } = useCreateDiscordCategory();

// Crear canal (ahora acepta categoryId)
const { mutateAsync: createChannel } = useCreateDiscordChannel();
// await createChannel({ name: "my-channel", categoryId: "123" })

// Enviar email
const { mutate: sendEmail } = useSendEmail();
// sendEmail({ email: "user@example.com", subject: "...", html: "..." })
```

---

## 🔧 Debugging

### Ver logs de Discord messages
```bash
# Ejecutar backend
npm run develop

# Buscar en output:
# "Discord sendMessage - ctx.state.user"
# "Discord sendMessage - Found users"
# "Discord sendMessage - Sender"
```

### Verificar que usuario se envía correctamente
1. Abre evento con canal de Discord
2. Tab "Conversación"
3. Envía un mensaje
4. En los logs deberías ver:
   ```
   Discord sendMessage - ctx.state.user: { id: X, documentId: "...", username: "..." }
   Discord sendMessage - Found users: 1
   Discord sendMessage - Sender: { displayName: "Tu Nombre", avatar: true }
   ```

### Verificar que se crea en categoría
1. Crea una categoría
2. Selecciónala
3. Crea canal
4. En Discord, el canal debe estar dentro de la categoría

---

## 📂 Estructura de Carpetas Nueva

```
backend/
├── src/
│   ├── api/
│   │   ├── auth/              ← NEW (login personalizado)
│   │   │   ├── controllers/auth.ts
│   │   │   ├── routes/auth.ts
│   │   │   └── content-types/
│   │   ├── discord/           ← ACTUALIZADO
│   │   │   ├── services/discord.ts
│   │   │   ├── controllers/discord.ts
│   │   │   └── routes/discord.ts
│   │   └── email/             ← NEW (sistema de emails)
│   │       ├── controllers/email.ts
│   │       ├── routes/email.ts
│   │       └── content-types/
│   └── config/
│       └── email.js           ← NEW (config SMTP)

frontend/
├── src/
│   ├── features/events/
│   │   ├── hooks/
│   │   │   ├── useDiscordChannels.ts ← ACTUALIZADO (nuevos hooks)
│   │   │   └── ...
│   │   └── pages/
│   │       └── EventDetailPage.tsx ← ACTUALIZADO (UI categorías)
│   ├── shared/
│   │   ├── api/
│   │   │   └── client.ts ← ACTUALIZADO (nuevos métodos)
│   │   ├── hooks/
│   │   │   └── useSendEmail.ts ← NEW
│   │   └── layouts/
│   │       └── EventDetailDrawerView.tsx ← LIMPIADO (unused imports)
│   └── ...
```

---

## ✅ Checklist de Features

### Discord Categories
- [x] Backend: listCategories endpoint
- [x] Backend: createCategory endpoint
- [x] Frontend: useDiscordCategories hook
- [x] Frontend: useCreateDiscordCategory hook
- [x] Frontend: UI selector de categorías
- [x] Frontend: Opción crear categoría inline
- [x] Frontend: Pasar categoryId al crear canal
- [ ] Frontend: Mostrar categoría en detalles del evento (futuro)

### Email System
- [x] Backend: Config SMTP
- [x] Backend: Email controller & routes
- [x] Frontend: useSendEmail hook
- [x] Frontend: API client method
- [ ] Frontend: Conectar share buttons a email (futuro)
- [ ] Frontend: Email templates (futuro)

### Auth Fixes
- [x] Backend: Endpoint personalizado de login
- [x] Status code 401 para credenciales inválidas
- [x] Status code 400 para datos faltantes
- [x] Status code 200 para login exitoso
- [x] Frontend: Sin cambios requeridos (usa mismo endpoint)

### Discord Messages
- [x] Backend: Obtener usuario autenticado correctamente
- [x] Backend: Buscar por documentId e id
- [x] Backend: Enviar con identidad del usuario
- [x] Frontend: Identificar mensajes propios correctamente
- [x] Frontend: Mostrar en burbuja correcta
- [x] Debug logs agregados

---

## 🚀 Próximos Pasos Sugeridos

### Corto Plazo (1-2 sprints)
1. **Conectar Share Buttons** → Invocar useSendEmail cuando se hace click
2. **Email Templates** → Crear templates para presupuestos, eventos, etc
3. **Mostrar Categoría en Detalles** → Cuando un canal está vinculado, mostrar en qué categoría está

### Mediano Plazo (1 mes)
1. **Persistencia Webhooks** → Guardar en BD en lugar de caché en memoria
2. **Eliminar Categorías** → Endpoint para borrar categorías de Discord
3. **Presupuestos Share UI** → Mejorar UI de share (copiar link, etc)

### Largo Plazo
1. **Discord Roles & Permissions** → Manage Discord roles desde Gigger
2. **Email Bulk** → Enviar emails a múltiples contactos
3. **Event Notifications** → Sistema de notificaciones automáticas por email

---

## 📞 Support / Troubleshooting

### Q: El usuario todavía no aparece en los mensajes
**A:**
1. Verifica los logs del backend (npm run develop)
2. Busca "Discord sendMessage - Sender" en los logs
3. Si dice `avatar: false`, el usuario no tiene avatar
4. Si dice `Found users: 0`, el usuario no fue encontrado - revisa que tiene documentId en BD

### Q: Las categorías no aparecen en el dropdown
**A:**
1. Verifica que el bot está en el servidor Discord
2. Verifica DISCORD_BOT_TOKEN y DISCORD_GUILD_ID en .env
3. Revisa los logs: "Discord listCategories error"
4. En Discord, crea una categoría manualmente primero

### Q: Email no se envía
**A:**
1. Verifica SMTP credentials en .env:
   - EMAIL_HOST
   - EMAIL_PORT (debe ser 465 para Arsys)
   - EMAIL_USERNAME
   - EMAIL_PASSWORD
2. Revisa logs del backend
3. En Arsys, verifica que la cuenta de email tiene permisos de SMTP

### Q: Login sigue devolviendo 500
**A:**
1. Verifica que estás usando el nuevo endpoint (debería ser automático)
2. Limpia node_modules y rebuild: `npm ci && npm run build`
3. Verifica credenciales en BD (email o username + password)
4. Revisa logs del backend

---

## 📚 Documentos de Referencia

- **CHANGELOG.md** - Resumen de todos los cambios
- **TECHNICAL_DOCS.md** - Documentación técnica detallada
- **QUICK_REFERENCE.md** - Este archivo

---

**Última actualización:** 2026-03-20
**Versión:** 1.0.0 (Sesión actual completada)
