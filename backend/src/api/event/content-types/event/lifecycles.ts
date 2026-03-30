export default {
  async beforeCreate(event: { params: { data: Record<string, unknown> } }) {
    validateBudgetAccepted(event.params.data);
    handleCancelledDate(event.params.data);
    await assignBudgetNumbers(event.params.data);
  },

  async afterCreate(event: { result: Record<string, unknown> }) {
    // draftAndPublish dispara afterCreate dos veces (draft + published), solo ejecutar una
    if (event.result.publishedAt === null) return;
    await createDiscordChannelForEvent(event.result);
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

async function createDiscordChannelForEvent(data: Record<string, unknown>) {
  try {
    const startDate = data.StartDate as string | undefined;
    const location = data.Location as string | undefined;

    if (!startDate || !location) return;

    const [year, month, day] = startDate.split('-');
    const slug = location.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const channelName = `${day}-${month}-${year}-${slug}`;

    const categoryId = await strapi.service('api::discord.discord').findCategoryByName('📅PETICIONES ABIERTAS');
    if (!categoryId) {
      strapi.log.warn('[Discord] Categoría "📅PETICIONES ABIERTAS" no encontrada');
      return;
    }

    const channel = await strapi.service('api::discord.discord').createChannel(channelName, categoryId);

    await strapi.documents('api::event.event').update({
      documentId: data.documentId as string,
      data: { DiscordChannelId: channel.id },
    });

    strapi.log.info(`[Discord] Canal creado: ${channelName} (${channel.id})`);

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

    const welcomeMessage =
      `@everyone 🎉 ¡Nuevo bolo!\n\n` +
      `📅 **Fecha:** ${day}/${month}/${year}\n` +
      `📍 **Lugar:** ${location}\n` +
      `💍 **Novios:** ${noviosLine}\n` +
      `👤 **Personas de contacto:**\n${otrosLines}`;

    await strapi.service('api::discord.discord').sendMessage(channel.id, welcomeMessage, undefined);

    strapi.log.info(`[Discord] Mensaje de bienvenida enviado al canal ${channel.id}`);

    // Enviar notificación por WhatsApp
    const whatsappGroupId = process.env.WHATSAPP_EVENT_GROUP_ID;
    strapi.log.info(`[WhatsApp] Group ID: ${whatsappGroupId ?? 'NO DEFINIDO'}`);
    if (whatsappGroupId) {
      const guildId = process.env.DISCORD_GUILD_ID;
      const discordUrl = `https://discord.com/channels/${guildId}/${channel.id}`;

      const whatsappMessage =
        `🎉 *¡Nuevo bolo en el sistema!*\n\n` +
        `📅 *Fecha:* ${day}/${month}/${year}\n` +
        `📍 *Lugar:* ${location}\n` +
        `💍 *Novios:* ${noviosLine}\n\n` +
        `💬 Canal de Discord:\n${discordUrl}`;

      await strapi.service('api::whatsapp.whatsapp').sendMessage(whatsappGroupId, whatsappMessage);
      strapi.log.info(`[WhatsApp] Notificación enviada al grupo ${whatsappGroupId}`);
    }
  } catch (err) {
    strapi.log.error('[Discord] Error al crear canal para evento:', err);
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
