"use strict";
/**
 * Base64 to Cloudinary Migration Script
 *
 * This script:
 * 1. Scans MongoDB for Base64 images
 * 2. Converts Base64 to optimized images using Sharp
 * 3. Uploads to Cloudinary CDN
 * 4. Updates MongoDB with CDN URLs
 * 5. Reports migration results
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const models_1 = require("../models");
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from root .env
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
});
/**
 * Check if a string is a Base64 image
 */
function isBase64Image(str) {
    if (!str || typeof str !== 'string')
        return false;
    return str.startsWith('data:image/') && str.includes('base64,');
}
/**
 * Extract Base64 data from data URI
 */
function extractBase64Data(dataUri) {
    const match = dataUri.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!match)
        return null;
    return {
        mimeType: match[1],
        base64: match[2],
    };
}
/**
 * Convert Base64 to Buffer
 */
function base64ToBuffer(base64) {
    return Buffer.from(base64, 'base64');
}
/**
 * Optimize image using Sharp
 */
async function optimizeImage(buffer, options = {}) {
    const { maxSizeKB = 700, quality = 85 } = options;
    const maxSizeBytes = maxSizeKB * 1024;
    let optimized = (0, sharp_1.default)(buffer)
        .webp({ quality })
        .resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true,
    });
    let outputBuffer = await optimized.toBuffer();
    // If still too large, reduce quality iteratively
    if (outputBuffer.length > maxSizeBytes) {
        let currentQuality = quality;
        while (outputBuffer.length > maxSizeBytes && currentQuality > 50) {
            currentQuality -= 10;
            outputBuffer = await (0, sharp_1.default)(buffer)
                .webp({ quality: currentQuality })
                .resize(1920, 1920, {
                fit: 'inside',
                withoutEnlargement: true,
            })
                .toBuffer();
        }
    }
    return outputBuffer;
}
/**
 * Upload image to Cloudinary
 */
async function uploadToCloudinary(buffer, folder, publicId) {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            folder: `dream/${folder}`,
            resource_type: 'image',
            format: 'webp',
            transformation: [
                { quality: 'auto' },
                { fetch_format: 'auto' },
            ],
            overwrite: false, // Don't overwrite existing images
            invalidate: true, // Invalidate CDN cache
        };
        if (publicId) {
            // publicId already includes folder, so use it directly
            uploadOptions.public_id = `dream/${publicId}`;
        }
        cloudinary_1.v2.uploader
            .upload_stream(uploadOptions, (error, result) => {
            if (error) {
                reject(error);
            }
            else if (result) {
                resolve(result.secure_url);
            }
            else {
                reject(new Error('Upload failed: No result returned'));
            }
        })
            .end(buffer);
    });
}
/**
 * Scan collection for Base64 images
 */
async function scanCollection(model, collectionName, imageFields) {
    const base64Images = [];
    const documents = await model.find({}).lean();
    for (const doc of documents) {
        for (const field of imageFields) {
            const value = doc[field];
            if (Array.isArray(value)) {
                // Handle array fields (e.g., images[])
                value.forEach((item, index) => {
                    if (isBase64Image(item)) {
                        base64Images.push({
                            collection: collectionName,
                            documentId: doc._id.toString(),
                            field,
                            fieldPath: `${field}[${index}]`,
                            base64: item,
                            size: Buffer.from(item).length,
                        });
                    }
                });
            }
            else if (typeof value === 'string' && isBase64Image(value)) {
                // Handle string fields (e.g., image)
                base64Images.push({
                    collection: collectionName,
                    documentId: doc._id.toString(),
                    field,
                    fieldPath: field,
                    base64: value,
                    size: Buffer.from(value).length,
                });
            }
        }
    }
    return base64Images;
}
/**
 * Migrate Base64 image to Cloudinary
 */
async function migrateImage(base64Image) {
    try {
        // Extract Base64 data
        const extracted = extractBase64Data(base64Image.base64);
        if (!extracted) {
            throw new Error('Invalid Base64 image format');
        }
        // Convert to Buffer
        const buffer = base64ToBuffer(extracted.base64);
        // Optimize image
        const optimizedBuffer = await optimizeImage(buffer, {
            maxSizeKB: 700,
            quality: 85,
        });
        console.log(`  [${base64Image.collection}] ${base64Image.fieldPath}: ${(buffer.length / 1024).toFixed(2)}KB → ${(optimizedBuffer.length / 1024).toFixed(2)}KB`);
        // Upload to Cloudinary with proper folder structure
        // Map collection names to proper folder names
        const folderMap = {
            'products': 'products',
            'categories': 'categories',
            'featuredProducts': 'featured-products',
            'bestSellingProducts': 'best-selling-products',
            'promoBanners': 'promo-banners',
            'heroBanners': 'hero-banners',
            'festivalBanners': 'festival-banners',
        };
        const folder = folderMap[base64Image.collection] || base64Image.collection.toLowerCase().replace('model', '');
        const publicId = `${folder}/${base64Image.documentId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const cdnUrl = await uploadToCloudinary(optimizedBuffer, folder, publicId);
        return cdnUrl;
    }
    catch (error) {
        console.error(`  ❌ Error migrating ${base64Image.collection}.${base64Image.fieldPath}:`, error instanceof Error ? error.message : error);
        return null;
    }
}
/**
 * Update document in MongoDB
 */
async function updateDocument(model, documentId, fieldPath, newUrl) {
    try {
        const doc = await model.findById(documentId);
        if (!doc) {
            throw new Error(`Document not found: ${documentId}`);
        }
        // Handle array fields (e.g., images[0])
        const arrayMatch = fieldPath.match(/^(.+)\[(\d+)\]$/);
        if (arrayMatch) {
            const field = arrayMatch[1];
            const index = parseInt(arrayMatch[2]);
            if (Array.isArray(doc[field])) {
                doc[field][index] = newUrl;
                await doc.save();
                return true;
            }
        }
        else {
            // Handle string fields
            doc[fieldPath] = newUrl;
            await doc.save();
            return true;
        }
        return false;
    }
    catch (error) {
        console.error(`  ❌ Error updating document ${documentId}:`, error);
        return false;
    }
}
/**
 * Main migration function
 */
async function migrate() {
    const result = {
        scanned: 0,
        found: 0,
        converted: 0,
        failed: 0,
        skipped: 0,
        totalSizeBefore: 0,
        totalSizeAfter: 0,
        errors: [],
    };
    try {
        console.log('🚀 Starting Base64 to Cloudinary Migration...\n');
        // Check Cloudinary configuration
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            throw new Error('Cloudinary credentials not found in environment variables. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in root .env file');
        }
        await (0, database_1.connectToDatabase)();
        console.log('✅ Connected to MongoDB\n');
        // Define collections and their image fields
        const collections = [
            { model: models_1.ProductModel, name: 'products', fields: ['images'] },
            { model: models_1.CategoryModel, name: 'categories', fields: ['image'] },
            { model: models_1.FeaturedProductModel, name: 'featuredProducts', fields: ['images'] },
            { model: models_1.BestSellingProductModel, name: 'bestSellingProducts', fields: ['images'] },
            { model: models_1.PromoBannerModel, name: 'promoBanners', fields: ['image', 'images', 'backgroundImage'] },
            { model: models_1.HeroBannerModel, name: 'heroBanners', fields: ['sliderImages', 'rightBanners'] },
            { model: models_1.FestivalBannerModel, name: 'festivalBanners', fields: ['image', 'images'] },
        ];
        // Step 1: Scan all collections
        console.log('📖 Step 1: Scanning collections for Base64 images...\n');
        const allBase64Images = [];
        for (const collection of collections) {
            const count = await collection.model.countDocuments();
            console.log(`  Scanning ${collection.name} (${count} documents)...`);
            const base64Images = await scanCollection(collection.model, collection.name, collection.fields);
            allBase64Images.push(...base64Images);
            result.scanned += count;
            if (base64Images.length > 0) {
                console.log(`    ⚠️  Found ${base64Images.length} Base64 images`);
            }
            else {
                console.log(`    ✅ No Base64 images found`);
            }
            console.log('');
        }
        result.found = allBase64Images.length;
        result.totalSizeBefore = allBase64Images.reduce((sum, img) => sum + img.size, 0);
        if (allBase64Images.length === 0) {
            console.log('✅ No Base64 images found. Migration complete!\n');
            return result;
        }
        console.log(`\n📊 Summary: Found ${allBase64Images.length} Base64 images (${(result.totalSizeBefore / 1024 / 1024).toFixed(2)} MB)\n`);
        // Step 2: Migrate each image
        console.log('🔄 Step 2: Migrating images to Cloudinary...\n');
        for (let i = 0; i < allBase64Images.length; i++) {
            const base64Image = allBase64Images[i];
            console.log(`[${i + 1}/${allBase64Images.length}] Migrating ${base64Image.collection}.${base64Image.fieldPath}...`);
            // Check if already a URL (skip if already migrated)
            if (base64Image.base64.startsWith('http://') || base64Image.base64.startsWith('https://')) {
                console.log('  ⏭️  Already a URL, skipping');
                result.skipped++;
                continue;
            }
            // Migrate image
            const cdnUrl = await migrateImage(base64Image);
            if (cdnUrl) {
                // Update document
                const collection = collections.find(c => c.name === base64Image.collection);
                if (collection) {
                    const updated = await updateDocument(collection.model, base64Image.documentId, base64Image.fieldPath, cdnUrl);
                    if (updated) {
                        result.converted++;
                        console.log(`  ✅ Migrated to: ${cdnUrl}\n`);
                    }
                    else {
                        result.failed++;
                        result.errors.push({
                            collection: base64Image.collection,
                            documentId: base64Image.documentId,
                            error: 'Failed to update document',
                        });
                    }
                }
                else {
                    result.failed++;
                    result.errors.push({
                        collection: base64Image.collection,
                        documentId: base64Image.documentId,
                        error: 'Collection not found',
                    });
                }
            }
            else {
                result.failed++;
                result.errors.push({
                    collection: base64Image.collection,
                    documentId: base64Image.documentId,
                    error: 'Failed to migrate image',
                });
            }
            // Small delay to avoid rate limiting (reduced for faster migration)
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        // Step 3: Report results
        console.log('\n📊 Migration Summary:');
        console.log(`   Documents scanned: ${result.scanned}`);
        console.log(`   Base64 images found: ${result.found}`);
        console.log(`   Successfully migrated: ${result.converted}`);
        console.log(`   Failed: ${result.failed}`);
        console.log(`   Skipped (already URLs): ${result.skipped}`);
        console.log(`   Total size before: ${(result.totalSizeBefore / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Total size after: ~${((result.converted * 500 * 1024) / 1024 / 1024).toFixed(2)} MB (estimated)`);
        if (result.errors.length > 0) {
            console.log(`\n⚠️  Errors (${result.errors.length}):`);
            result.errors.slice(0, 10).forEach((error, index) => {
                console.log(`   ${index + 1}. ${error.collection}/${error.documentId}: ${error.error}`);
            });
            if (result.errors.length > 10) {
                console.log(`   ... and ${result.errors.length - 10} more errors`);
            }
        }
        console.log('\n✅ Migration completed!');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
    finally {
        await (0, database_1.disconnectFromDatabase)();
    }
    return result;
}
// Run migration
migrate()
    .then((result) => {
    console.log('\n🎉 Migration script finished');
    process.exit(result.failed > 0 ? 1 : 0);
})
    .catch((error) => {
    console.error('\n💥 Migration script failed:', error);
    process.exit(1);
});
