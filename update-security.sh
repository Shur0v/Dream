#!/bin/bash

# Security Update Script for Next.js and React
# Fixes CVE-2025-55182, CVE-2025-66478, CVE-2025-55184, CVE-2025-67779, CVE-2025-55183

echo "🔒 Starting Security Update Process..."
echo "======================================"

# Check if pnpm is available, otherwise use npm
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    INSTALL_CMD="pnpm install"
    UPDATE_CMD="pnpm update"
else
    PKG_MANAGER="npm"
    INSTALL_CMD="npm install"
    UPDATE_CMD="npm update"
fi

echo "📦 Using package manager: $PKG_MANAGER"
echo ""

# Step 1: Update Next.js to patched version
echo "1️⃣  Updating Next.js to 15.5.7 (patched version)..."
$INSTALL_CMD next@15.5.7 --save-exact

# Step 2: Update React to patched version
echo "2️⃣  Updating React to 19.2.3 (patched version)..."
$INSTALL_CMD react@19.2.3 react-dom@19.2.3 --save-exact

# Step 3: Update TypeScript types
echo "3️⃣  Updating TypeScript types..."
$INSTALL_CMD @types/react@latest @types/react-dom@latest --save-dev

# Step 4: Update ESLint config if exists
if [ -f "package.json" ] && grep -q "eslint-config-next" package.json; then
    echo "4️⃣  Updating eslint-config-next..."
    $INSTALL_CMD eslint-config-next@latest --save-dev
fi

# Step 5: Clean install
echo "5️⃣  Cleaning and reinstalling dependencies..."
rm -rf node_modules
rm -f package-lock.json pnpm-lock.yaml yarn.lock
$INSTALL_CMD

# Step 6: Verify versions
echo ""
echo "6️⃣  Verifying installed versions..."
$PKG_MANAGER list next react react-dom

# Step 7: Build backend
echo ""
echo "7️⃣  Building backend..."
$PKG_MANAGER run backend:build

# Step 8: Build frontend
echo ""
echo "8️⃣  Building frontend..."
$PKG_MANAGER run build

echo ""
echo "✅ Security update completed!"
echo "======================================"
echo "📋 Next steps:"
echo "   1. Review the build output above"
echo "   2. Test your application locally"
echo "   3. Restart PM2 processes: pm2 restart all"
echo "   4. Monitor logs: pm2 logs"
echo ""

