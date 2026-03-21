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
      ctx.body = {
        error: {
          message: 'Missing required fields: email, subject, html',
          status: 'VALIDATION_ERROR'
        }
      };
      return;
    }

    try {
      // Enviar correo usando el servicio integrado de Strapi
      await strapi.service('plugin::email.email').send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject,
        html,
        attachments: attachments || [],
      });

      ctx.status = 200;
      ctx.body = { data: { message: 'Email sent successfully' } };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err) || 'Unknown error';
      const stack = err instanceof Error ? err.stack : undefined;

      // Log full error details
      strapi.log.error('Email send error:', { message, stack });

      ctx.status = 500;
      ctx.body = {
        error: {
          message: `Failed to send email: ${message}`,
          status: 'EMAIL_SERVICE_ERROR'
        }
      };
    }
  },
};
