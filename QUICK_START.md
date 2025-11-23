# Quick Start Guide - Express Backend

## Problem: No Data Showing

If you're seeing "No products found" everywhere, the Express backend server is not running.

## Solution: Start the Backend Server

### Option 1: Start Backend Only
```bash
pnpm backend:dev
```

This will start the Express server on `http://localhost:5000`

### Option 2: Start Both Backend + Frontend Together
```bash
pnpm dev:all
```

This starts both servers simultaneously.

## Verify Backend is Running

1. Open browser and go to: `http://localhost:5000/health`
2. You should see: `{"status":"ok","timestamp":"...","uptime":...}`

## Check API Endpoint

1. Go to: `http://localhost:5000/api/products`
2. You should see JSON with products data

## Frontend Configuration

Make sure `.env.local` exists in the root directory with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If this file doesn't exist, create it.

## Troubleshooting

### Backend won't start?
- Check if port 5000 is already in use
- Make sure all dependencies are installed: `pnpm install`
- Check `backend/.env` file exists

### Still no data?
1. Check browser console for errors (F12)
2. Verify backend is running: `http://localhost:5000/health`
3. Check network tab in browser dev tools
4. Clear browser localStorage cache

### Database files empty?
- Check `backend/database/products.json` has data
- If empty, you may need to seed the database




