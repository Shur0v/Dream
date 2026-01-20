# 🚨 VPS Urgent Fix - Routes Not Working

## সমস্যা:
আগে সব routes কাজ করতো, এখন 404 দিচ্ছে।

## দ্রুত সমাধান:

### Option 1: Quick Fix Script (Recommended)

```bash
# VPS-এ SSH করুন
ssh root@your-vps-ip

# Script download করুন (যদি Git use করেন)
cd /var/www/dreamshop
git pull origin main

# Script executable করুন
chmod +x vps-quick-fix.sh

# Run করুন
./vps-quick-fix.sh
```

### Option 2: Manual Steps

```bash
# 1. VPS-এ SSH করুন
ssh root@your-vps-ip

# 2. Project directory-তে যান
cd /var/www/dreamshop

# 3. Latest code pull করুন
git pull origin main

# 4. Dependencies install করুন
npm install

# 5. Backend rebuild করুন
npm run backend:build

# 6. PM2 restart করুন
pm2 stop all
pm2 delete all
pm2 start ecosystem.config.js
pm2 save

# 7. Check করুন
pm2 status
pm2 logs dreamshop-backend --lines 50
```

### Option 3: যদি Git pull না করতে পারেন

```bash
# Manual file upload করুন:
# 1. backend/express-routes/banners.ts
# 2. backend/express-routes/products.ts
# 3. ecosystem.config.js

# তারপর:
cd /var/www/dreamshop
npm install
npm run backend:build
pm2 restart ecosystem.config.js
```

---

## ✅ Verification:

```bash
# Test endpoints
curl http://localhost:5000/health
curl http://localhost:5000/api/hero-banners
curl http://localhost:5000/api/products?limit=5
```

সব endpoint-এ JSON response আসা উচিত।

---

## 🐛 যদি এখনও কাজ না করে:

```bash
# 1. Check backend logs
pm2 logs dreamshop-backend --err --lines 100

# 2. Check MongoDB connection
cat .env | grep MONGODB_URI

# 3. Test backend manually
cd /var/www/dreamshop
node backend/dist/server.js
# Check for errors in terminal

# 4. Check Nginx config
sudo nginx -t
sudo systemctl status nginx
```

---

## 📝 Important Notes:

1. **Backend rebuild করা জরুরি** - নতুন routes add করা হয়েছে
2. **PM2 restart করা জরুরি** - পুরানো code cache থাকতে পারে
3. **MongoDB connection check করুন** - যদি backend crash করে

---

**Quick Fix Script run করার পর সব ঠিক হয়ে যাবে!**
