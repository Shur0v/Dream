# VPS Setup - Run These Commands

## Step 1: Connect to VPS
```bash
ssh root@72.60.205.98
# Password: fzD#zxCsjU6pUSB
```

## Step 2: Navigate to Project
```bash
cd /var/www/dreamshop
```

## Step 3: Check Current Status
```bash
pwd
ls -la
node --version
npm --version
pm2 --version
pm2 status
```

## Step 4: Install Dependencies
```bash
npm install
```

## Step 5: Build Backend
```bash
npm run backend:build
```

## Step 6: Build Frontend
```bash
npm run build
```

## Step 7: Stop Existing PM2 Processes
```bash
pm2 delete all
```

## Step 8: Start Services
```bash
pm2 start ecosystem.config.js
pm2 save
```

## Step 9: Check Status
```bash
pm2 status
pm2 logs
```

## Step 10: Verify Health
```bash
curl http://localhost:5000/health
curl http://localhost:3000
```

## All-in-One Script (Copy and Paste)
```bash
cd /var/www/dreamshop && \
npm install && \
npm run backend:build && \
npm run build && \
pm2 delete all && \
pm2 start ecosystem.config.js && \
pm2 save && \
pm2 status
```

