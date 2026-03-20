import type { Context } from 'koa';

export default {
  async listCategories(ctx: Context) {
    try {
      const categories = await strapi.service('api::discord.discord').listCategories();
      ctx.body = { data: categories };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      strapi.log.error('Discord listCategories error:', message);
      ctx.status = 502;
      ctx.body = { error: { message } };
    }
  },

  async listChannels(ctx: Context) {
    try {
      const channels = await strapi.service('api::discord.discord').listChannels();
      ctx.body = { data: channels };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      strapi.log.error('Discord listChannels error:', message);
      ctx.status = 502;
      ctx.body = { error: { message } };
    }
  },

  async createChannel(ctx: Context) {
    const { name, categoryId } = ctx.request.body as { name?: string; categoryId?: string };

    if (!name?.trim()) {
      ctx.status = 400;
      ctx.body = { error: { message: 'El nombre del canal es obligatorio' } };
      return;
    }

    try {
      const channel = await strapi.service('api::discord.discord').createChannel(name.trim(), categoryId);
      ctx.body = { data: channel };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      strapi.log.error('Discord createChannel error:', message);
      ctx.status = 502;
      ctx.body = { error: { message } };
    }
  },

  async createCategory(ctx: Context) {
    const { name } = ctx.request.body as { name?: string };

    if (!name?.trim()) {
      ctx.status = 400;
      ctx.body = { error: { message: 'El nombre de la categoría es obligatorio' } };
      return;
    }

    try {
      const category = await strapi.service('api::discord.discord').createCategory(name.trim());
      ctx.body = { data: category };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      strapi.log.error('Discord createCategory error:', message);
      ctx.status = 502;
      ctx.body = { error: { message } };
    }
  },

  async sendMessage(ctx: Context) {
    const { channelId } = ctx.params;
    const { content } = ctx.request.body as { content?: string };

    if (!content?.trim()) {
      ctx.status = 400;
      ctx.body = { error: { message: 'El mensaje no puede estar vacío' } };
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
      ctx.body = { data: message };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      strapi.log.error('Discord sendMessage error:', message);
      ctx.status = 502;
      ctx.body = { error: { message } };
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
      ctx.body = { data: messages };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      strapi.log.error('Discord getMessages error:', message);
      ctx.status = 502;
      ctx.body = { error: { message } };
    }
  },
};
