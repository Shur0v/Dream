# Production Data Loading Fix

## Problem
Data is not loading properly on live server (dreamshopltd.com) even though it works locally.

## Root Causes
1. **API URL Configuration**: Frontend trying to access backend on wrong URL
2. **Backend Port**: Backend runs on port 5000, but frontend might not be able to access it
3. **CORS**: Already fixed, but needs verification
4. **Error Handling**: Errors showing to users instead of failing silently

## Solutions Applied

### 1. Fixed API URL Configuration
- Updated `src/lib/apiConfig.ts` to properly detect production environment
- Uses `https://dreamshopltd.com:5000/api` in production
- Falls back to localhost in development

### 2. Updated Critical Files
- `src/app/selleradmin/users/page.tsx` - Uses centralized API config
- `src/app/selleradmin/components/color/AddColorForm.tsx` - Uses centralized API config
- `src/app/selleradmin/components/product/AllProductsGrid.tsx` - Uses centralized API config
- `src/app/selleradmin/components/product/AddProductForm.tsx` - Uses centralized API config

### 3. Silent Error Handling
- All error states now fail silently (no user-facing errors)
- Errors logged to console for debugging
- Empty arrays returned instead of error messages

## VPS Configuration Required

### Option 1: Reverse Proxy (Recommended)
Configure Nginx to proxy backend requests:

```nginx
# /etc/nginx/sites-available/dreamshopltd.com
server {
    listen 80;
    server_name dreamshopltd.com www.dreamshopltd.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (Express)
    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then update `src/lib/apiConfig.ts` to use:
```typescript
return `${protocol}//${hostname.replace('www.', '')}/api`;
```

### Option 2: Direct Port Access (Current)
Backend accessible on port 5000:
- Frontend: `https://dreamshopltd.com:3000` (or port 80/443)
- Backend: `https://dreamshopltd.com:5000`

Update API config to use port 5000 (already done).

### Option 3: Environment Variable
Set `NEXT_PUBLIC_API_URL` in production:

```bash
# In .env.production or VPS environment
NEXT_PUBLIC_API_URL=https://dreamshopltd.com:5000/api
```

## Deployment Steps

1. **Build the application:**
```bash
cd /var/www/dreamshop
pnpm install
pnpm run backend:build
pnpm run build
```

2. **Update environment variables:**
```bash
# Create or update backend/.env
cd backend
cat > .env << EOF
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=dream
BACKEND_PORT=5000
NODE_ENV=production
EOF
```

3. **Set frontend environment variable (if using Option 3):**
```bash
# In project root
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://dreamshopltd.com:5000/api
EOF
```

4. **Restart PM2:**
```bash
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

5. **Verify:**
```bash
# Check backend is running
curl http://localhost:5000/health

# Check API endpoint
curl http://localhost:5000/api/users

# Check PM2 status
pm2 list
pm2 logs
```

## Testing

1. **Test API directly:**
```bash
curl https://dreamshopltd.com:5000/api/users
curl https://dreamshopltd.com:5000/api/colors
curl https://dreamshopltd.com:5000/api/categories
```

2. **Test from browser console:**
```javascript
fetch('https://dreamshopltd.com:5000/api/users')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

3. **Check browser network tab:**
- Open DevTools → Network
- Reload dashboard pages
- Verify API calls are successful (200 status)
- Check response data

## Troubleshooting

### If data still not loading:

1. **Check backend logs:**
```bash
pm2 logs dreamshop-backend --lines 100
```

2. **Check frontend logs:**
```bash
pm2 logs dreamshop-frontend --lines 100
```

3. **Verify MongoDB connection:**
```bash
# In backend directory
node -e "require('./config/database').connectToDatabase().then(() => console.log('Connected')).catch(console.error)"
```

4. **Check firewall:**
```bash
# Ensure port 5000 is open
sudo ufw status
sudo ufw allow 5000/tcp
```

5. **Test API from server:**
```bash
curl http://localhost:5000/api/users
```

### Common Issues:

- **CORS errors**: Already fixed with permissive CORS
- **Connection refused**: Backend not running or wrong port
- **404 errors**: API routes not registered
- **Empty data**: MongoDB connection issue or empty database

## Next Steps

1. Deploy updated code to VPS
2. Rebuild and restart services
3. Test all dashboard pages
4. Monitor PM2 logs for errors
5. Verify data loads correctly

