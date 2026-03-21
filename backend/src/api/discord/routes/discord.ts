export default {
  routes: [
    {
      method: 'GET',
      path: '/discord/categories',
      handler: 'discord.listCategories',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
    {
      method: 'GET',
      path: '/discord/channels',
      handler: 'discord.listChannels',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
    {
      method: 'POST',
      path: '/discord/channels',
      handler: 'discord.createChannel',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
    {
      method: 'POST',
      path: '/discord/categories',
      handler: 'discord.createCategory',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
    {
      method: 'GET',
      path: '/discord/channels/:channelId/messages',
      handler: 'discord.getMessages',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
    {
      method: 'POST',
      path: '/discord/channels/:channelId/messages',
      handler: 'discord.sendMessage',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
    {
      method: 'POST',
      path: '/discord/channels/:channelId/welcome',
      handler: 'discord.sendWelcomeMessage',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
  ],
};
