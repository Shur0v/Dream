#!/bin/bash

echo "🔍 VPS Diagnostic Check"
echo "======================"
echo ""

cd /var/www/dreamshop 2>/dev/null || cd $(dirname "$0")

echo "📊 PM2 Status:"
pm2 status
echo ""

echo "🔌 Port Check:"
echo "Backend (5000):"
sudo lsof -i :5000 2>/dev/null || echo "  ❌ Backend not running on port 5000"
echo ""
echo "Frontend (3000):"
sudo lsof -i :3000 2>/dev/null || echo "  ❌ Frontend not running on port 3000"
echo ""

echo "🧪 Backend API Test:"
BACKEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/products 2>/dev/null)
if [ "$BACKEND_TEST" = "200" ]; then
    echo "  ✅ Backend API responding (HTTP $BACKEND_TEST)"
    curl -s http://localhost:5000/api/products | head -c 100
    echo "..."
else
    echo "  ❌ Backend API not responding (HTTP $BACKEND_TEST)"
fi
echo ""

echo "🌐 Frontend Test:"
FRONTEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null)
if [ "$FRONTEND_TEST" = "200" ]; then
    echo "  ✅ Frontend responding (HTTP $FRONTEND_TEST)"
else
    echo "  ❌ Frontend not responding (HTTP $FRONTEND_TEST)"
fi
echo ""

echo "🔧 Nginx Status:"
sudo systemctl status nginx --no-pager | head -5
echo ""

echo "📝 Environment Variables:"
if [ -f .env ]; then
    echo "  ✅ .env file exists"
    echo "  BACKEND_PORT: $(grep BACKEND_PORT .env | cut -d'=' -f2 || echo 'Not set')"
    echo "  MONGODB_URI: $(grep MONGODB_URI .env | cut -d'=' -f2 | cut -c1-20 || echo 'Not set')..."
else
    echo "  ❌ .env file not found"
fi
echo ""

echo "📦 Build Check:"
if [ -f "backend/dist/server.js" ]; then
    echo "  ✅ Backend built"
else
    echo "  ❌ Backend not built (run: npm run backend:build)"
fi

if [ -d ".next" ]; then
    echo "  ✅ Frontend built"
else
    echo "  ❌ Frontend not built (run: npm run build)"
fi
echo ""

echo "📋 Recent Backend Logs (last 5 lines):"
pm2 logs dreamshop-backend --lines 5 --nostream 2>/dev/null || echo "  No logs available"
echo ""

echo "✅ Diagnostic complete!"
echo ""
echo "💡 Next steps:"
echo "1. If backend not running: pm2 start ecosystem.config.js"
echo "2. If API not responding: pm2 logs dreamshop-backend"
echo "3. If Nginx not configured: See nginx.conf.example"
echo "4. If build missing: npm run build:all"
