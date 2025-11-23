# Fix: No Data Showing Issue

## Problem
Website shows "No products found" everywhere because Express backend is not running.

## Quick Fix (3 Steps)

### Step 1: Add Environment Variable
Add this line to your `.env.local` file (in root directory):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Your `.env.local` should now look like:
```env
UPSTASH_REDIS_REST_URL="https://civil-sawfish-31828.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXxUAAIncDIwODQ5ZWM1ZTI2Y2M0MjYzYWViMzRmY2YyNmRjZDBhMXAyMzE4Mjg"
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 2: Start Express Backend Server
Open a new terminal and run:
```bash
pnpm backend:dev
```

You should see:
```
🚀 Express server running on http://localhost:5000
📁 Environment: development
```

### Step 3: Restart Frontend
If frontend is already running, restart it:
```bash
# Stop current dev server (Ctrl+C)
# Then start again:
pnpm dev
```

## Alternative: Run Both Together
Instead of running in separate terminals, you can run both together:
```bash
pnpm dev:all
```

## Verify It's Working

1. **Check Backend Health:**
   - Open: http://localhost:5000/health
   - Should show: `{"status":"ok",...}`

2. **Check Products API:**
   - Open: http://localhost:5000/api/products
   - Should show JSON with products array

3. **Check Frontend:**
   - Refresh your browser
   - Products should now appear

## If Still Not Working

1. **Check Browser Console (F12):**
   - Look for CORS errors
   - Look for network errors

2. **Check Backend Terminal:**
   - Should show request logs like: `[2024-...] GET /api/products`

3. **Clear Browser Cache:**
   - Clear localStorage
   - Hard refresh (Ctrl+Shift+R)

4. **Verify Database Files:**
   ```bash
   # Check if products.json has data
   cat backend/database/products.json | head -20
   ```

## Common Issues

### Port 5000 already in use?
Change port in `backend/.env`:
```env
BACKEND_PORT=5001
```
Then update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Backend won't start?
- Make sure all dependencies installed: `pnpm install`
- Check `backend/.env` file exists
- Check for TypeScript errors

### CORS errors?
- Make sure `backend/.env` has: `FRONTEND_URL=http://localhost:3000`
- Restart backend server




