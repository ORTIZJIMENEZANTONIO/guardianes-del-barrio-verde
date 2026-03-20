// PM2 — Guardianes del Barrio Verde
// Agregar esta entrada al ecosystem.config.cjs de cercu-frontend
module.exports = {
  apps: [
    {
      name: 'guardianes',
      cwd: '/var/www/cercu-frontend/guardianes',
      script: '.output/server/index.mjs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3004,
      },
      max_memory_restart: '200M',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/pm2/guardianes-error.log',
      out_file: '/var/log/pm2/guardianes-out.log',
    },
  ],
};
