import type { Context } from 'koa';

export default {
  async login(ctx: Context) {
    const { identifier, password } = ctx.request.body as { identifier?: string; password?: string };

    if (!identifier || !password) {
      ctx.status = 400;
      ctx.body = { error: { message: 'identifier y password son obligatorios' } };
      return;
    }

    try {
      // Find user by email or username
      const user = await strapi.documents('plugin::users-permissions.user').findMany({
        filters: {
          $or: [
            { email: { $eqi: identifier } },
            { username: { $eqi: identifier } },
          ],
        },
        populate: ['avatar'],
        limit: 1,
        status: 'published',
      });

      if (!user || user.length === 0) {
        ctx.status = 401;
        ctx.body = { error: { message: 'Invalid identifier or password' } };
        return;
      }

      const foundUser = user[0] as Record<string, unknown>;

      // Verify password using bcrypt
      const bcrypt = require('bcryptjs');
      const isPasswordValid = await bcrypt.compare(password, foundUser.password as string);

      if (!isPasswordValid) {
        ctx.status = 401;
        ctx.body = { error: { message: 'Invalid identifier or password' } };
        return;
      }

      // Generate JWT
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: foundUser.id,
      });

      ctx.body = {
        jwt,
        user: {
          id: foundUser.id,
          documentId: foundUser.documentId,
          username: foundUser.username,
          email: foundUser.email,
          displayName: foundUser.displayName,
          avatar: foundUser.avatar,
        },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      strapi.log.error('Auth login error:', message);
      ctx.status = 500;
      ctx.body = { error: { message } };
    }
  },
};
