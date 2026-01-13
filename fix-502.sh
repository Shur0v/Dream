#!/bin/bash

echo "=== Fixing 502 Bad Gateway Issues ==="
echo ""

# Step 1: Check PM2 status
echo "1. Checking PM2 status..."
pm2 status
echo ""

# Step 2: Check backend logs
echo "2. Checking backend logs for errors..."
pm2 logs dreamshop-backend --lines 30 --nostream
echo ""

# Step 3: Restart backend
echo "3. Restarting backend..."
pm2 restart dreamshop-backend
sleep 3
echo ""

# Step 4: Check if backend is listening
echo "4. Checking if backend is listening on port 5000..."
if netstat -tlnp 2>/dev/null | grep -q ":5000" || ss -tlnp 2>/dev/null | grep -q ":5000"; then
    echo "✅ Backend is listening on port 5000"
else
    echo "❌ Backend is NOT listening on port 5000"
    echo "Checking logs for errors..."
    pm2 logs dreamshop-backend --lines 50 --nostream
fi
echo ""

# Step 5: Test backend locally
echo "5. Testing backend health endpoint..."
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend health check passed"
    curl -s http://localhost:5000/health | head -c 200
    echo ""
else
    echo "❌ Backend health check failed"
fi
echo ""

# Step 6: Check Nginx config
echo "6. Checking Nginx configuration..."
if [ -f /etc/nginx/sites-available/dreamshop ]; then
    echo "✅ Nginx config file exists"
    echo "Testing Nginx config..."
    sudo nginx -t
else
    echo "❌ Nginx config file not found at /etc/nginx/sites-available/dreamshop"
fi
echo ""

# Step 7: Restart Nginx
echo "7. Restarting Nginx..."
sudo systemctl restart nginx
sleep 2
sudo systemctl status nginx --no-pager | head -10
echo ""

echo "=== Fix Complete ==="
echo ""
echo "Next steps:"
echo "1. Check PM2 logs: pm2 logs dreamshop-backend"
echo "2. Check Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "3. Test API: curl http://localhost:5000/api/categories?limit=5"
