/**
 * PM2 Ecosystem Configuration
 * Single app process for Dreamshop (Next.js app with API routes)
 */

module.exports = {
  apps: [
    {
      name: 'dreamshop',
      script: 'npm',
      args: 'run start:all',
      cwd: process.cwd(),
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
      },
      error_file: './logs/dreamshop-error.log',
      out_file: './logs/dreamshop-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      watch: false,
    },
  ],
};
