export default {
  routes: [
    {
      method: 'POST',
      path: '/upload/pdf',
      handler: 'upload.uploadPDF',
      config: {
        policies: ['global::isAuthenticated'],
      },
    },
  ],
};
