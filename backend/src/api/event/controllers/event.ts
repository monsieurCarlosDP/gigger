/**
 * event controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::event.event', () => ({
  async create(ctx) {
    // Extraer Notifications antes de que Strapi valide el body contra el schema
    const notifications = ctx.request.body?.data?.Notifications;
    if (ctx.request.body?.data) {
      delete ctx.request.body.data.Notifications;
    }
    ctx.state.notifications = notifications ?? { whatsapp: true, email: true };

    return super.create(ctx);
  },
}));
