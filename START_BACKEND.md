# How to Start Express Backend

## The Error You're Seeing
"Failed to fetch" means the Express backend server is **NOT running**.

## Quick Fix

### Step 1: Open a NEW Terminal
Keep your frontend terminal running, open a **second terminal window**.

### Step 2: Start Backend Server
In the new terminal, run:
```bash
cd F:/dream
pnpm backend:dev
```

You should see:
```
🚀 Express server running on http://localhost:5000
📁 Environment: development
```

### Step 3: Keep Both Terminals Open
- **Terminal 1**: Frontend (`pnpm dev`) - Port 3000
- **Terminal 2**: Backend (`pnpm backend:dev`) - Port 5000

### Step 4: Refresh Browser
Refresh your browser page. The error should be gone and data will load.

## Alternative: Run Both Together

If you want to run both in one terminal:
```bash
pnpm dev:all
```

This starts both frontend and backend together.

## Verify Backend is Running

1. Open browser: http://localhost:5000/health
2. Should show: `{"status":"ok",...}`

## If Backend Won't Start

### Check for Errors:
```bash
cd backend
npx ts-node server.ts
```

### Common Issues:
1. **Port 5000 in use?**
   - Change port in `backend/.env`: `BACKEND_PORT=5001`
   - Update `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5001/api`

2. **TypeScript errors?**
   - Run: `pnpm install`
   - Check: `backend/tsconfig.json` exists

3. **Missing dependencies?**
   - Run: `pnpm install`

## Temporary Fallback

I've added a fallback in the code - if Express backend is not available, it will try to use Next.js API routes. But **you should start the Express backend** for best performance.




