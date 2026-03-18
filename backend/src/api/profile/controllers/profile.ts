import type { Context } from 'koa';

interface ViabilityBody {
  Name?: string;
  StartDate?: string;
  EndDate?: string;
}

export default {
  async createViability(ctx: Context) {
    const user = ctx.state.user;
    if (!user) {
      ctx.status = 401;
      ctx.body = { error: { message: 'No autenticado' } };
      return;
    }

    const { Name, StartDate, EndDate } = ctx.request.body as ViabilityBody;

    if (!Name || !StartDate) {
      ctx.status = 400;
      ctx.body = { error: { message: 'Name y StartDate son obligatorios' } };
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const event = await strapi.documents('api::event.event').create({
        data: {
          Name,
          Type: 'Viability',
          StartDate,
          EndDate: EndDate || undefined,
          CreatedByUser: user.documentId,
        } as any,
        status: 'published',
      });

      ctx.body = { data: event };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      strapi.log.error('Profile createViability error:', message);
      ctx.status = 500;
      ctx.body = { error: { message } };
    }
  },

  async getViability(ctx: Context) {
    const user = ctx.state.user;
    if (!user) {
      ctx.status = 401;
      ctx.body = { error: { message: 'No autenticado' } };
      return;
    }

    try {
      const events = await strapi.documents('api::event.event').findMany({
        filters: {
          Type: { $eq: 'Viability' },
          CreatedByUser: { id: { $eq: user.id } },
        },
        sort: { StartDate: 'desc' },
        limit: 100,
        status: 'published',
      });

      ctx.body = { data: events };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      strapi.log.error('Profile getViability error:', message);
      ctx.status = 500;
      ctx.body = { error: { message } };
    }
  },

  async updateAvatar(ctx: Context) {
    const user = ctx.state.user;

    if (!user) {
      ctx.status = 401;
      ctx.body = { error: { message: 'No autenticado' } };
      return;
    }

    const { avatar } = ctx.request.body as { avatar?: Record<string, unknown> };

    if (!avatar) {
      ctx.status = 400;
      ctx.body = { error: { message: 'El campo avatar es obligatorio' } };
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updated: any = await strapi.documents('plugin::users-permissions.user').update({
        documentId: user.documentId,
        data: { avatar } as any,
        populate: { avatar: true },
      });

      ctx.body = { data: { avatar: updated.avatar } };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      strapi.log.error('Profile updateAvatar error:', message);
      ctx.status = 500;
      ctx.body = { error: { message } };
    }
  },
};
