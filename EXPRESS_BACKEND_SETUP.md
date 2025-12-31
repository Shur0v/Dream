# Express.js Backend Setup Guide

## Overview

The Express.js backend has been fully set up in the `backend/` folder with separate JSON database files for better performance and organization.

## Structure

```
backend/
├── server.ts                 # Main Express server
├── express-lib/
│   └── db.ts                # Database helper functions
├── express-routes/          # API route handlers
│   ├── products.ts
│   ├── categories.ts
│   ├── colors.ts
│   ├── orders.ts
│   ├── auth.ts
│   ├── cart.ts
│   └── admin.ts
└── database/                # Separate JSON files
    ├── products.json
    ├── categories.json
    ├── colors.json
    ├── orders.json
    └── users.json
```

## Setup Steps

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Create Environment File
Create `backend/.env` file:
```env
BACKEND_PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Start Backend Server

**Option A: Backend only**
```bash
pnpm backend:dev
```

**Option B: Backend + Frontend together**
```bash
pnpm dev:all
```

The backend will run on `http://localhost:5000`

### 4. Update Frontend Environment

Add to `.env.local` (or `.env`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Endpoints

All endpoints are prefixed with `/api`:

- **Products**: `/api/products`
- **Categories**: `/api/categories`
- **Colors**: `/api/colors`
- **Orders**: `/api/orders`
- **Auth**: `/api/auth`
- **Cart**: `/api/cart`
- **Admin**: `/api/admin`

## Database Files

The database has been split into separate JSON files:
- `products.json` - All products
- `categories.json` - All categories
- `colors.json` - All colors
- `orders.json` - All orders
- `users.json` - All users

Each file is cached in memory for 5 minutes to improve performance.

## Features

✅ Separate JSON database files (reduces file size pressure)
✅ In-memory caching (5 minutes TTL)
✅ CORS enabled for frontend
✅ Error handling middleware
✅ Request logging
✅ TypeScript support
✅ Hot reload with nodemon

## Performance Optimizations

1. **Separate Database Files**: Each entity has its own JSON file, reducing read/write pressure
2. **In-Memory Caching**: 5-minute cache for all database reads
3. **Frontend Caching**: localStorage caching (5 minutes) prevents unnecessary API calls
4. **useMemo Usage**: React components use `useMemo` for expensive computations
5. **Pagination**: API endpoints support pagination (default limit: 40)

## Migration from Next.js API Routes

The frontend has been updated to use the Express backend. All API calls now use:
```typescript
process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
```

## Development

- Backend runs on port 5000
- Frontend runs on port 3000
- Use `pnpm dev:all` to run both simultaneously

## Production

1. Build backend:
```bash
pnpm backend:build
```

2. Start backend:
```bash
pnpm backend:start
```

3. Set environment variables:
```env
NODE_ENV=production
BACKEND_PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
```






