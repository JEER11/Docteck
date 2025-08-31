module.exports = {
  apps: [
    {
      name: 'server',
      script: 'index.js',
      instances: process.env.PM2_INSTANCES ? Number(process.env.PM2_INSTANCES) : 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '512M',
      time: true,
    },
  ],
};
