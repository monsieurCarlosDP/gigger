module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('EMAIL_HOST'),
        port: env.int('EMAIL_PORT'),
        secure: env.int('EMAIL_PORT') === 465,
        auth: {
          user: env('EMAIL_USER'),
          pass: env('EMAIL_PASS'),
        },
      },
      settings: {
        defaultFrom: env('EMAIL_FROM'),
        defaultReplyTo: env('EMAIL_FROM'),
      },
    },
  },
});
