#!/bin/bash
# Complete VPS Setup Script
# Copy this entire file and run: bash vps-full-setup.sh

set -e

echo "=========================================="
echo "🚀 Dream Shop VPS Complete Setup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Project directory
cd /var/www/dreamshop

echo -e "${YELLOW}📋 Step 1: Checking prerequisites...${NC}"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
if command -v pm2 &> /dev/null; then
    echo "PM2: $(pm2 --version)"
else
    echo -e "${YELLOW}Installing PM2...${NC}"
    npm install -g pm2
fi
echo ""

echo -e "${YELLOW}🔐 Step 2: Checking environment files...${NC}"
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}❌ backend/.env not found!${NC}"
    echo "Creating template..."
    cat > backend/.env << 'EOF'
MONGODB_URI=your_mongodb_connection_string
BACKEND_PORT=5000
NODE_ENV=production
FRONTEND_URL=https://dreamshopltd.com
EOF
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your MongoDB URI${NC}"
else
    echo -e "${GREEN}✅ backend/.env exists${NC}"
fi

if [ ! -f ".env.local" ] && [ ! -f ".env.production" ]; then
    echo "Creating .env.local..."
    cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://dreamshopltd.com/api
NODE_ENV=production
EOF
    echo -e "${GREEN}✅ Created .env.local${NC}"
else
    echo -e "${GREEN}✅ Frontend .env exists${NC}"
fi
echo ""

echo -e "${YELLOW}📦 Step 3: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}🔨 Step 4: Building backend...${NC}"
npm run backend:build
if [ ! -f "backend/dist/server.js" ]; then
    echo -e "${RED}❌ Backend build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend built successfully${NC}"
echo ""

echo -e "${YELLOW}🔨 Step 5: Building frontend...${NC}"
npm run build
if [ ! -d ".next" ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

echo -e "${YELLOW}🛑 Step 6: Stopping existing PM2 processes...${NC}"
pm2 delete all 2>/dev/null || true
echo -e "${GREEN}✅ Existing processes stopped${NC}"
echo ""

echo -e "${YELLOW}🚀 Step 7: Starting services with PM2...${NC}"
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
echo -e "${GREEN}✅ Services started${NC}"
echo ""

echo -e "${YELLOW}⏳ Step 8: Waiting for services to start...${NC}"
sleep 8
echo ""

echo -e "${YELLOW}📊 Step 9: Service Status:${NC}"
pm2 status
echo ""

echo -e "${YELLOW}🏥 Step 10: Health Checks:${NC}"
sleep 3

if curl -s http://localhost:5000/health | grep -q "ok"; then
    echo -e "${GREEN}✅ Backend: OK${NC}"
else
    echo -e "${YELLOW}⚠️  Backend: Starting... (check logs if needed)${NC}"
fi

if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|304"; then
    echo -e "${GREEN}✅ Frontend: OK${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend: Starting... (check logs if needed)${NC}"
fi
echo ""

echo -e "${GREEN}=========================================="
echo "✅ Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Check status: pm2 status"
echo "2. View logs: pm2 logs"
echo "3. Setup auto-start: pm2 startup"
echo "4. Visit: https://dreamshopltd.com"
echo ""

