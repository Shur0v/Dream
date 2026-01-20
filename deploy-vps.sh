#!/bin/bash

# VPS Deployment Script for Dreamshop
# Usage: ./deploy-vps.sh

set -e  # Exit on error

echo "🚀 Starting VPS Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}⚠️  Some commands may require sudo. Make sure you have sudo access.${NC}"
fi

# Step 1: Check Node.js
echo -e "\n${GREEN}📦 Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Installing...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo -e "${GREEN}✅ Node.js $(node --version) found${NC}"
fi

# Step 2: Check PM2
echo -e "\n${GREEN}📦 Checking PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 not found. Installing...${NC}"
    sudo npm install -g pm2
else
    echo -e "${GREEN}✅ PM2 found${NC}"
fi

# Step 3: Check Nginx
echo -e "\n${GREEN}📦 Checking Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}⚠️  Nginx not found. Installing...${NC}"
    sudo apt update
    sudo apt install nginx -y
    sudo systemctl start nginx
    sudo systemctl enable nginx
else
    echo -e "${GREEN}✅ Nginx found${NC}"
fi

# Step 4: Check .env file
echo -e "\n${GREEN}📝 Checking .env file...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    echo -e "${YELLOW}Please create .env file with required variables:${NC}"
    echo "  - NODE_ENV=production"
    echo "  - BACKEND_PORT=5000"
    echo "  - PORT=3000"
    echo "  - MONGODB_URI=your-mongodb-connection-string"
    echo "  - JWT_SECRET=your-secret-key"
    exit 1
else
    echo -e "${GREEN}✅ .env file found${NC}"
fi

# Step 5: Install dependencies
echo -e "\n${GREEN}📦 Installing dependencies...${NC}"
if [ -f pnpm-lock.yaml ]; then
    echo "Using pnpm..."
    npm install -g pnpm
    pnpm install
else
    echo "Using npm..."
    npm install
fi

# Step 6: Build backend
echo -e "\n${GREEN}🔨 Building backend...${NC}"
npm run backend:build

if [ ! -f backend/dist/server.js ]; then
    echo -e "${RED}❌ Backend build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Backend built successfully${NC}"

# Step 7: Build frontend
echo -e "\n${GREEN}🔨 Building frontend...${NC}"
npm run build

if [ ! -d .next ]; then
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Frontend built successfully${NC}"

# Step 8: Create logs directory
echo -e "\n${GREEN}📁 Creating logs directory...${NC}"
mkdir -p logs
echo -e "${GREEN}✅ Logs directory created${NC}"

# Step 9: Stop existing PM2 processes
echo -e "\n${GREEN}🛑 Stopping existing PM2 processes...${NC}"
pm2 stop ecosystem.config.js 2>/dev/null || true
pm2 delete ecosystem.config.js 2>/dev/null || true

# Step 10: Start PM2
echo -e "\n${GREEN}🚀 Starting PM2 processes...${NC}"
pm2 start ecosystem.config.js
pm2 save

# Step 11: Check PM2 status
echo -e "\n${GREEN}📊 PM2 Status:${NC}"
pm2 status

# Step 12: Wait a bit for servers to start
echo -e "\n${GREEN}⏳ Waiting for servers to start...${NC}"
sleep 5

# Step 13: Test backend
echo -e "\n${GREEN}🧪 Testing backend...${NC}"
if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend is not responding${NC}"
    echo "Check logs: pm2 logs dreamshop-backend"
fi

# Step 14: Test frontend
echo -e "\n${GREEN}🧪 Testing frontend...${NC}"
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${RED}❌ Frontend is not responding${NC}"
    echo "Check logs: pm2 logs dreamshop-frontend"
fi

# Step 15: Nginx reminder
echo -e "\n${YELLOW}⚠️  Don't forget to:${NC}"
echo "1. Setup Nginx configuration (see NGINX_SETUP.md)"
echo "2. Install SSL certificate: sudo certbot --nginx -d yourdomain.com"
echo "3. Configure firewall: sudo ufw allow 'Nginx Full'"

echo -e "\n${GREEN}✅ Deployment completed!${NC}"
echo -e "\n${GREEN}Useful commands:${NC}"
echo "  - PM2 logs: pm2 logs"
echo "  - PM2 status: pm2 status"
echo "  - PM2 restart: pm2 restart ecosystem.config.js"
echo "  - Nginx test: sudo nginx -t"
echo "  - Nginx reload: sudo systemctl reload nginx"
