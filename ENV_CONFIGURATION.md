# Environment Configuration Guide

## .env.local File Configuration

আপনার project root directory-তে `.env.local` file এ এই variables গুলো থাকতে হবে:

```env
# Upstash Redis Configuration (optional - for future use)
UPSTASH_REDIS_REST_URL="https://civil-sawfish-31828.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXxUAAIncDIwODQ5ZWM1ZTI2Y2M0MjYzYWViMzRmY2YyNmRjZDBhMXAyMzE4Mjg"

# Database Seed Token (for initial data seeding)
DB_SEED_TOKEN=seed-9f4c7f2d13e64d8a9c81d7a6e2b5c0ff

# Express Backend API URL (REQUIRED)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Important Notes:

### 1. NEXT_PUBLIC_API_URL (Required)
এই variable **অবশ্যই** থাকতে হবে Express backend use করার জন্য।

- **Value**: `http://localhost:5000/api`
- **Purpose**: Frontend থেকে Express backend server-এ API calls করার জন্য
- **Default**: যদি না থাকে, তাহলে `http://localhost:5000/api` use হবে

### 2. Backend Server Port
Backend server default port `5000` use করে। যদি change করতে চান:

**Step 1**: `backend/.env` file এ:
```env
BACKEND_PORT=5001
```

**Step 2**: `.env.local` file এ update করুন:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### 3. Frontend URL (Backend Configuration)
Backend server CORS setup করার জন্য `backend/.env` file এ:
```env
FRONTEND_URL=http://localhost:3000
```

## Complete .env.local Example:

```env
# Redis Configuration
UPSTASH_REDIS_REST_URL="https://civil-sawfish-31828.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXxUAAIncDIwODQ5ZWM1ZTI2Y2M0MjYzYWViMzRmY2YyNmRjZDBhMXAyMzE4Mjg"

# Seed Token
DB_SEED_TOKEN=seed-9f4c7f2d13e64d8a9c81d7a6e2b5c0ff

# Express Backend API (REQUIRED)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Backend .env File

`backend/.env` file এ এই variables থাকতে হবে:

```env
BACKEND_PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Verification

### Check if .env.local is correct:
```bash
cat .env.local | grep NEXT_PUBLIC_API_URL
```

Should show: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`

### Check if backend/.env exists:
```bash
cat backend/.env
```

Should show:
```
BACKEND_PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## After Updating .env.local

1. **Restart Frontend**: 
   ```bash
   # Stop current dev server (Ctrl+C)
   pnpm dev
   ```

2. **Restart Backend** (if running):
   ```bash
   # Stop current backend (Ctrl+C)
   pnpm backend:dev
   ```

## Production Configuration

Production এ `.env.local` এর পরিবর্তে Vercel/Deployment platform এ environment variables set করুন:

- `NEXT_PUBLIC_API_URL` = আপনার production backend URL (e.g., `https://api.yourdomain.com/api`)






