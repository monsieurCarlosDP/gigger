const DISCORD_API = 'https://discord.com/api/v10';

function getConfig() {
  const token = process.env.DISCORD_BOT_TOKEN;
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!token || !guildId) {
    throw new Error('DISCORD_BOT_TOKEN and DISCORD_GUILD_ID must be set');
  }
  return { token, guildId };
}

async function discordFetch<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  const { token } = getConfig();
  const res = await fetch(`${DISCORD_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Discord API error ${res.status}: ${body}`);
  }
  return res.json() as T;
}

interface DiscordChannel {
  id: string;
  name: string;
  type: number;
  parent_id: string | null;
  position: number;
}

interface DiscordAuthor {
  id: string;
  username: string;
  avatar: string | null;
  bot?: boolean;
}

interface DiscordMessage {
  id: string;
  content: string;
  author: DiscordAuthor;
  timestamp: string;
  edited_timestamp: string | null;
  attachments: { id: string; filename: string; url: string }[];
  webhook_id?: string;
}

// In-memory cache for webhook URLs per channel
const webhookCache = new Map<string, { id: string; token: string }>();

async function getOrCreateWebhook(channelId: string): Promise<{ id: string; token: string }> {
  const cached = webhookCache.get(channelId);
  if (cached) return cached;

  // List existing webhooks for the channel
  const webhooks = await discordFetch<{ id: string; token: string; name: string }[]>(
    `/channels/${channelId}/webhooks`,
  );

  // Look for our webhook
  const existing = webhooks.find((w) => w.name === 'Gigger');
  if (existing) {
    const entry = { id: existing.id, token: existing.token };
    webhookCache.set(channelId, entry);
    return entry;
  }

  // Create a new one
  const created = await discordFetch<{ id: string; token: string }>(
    `/channels/${channelId}/webhooks`,
    {
      method: 'POST',
      body: JSON.stringify({ name: 'Gigger' }),
    },
  );

  const entry = { id: created.id, token: created.token };
  webhookCache.set(channelId, entry);
  return entry;
}

function buildAvatarUrl(avatar: Record<string, unknown> | null): string | undefined {
  if (!avatar || !avatar.top) return undefined;

  const params = new URLSearchParams();
  const fields = [
    'top', 'accessories', 'facialHair', 'clothing', 'clothingGraphic',
    'eyes', 'eyebrows', 'mouth', 'skinColor', 'hairColor', 'clothesColor',
    'facialHairColor', 'hatColor',
  ];

  for (const field of fields) {
    const val = avatar[field];
    if (val && typeof val === 'string') params.set(field, val);
  }

  if (avatar.accessories) params.set('accessoriesProbability', '100');
  if (avatar.facialHair) params.set('facialHairProbability', '100');

  return `https://api.dicebear.com/9.x/avataaars/png?${params.toString()}`;
}

export default {
  async listChannels() {
    const { guildId } = getConfig();
    const channels = await discordFetch<DiscordChannel[]>(`/guilds/${guildId}/channels`);

    // type 0 = text channel
    return channels
      .filter((ch) => ch.type === 0)
      .map((ch) => ({
        id: ch.id,
        name: ch.name,
        categoryId: ch.parent_id,
        position: ch.position,
      }))
      .sort((a, b) => a.position - b.position);
  },

  async createChannel(name: string, categoryId?: string) {
    const { guildId } = getConfig();
    const body: Record<string, unknown> = {
      name,
      type: 0, // text channel
    };
    if (categoryId) body.parent_id = categoryId;

    const channel = await discordFetch<DiscordChannel>(`/guilds/${guildId}/channels`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return {
      id: channel.id,
      name: channel.name,
      categoryId: channel.parent_id,
      position: channel.position,
    };
  },

  async sendMessage(
    channelId: string,
    content: string,
    sender?: { displayName: string; avatar: Record<string, unknown> | null },
  ) {
    if (sender) {
      // Send via webhook with user identity
      const webhook = await getOrCreateWebhook(channelId);
      const avatarUrl = buildAvatarUrl(sender.avatar);

      const body: Record<string, unknown> = {
        content,
        username: sender.displayName,
      };
      if (avatarUrl) body.avatar_url = avatarUrl;

      const message = await discordFetch<DiscordMessage>(
        `/webhooks/${webhook.id}/${webhook.token}?wait=true`,
        { method: 'POST', body: JSON.stringify(body) },
      );

      return {
        id: message.id,
        content: message.content,
        author: {
          id: message.author.id,
          username: message.author.username,
          avatar: message.author.avatar
            ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=64`
            : null,
          bot: message.author.bot ?? false,
        },
        timestamp: message.timestamp,
        editedAt: message.edited_timestamp,
        attachments: message.attachments.map((a) => ({
          id: a.id,
          filename: a.filename,
          url: a.url,
        })),
      };
    }

    // Fallback: send as bot
    const message = await discordFetch<DiscordMessage>(`/channels/${channelId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });

    return {
      id: message.id,
      content: message.content,
      author: {
        id: message.author.id,
        username: message.author.username,
        avatar: message.author.avatar
          ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png?size=64`
          : null,
        bot: message.author.bot ?? false,
      },
      timestamp: message.timestamp,
      editedAt: message.edited_timestamp,
      attachments: message.attachments.map((a) => ({
        id: a.id,
        filename: a.filename,
        url: a.url,
      })),
    };
  },

  async getMessages(channelId: string, options?: { before?: string; limit?: number }) {
    const limit = Math.min(options?.limit ?? 50, 100);
    const params = new URLSearchParams({ limit: String(limit) });
    if (options?.before) params.set('before', options.before);

    const messages = await discordFetch<DiscordMessage[]>(
      `/channels/${channelId}/messages?${params}`,
    );

    return messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      author: {
        id: msg.author.id,
        username: msg.author.username,
        avatar: msg.author.avatar
          ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png?size=64`
          : null,
        bot: msg.author.bot ?? false,
      },
      isWebhook: !!msg.webhook_id,
      timestamp: msg.timestamp,
      editedAt: msg.edited_timestamp,
      attachments: msg.attachments.map((a) => ({
        id: a.id,
        filename: a.filename,
        url: a.url,
      })),
    }));
  },
};
