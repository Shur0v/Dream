# VPS এ সাইট লাইভ করার সম্পূর্ণ গাইড (Step by Step)

এই গাইডে আপনার Next.js + Express backend সাইট VPS-এ deploy করার সব steps আছে।

---

## 📋 প্রয়োজনীয় জিনিস

1. **VPS Server** (Ubuntu 20.04/22.04 recommended)
2. **Domain Name** (যেমন: dreamshopltd.com)
3. **SSH Access** (VPS-এর IP address এবং root/user credentials)
4. **MongoDB Connection String** (MongoDB Atlas বা local MongoDB)

---

## 🚀 Step 1: VPS Server Setup

### 1.1 VPS-এ SSH Connect করুন

```bash
ssh root@your-vps-ip
# অথবা
ssh username@your-vps-ip
```

### 1.2 System Update করুন

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.3 Node.js Install করুন (v18 বা তার উপরে)

```bash
# Node.js v20 install করুন
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify করুন
node --version
npm --version
```

### 1.4 PM2 Install করুন (Process Manager)

```bash
sudo npm install -g pm2
```

### 1.5 Nginx Install করুন (Web Server)

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 1.6 Git Install করুন

```bash
sudo apt install git -y
```

---

## 📁 Step 2: Project Upload করুন VPS-এ

### Option A: Git থেকে Clone করুন (Recommended)

```bash
# Project directory তৈরি করুন
sudo mkdir -p /var/www
cd /var/www

# Git repository clone করুন
sudo git clone https://github.com/your-username/dream.git
# অথবা আপনার repository URL

# Ownership change করুন
sudo chown -R $USER:$USER /var/www/dream
cd /var/www/dream
```

### Option B: SCP দিয়ে Upload করুন (Local থেকে)

**Local Terminal এ:**
```bash
# Project folder compress করুন
tar -czf dream.tar.gz dream/

# VPS-এ upload করুন
scp dream.tar.gz username@your-vps-ip:/var/www/

# VPS-এ SSH করুন এবং extract করুন
ssh username@your-vps-ip
cd /var/www
tar -xzf dream.tar.gz
cd dream
```

---

## ⚙️ Step 3: Environment Variables Setup

### 3.1 .env File তৈরি করুন

```bash
cd /var/www/dream
nano .env
```

### 3.2 এই Variables গুলো add করুন:

```env
# Node Environment
NODE_ENV=production

# Backend Port
BACKEND_PORT=5000

# Frontend Port
PORT=3000

# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dreamshop?retryWrites=true&w=majority
# অথবা local MongoDB: mongodb://localhost:27017/dreamshop

# JWT Secret (যেকোনো random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary (যদি image upload use করেন)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# API Base URL
NEXT_PUBLIC_API_URL=https://dreamshopltd.com/api
# অথবা: http://your-vps-ip/api (development এর জন্য)
```

**Save করুন:** `Ctrl+X`, `Y`, `Enter`

---

## 🔨 Step 4: Dependencies Install করুন

```bash
cd /var/www/dream

# npm install করুন
npm install

# অথবা pnpm ব্যবহার করলে:
npm install -g pnpm
pnpm install
```

---

## 🏗️ Step 5: Build Project

### 5.1 Backend Build করুন

```bash
npm run backend:build
```

**Check করুন:** `backend/dist/server.js` file তৈরি হয়েছে কিনা

```bash
ls -la backend/dist/server.js
```

### 5.2 Frontend Build করুন

```bash
npm run build
```

**Check করুন:** `.next` folder তৈরি হয়েছে কিনা

```bash
ls -la .next
```

---

## 🎯 Step 6: PM2 Setup (Process Manager)

### 6.1 Logs Directory তৈরি করুন

```bash
mkdir -p logs
```

### 6.2 PM2 দিয়ে Start করুন

```bash
pm2 start ecosystem.config.js
```

### 6.3 PM2 Status Check করুন

```bash
pm2 status
```

**Expected Output:**
```
┌─────┬──────────────────────┬─────────┬─────────┬──────────┐
│ id  │ name                 │ status  │ restart │ uptime   │
├─────┼──────────────────────┼─────────┼─────────┼──────────┤
│ 0   │ dreamshop-backend    │ online  │ 0       │ 5s       │
│ 1   │ dreamshop-frontend   │ online  │ 0       │ 5s       │
└─────┴──────────────────────┴─────────┴─────────┴──────────┘
```

### 6.4 PM2 Logs Check করুন

```bash
# সব logs দেখুন
pm2 logs

# শুধু backend logs
pm2 logs dreamshop-backend

# শুধু frontend logs
pm2 logs dreamshop-frontend
```

### 6.5 PM2 Save করুন (Auto-start on reboot)

```bash
pm2 save
pm2 startup
```

**Last command-এর output-এ একটা command দেবে, সেটা run করুন:**
```bash
# Example output:
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u username --hp /home/username
```

---

## 🌐 Step 7: Nginx Configuration

### 7.1 Nginx Config File তৈরি করুন

```bash
sudo nano /etc/nginx/sites-available/dreamshop
```

### 7.2 এই Content Paste করুন:

```nginx
server {
    listen 80;
    server_name dreamshopltd.com www.dreamshopltd.com;

    # Increase body size for file uploads
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Backend API - Port 5000
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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

**Save করুন:** `Ctrl+X`, `Y`, `Enter`

### 7.3 Site Enable করুন

```bash
# Symlink তৈরি করুন
sudo ln -s /etc/nginx/sites-available/dreamshop /etc/nginx/sites-enabled/

# Default site remove করুন (যদি থাকে)
sudo rm /etc/nginx/sites-enabled/default

# Nginx config test করুন
sudo nginx -t
```

**Expected Output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 7.4 Nginx Restart করুন

```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

---

## 🔒 Step 8: SSL Certificate Setup (HTTPS)

### 8.1 Certbot Install করুন

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 8.2 SSL Certificate Install করুন

```bash
sudo certbot --nginx -d dreamshopltd.com -d www.dreamshopltd.com
```

**Prompts এ:**
- Email address দিন
- Terms & Conditions accept করুন (A)
- Redirect HTTP to HTTPS choose করুন (option 2)

### 8.3 Auto-renewal Test করুন

```bash
sudo certbot renew --dry-run
```

---

## 🔥 Step 9: Firewall Setup

### 9.1 UFW Firewall Enable করুন

```bash
# Check status
sudo ufw status

# Allow Nginx
sudo ufw allow 'Nginx Full'
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'

# SSH allow করুন (important!)
sudo ufw allow OpenSSH

# Enable firewall
sudo ufw enable

# Status check
sudo ufw status
```

---

## ✅ Step 10: Testing & Verification

### 10.1 Backend Test করুন

```bash
# Direct backend test
curl http://localhost:5000/api/products

# Health check
curl http://localhost:5000/health
```

### 10.2 Frontend Test করুন

```bash
curl http://localhost:3000
```

### 10.3 Nginx Test করুন

```bash
# Local test
curl http://localhost/api/products

# Domain test (browser এ)
# Visit: https://dreamshopltd.com
```

### 10.4 PM2 Status Check

```bash
pm2 status
pm2 logs --lines 50
```

---

## 🔧 Common Commands (Quick Reference)

### PM2 Commands

```bash
# Start
pm2 start ecosystem.config.js

# Stop
pm2 stop ecosystem.config.js

# Restart
pm2 restart ecosystem.config.js

# Stop all
pm2 stop all

# Delete all
pm2 delete all

# Status
pm2 status

# Logs
pm2 logs
pm2 logs dreamshop-backend
pm2 logs dreamshop-frontend

# Monitor
pm2 monit
```

### Nginx Commands

```bash
# Test config
sudo nginx -t

# Reload (without downtime)
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# Status
sudo systemctl status nginx

# Logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Project Update Commands

```bash
cd /var/www/dream

# Git pull (যদি Git use করেন)
git pull origin main

# Dependencies update
npm install

# Rebuild
npm run backend:build
npm run build

# Restart PM2
pm2 restart ecosystem.config.js
```

---

## 🐛 Troubleshooting

### Problem 1: PM2 Backend Start হচ্ছে না

**Check করুন:**
```bash
# Logs দেখুন
pm2 logs dreamshop-backend

# Manual test করুন
cd /var/www/dream
node backend/dist/server.js
```

**সম্ভাব্য কারণ:**
- MongoDB connection string ভুল
- Port 5000 already in use
- .env file missing

**সমাধান:**
```bash
# Port check করুন
sudo netstat -tulpn | grep 5000

# Process kill করুন (যদি লাগে)
sudo kill -9 <PID>

# .env file check করুন
cat .env
```

### Problem 2: 502 Bad Gateway

**কারণ:** Backend running নেই

**সমাধান:**
```bash
pm2 status
pm2 restart dreamshop-backend
pm2 logs dreamshop-backend
```

### Problem 3: API Data আসছে না

**Check করুন:**
```bash
# Backend direct test
curl http://localhost:5000/api/products

# Nginx test
curl http://localhost/api/products

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

**সমাধান:** NGINX_SETUP.md file follow করুন

### Problem 4: Frontend Build Error

**Check করুন:**
```bash
npm run build
# Error message দেখুন
```

**সম্ভাব্য সমাধান:**
```bash
# Clean build
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### Problem 5: MongoDB Connection Error

**Check করুন:**
```bash
# .env file check
cat .env | grep MONGODB

# MongoDB connection test
pm2 logs dreamshop-backend | grep MongoDB
```

**সমাধান:**
- MongoDB Atlas-এ IP whitelist করুন (0.0.0.0/0 for testing)
- Connection string verify করুন
- Network connectivity check করুন

---

## 📝 Deployment Checklist

- [ ] VPS server ready
- [ ] Node.js installed (v18+)
- [ ] PM2 installed
- [ ] Nginx installed
- [ ] Project uploaded to VPS
- [ ] .env file configured
- [ ] Dependencies installed
- [ ] Backend built successfully
- [ ] Frontend built successfully
- [ ] PM2 processes running
- [ ] Nginx configured
- [ ] Domain DNS pointing to VPS IP
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Backend API working (`/api/products`)
- [ ] Frontend loading correctly
- [ ] HTTPS working

---

## 🎉 Success!

যদি সব steps সঠিকভাবে follow করেন, তাহলে আপনার site live হবে:
- Frontend: `https://dreamshopltd.com`
- Backend API: `https://dreamshopltd.com/api`

---

## 📞 Additional Help

- PM2 Documentation: https://pm2.keymetrics.io/
- Nginx Documentation: https://nginx.org/en/docs/
- Next.js Deployment: https://nextjs.org/docs/deployment

---

**Note:** Production environment-এ security best practices follow করুন:
- Strong passwords ব্যবহার করুন
- SSH key-based authentication setup করুন
- Regular backups নিন
- Security updates রাখুন
- Environment variables secure রাখুন
