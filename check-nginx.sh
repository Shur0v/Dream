#!/bin/bash

echo "=== Nginx Configuration Check ==="
echo ""

echo "1. Checking if Nginx is running:"
sudo systemctl status nginx --no-pager | head -5
echo ""

echo "2. Testing Nginx configuration:"
sudo nginx -t
echo ""

echo "3. Checking Nginx config file:"
if [ -f /etc/nginx/sites-available/dreamshop ]; then
    echo "✅ Config file exists: /etc/nginx/sites-available/dreamshop"
    echo ""
    echo "Key settings:"
    grep -A 5 "location /api" /etc/nginx/sites-available/dreamshop | head -10
else
    echo "❌ Config file NOT found: /etc/nginx/sites-available/dreamshop"
fi
echo ""

echo "4. Checking if site is enabled:"
if [ -L /etc/nginx/sites-enabled/dreamshop ]; then
    echo "✅ Site is enabled"
else
    echo "❌ Site is NOT enabled"
    echo "Run: sudo ln -s /etc/nginx/sites-available/dreamshop /etc/nginx/sites-enabled/"
fi
echo ""

echo "5. Testing backend connection from Nginx perspective:"
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend is accessible on localhost:5000"
    curl -s http://localhost:5000/health | head -c 100
    echo ""
else
    echo "❌ Backend is NOT accessible on localhost:5000"
fi
echo ""

echo "6. Testing API through Nginx:"
if curl -s http://localhost/api/categories?limit=5 > /dev/null; then
    echo "✅ API accessible through Nginx"
    curl -s http://localhost/api/categories?limit=5 | head -c 200
    echo ""
else
    echo "❌ API NOT accessible through Nginx"
fi
echo ""

echo "7. Checking Nginx error logs (last 10 lines):"
sudo tail -10 /var/log/nginx/error.log
echo ""

echo "8. Checking Nginx access logs (last 5 lines):"
sudo tail -5 /var/log/nginx/access.log
echo ""

echo "=== Check Complete ==="
