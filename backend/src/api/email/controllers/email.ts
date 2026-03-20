import type { Context } from 'koa';

export default {
  async send(ctx: Context) {
    const { email, subject, html, attachments } = ctx.request.body as {
      email?: string;
      subject?: string;
      html?: string;
      attachments?: any[];
    };

    // Validar campos requeridos
    if (!email || !subject || !html) {
      ctx.status = 400;
      ctx.body = { error: 'Missing required fields: email, subject, html' };
      return;
    }

    try {
      // Enviar correo usando el servicio integrado de Strapi
      await strapi.service('plugin::email.email').send({
        to: email,
        subject,
        html,
        attachments: attachments || [],
      });

      ctx.status = 200;
      ctx.body = { message: 'Email sent successfully' };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      strapi.log.error('Email send error:', message);
      ctx.status = 500;
      ctx.body = { error: { message: 'Failed to send email' } };
    }
  },
};
