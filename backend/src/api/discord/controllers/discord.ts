import type { Context } from 'koa';

function handleDiscordError(err: unknown): { status: number; message: string } {
  // Log the full error for debugging
  if (err instanceof Error) {
    strapi.log.error('Discord full error:', { message: err.message, stack: err.stack });
  } else {
    strapi.log.error('Discord error (non-Error):', err);
  }

  const errorMessage = err instanceof Error ? err.message : String(err) || 'Error desconocido';

  // Configuration error
  if (errorMessage.includes('DISCORD_BOT_TOKEN') || errorMessage.includes('DISCORD_GUILD_ID')) {
    return {
      status: 500,
      message: 'Configuración de Discord incompleta. Verifica DISCORD_BOT_TOKEN y DISCORD_GUILD_ID.',
    };
  }

  // Discord API errors (401, 403, etc.)
  if (errorMessage.includes('Discord API error')) {
    const match = errorMessage.match(/Discord API error (\d+)/);
    const statusCode = match ? parseInt(match[1], 10) : null;

    switch (statusCode) {
      case 401:
        return { status: 500, message: 'Token de Discord inválido o expirado.' };
      case 403:
        return { status: 500, message: 'Permisos insuficientes. Verifica que el bot tiene acceso al servidor.' };
      case 404:
        return { status: 500, message: 'Recurso de Discord no encontrado.' };
      case 429:
        return { status: 503, message: 'Límite de rate limit de Discord alcanzado. Intenta más tarde.' };
      default:
        return { status: 500, message: `Error en API de Discord: ${errorMessage}` };
    }
  }

  // Generic server error
  return { status: 500, message: errorMessage };
}

export default {
  async listCategories(ctx: Context) {
    try {
      const categories = await strapi.service('api::discord.discord').listCategories();
      ctx.status = 200;
      ctx.body = { data: categories };
    } catch (err) {
      const { status, message } = handleDiscordError(err);
      strapi.log.error('Discord listCategories error:', message);
      ctx.status = status;
      ctx.body = {
        error: {
          message,
          status: 'ERROR'
        }
      };
    }
  },

  async listChannels(ctx: Context) {
    try {
      const channels = await strapi.service('api::discord.discord').listChannels();
      ctx.status = 200;
      ctx.body = { data: channels };
    } catch (err) {
      const { status, message } = handleDiscordError(err);
      strapi.log.error('Discord listChannels error:', message);
      ctx.status = status;
      ctx.body = {
        error: {
          message,
          status: 'ERROR'
        }
      };
    }
  },

  async createChannel(ctx: Context) {
    const { name, categoryId } = ctx.request.body as { name?: string; categoryId?: string };

    if (!name?.trim()) {
      ctx.status = 400;
      ctx.body = { error: { message: 'El nombre del canal es obligatorio', status: 'VALIDATION_ERROR' } };
      return;
    }

    try {
      const channel = await strapi.service('api::discord.discord').createChannel(name.trim(), categoryId);
      ctx.status = 201;
      ctx.body = { data: channel };
    } catch (err) {
      const { status, message } = handleDiscordError(err);
      strapi.log.error('Discord createChannel error:', message);
      ctx.status = status;
      ctx.body = {
        error: {
          message,
          status: 'ERROR'
        }
      };
    }
  },

  async createCategory(ctx: Context) {
    const { name } = ctx.request.body as { name?: string };

    if (!name?.trim()) {
      ctx.status = 400;
      ctx.body = { error: { message: 'El nombre de la categoría es obligatorio', status: 'VALIDATION_ERROR' } };
      return;
    }

    try {
      const category = await strapi.service('api::discord.discord').createCategory(name.trim());
      ctx.status = 201;
      ctx.body = { data: category };
    } catch (err) {
      const { status, message } = handleDiscordError(err);
      strapi.log.error('Discord createCategory error:', message);
      ctx.status = status;
      ctx.body = {
        error: {
          message,
          status: 'ERROR'
        }
      };
    }
  },

  async sendMessage(ctx: Context) {
    const { channelId } = ctx.params;
    const { content } = ctx.request.body as { content?: string };

    if (!content?.trim()) {
      ctx.status = 400;
      ctx.body = { error: { message: 'El mensaje no puede estar vacío', status: 'VALIDATION_ERROR' } };
      return;
    }

    try {
      // Get authenticated user with avatar to send via webhook
      const user = ctx.state.user;
      const auth = ctx.state.auth;
      let sender: { displayName: string; avatar: Record<string, unknown> | null } | undefined;

      strapi.log.debug('Discord sendMessage - ctx.state.user:', {
        id: (user as Record<string, unknown>)?.id,
        documentId: (user as Record<string, unknown>)?.documentId,
        username: (user as Record<string, unknown>)?.username
      });
      strapi.log.debug('Discord sendMessage - ctx.state.auth:', {
        credentials: !!auth?.credentials
      });

      // Try to get user from ctx.state.user or auth
      let userWithAvatar: Record<string, unknown>[] = [];
      if (user) {
        const userObj = user as Record<string, unknown>;
        const documentId = userObj?.documentId as string | undefined;
        const userId = userObj?.id as number | undefined;

        if (documentId) {
          userWithAvatar = await strapi.documents('plugin::users-permissions.user').findMany({
            filters: { documentId: { $eq: documentId } },
            populate: ['avatar'],
            limit: 1,
          });
        } else if (userId) {
          userWithAvatar = await strapi.documents('plugin::users-permissions.user').findMany({
            filters: { id: { $eq: userId } },
            populate: ['avatar'],
            limit: 1,
          });
        }
      }

      if (userWithAvatar && userWithAvatar.length > 0) {
        strapi.log.debug('Discord sendMessage - Found users:', userWithAvatar.length);
        const userData = userWithAvatar[0] as Record<string, unknown>;
        sender = {
          displayName: (userData.displayName as string) || (userData.username as string),
          avatar: (userData.avatar as Record<string, unknown> | null) || null,
        };
        strapi.log.debug('Discord sendMessage - Sender:', { displayName: sender.displayName, avatar: !!sender.avatar })
      } else {
        strapi.log.warn('Discord sendMessage - User ID not found in context');
      }

      const message = await strapi.service('api::discord.discord').sendMessage(channelId, content.trim(), sender);
      ctx.status = 201;
      ctx.body = { data: message };
    } catch (err) {
      const { status, message } = handleDiscordError(err);
      strapi.log.error('Discord sendMessage error:', message);
      ctx.status = status;
      ctx.body = {
        error: {
          message,
          status: 'ERROR'
        }
      };
    }
  },

  async getMessages(ctx: Context) {
    const { channelId } = ctx.params;
    const { before, limit } = ctx.query;

    try {
      const messages = await strapi.service('api::discord.discord').getMessages(channelId, {
        before: typeof before === 'string' ? before : undefined,
        limit: limit ? Number(limit) : undefined,
      });
      ctx.status = 200;
      ctx.body = { data: messages };
    } catch (err) {
      const { status, message } = handleDiscordError(err);
      strapi.log.error('Discord getMessages error:', message);
      ctx.status = status;
      ctx.body = {
        error: {
          message,
          status: 'ERROR'
        }
      };
    }
  },

  async sendWelcomeMessage(ctx: Context) {
    const { channelId } = ctx.params;
    const { eventName, location, distance, contacts } = ctx.request.body as {
      eventName?: string;
      location?: string;
      distance?: number | string;
      contacts?: Array<{ Name: string; Type?: string; Email?: string; Number?: string }>;
    };

    if (!eventName) {
      ctx.status = 400;
      ctx.body = { error: { message: 'eventName es obligatorio' } };
      return;
    }

    try {
      // Build welcome message as bot (no sender specified)
      const contactsList = contacts && contacts.length > 0
        ? contacts.map(c => `• ${c.Name}${c.Type ? ` (${c.Type})` : ''}${c.Email ? ` - ${c.Email}` : ''}${c.Number ? ` - ${c.Number}` : ''}`).join('\n')
        : 'Sin contactos especificados';

      const welcomeContent = `🎉 **${eventName}**\n\n📍 **Información del evento:**\n${location ? `📌 Ubicación: ${location}\n` : ''}${distance ? `📏 Distancia: ${distance} km\n` : ''}\n👥 **Contactos:**\n${contactsList}`;

      // Send message as bot (no sender = bot message)
      const message = await strapi.service('api::discord.discord').sendMessage(channelId, welcomeContent, undefined);

      ctx.status = 201;
      ctx.body = { data: message };
    } catch (err) {
      const { status, message } = handleDiscordError(err);
      strapi.log.error('Discord sendWelcomeMessage error:', message);
      ctx.status = status;
      ctx.body = {
        error: {
          message,
          status: 'ERROR'
        }
      };
    }
  },
};
