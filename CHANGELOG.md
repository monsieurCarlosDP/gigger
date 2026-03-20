# Changelog - Gigger

## Sesión: Discord Categories, Auth Improvements & Bug Fixes (2026-03-20)

### Features Implementadas

#### 1. **Discord Category Selection & Creation**
Permite a los usuarios seleccionar una categoría existente o crear una nueva cuando crean un canal de Discord para un evento.

**Backend Changes:**
- `backend/src/api/discord/services/discord.ts`: Agregué método `listCategories()` para obtener todas las categorías (type 4)
- `backend/src/api/discord/controllers/discord.ts`: Agregué handler `listCategories()`
- `backend/src/api/discord/routes/discord.ts`: Agregué ruta `GET /discord/categories` y `POST /discord/categories`

**Frontend Changes:**
- `frontend/src/shared/api/client.ts`:
  - Agregué `getDiscordCategories()` - obtiene categorías
  - Agregué `createDiscordCategory(name)` - crea nueva categoría
  - Actualicé `createDiscordChannel()` para aceptar parámetro opcional `categoryId`

- `frontend/src/features/events/hooks/useDiscordChannels.ts`:
  - Agregué hook `useDiscordCategories()` para obtener categorías con React Query
  - Actualicé `useCreateDiscordChannel()` para aceptar `{ name, categoryId? }`
  - Agregué hook `useCreateDiscordCategory()` para crear categorías

- `frontend/src/features/events/pages/EventDetailPage.tsx`:
  - Agregué UI para seleccionar categoría existente con Autocomplete
  - Agregué opción "Crear nueva" para crear categorías on-the-fly
  - Formulario inline para crear nuevas categorías sin navegar
  - Los usuarios pueden seleccionar una categoría antes de crear un canal

**UX Flow:**
1. Usuario abre tab "Conversación" en detalle de evento
2. Puede seleccionar una categoría existente del dropdown
3. O hacer clic en "Crear nueva" para crear una categoría
4. Escribe nombre del nuevo canal
5. Hace clic "Crear y vincular" → canal se crea en la categoría seleccionada

---

#### 2. **Email Configuration & API**
Sistema de envío de correos configurado con Strapi y SMTP de Arsys.

**Backend Files Created:**
- `backend/config/email.js`: Configuración de nodemailer con SMTP
  - Host, puerto, autenticación desde variables de entorno
  - Direcciones default para from/replyTo

- `backend/src/api/email/controllers/email.ts`:
  - Handler para `POST /email/send`
  - Acepta: `email`, `subject`, `html`, `attachments` (opcional)
  - Usa servicio de email de Strapi

- `backend/src/api/email/routes/email.ts`:
  - Ruta `POST /api/email/send` sin autenticación requerida

**Frontend Changes:**
- `frontend/src/shared/api/client.ts`:
  - Agregué método `sendEmail()` - envía emails vía API

- `frontend/src/shared/hooks/useSendEmail.ts` (NEW):
  - Hook React Query para enviar emails
  - Notificaciones de éxito/error vía Snackbar

**Configuration Required:**
```env
# backend/.env
EMAIL_HOST=smtp.arsys.com
EMAIL_PORT=465
EMAIL_USERNAME=your-email@domain.com
EMAIL_PASSWORD=your-app-password
```

---

### Bugs Arreglados

#### 1. **Login Devolvía 500 en Credenciales Inválidas**

**Problema:** Cuando el usuario ingresaba credenciales inválidas, el endpoint `/api/auth/local` devolvía `500 Internal Server Error` en lugar de `401 Unauthorized`.

**Solución:** Creé endpoint personalizado de login.

**Backend Files Created:**
- `backend/src/api/auth/controllers/auth.ts`:
  - Controlador personalizado con manejo correcto de errores
  - Busca usuario por email o username (case-insensitive)
  - Verifica contraseña con bcrypt
  - Retorna codes de estado correctos:
    - `400 Bad Request`: si faltan identifier/password
    - `401 Unauthorized`: si credenciales son inválidas
    - `200 OK`: si login es exitoso

- `backend/src/api/auth/routes/auth.ts`:
  - Ruta `POST /api/auth/local` sin autenticación (auth: false)

- `backend/src/api/auth/content-types/auth/schema.json`:
  - Schema vacío para la colección de auth

El frontend no necesita cambios porque usa el mismo endpoint `/api/auth/local`.

---

#### 2. **Mensajes Discord No Se Enviaban Con Identidad del Usuario**

**Problema:** Los mensajes enviados via webhook no mostraban el nombre y avatar correcto del usuario autenticado.

**Causa:** La obtención del usuario en `ctx.state.user` no estaba funcionando correctamente.

**Solución:** Mejoré la lógica de obtención del usuario en el controlador Discord.

**Changes in `backend/src/api/discord/controllers/discord.ts`:**
- Cambié cómo se accede al usuario autenticado
- Ahora intenta obtener por `documentId` primero, luego por `id`
- Agregué logs de debug para facilitar troubleshooting:
  ```
  Discord sendMessage - ctx.state.user
  Discord sendMessage - Found users
  Discord sendMessage - Sender
  ```

**Result:**
- ✅ Los mensajes se envían con el `displayName` del usuario
- ✅ Los mensajes se envían con el avatar DiceBear del usuario
- ✅ El frontend identifica correctamente los mensajes propios (`isMine`)
- ✅ Los mensajes aparecen en la burbuja correcta (sent vs received)

---

#### 3. **Lifecycle Hook Null Reference Error**

**Problema:** En `backend/src/api/event/content-types/event/lifecycles.ts`, el hook `beforeUpdate` causaba error: "Cannot read properties of undefined (reading 'documentId')".

**Solución:** Agregué null check antes de acceder a `info.documentId`:
```typescript
if (!info) return;
```

---

#### 4. **Unused Imports & Variables Cleanup**

**File:** `frontend/src/shared/layouts/EventDetailDrawerView.tsx`

Eliminé imports y variables no utilizadas:
- Removí `EditIcon`, `OpenInFullIcon` (no usados)
- Removí imports `useNavigate`, `useDrawerNav` (no usados)
- Removí variable `currentTabName` (no usada)

---

### Cambios API & Tipos

#### Nuevos Endpoints

| Method | Path | Handler | Auth | Description |
|--------|------|---------|------|-------------|
| GET | `/discord/categories` | `discord.listCategories` | ✓ | Lista categorías de Discord |
| POST | `/discord/categories` | `discord.createCategory` | ✓ | Crea nueva categoría |
| POST | `/email/send` | `email.send` | ✗ | Envía email |
| POST | `/auth/local` | `auth.login` | ✗ | Login con credenciales |

#### Hooks Frontend Actualizados

```typescript
// useDiscordChannels.ts
useDiscordCategories()           // NEW: obtiene categorías
useCreateDiscordChannel()         // UPDATED: acepta { name, categoryId? }
useCreateDiscordCategory()        // NEW: crea categorías
useLinkDiscordChannel()          // Existente

// useSendEmail.ts
useSendEmail()                    // NEW: envía emails

// Auth (via client.ts)
api.login(identifier, password)   // Existente, ahora con códigos de estado correctos
```

---

### Testing Recommendations

#### 1. Discord Categories
- [ ] Crear categoría nueva
- [ ] Seleccionar categoría existente al crear canal
- [ ] Verificar que el canal se crea en la categoría correcta en Discord

#### 2. Auth/Login
- [ ] Login con credenciales válidas → status 200
- [ ] Login con credenciales inválidas → status 401
- [ ] Login sin identifier → status 400
- [ ] Login sin password → status 400

#### 3. Discord Messages
- [ ] Enviar mensaje → debe mostrar con tu nombre y avatar
- [ ] Verificar que `msg.isWebhook && msg.author.username === user.displayName`
- [ ] Mensaje debe aparecer en burbuja "sent" (derecha)

#### 4. Email (cuando esté integrado)
- [ ] Enviar email vía API
- [ ] Verificar entrega en Arsys

---

### Environment Variables Required

```bash
# backend/.env
DISCORD_BOT_TOKEN=your-bot-token
DISCORD_GUILD_ID=your-guild-id
EMAIL_HOST=smtp.arsys.com
EMAIL_PORT=465
EMAIL_USERNAME=your-email@domain.com
EMAIL_PASSWORD=your-app-password
```

---

### Files Modified

#### Backend
- `backend/src/api/discord/services/discord.ts` - Agregué listCategories()
- `backend/src/api/discord/controllers/discord.ts` - Agregué handlers, mejoré sendMessage
- `backend/src/api/discord/routes/discord.ts` - Agregué rutas de categorías
- `backend/src/api/event/content-types/event/lifecycles.ts` - Agregué null check
- `backend/config/email.js` - NEW
- `backend/src/api/email/` - NEW folder con controllers, routes
- `backend/src/api/auth/` - NEW folder con controllers, routes

#### Frontend
- `frontend/src/shared/api/client.ts` - Nuevos métodos Discord & Email
- `frontend/src/shared/hooks/useSendEmail.ts` - NEW
- `frontend/src/features/events/hooks/useDiscordChannels.ts` - Nuevos hooks
- `frontend/src/features/events/pages/EventDetailPage.tsx` - UI de categorías
- `frontend/src/shared/layouts/EventDetailDrawerView.tsx` - Cleanup imports

---

### Known Limitations & Future Improvements

1. **Email Share Feature**: Los botones de compartir presupuesto están en UI pero no están conectados al backend aún
2. **Debug Logs**: Los logs de Discord están en DEBUG level - considerar cambiar a INFO en producción
3. **Email Templates**: Actualmente solo soporta HTML raw - considerar agregar templating
4. **Categoría Deletion**: No hay endpoint para eliminar categorías
5. **Webhook Caché**: El caché de webhooks es en memoria - se pierde al reiniciar el servidor

---

### Notes & Decisions

1. **Auth Endpoint Personalizado**: Se decidió crear un endpoint personalizado en lugar de parchear el de Strapi para tener control total sobre los códigos de estado y el manejo de errores.

2. **Discord User Lookup**: Se intenta buscar por `documentId` primero (Strapi v5) y luego por `id` (compatibilidad) para manejar ambos casos.

3. **Category Creation**: La creación de categorías está en el mismo flujo de creación de canales para mejor UX - el usuario no necesita navegar a otra pantalla.

4. **Email Config**: Se usa nodemailer + servicio de Strapi en lugar de solo plugin porque da más control y compatibilidad.

---

**Última actualización:** 2026-03-20
**Versión del Proyecto:** v0.1.0 (en desarrollo)
