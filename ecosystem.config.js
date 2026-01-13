/**
 * PM2 Ecosystem Configuration
 * Manages both backend and frontend servers
 * 
 * Usage on VPS:
 * 1. Build backend: npm run backend:build
 * 2. Build frontend: npm run build
 * 3. Start both: pm2 start ecosystem.config.js
 * 4. Save PM2 config: pm2 save
 * 5. Setup startup: pm2 startup
 */

const path = require('path');

module.exports = {
  apps: [
    {
      name: 'dreamshop-backend',
      script: 'node',
      args: 'backend/dist/backend/server.js',
      cwd: process.cwd(),
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        BACKEND_PORT: process.env.BACKEND_PORT || 5000,
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '500M',
      watch: false,
    },
    {
      name: 'dreamshop-frontend',
      script: 'npm',
      args: 'start',
      cwd: process.cwd(),
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 3000,
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
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


