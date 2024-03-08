module.exports = {
  apps: [
    {
      name: 'mongo-auth',
      script: 'server.js',
      instances: 4,
      exec_mode: 'cluster',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
