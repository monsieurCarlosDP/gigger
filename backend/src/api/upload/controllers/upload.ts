import type { Context } from 'koa';
import * as fs from 'fs';
import * as path from 'path';

export default {
  async uploadPDF(ctx: Context) {
    try {
      const { filename, content } = ctx.request.body as {
        filename?: string;
        content?: string; // base64
      };

      if (!filename || !content) {
        ctx.status = 400;
        ctx.body = { error: { message: 'filename y content son obligatorios' } };
        return;
      }

      // Decode base64 to Buffer
      const buffer = Buffer.from(content, 'base64');

      // Create uploads directory in public folder
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'pdfs');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Sanitize filename and create unique name
      const sanitizedFilename = filename.replace(/[^a-z0-9._-]/gi, '_');
      const timestamp = Date.now();
      const uniqueFilename = `${timestamp}-${sanitizedFilename}`;
      const filePath = path.join(uploadDir, uniqueFilename);

      // Write file
      fs.writeFileSync(filePath, buffer);

      // Generate full public URL
      const protocol = ctx.protocol || 'http';
      const host = ctx.host || 'localhost:1337';
      const publicUrl = `${protocol}://${host}/uploads/pdfs/${uniqueFilename}`;

      ctx.status = 200;
      ctx.body = {
        data: {
          filename: uniqueFilename,
          url: publicUrl,
        },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      strapi.log.error('Upload PDF error:', message);
      ctx.status = 500;
      ctx.body = { error: { message: `Error al subir PDF: ${message}` } };
    }
  },
};
