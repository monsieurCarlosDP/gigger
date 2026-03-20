# Documentación Técnica - Gigger

## 1. Discord Categories Feature

### Arquitectura

```
Frontend (EventDetailPage)
    ↓
useDiscordCategories() + useCreateDiscordCategory()
    ↓
API client.ts (getDiscordCategories, createDiscordCategory)
    ↓
Backend API (GET/POST /discord/categories)
    ↓
Discord Service (listCategories, createCategory)
    ↓
Discord.js API (type 4 channels)
```

### Backend Implementation

#### Service: `discord.ts`

```typescript
async listCategories() {
  const channels = await discordFetch('/guilds/{guildId}/channels');
  // Filtra por type === 4 (categorías)
  // Retorna { id, name }
}

async createCategory(name: string) {
  const body = { name, type: 4 };
  return discordFetch('/guilds/{guildId}/channels', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}
```

#### Controller: `discord.ts`

Los handlers `listCategories()` y `createCategory()` simplemente:
1. Validan la entrada (e.g., name no vacío)
2. Llaman al servicio
3. Retornan el resultado o error con status code apropiado

#### Routes: `discord.ts`

```typescript
{
  method: 'GET',
  path: '/discord/categories',
  handler: 'discord.listCategories',
  config: { policies: ['global::isAuthenticated'] }
}
```

### Frontend Implementation

#### Hooks: `useDiscordChannels.ts`

```typescript
// Obtiene categorías
useDiscordCategories() {
  return useQuery({
    queryKey: ['discord', 'categories'],
    queryFn: async () => {
      const res = await api.getDiscordCategories();
      return res.data;
    }
  });
}

// Crea categoría
useCreateDiscordCategory() {
  return useMutation({
    mutationFn: async (name: string) => {
      return api.createDiscordCategory(name);
    },
    onSuccess: () => {
      // Invalida ambas queries para refrescar datos
      queryClient.invalidateQueries({
        queryKey: ['discord', 'categories']
      });
    }
  });
}
```

#### UI: `EventDetailPage.tsx`

El flujo de creación de canal ahora tiene dos estados:

**Estado 1: Seleccionar categoría existente**
```typescript
<Autocomplete
  options={categories}
  value={selectedCategory}
  onChange={(e, value) => setSelectedCategory(value)}
/>
<Button onClick={() => setShowNewCategory(true)}>Crear nueva</Button>
```

**Estado 2: Crear nueva categoría**
```typescript
<TextField value={newCategoryName} />
<Button onClick={async () => {
  const category = await createCategory(newCategoryName);
  setSelectedCategory({ id: category.id, name: category.name });
}}>Crear</Button>
```

Luego, al crear el canal:
```typescript
const channel = await createChannel({
  name: newChannelName,
  categoryId: selectedCategory?.id  // ← Aquí se pasa la categoría
});
```

### Data Flow Example

1. **Usuario abre evento** → `useDiscordCategories()` fetch automático
2. **Usuario hace clic "Crear nueva"** → `showNewCategory = true`
3. **Usuario escribe nombre y hace clic "Crear"** → `createCategory()` mutation
4. **Backend crea categoría en Discord** → Discord API type 4 channel
5. **Query invalidate automático** → `categories` se refresca
6. **UI actualiza** → Nueva categoría aparece en Autocomplete
7. **Usuario selecciona categoría** → `selectedCategory = { id, name }`
8. **Usuario crea canal** → `createChannel({ name, categoryId })`
9. **Backend crea canal en Discord** → Discord API dentro de categoría (parent_id)

---

## 2. Auth Improvements

### Problema Original

El endpoint estándar de Strapi `/api/auth/local` devolvía `500 Internal Server Error` cuando las credenciales eran inválidas.

### Solución

Endpoint personalizado con manejo explícito de errores.

#### Implementation: `backend/src/api/auth/controllers/auth.ts`

```typescript
async login(ctx) {
  // 1. Validar input
  if (!identifier || !password) return 400;

  // 2. Buscar usuario
  const users = await strapi.documents('plugin::users-permissions.user').findMany({
    filters: {
      $or: [
        { email: { $eqi: identifier } },
        { username: { $eqi: identifier } }
      ]
    }
  });
  if (!users.length) return 401; // ← No encontrado

  // 3. Verificar contraseña
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return 401; // ← Contraseña incorrecta

  // 4. Generar JWT
  const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
    id: user.id
  });

  return 200 + { jwt, user }; // ← Éxito
}
```

#### Status Codes

| Código | Condición |
|--------|-----------|
| `200 OK` | Login exitoso |
| `400 Bad Request` | Falta identifier o password |
| `401 Unauthorized` | Usuario no encontrado o contraseña incorrecta |
| `500 Server Error` | Error interno (no debería suceder en flujo normal) |

#### API Compatibility

El endpoint personalizado reemplaza el estándar de Strapi `/api/auth/local`, por lo que el frontend no necesita cambios:

```typescript
// frontend/src/shared/api/client.ts
login(identifier: string, password: string) {
  return authFetch('/auth/local', {
    method: 'POST',
    body: JSON.stringify({ identifier, password })
  });
}
```

El cliente automáticamente usa el nuevo endpoint.

---

## 3. Discord Message User Identity

### Problema Original

Los mensajes enviados vía webhook no mostraban la identidad del usuario autenticado. Los mensajes siempre parecían ser del bot.

### Root Cause

```typescript
// ❌ Antes
const userId = ctx.state.user?.documentId; // undefined en algunos casos
const user = await strapi.documents('plugin::users-permissions.user').findOne({
  documentId: userId,  // ← Sintaxis incorrecta para Strapi v5
  populate: { avatar: true }
});
```

El método `findOne()` de Strapi v5 no acepta ese formato de parámetros.

### Solución

```typescript
// ✅ Después
const user = ctx.state.user;

// Obtener user ID (intenta documentId primero, luego id)
const documentId = user?.documentId;
const userId = user?.id;

// Buscar con findMany (sintaxis correcta)
const userWithAvatar = await strapi.documents('plugin::users-permissions.user').findMany({
  filters: { documentId: { $eq: documentId } }, // o { id: { $eq: userId } }
  populate: ['avatar'],
  limit: 1
});

// Construir sender con datos del usuario
const sender = {
  displayName: userData.displayName || userData.username,
  avatar: userData.avatar || null
};
```

### Discord Webhook Flow

1. **Backend obtiene usuario autenticado** con avatar populated
2. **Construye payload de webhook**:
   ```json
   {
     "content": "Mensaje del usuario",
     "username": "Juan Pérez",        // ← displayName
     "avatar_url": "https://dicebear..." // ← Avatar DiceBear
   }
   ```
3. **Discord API crea mensaje** con ese username y avatar
4. **Discord retorna mensaje** con `author.username = "Juan Pérez"`
5. **Frontend lo identifica como propio**:
   ```typescript
   const isMine = msg.isWebhook &&
                  msg.author.username === (user?.displayName || user?.username);
   ```
6. **Se muestra en burbuja "sent"** (derecha)

### Debug Logs

Se agregaron logs DEBUG para troubleshooting:

```typescript
strapi.log.debug('Discord sendMessage - ctx.state.user:', {
  id: user?.id,
  documentId: user?.documentId,
  username: user?.username
});
strapi.log.debug('Discord sendMessage - Found users:', userWithAvatar.length);
strapi.log.debug('Discord sendMessage - Sender:', {
  displayName: sender.displayName,
  avatar: !!sender.avatar
});
```

Para ver estos logs:
```bash
# Ejecutar backend en desarrollo
npm run develop

# Buscar líneas con "Discord sendMessage"
```

---

## 4. Email System

### Architecture

```
Frontend (EventDetailPage - Share Button)
    ↓
useSendEmail() mutation
    ↓
api.sendEmail({ email, subject, html, attachments })
    ↓
POST /email/send
    ↓
email.send() controller
    ↓
strapi.service('plugin::email.email').send()
    ↓
nodemailer (SMTP)
    ↓
Email Server (Arsys)
```

### Backend Setup

#### Config: `backend/config/email.js`

```javascript
export default ({ env }) => {
  return {
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('EMAIL_HOST'),
          port: env('EMAIL_PORT'),
          secure: env('EMAIL_PORT') === '465',
          auth: {
            user: env('EMAIL_USERNAME'),
            pass: env('EMAIL_PASSWORD')
          }
        },
        settings: {
          defaultFrom: env('EMAIL_FROM'),
          defaultReplyTo: env('EMAIL_REPLY_TO')
        }
      }
    }
  };
};
```

#### Controller: `backend/src/api/email/controllers/email.ts`

```typescript
async send(ctx) {
  const { email, subject, html, attachments } = ctx.request.body;

  // Validación
  if (!email || !subject || !html) {
    return ctx.status = 400;
  }

  try {
    // Usa servicio de email de Strapi
    await strapi.service('plugin::email.email').send({
      to: email,
      subject,
      html,
      attachments
    });

    ctx.body = { message: 'Email enviado' };
  } catch (err) {
    ctx.status = 500;
    ctx.body = { error: err.message };
  }
}
```

### Frontend Integration

#### Hook: `frontend/src/shared/hooks/useSendEmail.ts`

```typescript
export function useSendEmail() {
  const { showSuccess, showError } = useSnackbar();

  return useMutation({
    mutationFn: async (data) => {
      return api.sendEmail(data);
    },
    onSuccess: () => {
      showSuccess('Email enviado correctamente');
    },
    onError: (err) => {
      showError(err.message);
    }
  });
}
```

#### Usage Example

```typescript
const { mutate: sendEmail } = useSendEmail();

// Enviar email
sendEmail({
  email: 'cliente@example.com',
  subject: 'Presupuesto para tu evento',
  html: '<h1>Presupuesto</h1><p>Total: €1000</p>',
  attachments: [
    {
      filename: 'presupuesto.pdf',
      content: pdfBuffer,
      contentType: 'application/pdf'
    }
  ]
});
```

### Environment Variables

```env
# backend/.env
EMAIL_HOST=smtp.arsys.com
EMAIL_PORT=465
EMAIL_USERNAME=your-email@domain.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@gigger.com
EMAIL_REPLY_TO=support@gigger.com
```

---

## 5. Type Safety

### TypeScript Interfaces

#### Discord Types

```typescript
// frontend/src/shared/api/client.ts
export interface DiscordChannel {
  id: string;
  name: string;
  categoryId: string | null;  // parent_id from Discord
  position: number;
}

export interface DiscordMessage {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    avatar: string | null;
    bot: boolean;
  };
  isWebhook: boolean;
  timestamp: string;
  editedAt: string | null;
  attachments: Array<{
    id: string;
    filename: string;
    url: string;
  }>;
}
```

#### Auth Types

```typescript
// frontend/src/shared/api/client.ts
export interface AuthUser {
  id: number;
  documentId: string;
  username: string;
  email: string;
  displayName?: string;
  avatar?: AvatarConfig | null;
}
```

### API Client Type Safety

```typescript
// Todos los métodos están tipiados
api.getDiscordChannels(): Promise<{ data: DiscordChannel[] }>
api.createDiscordCategory(name: string): Promise<{ data: { id: string; name: string } }>
api.sendEmail(data: { email, subject, html, attachments? }): Promise<{ message: string }>
```

---

## 6. Query & Mutation Caching

### React Query Keys

```typescript
// Discord
['discord', 'categories']      // Lista de categorías
['discord', 'channels']        // Lista de canales
['discord', 'messages', channelId]  // Mensajes de un canal

// Auth
// Sin key específica, solo almacenado en AuthContext
```

### Invalidation Strategy

Cuando se crean recursos, se invalidan las queries relevantes:

```typescript
// Crear categoría → invalida categorías
queryClient.invalidateQueries({
  queryKey: ['discord', 'categories']
});

// Crear canal → invalida canales
queryClient.invalidateQueries({
  queryKey: ['discord', 'channels']
});

// Enviar mensaje → invalida mensajes del canal
queryClient.invalidateQueries({
  queryKey: ['discord', 'messages', channelId]
});
```

---

## 7. Error Handling

### Backend Error Responses

**Formato estándar:**
```json
{
  "error": {
    "message": "Descripción del error"
  }
}
```

**Con status codes:**
- `400` - Bad Request (validación)
- `401` - Unauthorized (auth requerida)
- `403` - Forbidden (permisos insuficientes)
- `404` - Not Found (recurso no existe)
- `500` - Internal Server Error

### Frontend Error Handling

```typescript
async function authFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message ?? `Error ${res.status}`);
  }

  return res.json();
}
```

El error se propaga y es capturado por los hooks de React Query:

```typescript
useEffect(() => {
  if (query.error) {
    showError(query.error.message);
  }
}, [query.error]);
```

---

## 8. Performance Considerations

### Caching Strategy

1. **Discord Categories**: Caché persistente con invalidación manual
2. **Discord Channels**: Caché persistente con invalidación manual
3. **Messages**: Polling cada 5 segundos cuando el usuario está en tab de chat

### Webhook Caché (In-Memory)

```typescript
const webhookCache = new Map<string, { id: string; token: string }>();

// Busca en caché primero
const cached = webhookCache.get(channelId);
if (cached) return cached;

// Si no está en caché, lo crea y lo almacena
const webhook = await createWebhook(channelId);
webhookCache.set(channelId, webhook);
```

**Limitación:** El caché se pierde al reiniciar el servidor. Para producción, considerar guardar en base de datos.

---

## 9. Testing Checklist

### Discord Categories
- [ ] Listar categorías vacías
- [ ] Crear categoría exitosamente
- [ ] Crear canal en categoría específica
- [ ] Verificar en Discord que el canal está en la categoría
- [ ] Crear categoría y seleccionarla en el mismo flujo

### Auth/Login
- [ ] Login exitoso devuelve 200 + JWT
- [ ] Credenciales inválidas devuelven 401
- [ ] Falta identifier devuelve 400
- [ ] Falta password devuelve 400
- [ ] Token JWT se almacena en localStorage

### Messages
- [ ] Enviar mensaje como usuario autenticado
- [ ] Mensaje aparece con tu nombre
- [ ] Mensaje aparece con tu avatar
- [ ] Mensaje está en burbuja "sent" (derecha)
- [ ] Verificar en Discord que nombre y avatar son correctos

### Email (cuando esté integrado)
- [ ] Enviar email exitosamente
- [ ] Email recibido en bandeja de entrada
- [ ] Attachments se envían correctamente
- [ ] Variables de entorno están configuradas

---

## 10. Deployment Notes

### Required Environment Variables

```env
# Discord
DISCORD_BOT_TOKEN=
DISCORD_GUILD_ID=

# Email
EMAIL_HOST=smtp.arsys.com
EMAIL_PORT=465
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_FROM=
EMAIL_REPLY_TO=

# General
NODE_ENV=production
DATABASE_URL=
JWT_SECRET=
```

### Database Migrations

No se requieren migraciones de base de datos para los cambios en esta sesión.

### Build & Deploy

```bash
# Backend
cd backend
npm run build
# Verificar que no hay errores TypeScript

# Frontend
cd frontend
npm run build
# Verificar que no hay errores de lint/TypeScript
```

---

**Última actualización:** 2026-03-20
**Versión:** 1.0.0
