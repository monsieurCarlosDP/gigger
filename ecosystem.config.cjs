module.exports = {
  apps: [
    {
      name: 'gigger-backend',
      cwd: '/var/www/gigger/backend',
      script: 'npm',
      args: 'run dev',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'gigger-frontend',
      cwd: '/var/www/gigger/frontend',
      script: 'npm',
      args: 'run dev',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'gigger-client',
      cwd: '/var/www/gigger/client-form',
      script: 'npm',
      args: 'run dev',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
