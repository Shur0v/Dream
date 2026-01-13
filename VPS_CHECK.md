# VPS Data Loading Issue - Step by Step Fix

## সমস্যা: Frontend design দেখা যাচ্ছে কিন্তু data আসছে না

### Step 1: Backend Running Check করুন (সবচেয়ে গুরুত্বপূর্ণ)

```bash
# VPS-এ SSH login করুন
ssh root@your-vps-ip

# Project directory-তে যান
cd /var/www/dreamshop

# PM2 status check করুন
pm2 status
```

**Expected Output:**
```
┌─────┬──────────────────────┬─────────┬─────────┬──────────┐
│ id  │ name                 │ status  │ cpu     │ memory   │
├─────┼──────────────────────┼─────────┼─────────┼──────────┤
│ 0   │ dreamshop-backend    │ online  │ 0%      │ 50 MB    │
│ 1   │ dreamshop-frontend   │ online  │ 0%      │ 200 MB   │
└─────┴──────────────────────┴─────────┴─────────┴──────────┘
```

**যদি backend offline থাকে:**
```bash
pm2 restart dreamshop-backend
# অথবা
pm2 start ecosystem.config.js
pm2 save
```

### Step 2: Backend API Direct Test করুন

```bash
# Backend API test করুন (should return JSON data)
curl http://localhost:5000/api/products

# Categories test
curl http://localhost:5000/api/categories
```

**যদি error আসে:**
```bash
# Backend logs check করুন
pm2 logs dreamshop-backend --lines 50

# Common errors:
# - MongoDB connection error
# - Port already in use
# - Environment variables missing
```

### Step 3: Frontend API Calls Check করুন

Browser-এ F12 press করে:
1. **Network tab** open করুন
2. Page reload করুন
3. Failed requests দেখুন (red color)

**Common issues:**
- `Failed to fetch` → Backend running নেই
- `404 Not Found` → Nginx reverse proxy setup নেই
- `CORS error` → Backend CORS issue (rare, already configured)

### Step 4: Nginx Reverse Proxy Setup করুন

```bash
# Nginx config file create করুন
sudo nano /etc/nginx/sites-available/dreamshop
```

**এই content paste করুন (yourdomain.com replace করুন):**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    client_max_body_size 50M;

    # Frontend (Next.js) - Port 3000
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

    # Backend API - Port 5000
    # All /api/* requests go to Express backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Save করুন (Ctrl+X, Y, Enter)**

**Enable করুন:**
```bash
sudo ln -s /etc/nginx/sites-available/dreamshop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 5: Environment Variables Check করুন

```bash
cd /var/www/dreamshop

# .env file check করুন
cat .env

# Important variables:
# BACKEND_PORT=5000
# MONGODB_URI=your_mongodb_connection_string
# NEXT_PUBLIC_API_URL=http://yourdomain.com/api (optional)
```

**যদি .env file না থাকে:**
```bash
nano .env
```

**এই content add করুন:**
```env
BACKEND_PORT=5000
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=dream
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Step 6: Complete Restart করুন

```bash
cd /var/www/dreamshop

# Stop all
pm2 stop all

# Rebuild (if code changed)
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

### Step 7: Browser Console Check করুন

Browser-এ F12 → Console tab-এ check করুন:

```javascript
// API URL check
console.log('API URL:', window.location.origin + '/api');

// Test API call
fetch('/api/products')
  .then(r => r.json())
  .then(d => console.log('Products:', d))
  .catch(e => console.error('Error:', e));
```

### Step 8: Quick Diagnostic Script

VPS-এ run করুন:

```bash
cd /var/www/dreamshop

echo "=== PM2 Status ==="
pm2 status

echo ""
echo "=== Backend Port Check ==="
sudo lsof -i :5000 || echo "Backend not running on port 5000"

echo ""
echo "=== Frontend Port Check ==="
sudo lsof -i :3000 || echo "Frontend not running on port 3000"

echo ""
echo "=== Backend API Test ==="
curl -s http://localhost:5000/api/products | head -c 200

echo ""
echo ""
echo "=== Frontend Test ==="
curl -s http://localhost:3000 | head -c 200

echo ""
echo ""
echo "=== Nginx Status ==="
sudo systemctl status nginx | head -5

echo ""
echo "=== MongoDB Connection ==="
node -e "require('dotenv').config(); console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not Set')"
```

## Most Common Issues:

### Issue 1: Backend Not Running
**Solution:**
```bash
pm2 start ecosystem.config.js
pm2 save
```

### Issue 2: Nginx Not Configured
**Solution:** Step 4 follow করুন

### Issue 3: MongoDB Connection Failed
**Solution:**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check .env file
cat .env | grep MONGODB_URI
```

### Issue 4: Port Already in Use
**Solution:**
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>

# Restart backend
pm2 restart dreamshop-backend
```

## Verification:

After fixing, verify:

1. ✅ `pm2 status` shows both backend and frontend online
2. ✅ `curl http://localhost:5000/api/products` returns JSON
3. ✅ `curl http://localhost:3000` returns HTML
4. ✅ Browser Network tab shows successful API calls
5. ✅ Data appears on frontend

## Still Not Working?

1. Check PM2 logs: `pm2 logs --lines 100`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Check browser console for specific errors
4. Share error messages for further help
