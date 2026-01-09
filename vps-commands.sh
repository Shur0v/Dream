#!/bin/bash
# Commands to run on VPS
# Copy and paste these commands one by one on VPS

cd /var/www/dreamshop

echo "=== Current Directory ==="
pwd
echo ""

echo "=== Directory Contents ==="
ls -la
echo ""

echo "=== Node.js Version ==="
node --version
echo ""

echo "=== npm Version ==="
npm --version
echo ""

echo "=== PM2 Version ==="
pm2 --version 2>/dev/null || echo "PM2 not installed"
echo ""

echo "=== Current PM2 Status ==="
pm2 status 2>/dev/null || echo "No PM2 processes running"
echo ""

echo "=== Checking Environment Files ==="
if [ -f "backend/.env" ]; then
    echo "✅ backend/.env exists"
else
    echo "❌ backend/.env NOT found"
fi

if [ -f ".env.local" ] || [ -f ".env.production" ]; then
    echo "✅ Frontend .env exists"
else
    echo "❌ Frontend .env NOT found"
fi
echo ""

echo "=== Ready for Setup ==="
echo "Run: npm install"
echo "Then: npm run backend:build"
echo "Then: npm run build"
echo "Then: pm2 start ecosystem.config.js"

