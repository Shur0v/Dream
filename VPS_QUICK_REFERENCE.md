# VPS Deployment Quick Reference Card (বাংলা)

## 🚀 দ্রুত Deployment

```bash
# 1. VPS-এ SSH করুন
ssh username@your-vps-ip

# 2. Project directory-তে যান
cd /var/www/dream

# 3. Deployment script run করুন
./deploy-vps.sh

# অথবা manually:
npm install
npm run backend:build
npm run build
pm2 start ecosystem.config.js
pm2 save
```

---

## 📋 Essential Commands

### PM2 Management

```bash
# Start
pm2 start ecosystem.config.js

# Stop
pm2 stop ecosystem.config.js

# Restart
pm2 restart ecosystem.config.js

# Status
pm2 status

# Logs
pm2 logs
pm2 logs dreamshop-backend
pm2 logs dreamshop-frontend

# Monitor
pm2 monit
```

### Nginx Management

```bash
# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# Status
sudo systemctl status nginx

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Project Update

```bash
cd /var/www/dream
git pull                    # Git থেকে update
npm install                 # Dependencies update
npm run backend:build       # Backend rebuild
npm run build              # Frontend rebuild
pm2 restart ecosystem.config.js  # Restart
```

---

## 🔍 Quick Checks

```bash
# Backend check
curl http://localhost:5000/health

# Frontend check
curl http://localhost:3000

# API check
curl http://localhost:5000/api/products

# PM2 status
pm2 status

# Nginx status
sudo systemctl status nginx
```

---

## 🐛 Common Issues & Fixes

### Backend Start হচ্ছে না
```bash
pm2 logs dreamshop-backend
# Check MongoDB connection in .env
```

### 502 Bad Gateway
```bash
pm2 restart dreamshop-backend
sudo systemctl restart nginx
```

### Port Already in Use
```bash
sudo netstat -tulpn | grep 5000
sudo kill -9 <PID>
```

### Build Error
```bash
rm -rf node_modules .next backend/dist
npm install
npm run backend:build
npm run build
```

---

## 📁 Important Files

- **PM2 Config:** `ecosystem.config.js`
- **Nginx Config:** `/etc/nginx/sites-available/dreamshop`
- **Environment:** `.env`
- **Logs:** `logs/` directory
- **Backend Build:** `backend/dist/server.js`
- **Frontend Build:** `.next/` directory

---

## 🔐 Security Checklist

- [ ] Strong passwords
- [ ] SSH key authentication
- [ ] Firewall configured (UFW)
- [ ] SSL certificate installed
- [ ] .env file secured (not in Git)
- [ ] Regular backups
- [ ] System updates

---

## 📞 Helpful Links

- Full Guide: `VPS_DEPLOYMENT_GUIDE.md`
- Nginx Setup: `NGINX_SETUP.md`
- Troubleshooting: `VPS_TROUBLESHOOTING.md`
