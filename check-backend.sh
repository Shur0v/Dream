#!/bin/bash

echo "=== Backend Status Check ==="
echo ""

echo "1. PM2 Status:"
pm2 status
echo ""

echo "2. Backend Logs (last 20 lines):"
pm2 logs dreamshop-backend --lines 20 --nostream
echo ""

echo "3. Check if port 5000 is listening:"
netstat -tlnp | grep 5000 || ss -tlnp | grep 5000
echo ""

echo "4. Test backend health endpoint:"
curl -s http://localhost:5000/health || echo "❌ Backend not responding"
echo ""

echo "5. Test backend API endpoint:"
curl -s http://localhost:5000/api/categories?limit=5 | head -c 200 || echo "❌ API not responding"
echo ""

echo "6. Check backend process:"
ps aux | grep "node.*server.js" | grep -v grep
echo ""

echo "=== Check Complete ==="
