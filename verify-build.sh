#!/bin/bash

echo "=== Verifying Backend Build ==="
echo ""

echo "1. Checking if backend/dist exists:"
if [ -d "backend/dist" ]; then
    echo "✅ backend/dist directory exists"
    echo "Contents:"
    ls -la backend/dist/ | head -20
else
    echo "❌ backend/dist directory does NOT exist"
fi
echo ""

echo "2. Looking for server.js file:"
find backend -name "server.js" -type f 2>/dev/null
echo ""

echo "3. Checking backend/dist/server.js specifically:"
if [ -f "backend/dist/server.js" ]; then
    echo "✅ backend/dist/server.js EXISTS"
    ls -lh backend/dist/server.js
else
    echo "❌ backend/dist/server.js does NOT exist"
    echo ""
    echo "Checking alternative locations:"
    if [ -f "backend/dist/backend/server.js" ]; then
        echo "⚠️  Found: backend/dist/backend/server.js"
        ls -lh backend/dist/backend/server.js
    fi
fi
echo ""

echo "4. TypeScript build output check:"
if [ -f "backend/tsconfig.json" ]; then
    echo "tsconfig.json found"
    echo "outDir from tsconfig:"
    grep "outDir" backend/tsconfig.json
fi
echo ""

echo "=== Verification Complete ==="
