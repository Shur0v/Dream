/**
 * Quick test to verify Cloudinary credentials
 */

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.join(process.cwd(), 'backend', '.env');
dotenv.config({ path: envPath });

// Also try .env.local
const envLocalPath = path.join(process.cwd(), '.env.local');
dotenv.config({ path: envLocalPath });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

async function testCloudinary() {
  try {
    console.log('🔍 Testing Cloudinary Configuration...\n');
    
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    console.log('Credentials check:');
    console.log(`  Cloud Name: ${cloudName ? '✅ Set' : '❌ Missing'}`);
    console.log(`  API Key: ${apiKey ? '✅ Set' : '❌ Missing'}`);
    console.log(`  API Secret: ${apiSecret ? '✅ Set' : '❌ Missing'}\n`);
    
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary credentials are missing. Please check your .env files.');
    }
    
    // Test connection by listing resources
    console.log('Testing Cloudinary connection...');
    const result = await cloudinary.api.ping();
    
    if (result.status === 'ok') {
      console.log('✅ Cloudinary connection successful!\n');
      console.log('📁 Folder structure will be:');
      console.log('  dream/products/');
      console.log('  dream/categories/');
      console.log('  dream/featured-products/');
      console.log('  dream/best-selling-products/');
      console.log('  dream/promo-banners/');
      console.log('  dream/hero-banners/');
      console.log('  dream/festival-banners/\n');
      console.log('✅ Ready to migrate images!');
    } else {
      throw new Error('Cloudinary ping failed');
    }
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
    }
    process.exit(1);
  }
}

testCloudinary();

