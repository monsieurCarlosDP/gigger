export default {
  routes: [
    {
      method: 'PUT',
      path: '/profile/avatar',
      handler: 'profile.updateAvatar',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
    {
      method: 'POST',
      path: '/profile/viability',
      handler: 'profile.createViability',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
    {
      method: 'GET',
      path: '/profile/my-viability',
      handler: 'profile.getViability',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
  ],
};
