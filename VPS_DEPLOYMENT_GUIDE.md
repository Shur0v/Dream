# VPS Deployment Guide - dreamshopltd.com

## Overview
Complete guide for deploying frontend and backend to VPS in production build mode.

## Prerequisites
- VPS with Node.js 18+ installed
- PM2 installed globally (`npm install -g pm2`)
- MongoDB connection string
- Domain: `dreamshopltd.com`

## Step 1: Prepare Environment Variables

### Backend Environment (`backend/.env`)
```env
MONGODB_URI=your_mongodb_connection_string
BACKEND_PORT=5000
NODE_ENV=production
FRONTEND_URL=https://dreamshopltd.com
```

### Frontend Environment (`.env.local` or `.env.production`)
```env
NEXT_PUBLIC_API_URL=https://dreamshopltd.com/api
NODE_ENV=production
```

**Note**: If using reverse proxy (Nginx), `NEXT_PUBLIC_API_URL` can be `/api` (relative path)

## Step 2: Build Both Frontend and Backend

```bash
# Navigate to project directory
cd /var/www/dreamshop

# Install dependencies
pnpm install

# Build backend (TypeScript to JavaScript)
pnpm run backend:build

# Build frontend (Next.js production build)
pnpm run build
```

## Step 3: Update PM2 Ecosystem Config

The `ecosystem.config.js` is already configured for production. Verify:

```javascript
module.exports = {
  apps: [
    {
      name: 'dreamshop-backend',
      script: 'node',
      args: 'backend/dist/server.js',
      cwd: '/var/www/dreamshop',
      env: {
        NODE_ENV: 'production',
        BACKEND_PORT: 5000,
      },
    },
    {
      name: 'dreamshop-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/dreamshop',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

## Step 4: Start Services with PM2

```bash
# Stop existing processes (if any)
pm2 delete all

# Start both services
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command output to enable auto-start
```

## Step 5: Configure Nginx Reverse Proxy (Recommended)

Create `/etc/nginx/sites-available/dreamshopltd.com`:

```nginx
server {
    listen 80;
    server_name dreamshopltd.com www.dreamshopltd.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name dreamshopltd.com www.dreamshopltd.com;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/dreamshopltd.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dreamshopltd.com/privkey.pem;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (Express)
    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers (backend also handles CORS, but Nginx can add extra)
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
        add_header Access-Control-Allow-Headers 'Content-Type, Authorization, X-Requested-With' always;
        
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
            add_header Access-Control-Allow-Headers 'Content-Type, Authorization, X-Requested-With' always;
            add_header Access-Control-Max-Age 86400;
            add_header Content-Type 'text/plain charset=UTF-8';
            add_header Content-Length 0;
            return 204;
        }
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000/health;
        access_log off;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/dreamshopltd.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: Verify Deployment

### Check PM2 Status
```bash
pm2 status
pm2 logs
```

### Check Backend Health
```bash
curl http://localhost:5000/health
curl https://dreamshopltd.com/api/health
```

### Check Frontend
```bash
curl http://localhost:3000
curl https://dreamshopltd.com
```

### Check CORS
Open browser console on `https://dreamshopltd.com` and check for CORS errors.

## Step 7: Monitor Logs

```bash
# View all logs
pm2 logs

# View backend logs only
pm2 logs dreamshop-backend

# View frontend logs only
pm2 logs dreamshop-frontend

# View logs in real-time
pm2 logs --lines 100
```

## Troubleshooting

### CORS Errors
1. **Backend CORS**: Already configured to allow all origins (`origin: true`)
2. **Nginx CORS**: Added CORS headers in Nginx config
3. **API URL**: Ensure `NEXT_PUBLIC_API_URL` is set correctly

### Port Already in Use
```bash
# Check what's using port 5000
sudo lsof -i :5000

# Check what's using port 3000
sudo lsof -i :3000

# Kill process if needed
sudo kill -9 <PID>
```

### Build Errors
```bash
# Clean and rebuild
rm -rf .next node_modules backend/dist
pnpm install
pnpm run backend:build
pnpm run build
```

### PM2 Process Crashes
```bash
# Check error logs
pm2 logs dreamshop-backend --err
pm2 logs dreamshop-frontend --err

# Restart processes
pm2 restart all

# Check system resources
pm2 monit
```

## Production Checklist

- [ ] Backend `.env` configured with MongoDB URI
- [ ] Frontend `.env.local` configured with API URL
- [ ] Backend built successfully (`backend/dist/server.js` exists)
- [ ] Frontend built successfully (`.next` folder exists)
- [ ] PM2 processes running (`pm2 status` shows both processes)
- [ ] Nginx configured and reloaded
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] Health check endpoint working (`/api/health`)
- [ ] Frontend accessible (`https://dreamshopltd.com`)
- [ ] No CORS errors in browser console
- [ ] Database connection working
- [ ] API endpoints responding correctly

## Quick Deployment Script

Create `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project
cd /var/www/dreamshop

# Pull latest code (if using git)
# git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build backend
echo "🔨 Building backend..."
pnpm run backend:build

# Build frontend
echo "🔨 Building frontend..."
pnpm run build

# Restart PM2 processes
echo "🔄 Restarting services..."
pm2 restart all

# Show status
echo "✅ Deployment complete!"
pm2 status
```

Make executable:
```bash
chmod +x deploy.sh
```

Run deployment:
```bash
./deploy.sh
```

## API URL Configuration

The app automatically detects the API URL based on the domain:

- **Production** (`dreamshopltd.com`): Uses `/api` (reverse proxy) or `https://dreamshopltd.com/api`
- **Development** (`localhost`): Uses `http://localhost:5000/api`

No manual configuration needed if using reverse proxy!

## Security Notes

1. **CORS**: Backend allows all origins in production (can be restricted if needed)
2. **Environment Variables**: Never commit `.env` files
3. **SSL**: Always use HTTPS in production
4. **Firewall**: Only expose ports 80, 443 (Nginx), not 3000, 5000 directly

---

**Status**: ✅ Ready for production deployment!

