"use strict";
/**
 * Quick test to verify Cloudinary credentials
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from root .env
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
cloudinary_1.v2.config({
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
        const result = await cloudinary_1.v2.api.ping();
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
        }
        else {
            throw new Error('Cloudinary ping failed');
        }
    }
    catch (error) {
        console.error('❌ Cloudinary test failed:', error);
        if (error instanceof Error) {
            console.error('   Error message:', error.message);
        }
        process.exit(1);
    }
}
testCloudinary();
