#!/bin/bash

echo "🔧 Fixing VPS issues..."

cd /var/www/dreamshop || cd $(dirname "$0")

# Stop all PM2 processes
echo "🛑 Stopping PM2 processes..."
pm2 stop all 2>/dev/null || true

# Kill processes on ports (if stuck)
echo "🔪 Killing processes on ports 3000 and 5000..."
sudo lsof -ti:3000 | xargs sudo kill -9 2>/dev/null || true
sudo lsof -ti:5000 | xargs sudo kill -9 2>/dev/null || true

# Wait a moment
sleep 2

# Rebuild
echo "📦 Rebuilding backend..."
npm run backend:build

echo "📦 Rebuilding frontend..."
npm run build

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p logs

# Start with PM2
echo "🚀 Starting PM2 processes..."
pm2 start ecosystem.config.js

# Save PM2 config
echo "💾 Saving PM2 configuration..."
pm2 save

# Check status
echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "✅ Done!"
echo ""
echo "📝 Next steps:"
echo "1. Check logs: pm2 logs"
echo "2. Test backend: curl http://localhost:5000/api/products"
echo "3. Test frontend: curl http://localhost:3000"
echo "4. Check Nginx: sudo nginx -t && sudo systemctl reload nginx"
