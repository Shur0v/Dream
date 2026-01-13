# Nginx Setup for Dreamshop - Complete Guide

## সমস্যা: https://dreamshopltd.com/ এ data আসছে না

এর মানে Nginx reverse proxy setup নেই বা ভুল আছে।

## Step-by-Step Nginx Setup:

### Step 1: Nginx Install Check করুন

```bash
# Check if Nginx is installed
nginx -v

# If not installed:
sudo apt update
sudo apt install nginx -y
```

### Step 2: Nginx Config File Create করুন

```bash
sudo nano /etc/nginx/sites-available/dreamshop
```

**এই content paste করুন:**

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
    # All /api/* requests go to Express backend
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

### Step 3: Enable Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/dreamshop /etc/nginx/sites-enabled/

# Remove default site (if exists)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t
```

**Expected output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### Step 4: Reload Nginx

```bash
sudo systemctl reload nginx
# অথবা
sudo systemctl restart nginx
```

### Step 5: Check Nginx Status

```bash
sudo systemctl status nginx
```

### Step 6: Verify Backend Running

```bash
# Check PM2 status
pm2 status

# Backend should be online
# If not:
cd /var/www/dreamshop
pm2 start ecosystem.config.js
pm2 save
```

### Step 7: Test API Directly

```bash
# Test backend API (should return JSON)
curl http://localhost:5000/api/products

# Test through Nginx (should return same JSON)
curl http://localhost/api/products
# অথবা
curl https://dreamshopltd.com/api/products
```

### Step 8: SSL Setup (HTTPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d dreamshopltd.com -d www.dreamshopltd.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS (option 2)
```

### Step 9: Firewall Check

```bash
# Check firewall status
sudo ufw status

# Open ports if needed
sudo ufw allow 'Nginx Full'
sudo ufw allow 'Nginx HTTP'
sudo ufw allow 'Nginx HTTPS'
sudo ufw allow 3000/tcp  # Frontend (if direct access needed)
sudo ufw allow 5000/tcp  # Backend (if direct access needed)
```

## Troubleshooting:

### Issue 1: Nginx Config Test Fails

```bash
# Check syntax errors
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

### Issue 2: 502 Bad Gateway

**কারণ:** Backend running নেই

**সমাধান:**
```bash
pm2 status
pm2 restart dreamshop-backend
```

### Issue 3: 404 Not Found for /api

**কারণ:** Nginx config-এ `/api` location block নেই

**সমাধান:** Step 2 follow করুন

### Issue 4: CORS Errors

**কারণ:** Backend CORS configuration issue (rare, already configured)

**সমাধান:** Backend logs check করুন:
```bash
pm2 logs dreamshop-backend | grep CORS
```

### Issue 5: SSL Certificate Issues

```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

## Verification Checklist:

- [ ] Nginx installed and running
- [ ] Config file created at `/etc/nginx/sites-available/dreamshop`
- [ ] Symlink created at `/etc/nginx/sites-enabled/dreamshop`
- [ ] `nginx -t` passes without errors
- [ ] Nginx reloaded/restarted
- [ ] Backend running (`pm2 status` shows online)
- [ ] `curl http://localhost:5000/api/products` returns JSON
- [ ] `curl http://localhost/api/products` returns JSON
- [ ] SSL certificate installed (for HTTPS)
- [ ] Firewall ports open

## Quick Test Commands:

```bash
# Test backend directly
curl http://localhost:5000/api/products | head -c 200

# Test through Nginx
curl http://localhost/api/products | head -c 200

# Test frontend
curl http://localhost:3000 | head -c 200

# Check PM2
pm2 status

# Check Nginx
sudo systemctl status nginx
```

## After Setup:

1. Visit https://dreamshopltd.com/
2. Open browser console (F12)
3. Check Network tab for API calls
4. Should see successful requests to `/api/products`, `/api/categories`, etc.

## Still Not Working?

1. Check browser console (F12 → Console tab) for errors
2. Check Network tab (F12 → Network) for failed requests
3. Check PM2 logs: `pm2 logs dreamshop-backend`
4. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
5. Share error messages for further help
