export default {
  routes: [
    {
      method: 'GET',
      path: '/whatsapp/status',
      handler: 'whatsapp.getStatus',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
    {
      method: 'GET',
      path: '/whatsapp/chats',
      handler: 'whatsapp.getChats',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
    {
      method: 'GET',
      path: '/whatsapp/groups',
      handler: 'whatsapp.getGroups',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
    {
      method: 'POST',
      path: '/whatsapp/send',
      handler: 'whatsapp.sendMessage',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
  ],
};
