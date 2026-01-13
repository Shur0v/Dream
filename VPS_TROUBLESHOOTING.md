# VPS Troubleshooting Guide - No Data Loading

যদি frontend design দেখা যাচ্ছে কিন্তু data আসছে না, এই guide follow করুন।

## সমস্যা: Frontend দেখা যাচ্ছে কিন্তু data আসছে না

### Step 1: Backend Running আছে কিনা Check করুন

```bash
# PM2 status check
pm2 status

# Backend logs check
pm2 logs dreamshop-backend

# Backend port check (5000)
sudo lsof -i :5000
# অথবা
netstat -tulpn | grep 5000
```

**সমাধান যদি backend running না থাকে:**
```bash
cd /var/www/dreamshop
pm2 start ecosystem.config.js
pm2 save
```

### Step 2: Frontend Running আছে কিনা Check করুন

```bash
# PM2 status check
pm2 status

# Frontend logs check
pm2 logs dreamshop-frontend

# Frontend port check (3000)
sudo lsof -i :3000
# অথবা
netstat -tulpn | grep 3000
```

**সমাধান যদি frontend running না থাকে:**
```bash
cd /var/www/dreamshop
pm2 restart dreamshop-frontend
```

### Step 3: Nginx Reverse Proxy Setup Check করুন

```bash
# Nginx config file check
sudo nano /etc/nginx/sites-available/dreamshop

# Nginx syntax test
sudo nginx -t

# Nginx status check
sudo systemctl status nginx

# Nginx reload (if config changed)
sudo systemctl reload nginx
```

**Nginx config example (nginx.conf.example file দেখুন):**
- `/api` requests → `http://localhost:5000` (backend)
- `/` requests → `http://localhost:3000` (frontend)

### Step 4: Browser Console Check করুন

Browser-এ F12 press করে Console tab-এ error messages check করুন:

```javascript
// Common errors:
// - Failed to fetch
// - Network error
// - CORS error
// - 404 Not Found
```

### Step 5: API Endpoint Test করুন

VPS-এ directly API test করুন:

```bash
# Backend API test (should return JSON)
curl http://localhost:5000/api/products

# Frontend test
curl http://localhost:3000

# Through Nginx (if configured)
curl http://yourdomain.com/api/products
```

### Step 6: Environment Variables Check করুন

```bash
cd /var/www/dreamshop

# Check .env file exists
ls -la .env

# Check important variables
cat .env | grep -E "BACKEND_PORT|NEXT_PUBLIC_API_URL|MONGODB_URI"
```

**Required variables:**
- `BACKEND_PORT=5000`
- `MONGODB_URI=your_mongodb_connection`
- `NEXT_PUBLIC_API_URL=http://yourdomain.com/api` (optional, auto-detected)

### Step 7: MongoDB Connection Check করুন

```bash
# MongoDB status
sudo systemctl status mongod
# অথবা
sudo systemctl status mongodb

# MongoDB connection test
cd /var/www/dreamshop
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(e => console.error('❌ Error:', e.message))"
```

### Step 8: Firewall Ports Check করুন

```bash
# Check if ports are open
sudo ufw status

# Open ports if needed
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp  # Frontend (if direct access needed)
sudo ufw allow 5000/tcp  # Backend (if direct access needed)
```

### Step 9: Build Check করুন

```bash
cd /var/www/dreamshop

# Check if backend is built
ls -la backend/dist/server.js

# Check if frontend is built
ls -la .next

# Rebuild if needed
npm run backend:build
npm run build
```

### Step 10: Complete Restart

```bash
cd /var/www/dreamshop

# Stop all
pm2 stop all

# Rebuild
npm run backend:build
npm run build

# Start all
pm2 start ecosystem.config.js

# Save
pm2 save

# Check status
pm2 status
pm2 logs
```

## Common Issues and Solutions

### Issue 1: "Failed to fetch" Error

**কারণ:** Backend running নেই অথবা wrong URL

**সমাধান:**
```bash
# Check backend
pm2 logs dreamshop-backend

# Restart backend
pm2 restart dreamshop-backend

# Check if backend responds
curl http://localhost:5000/api/products
```

### Issue 2: CORS Error

**কারণ:** Backend CORS configuration issue

**সমাধান:** Backend already has permissive CORS. Check backend logs:
```bash
pm2 logs dreamshop-backend | grep CORS
```

### Issue 3: 404 Not Found

**কারণ:** Nginx reverse proxy setup নেই

**সমাধান:** Nginx config setup করুন (nginx.conf.example দেখুন)

### Issue 4: Empty Data / No Products

**কারণ:** MongoDB connection issue অথবা database empty

**সমাধান:**
```bash
# Check MongoDB connection
pm2 logs dreamshop-backend | grep -i mongo

# Test MongoDB connection
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ Connected'); mongoose.connection.db.listCollections().toArray().then(cols => console.log('Collections:', cols.map(c => c.name))); }).catch(e => console.error('❌ Error:', e.message))"
```

### Issue 5: Port Already in Use

**কারণ:** Another process using same port

**সমাধান:**
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill process (replace PID)
sudo kill -9 <PID>

# Or kill all node processes (careful!)
pkill -f node
```

## Quick Fix Script

Create `fix-vps.sh`:

```bash
#!/bin/bash

echo "🔧 Fixing VPS issues..."

cd /var/www/dreamshop

# Stop all
pm2 stop all

# Kill processes on ports
sudo lsof -ti:3000 | xargs sudo kill -9 2>/dev/null || true
sudo lsof -ti:5000 | xargs sudo kill -9 2>/dev/null || true

# Rebuild
echo "📦 Rebuilding..."
npm run backend:build
npm run build

# Create logs directory
mkdir -p logs

# Start with PM2
echo "🚀 Starting PM2..."
pm2 start ecosystem.config.js
pm2 save

# Check status
echo ""
echo "📊 Status:"
pm2 status

echo ""
echo "✅ Done! Check logs with: pm2 logs"
```

Make executable and run:
```bash
chmod +x fix-vps.sh
./fix-vps.sh
```

## Verification Checklist

- [ ] Backend running (`pm2 status` shows `dreamshop-backend` online)
- [ ] Frontend running (`pm2 status` shows `dreamshop-frontend` online)
- [ ] Backend responds (`curl http://localhost:5000/api/products` returns JSON)
- [ ] Frontend responds (`curl http://localhost:3000` returns HTML)
- [ ] Nginx configured (`sudo nginx -t` passes)
- [ ] MongoDB connected (backend logs show connection success)
- [ ] Environment variables set (`.env` file exists with correct values)
- [ ] Ports open (firewall allows 80, 443)
- [ ] No port conflicts (`sudo lsof -i :3000` and `:5000` show correct processes)

## Still Not Working?

1. Check browser Network tab (F12 → Network) - see which requests are failing
2. Check PM2 logs: `pm2 logs --lines 100`
3. Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
4. Check system logs: `sudo journalctl -u nginx -f`
