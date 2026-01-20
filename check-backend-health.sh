#!/bin/bash

# Backend Health Check Script
# Run this on VPS to diagnose backend issues

echo "🔍 Checking Backend Health..."
echo ""

# Check if backend process is running
echo "1. Checking PM2 Status:"
pm2 status
echo ""

# Check backend logs for errors
echo "2. Recent Backend Errors (last 50 lines):"
pm2 logs dreamshop-backend --lines 50 --err | tail -50
echo ""

# Check if MongoDB connection is working
echo "3. Testing MongoDB Connection:"
cd /var/www/dreamshop
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.log('❌ MONGODB_URI not found in .env');
  process.exit(1);
}
mongoose.connect(uri)
  .then(() => {
    console.log('✅ MongoDB connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
"
echo ""

# Check if backend build exists
echo "4. Checking Backend Build:"
if [ -f "backend/dist/server.js" ]; then
  echo "✅ Backend build file exists"
else
  echo "❌ Backend build file NOT found!"
  echo "   Run: npm run backend:build"
fi
echo ""

# Check if required dependencies are installed
echo "5. Checking Required Dependencies:"
cd /var/www/dreamshop
node -e "
const required = ['express', 'mongoose', 'cors', 'dotenv', 'sharp'];
const pkg = require('./package.json');
const missing = required.filter(dep => !pkg.dependencies[dep] && !pkg.devDependencies[dep]);
if (missing.length === 0) {
  console.log('✅ All required dependencies found');
} else {
  console.log('❌ Missing dependencies:', missing.join(', '));
}
"
echo ""

# Check port availability
echo "6. Checking Port Availability:"
if netstat -tuln | grep -q ':5000 '; then
  echo "⚠️  Port 5000 is in use"
  netstat -tuln | grep ':5000 '
else
  echo "✅ Port 5000 is available"
fi
echo ""

# Check .env file
echo "7. Checking .env file:"
if [ -f ".env" ]; then
  echo "✅ .env file exists"
  if grep -q "MONGODB_URI" .env; then
    echo "✅ MONGODB_URI found in .env"
  else
    echo "❌ MONGODB_URI NOT found in .env"
  fi
else
  echo "❌ .env file NOT found!"
fi
echo ""

echo "✅ Health check complete!"
