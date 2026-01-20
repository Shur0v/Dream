# ⚠️ VPS Update Instructions - IMPORTANT!

## Code Pull করার পর অবশ্যই করুন:

### 🚨 Critical Steps (Every Time After Git Pull):

```bash
# VPS-এ SSH করুন
ssh root@your-vps-ip

# Project directory-তে যান
cd /var/www/dreamshop

# Code pull করুন
git pull origin main

# ⚠️ IMPORTANT: Fix script run করুন (এই step skip করবেন না!)
chmod +x fix-after-pull.sh
./fix-after-pull.sh
```

---

## কেন এই script run করতে হবে?

1. **Backend Rebuild:** TypeScript code change হলে rebuild করতে হবে
2. **PM2 Restart:** নতুন code load করার জন্য restart করতে হবে
3. **Dependencies:** নতুন packages থাকলে install করতে হবে
4. **Verification:** সব কিছু ঠিক আছে কিনা check করতে হবে

---

## Quick Command (One-liner):

```bash
cd /var/www/dreamshop && git pull origin main && chmod +x fix-after-pull.sh && ./fix-after-pull.sh
```

---

## Manual Steps (যদি script কাজ না করে):

```bash
cd /var/www/dreamshop
git pull origin main
npm install
npm run backend:build
pm2 stop all
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
pm2 logs dreamshop-backend --lines 50
```

---

## ⚠️ Common Mistakes:

1. ❌ **Code pull করেই থেমে যাওয়া** - Backend rebuild করতে হবে!
2. ❌ **PM2 restart না করা** - Old code running থাকবে!
3. ❌ **Build check না করা** - Errors miss হবে!

---

## ✅ Success Indicators:

Script run করার পর দেখবেন:
- ✅ Backend built successfully
- ✅ PM2 status shows "online"
- ✅ MongoDB connection established
- ✅ All endpoints return JSON (not 404)

---

## 🐛 Troubleshooting:

### যদি Data এখনও না আসে:

```bash
# 1. Check backend logs
pm2 logs dreamshop-backend --err --lines 100

# 2. Check if backend is running
pm2 status

# 3. Check MongoDB connection
pm2 logs dreamshop-backend | grep -i mongo

# 4. Test manually
curl http://localhost:5000/health
curl http://localhost:5000/api/products?limit=1
```

### যদি Backend Crash করে:

```bash
# Check .env file
cat .env | grep MONGODB_URI

# Test MongoDB connection manually
node -e "
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => { console.log('✅ Connected'); process.exit(0); })
  .catch(err => { console.log('❌ Error:', err.message); process.exit(1); });
"
```

---

**Remember: Code pull করার পর সবসময় `fix-after-pull.sh` run করুন!**
