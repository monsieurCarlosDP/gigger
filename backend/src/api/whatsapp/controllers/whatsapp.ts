import type { Context } from 'koa';

function handleWhatsAppError(err: unknown): { status: number; message: string } {
  const message = err instanceof Error ? err.message : String(err) || 'Error desconocido';

  if (message.includes('no está conectado')) {
    return { status: 503, message: 'WhatsApp no está conectado. Escanea el QR para iniciar sesión.' };
  }

  return { status: 500, message };
}

export default {
  async getStatus(ctx: Context) {
    try {
      const result = await strapi.service('api::whatsapp.whatsapp').getStatus();
      ctx.status = 200;
      ctx.body = { data: result };
    } catch (err) {
      const { status, message } = handleWhatsAppError(err);
      ctx.status = status;
      ctx.body = { error: { message } };
    }
  },

  async getChats(ctx: Context) {
    try {
      const chats = await strapi.service('api::whatsapp.whatsapp').getChats();
      ctx.status = 200;
      ctx.body = { data: chats };
    } catch (err) {
      const { status, message } = handleWhatsAppError(err);
      ctx.status = status;
      ctx.body = { error: { message } };
    }
  },

  async getGroups(ctx: Context) {
    try {
      const groups = await strapi.service('api::whatsapp.whatsapp').getGroups();
      ctx.status = 200;
      ctx.body = { data: groups };
    } catch (err) {
      const { status, message } = handleWhatsAppError(err);
      ctx.status = status;
      ctx.body = { error: { message } };
    }
  },

  async sendMessage(ctx: Context) {
    const { to, content } = ctx.request.body as { to?: string; content?: string };

    if (!to?.trim()) {
      ctx.status = 400;
      ctx.body = { error: { message: 'El destinatario (to) es obligatorio' } };
      return;
    }

    if (!content?.trim()) {
      ctx.status = 400;
      ctx.body = { error: { message: 'El contenido del mensaje es obligatorio' } };
      return;
    }

    try {
      const message = await strapi.service('api::whatsapp.whatsapp').sendMessage(to.trim(), content.trim());
      ctx.status = 201;
      ctx.body = { data: message };
    } catch (err) {
      const { status, message } = handleWhatsAppError(err);
      ctx.status = status;
      ctx.body = { error: { message } };
    }
  },
};
