/**
 * PM2 Ecosystem Configuration
 * Manages both backend and frontend servers
 */

module.exports = {
  apps: [
    {
      name: 'dreamshop-backend',
      script: 'node',
      args: 'backend/dist/server.js',
      cwd: '/var/www/dreamshop',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        BACKEND_PORT: 5000,
      },
      error_file: '/var/www/dreamshop/logs/backend-error.log',
      out_file: '/var/www/dreamshop/logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
    },
    {
      name: 'dreamshop-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/dreamshop',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/www/dreamshop/logs/frontend-error.log',
      out_file: '/var/www/dreamshop/logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
    },
  ],
};


