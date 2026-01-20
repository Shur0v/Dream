#!/bin/bash

# Quick Fix Script for VPS
# Run this on VPS to fix all routes immediately

set -e

echo "🔧 Starting Quick Fix..."
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

# Step 1: Pull latest code
echo -e "${YELLOW}Step 1: Pulling latest code...${NC}"
if [ -d ".git" ]; then
    git pull origin main || echo "⚠️  Git pull failed, continuing..."
else
    echo "⚠️  Not a git repository, skipping pull"
fi
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
npm install
echo ""

# Step 3: Rebuild backend
echo -e "${YELLOW}Step 3: Rebuilding backend...${NC}"
npm run backend:build

if [ ! -f "backend/dist/server.js" ]; then
    echo -e "${RED}❌ Backend build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend built successfully${NC}"
echo ""

# Step 4: Stop PM2 processes
echo -e "${YELLOW}Step 4: Stopping PM2 processes...${NC}"
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
echo ""

# Step 5: Start PM2
echo -e "${YELLOW}Step 5: Starting PM2 processes...${NC}"
pm2 start ecosystem.config.js
pm2 save
echo ""

# Step 6: Wait for servers to start
echo -e "${YELLOW}Step 6: Waiting for servers to start...${NC}"
sleep 5
echo ""

# Step 7: Check status
echo -e "${YELLOW}Step 7: Checking PM2 status...${NC}"
pm2 status
echo ""

# Step 8: Test endpoints
echo -e "${YELLOW}Step 8: Testing endpoints...${NC}"

echo -n "Testing /health: "
if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
fi

echo -n "Testing /api/hero-banners: "
if curl -s http://localhost:5000/api/hero-banners > /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
fi

echo -n "Testing /api/products: "
if curl -s http://localhost:5000/api/products?limit=1 > /dev/null; then
    echo -e "${GREEN}✅${NC}"
else
    echo -e "${RED}❌${NC}"
fi

echo ""
echo -e "${GREEN}✅ Quick fix completed!${NC}"
echo ""
echo "Check logs if any issues:"
echo "  pm2 logs dreamshop-backend --lines 50"
echo ""
