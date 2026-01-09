#!/bin/bash
# Connect to VPS and run setup
ssh root@72.60.205.98 << 'ENDSSH'
cd /var/www/dreamshop
pwd
ls -la
echo "Current directory contents listed above"
ENDSSH
