#!/bin/bash

echo "=== Restarting Backend with Correct Path ==="
echo ""

# Step 1: Stop existing backend
echo "1. Stopping existing backend..."
pm2 delete dreamshop-backend 2>/dev/null || echo "Backend not running"
echo ""

# Step 2: Verify build file exists
echo "2. Verifying build file exists..."
if [ -f "backend/dist/backend/server.js" ]; then
    echo "✅ Found: backend/dist/backend/server.js"
    ls -lh backend/dist/backend/server.js
else
    echo "❌ ERROR: backend/dist/backend/server.js NOT FOUND"
    echo "Running build..."
    npm run backend:build
    if [ ! -f "backend/dist/backend/server.js" ]; then
        echo "❌ Build failed or file still not found"
        exit 1
    fi
fi
echo ""

# Step 3: Start backend with PM2
echo "3. Starting backend with PM2..."
pm2 start ecosystem.config.js --only dreamshop-backend
sleep 2
echo ""

# Step 4: Check PM2 status
echo "4. PM2 Status:"
pm2 status
echo ""

# Step 5: Check backend logs
echo "5. Backend logs (last 15 lines):"
pm2 logs dreamshop-backend --lines 15 --nostream
echo ""

# Step 6: Test backend
echo "6. Testing backend health endpoint:"
sleep 1
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend is responding!"
    curl -s http://localhost:5000/health | head -c 200
    echo ""
else
    echo "❌ Backend is NOT responding"
    echo "Check logs: pm2 logs dreamshop-backend"
fi
echo ""

echo "=== Restart Complete ==="
