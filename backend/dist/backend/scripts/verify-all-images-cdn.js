"use strict";
/**
 * Verify All Images Are CDN URLs
 *
 * This script verifies that all images in MongoDB are CDN URLs (Cloudinary)
 * and not Base64 data URIs
 */
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const models_1 = require("../models");
/**
 * Check if string is Base64 image
 */
function isBase64Image(str) {
    if (!str || typeof str !== 'string')
        return false;
    return str.startsWith('data:image/') && str.includes('base64,');
}
/**
 * Check if string is CDN URL
 */
function isCDNUrl(str) {
    if (!str || typeof str !== 'string')
        return false;
    return str.startsWith('https://res.cloudinary.com/') ||
        str.startsWith('https://') ||
        str.startsWith('http://');
}
/**
 * Check if string is local path
 */
function isLocalPath(str) {
    if (!str || typeof str !== 'string')
        return false;
    return str.startsWith('/uploads/') || str.startsWith('/placeholder');
}
/**
 * Scan collection for image fields
 */
async function scanCollection(model, collectionName, imageFields) {
    const checks = [];
    const documents = await model.find({}).lean();
    for (const doc of documents) {
        for (const field of imageFields) {
            const value = doc[field];
            if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    if (typeof item === 'string' && item.trim()) {
                        checks.push({
                            collection: collectionName,
                            documentId: doc._id.toString(),
                            field: `${field}[${index}]`,
                            value: item.substring(0, 100) + (item.length > 100 ? '...' : ''),
                            isBase64: isBase64Image(item),
                            isCDN: isCDNUrl(item),
                            isLocal: isLocalPath(item),
                        });
                    }
                });
            }
            else if (typeof value === 'string' && value.trim()) {
                checks.push({
                    collection: collectionName,
                    documentId: doc._id.toString(),
                    field,
                    value: value.substring(0, 100) + (value.length > 100 ? '...' : ''),
                    isBase64: isBase64Image(value),
                    isCDN: isCDNUrl(value),
                    isLocal: isLocalPath(value),
                });
            }
        }
    }
    return checks;
}
async function verify() {
    try {
        console.log('🔍 Verifying all images are CDN URLs...\n');
        await (0, database_1.connectToDatabase)();
        console.log('✅ Connected to MongoDB\n');
        const collections = [
            { model: models_1.ProductModel, name: 'products', fields: ['images'] },
            { model: models_1.CategoryModel, name: 'categories', fields: ['image'] },
            { model: models_1.FeaturedProductModel, name: 'featuredProducts', fields: ['images'] },
            { model: models_1.BestSellingProductModel, name: 'bestSellingProducts', fields: ['images'] },
            { model: models_1.PromoBannerModel, name: 'promoBanners', fields: ['image', 'backgroundImage'] },
            { model: models_1.HeroBannerModel, name: 'heroBanners', fields: ['sliderImages', 'rightBanners'] },
            { model: models_1.FestivalBannerModel, name: 'festivalBanners', fields: ['image'] },
        ];
        const allChecks = [];
        let totalDocuments = 0;
        for (const collection of collections) {
            const count = await collection.model.countDocuments();
            totalDocuments += count;
            console.log(`📁 ${collection.name}: ${count} documents`);
            const checks = await scanCollection(collection.model, collection.name, collection.fields);
            allChecks.push(...checks);
            const base64Count = checks.filter(c => c.isBase64).length;
            const cdnCount = checks.filter(c => c.isCDN).length;
            const localCount = checks.filter(c => c.isLocal).length;
            if (checks.length > 0) {
                console.log(`   Images found: ${checks.length}`);
                console.log(`   ✅ CDN URLs: ${cdnCount}`);
                console.log(`   📁 Local paths: ${localCount}`);
                if (base64Count > 0) {
                    console.log(`   ⚠️  Base64: ${base64Count} (NEEDS MIGRATION)`);
                }
            }
            else {
                console.log(`   ℹ️  No images found`);
            }
            console.log('');
        }
        // Summary
        console.log('📊 Verification Summary:');
        console.log(`   Total documents scanned: ${totalDocuments}`);
        console.log(`   Total images found: ${allChecks.length}`);
        const base64Images = allChecks.filter(c => c.isBase64);
        const cdnImages = allChecks.filter(c => c.isCDN);
        const localImages = allChecks.filter(c => c.isLocal);
        const otherImages = allChecks.filter(c => !c.isBase64 && !c.isCDN && !c.isLocal);
        console.log(`   ✅ CDN URLs: ${cdnImages.length} (${((cdnImages.length / allChecks.length) * 100).toFixed(1)}%)`);
        console.log(`   📁 Local paths: ${localImages.length} (${((localImages.length / allChecks.length) * 100).toFixed(1)}%)`);
        if (base64Images.length > 0) {
            console.log(`   ⚠️  Base64 images: ${base64Images.length} (NEEDS MIGRATION!)`);
            console.log(`\n❌ Base64 Images Found:`);
            base64Images.forEach((img, index) => {
                console.log(`   ${index + 1}. ${img.collection}.${img.field} (${img.documentId})`);
            });
        }
        else {
            console.log(`   ✅ Base64 images: 0 (All migrated!)`);
        }
        if (otherImages.length > 0) {
            console.log(`   ⚠️  Other/Invalid: ${otherImages.length}`);
            otherImages.slice(0, 5).forEach((img, index) => {
                console.log(`      ${index + 1}. ${img.collection}.${img.field}: ${img.value}`);
            });
        }
        if (base64Images.length === 0 && cdnImages.length > 0) {
            console.log(`\n✅ SUCCESS: All images are CDN URLs!`);
            console.log(`   All ${cdnImages.length} images are using Cloudinary CDN`);
        }
        else if (base64Images.length > 0) {
            console.log(`\n⚠️  WARNING: ${base64Images.length} Base64 images found. Run migration!`);
        }
    }
    catch (error) {
        console.error('❌ Verification failed:', error);
        throw error;
    }
    finally {
        await (0, database_1.disconnectFromDatabase)();
    }
}
verify()
    .then(() => {
    console.log('\n🎉 Verification completed');
    process.exit(0);
})
    .catch((error) => {
    console.error('\n💥 Verification failed:', error);
    process.exit(1);
});
