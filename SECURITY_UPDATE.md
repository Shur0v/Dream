# Security Update Instructions

## Critical Security Vulnerabilities Fixed

This update addresses the following CVEs:
- **CVE-2025-55182** - React Server Components vulnerability
- **CVE-2025-55184** - React Server Components vulnerability  
- **CVE-2025-66478** - Next.js framework vulnerability
- **CVE-2025-67779** - React Server Components vulnerability
- **CVE-2025-55183** - React Server Components vulnerability

## Updated Packages

- **Next.js**: `15.5.4` → `15.5.7` (patched)
- **React**: `19.1.0` → `19.2.3` (patched)
- **React DOM**: `19.1.0` → `19.2.3` (patched)

## Update Steps

### Option 1: Automated Script (Recommended)

```bash
# Make script executable
chmod +x update-security.sh

# Run the update script
./update-security.sh
```

### Option 2: Manual Update

```bash
# Update Next.js to patched version
pnpm install next@15.5.7 react@19.2.3 react-dom@19.2.3 --save-exact

# Update TypeScript types
pnpm install @types/react@latest @types/react-dom@latest --save-dev

# Clean install
rm -rf node_modules
pnpm install

# Build backend
pnpm run backend:build

# Build frontend
pnpm run build
```

### Option 3: Using Next.js Codemod (Alternative)

```bash
# Automatic upgrade with codemod
npx @next/codemod upgrade latest
```

## After Update

### 1. Verify Versions

```bash
pnpm list next react react-dom
```

Expected output:
- `next@15.5.7`
- `react@19.2.3`
- `react-dom@19.2.3`

### 2. Rebuild Application

```bash
# Build backend
pnpm run backend:build

# Build frontend
pnpm run build
```

### 3. Restart PM2 Processes

```bash
# Stop all processes
pm2 delete all

# Start with ecosystem config
pm2 start ecosystem.config.js

# Or start manually
pm2 start backend/dist/server.js --name "dreamshop-backend"
pm2 start npm --name "dreamshop-frontend" -- start

# Save PM2 configuration
pm2 save
```

### 4. Monitor Application

```bash
# Check status
pm2 list

# View logs
pm2 logs

# Monitor resources
pm2 monit
```

## Verification Checklist

- [ ] Next.js updated to 15.5.7 or later
- [ ] React updated to 19.2.3 or later
- [ ] React DOM updated to 19.2.3 or later
- [ ] Application builds successfully
- [ ] Backend builds successfully
- [ ] PM2 processes running without errors
- [ ] Application accessible and functional
- [ ] No console errors in browser

## Additional Security Measures

1. **Review Server Logs**: Check for any suspicious activity
2. **Update Dependencies**: Run `pnpm audit` to check for other vulnerabilities
3. **Review Access Logs**: Check server access logs for unusual patterns
4. **Change Credentials**: If compromised, change all passwords and API keys
5. **Enable Firewall**: Ensure proper firewall rules are in place

## Troubleshooting

### Build Errors

If you encounter build errors:

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules
pnpm install

# Rebuild
pnpm run build
```

### PM2 Errors

If PM2 shows errors:

```bash
# Check logs
pm2 logs dreamshop-backend --lines 100
pm2 logs dreamshop-frontend --lines 100

# Restart processes
pm2 restart all

# If still failing, delete and recreate
pm2 delete all
pm2 start ecosystem.config.js
```

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs`
2. Check application logs in `/var/www/dreamshop/logs/`
3. Verify environment variables are set correctly
4. Ensure MongoDB connection is working
5. Check server resources (CPU, memory, disk)

