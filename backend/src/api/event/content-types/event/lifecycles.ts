interface NotificationsConfig {
  whatsapp: boolean;
  email: boolean;
}

export default {
  async beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    validateBudgetAccepted(event.params.data);
    handleCancelledDate(event.params.data);
    await assignBudgetNumbers(event.params.data);
    // Leer Notifications desde ctx.state (fue extraído en el controller antes de la validación del schema)
    const ctx = strapi.requestContext.get();
    (event as any)._notifications = (ctx?.state?.notifications as NotificationsConfig | undefined) ?? { whatsapp: true, email: true };
  },

  async afterCreate(event: { result: Record<string, unknown> }) {
    // draftAndPublish dispara afterCreate dos veces (draft + published), solo ejecutar una
    if (event.result.publishedAt === null) return;
    const notifications: NotificationsConfig = (event as any)._notifications ?? { whatsapp: true, email: true };
    await sendEventNotifications(event.result, notifications);
  },

  async beforeUpdate(event: { params: { data: Record<string, unknown> } }) {
    validateBudgetAccepted(event.params.data);
    handleCancelledDate(event.params.data);
    await assignBudgetNumbers(event.params.data);
  },
};

interface PersonWithTags {
  documentId: string;
  Name: string;
  Email?: string;
  Number?: string | bigint;
  tags?: { Name: string }[];
}

const GIG_TYPE_LABELS: Record<string, string> = {
  Wedding: '💍 Boda',
  Party: '🎊 Fiesta',
  Village: '🏘️ Pueblo',
  Gig: '🎸 Concierto',
};

async function sendEventNotifications(data: Record<string, unknown>, notifications: NotificationsConfig) {
  try {
    if (data.Type !== 'Event') return;

    const gigType = data.GigType as string | undefined;
    const isWedding = gigType === 'Wedding';
    const isOtherGig = gigType === 'Party' || gigType === 'Village' || gigType === 'Gig';

    if (!isWedding && !isOtherGig) return;

    const startDate = data.StartDate as string | undefined;
    const location = data.Location as string | undefined;
    const distance = data.Distance as number | undefined;

    if (!startDate || !location) return;

    const [year, month, day] = startDate.split('-');

    // Obtener contactos del evento con sus tags
    const eventDoc = await strapi.documents('api::event.event').findOne({
      documentId: data.documentId as string,
      populate: { contacts: { populate: ['tags'] } },
    });

    const contacts = (eventDoc?.contacts ?? []) as PersonWithTags[];
    const novios = contacts.filter((c) => c.tags?.some((t) => t.Name === 'Novio' || t.Name === 'Novia'));
    const otros = contacts.filter((c) => !novios.some((n) => n.documentId === c.documentId));

    const noviosLine = novios.length > 0
      ? novios.map((n) => n.Name).join(' & ')
      : 'Sin especificar';

    const otrosLines = otros.length > 0
      ? otros.map((c) => `• ${c.Name}${c.Number ? ` — ${c.Number}` : ''}${c.Email ? ` — ${c.Email}` : ''}`).join('\n')
      : '• Sin especificar';

    const gigLabel = GIG_TYPE_LABELS[gigType ?? ''] ?? '🎵 Bolo';

    let whatsappMessage: string;

    if (isWedding) {
      whatsappMessage =
        `🎉 *¡Nuevo bolo en el sistema!*\n\n` +
        `📅 *Fecha:* ${day}/${month}/${year}\n` +
        `📍 *Lugar:* ${location}\n` +
        `💍 *Novios:* ${noviosLine}\n\n`;
    } else {
      whatsappMessage =
        `${gigLabel} — *${location}*\n\n` +
        `📅 *Fecha:* ${day}/${month}/${year}\n` +
        `📍 *Lugar:* ${location}\n` +
        `${distance ? `🚗 *Distancia:* ${distance} km\n` : ''}` +
        `👤 *Contacto:*\n${otrosLines}\n\n`;
    }

    // Enviar notificación por WhatsApp
    const whatsappGroupId = process.env.WHATSAPP_EVENT_GROUP_ID;
    if (notifications.whatsapp && whatsappGroupId) {
      await strapi.service('api::whatsapp.whatsapp').sendMessage(whatsappGroupId, whatsappMessage);
      strapi.log.info(`[WhatsApp] Notificación enviada al grupo ${whatsappGroupId}`);
    }

    // Enviar email de confirmación a los novios (solo bodas)
    if (!isWedding || !notifications.email) return;
    const noviosConEmail = novios.filter((n) => n.Email);
    for (const novio of noviosConEmail) {
      const html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #333;">🎉 ¡Hemos recibido tu solicitud!</h2>
          <p>Hola <strong>${novio.Name}</strong>, muchas gracias por contactarnos. Aquí tienes un resumen de tu solicitud:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <tr><td style="padding: 8px; color: #666;">📅 Fecha</td><td style="padding: 8px;"><strong>${day}/${month}/${year}</strong></td></tr>
            <tr style="background:#f9f9f9;"><td style="padding: 8px; color: #666;">📍 Lugar</td><td style="padding: 8px;"><strong>${location}</strong></td></tr>
            <tr><td style="padding: 8px; color: #666;">💍 Novios</td><td style="padding: 8px;"><strong>${noviosLine}</strong></td></tr>
          </table>
          <p>Nos pondremos en contacto con vosotros lo antes posible.</p>
          <p style="color: #999; font-size: 12px;">EfectiviWonders</p>
        </div>
      `;

      await strapi.service('plugin::email.email').send({
        to: novio.Email,
        from: process.env.EMAIL_FROM,
        subject: '🎉 ¡Hemos recibido tu solicitud! — EfectiviWonders',
        html,
      });

      strapi.log.info(`[Email] Confirmación enviada a ${novio.Email}`);
    }
  } catch (err) {
    strapi.log.error('[Notifications] Error al enviar notificaciones del evento:', err);
  }
}

function handleCancelledDate(data: Record<string, unknown>) {
  if (!('Status' in data)) return;
  if (data.Status === 'Cancelled') {
    if (!data.CancelledDate) {
      data.CancelledDate = new Date().toISOString().split('T')[0];
    }
  } else {
    data.CancelledDate = null;
  }
}

interface BudgetEntry {
  BudgetNumber?: string | null;
  [key: string]: unknown;
}

async function assignBudgetNumbers(data: Record<string, unknown>) {
  const budget = data?.Budget;
  if (!Array.isArray(budget) || budget.length === 0) return;

  const newBudgets = (budget as BudgetEntry[]).filter((b) => !b.BudgetNumber);
  if (newBudgets.length === 0) return;

  // Read current counter from Info single type
  const info = await strapi.documents('api::info.info').findFirst();
  if (!info) return; // Si no existe info, no actualizar contador

  let counter = Number(info.BudgetCounter) || 0;

  // Assign numbers to new budgets
  for (const b of newBudgets) {
    counter += 1;
    b.BudgetNumber = String(counter);
  }

  // Update counter
  await strapi.documents('api::info.info').update({
    documentId: info.documentId,
    data: { BudgetCounter: counter } as Record<string, unknown>,
  });
}

function validateBudgetAccepted(data: Record<string, unknown>) {
  const budget = data?.Budget;
  if (!Array.isArray(budget) || budget.length === 0) return;

  // Buscar si hay algún budget aceptado
  const acceptedIndex = budget.findIndex(
    (item: { Accepted?: boolean }) => item.Accepted === true
  );

  // Si hay un aceptado, poner todos los demás en false
  if (acceptedIndex !== -1) {
    budget.forEach((item: Record<string, unknown>, index: number) => {
      (item as { Accepted?: boolean }).Accepted = index === acceptedIndex;
    });
  }
}
