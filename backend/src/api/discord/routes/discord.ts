export default {
  routes: [
    {
      method: 'GET',
      path: '/discord/channels',
      handler: 'discord.listChannels',
      config: {
        policies: [],
      },
    },
    {
      method: 'GET',
      path: '/discord/channels/:channelId/messages',
      handler: 'discord.getMessages',
      config: {
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/discord/channels/:channelId/messages',
      handler: 'discord.sendMessage',
      config: {
        policies: [],
      },
    },
  ],
};
