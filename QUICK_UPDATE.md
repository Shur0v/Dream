# 🚨 Quick Security Update Guide

## VPS Suspended? Follow These Steps:

### Step 1: Update Packages (Run on VPS)

```bash
cd /var/www/dreamshop

# Update to patched versions
pnpm install next@15.5.7 react@19.2.3 react-dom@19.2.3 --save-exact

# Update TypeScript types
pnpm install @types/react@latest @types/react-dom@latest --save-dev

# Clean install
rm -rf node_modules .next
pnpm install
```

### Step 2: Build Application

```bash
# Build backend
pnpm run backend:build

# Build frontend
pnpm run build
```

### Step 3: Restart PM2

```bash
# Stop all
pm2 delete all

# Start with ecosystem config
pm2 start ecosystem.config.js

# Or start manually:
pm2 start backend/dist/server.js --name "dreamshop-backend"
pm2 start npm --name "dreamshop-frontend" -- start

# Save
pm2 save
```

### Step 4: Verify

```bash
# Check versions
pnpm list next react react-dom

# Check PM2 status
pm2 list

# Check logs
pm2 logs
```

## Expected Versions After Update:

- ✅ `next@15.5.7` (or higher)
- ✅ `react@19.2.3` (or higher)
- ✅ `react-dom@19.2.3` (or higher)

## If Build Fails:

```bash
# Clear all caches
rm -rf node_modules .next backend/dist
pnpm install
pnpm run backend:build
pnpm run build
```

## One-Line Update (if pnpm available):

```bash
pnpm install next@15.5.7 react@19.2.3 react-dom@19.2.3 @types/react@latest @types/react-dom@latest --save-exact && rm -rf node_modules .next && pnpm install && pnpm run backend:build && pnpm run build
```

