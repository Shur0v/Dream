# Quick VPS Setup - Copy & Paste

## Connect to VPS:
```bash
ssh root@72.60.205.98
# Password: fzD#zxCsjU6pUSB
```

## Once Connected, Run This Single Command:

```bash
cd /var/www/dreamshop && bash <(curl -s https://raw.githubusercontent.com/your-repo/vps-full-setup.sh) || cat > vps-full-setup.sh << 'SCRIPT_END'
[paste the entire vps-full-setup.sh content here]
SCRIPT_END
chmod +x vps-full-setup.sh && bash vps-full-setup.sh
```

## OR Manual Step-by-Step:

```bash
# 1. Navigate
cd /var/www/dreamshop

# 2. Install dependencies
npm install

# 3. Build backend
npm run backend:build

# 4. Build frontend
npm run build

# 5. Stop old processes
pm2 delete all

# 6. Start services
pm2 start ecosystem.config.js
pm2 save

# 7. Check status
pm2 status
pm2 logs
```

## All-in-One Command (Copy Entire Block):

```bash
cd /var/www/dreamshop && \
npm install && \
npm run backend:build && \
npm run build && \
pm2 delete all && \
pm2 start ecosystem.config.js && \
pm2 save && \
sleep 5 && \
pm2 status && \
echo "✅ Setup Complete! Check logs with: pm2 logs"
```

