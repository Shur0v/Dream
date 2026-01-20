# VPS Fixes Summary - Step by Step

এই document-এ সব fixes-এর summary আছে যা VPS-এ apply করতে হবে।

---

## 🔧 Fixed Issues:

### ✅ 1. Hero Banners POST Route Missing
**সমস্যা:** `/api/hero-banners` POST route Express backend-এ ছিল না  
**সমাধান:** `backend/express-routes/banners.ts`-এ POST route যোগ করা হয়েছে

### ✅ 2. Promo Banners POST Route Missing  
**সমস্যা:** `/api/promo-banners` POST route Express backend-এ ছিল না  
**সমাধান:** `backend/express-routes/banners.ts`-এ POST route যোগ করা হয়েছে

### ✅ 3. Festival Banners POST Route Missing
**সমস্যা:** `/api/festival-banners` POST route Express backend-এ ছিল না  
**সমাধান:** `backend/express-routes/banners.ts`-এ POST route যোগ করা হয়েছে

### ✅ 4. Products Data Not Showing
**সমস্যা:** Products MongoDB-এ save হচ্ছিল কিন্তু Express route JSON file থেকে পড়ছিল  
**সমাধান:** `backend/express-routes/products.ts` MongoDB functions ব্যবহার করছে এখন

---

## 🚀 VPS-এ Apply করার Steps:

### Step 1: Code Update করুন

```bash
# VPS-এ SSH করুন
ssh root@your-vps-ip

# Project directory-তে যান
cd /var/www/dreamshop

# Git থেকে latest code pull করুন (যদি Git use করেন)
git pull origin main

# অথবা manually files upload করুন:
# - backend/express-routes/banners.ts
# - backend/express-routes/products.ts
```

### Step 2: Dependencies Check করুন

```bash
cd /var/www/dreamshop

# Check if sharp is installed (image processing এর জন্য)
npm list sharp

# যদি না থাকে:
npm install sharp
```

### Step 3: Backend Rebuild করুন

```bash
cd /var/www/dreamshop

# Backend rebuild করুন
npm run backend:build

# Verify করুন build successful হয়েছে
ls -la backend/dist/server.js
```

### Step 4: PM2 Restart করুন

```bash
# Stop existing processes
pm2 stop all

# Delete old processes
pm2 delete all

# Start fresh
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save

# Check status
pm2 status

# Check logs
pm2 logs dreamshop-backend --lines 50
```

### Step 5: Test করুন

```bash
# Backend health check
curl http://localhost:5000/health

# Test hero-banners POST (should work now)
curl -X POST http://localhost:5000/api/hero-banners \
  -H "Content-Type: application/json" \
  -d '{"sliderImages":["/test.jpg"],"rightBanners":["/test2.jpg"],"isActive":true}'

# Test products GET (should show MongoDB data now)
curl http://localhost:5000/api/products?limit=5
```

---

## 🐛 Backend Crash Fix (3848 restarts)

Backend crash হওয়ার সম্ভাব্য কারণ:

1. **MongoDB Connection Issue**
   - `.env` file-এ `MONGODB_URI` check করুন
   - MongoDB Atlas-এ IP whitelist করুন (0.0.0.0/0)

2. **Missing Dependencies**
   ```bash
   npm install
   ```

3. **Build Issues**
   ```bash
   npm run backend:build
   ```

4. **Port Conflict**
   ```bash
   # Check if port 5000 is in use
   sudo netstat -tulpn | grep 5000
   
   # Kill process if needed
   sudo kill -9 <PID>
   ```

### Diagnostic Script Run করুন:

```bash
cd /var/www/dreamshop
chmod +x check-backend-health.sh
./check-backend-health.sh
```

---

## 📝 Verification Checklist:

- [ ] Code updated on VPS
- [ ] `npm install` completed
- [ ] `npm run backend:build` successful
- [ ] `backend/dist/server.js` exists
- [ ] PM2 processes restarted
- [ ] Backend logs show no errors
- [ ] `curl http://localhost:5000/health` returns success
- [ ] Hero banners POST works
- [ ] Products GET shows data from MongoDB
- [ ] Image upload works (`/api/upload-image`)

---

## 🔍 Troubleshooting:

### যদি Backend এখনও Crash করে:

```bash
# 1. Check logs
pm2 logs dreamshop-backend --err --lines 100

# 2. Check MongoDB connection manually
cd /var/www/dreamshop
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => { console.log('✅ Connected'); process.exit(0); })
  .catch(err => { console.log('❌ Error:', err.message); process.exit(1); });
"

# 3. Check .env file
cat .env | grep MONGODB_URI

# 4. Try running backend manually (without PM2)
cd /var/www/dreamshop
node backend/dist/server.js
# Check for errors in terminal
```

### যদি Products এখনও না আসে:

```bash
# 1. Check MongoDB directly
# MongoDB connection test করুন

# 2. Check if products exist in MongoDB
# MongoDB Compass বা mongo shell দিয়ে verify করুন

# 3. Check backend logs
pm2 logs dreamshop-backend | grep -i product

# 4. Test API directly
curl http://localhost:5000/api/products?limit=5
```

### যদি Image Upload কাজ না করে:

```bash
# 1. Check upload directory exists
ls -la public/uploads

# 2. Check permissions
sudo chmod -R 755 public/uploads

# 3. Check sharp is installed
npm list sharp

# 4. Test upload endpoint
curl -X POST http://localhost:5000/api/upload-image \
  -F "file=@/path/to/test-image.jpg"
```

---

## 📞 Additional Notes:

1. **Environment Variables:** Ensure `.env` file has:
   - `MONGODB_URI=your-connection-string`
   - `BACKEND_PORT=5000`
   - `NODE_ENV=production`

2. **File Permissions:**
   ```bash
   sudo chown -R $USER:$USER /var/www/dreamshop
   sudo chmod -R 755 /var/www/dreamshop
   ```

3. **Nginx Config:** Ensure Nginx is properly configured (see `NGINX_SETUP.md`)

4. **Firewall:** Ensure ports are open:
   ```bash
   sudo ufw allow 5000/tcp
   sudo ufw allow 3000/tcp
   ```

---

## ✅ Success Indicators:

যদি সব ঠিক থাকে, তাহলে:

1. ✅ PM2 status shows both processes as "online"
2. ✅ Backend logs show "MongoDB connection established"
3. ✅ `curl http://localhost:5000/health` returns JSON
4. ✅ Dashboard-এ products দেখা যাচ্ছে
5. ✅ Hero banners image upload কাজ করছে
6. ✅ All product pages-এ data দেখা যাচ্ছে

---

**Note:** যদি কোনো সমস্যা থাকে, `check-backend-health.sh` script run করুন এবং output share করুন।
