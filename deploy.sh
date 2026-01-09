#!/bin/bash

# Dream Shop Production Deployment Script
# Usage: ./deploy.sh

set -e  # Exit on error

echo "🚀 Starting Dream Shop Production Deployment..."
echo ""

# Navigate to project directory
cd /var/www/dreamshop || { echo "❌ Error: /var/www/dreamshop not found!"; exit 1; }

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
pnpm install || { echo "❌ Error: Failed to install dependencies"; exit 1; }
echo "✅ Dependencies installed"
echo ""

# Step 2: Build backend
echo "🔨 Step 2: Building backend..."
pnpm run backend:build || { echo "❌ Error: Backend build failed"; exit 1; }
echo "✅ Backend built successfully"
echo ""

# Step 3: Build frontend
echo "🔨 Step 3: Building frontend..."
pnpm run build || { echo "❌ Error: Frontend build failed"; exit 1; }
echo "✅ Frontend built successfully"
echo ""

# Step 4: Restart PM2 processes
echo "🔄 Step 4: Restarting PM2 processes..."
pm2 restart all || pm2 start ecosystem.config.js || { echo "❌ Error: Failed to start PM2 processes"; exit 1; }
echo "✅ PM2 processes restarted"
echo ""

# Step 5: Show status
echo "📊 Deployment Status:"
pm2 status
echo ""

# Step 6: Check health
echo "🏥 Checking service health..."
sleep 2

# Check backend health
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend health check: OK"
else
    echo "⚠️  Backend health check: Failed (may need a moment to start)"
fi

# Check frontend
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend health check: OK"
else
    echo "⚠️  Frontend health check: Failed (may need a moment to start)"
fi

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Check logs: pm2 logs"
echo "   2. Monitor: pm2 monit"
echo "   3. Verify: https://dreamshopltd.com"
echo ""

