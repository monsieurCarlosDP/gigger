import type { Context } from 'koa';

export default {
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
      const userId = ctx.state.user?.documentId;
      let sender: { displayName: string; avatar: Record<string, unknown> | null } | undefined;

      if (userId) {
        const user = await strapi.documents('plugin::users-permissions.user').findOne({
          documentId: userId,
          populate: { avatar: true },
        });
        if (user) {
          sender = {
            displayName: (user as Record<string, unknown>).displayName as string || user.username,
            avatar: (user as Record<string, unknown>).avatar as Record<string, unknown> | null,
          };
        }
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
