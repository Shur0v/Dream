#!/bin/bash

# Fix Script After Git Pull
# Run this every time after git pull to ensure backend is updated

set -e

echo "🔧 Fixing Backend After Git Pull..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get project directory
PROJECT_DIR="/var/www/dreamshop"
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}❌ Project directory not found at $PROJECT_DIR${NC}"
    exit 1
fi

cd "$PROJECT_DIR"

echo -e "${GREEN}📁 Current directory: $(pwd)${NC}"
echo ""

# Step 1: Check if .env exists
echo -e "${YELLOW}Step 1: Checking .env file...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo "Please create .env file with MONGODB_URI"
    exit 1
fi
echo -e "${GREEN}✅ .env file exists${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2: Installing/updating dependencies...${NC}"
npm install
echo ""

# Step 3: Rebuild backend (IMPORTANT!)
echo -e "${YELLOW}Step 3: Rebuilding backend (CRITICAL!)...${NC}"
npm run backend:build

if [ ! -f "backend/dist/server.js" ]; then
    echo -e "${RED}❌ Backend build failed!${NC}"
    echo "Check build errors above"
    exit 1
fi
echo -e "${GREEN}✅ Backend built successfully${NC}"
echo ""

# Step 4: Check build timestamp
echo -e "${YELLOW}Step 4: Checking build timestamp...${NC}"
BUILD_TIME=$(stat -c %Y backend/dist/server.js 2>/dev/null || stat -f %m backend/dist/server.js 2>/dev/null)
CURRENT_TIME=$(date +%s)
AGE=$((CURRENT_TIME - BUILD_TIME))
echo "Build age: ${AGE} seconds"
if [ $AGE -gt 300 ]; then
    echo -e "${YELLOW}⚠️  Build is older than 5 minutes, rebuilding...${NC}"
    npm run backend:build
fi
echo ""

# Step 5: Stop PM2 processes
echo -e "${YELLOW}Step 5: Stopping PM2 processes...${NC}"
pm2 stop all 2>/dev/null || true
sleep 2
pm2 delete all 2>/dev/null || true
sleep 1
echo ""

# Step 6: Clear PM2 logs (optional)
echo -e "${YELLOW}Step 6: Clearing old PM2 logs...${NC}"
pm2 flush 2>/dev/null || true
echo ""

# Step 7: Start PM2 with fresh processes
echo -e "${YELLOW}Step 7: Starting PM2 processes...${NC}"
pm2 start ecosystem.config.js
pm2 save
echo ""

# Step 8: Wait for servers to start
echo -e "${YELLOW}Step 8: Waiting for servers to start...${NC}"
sleep 8
echo ""

# Step 9: Check PM2 status
echo -e "${YELLOW}Step 9: Checking PM2 status...${NC}"
pm2 status
echo ""

# Step 10: Check backend logs for errors
echo -e "${YELLOW}Step 10: Checking backend logs (last 30 lines)...${NC}"
pm2 logs dreamshop-backend --lines 30 --nostream | tail -30
echo ""

# Step 11: Test endpoints
echo -e "${YELLOW}Step 11: Testing endpoints...${NC}"

echo -n "Testing /health: "
HEALTH_RESPONSE=$(curl -s http://localhost:5000/health 2>/dev/null)
if [ $? -eq 0 ] && echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
    echo "Response: $HEALTH_RESPONSE"
fi

echo -n "Testing /api/hero-banners: "
HERO_RESPONSE=$(curl -s http://localhost:5000/api/hero-banners 2>/dev/null)
if [ $? -eq 0 ] && echo "$HERO_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
    echo "Response: $HERO_RESPONSE"
fi

echo -n "Testing /api/products: "
PRODUCTS_RESPONSE=$(curl -s "http://localhost:5000/api/products?limit=1" 2>/dev/null)
if [ $? -eq 0 ] && echo "$PRODUCTS_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
    echo "Response: $PRODUCTS_RESPONSE"
fi

echo ""

# Step 12: Check MongoDB connection in logs
echo -e "${YELLOW}Step 12: Checking MongoDB connection status...${NC}"
if pm2 logs dreamshop-backend --lines 50 --nostream | grep -q "MongoDB connection established"; then
    echo -e "${GREEN}✅ MongoDB connected${NC}"
else
    echo -e "${RED}❌ MongoDB connection issue detected${NC}"
    echo "Check logs: pm2 logs dreamshop-backend"
fi
echo ""

echo -e "${GREEN}✅ Fix completed!${NC}"
echo ""
echo "If issues persist, check:"
echo "  1. pm2 logs dreamshop-backend --lines 100"
echo "  2. cat .env | grep MONGODB_URI"
echo "  3. curl http://localhost:5000/health"
echo ""
