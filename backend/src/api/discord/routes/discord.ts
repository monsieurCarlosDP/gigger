export default {
  routes: [
    {
      method: 'GET',
      path: '/discord/channels',
      handler: 'discord.listChannels',
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
  ],
};
