"use strict";
/**
 * Base64 Image Scanner
 *
 * Scans MongoDB for Base64 images without modifying data
 * Reports all Base64 occurrences with their database paths
 */
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const models_1 = require("../models");
/**
 * Check if a string is a Base64 image
 */
function isBase64Image(str) {
    if (!str || typeof str !== 'string')
        return false;
    return str.startsWith('data:image/') && str.includes('base64,');
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
                value.forEach((item, index) => {
                    if (isBase64Image(item)) {
                        base64Images.push({
                            collection: collectionName,
                            documentId: doc._id.toString(),
                            documentName: doc.name || doc.title || doc.slug || undefined,
                            field,
                            fieldPath: `${field}[${index}]`,
                            base64Length: item.length,
                            estimatedSizeKB: Math.round((item.length * 3) / 4 / 1024), // Base64 is ~33% larger
                        });
                    }
                });
            }
            else if (typeof value === 'string' && isBase64Image(value)) {
                base64Images.push({
                    collection: collectionName,
                    documentId: doc._id.toString(),
                    documentName: doc.name || doc.title || doc.slug || undefined,
                    field,
                    fieldPath: field,
                    base64Length: value.length,
                    estimatedSizeKB: Math.round((value.length * 3) / 4 / 1024),
                });
            }
        }
    }
    return base64Images;
}
async function scan() {
    try {
        console.log('🔍 Scanning MongoDB for Base64 images...\n');
        await (0, database_1.connectToDatabase)();
        console.log('✅ Connected to MongoDB\n');
        const collections = [
            { model: models_1.ProductModel, name: 'products', fields: ['images'] },
            { model: models_1.CategoryModel, name: 'categories', fields: ['image'] },
            { model: models_1.FeaturedProductModel, name: 'featuredProducts', fields: ['images'] },
            { model: models_1.BestSellingProductModel, name: 'bestSellingProducts', fields: ['images'] },
            { model: models_1.PromoBannerModel, name: 'promoBanners', fields: ['image', 'images'] },
            { model: models_1.HeroBannerModel, name: 'heroBanners', fields: ['sliderImages', 'rightBanners'] },
            { model: models_1.FestivalBannerModel, name: 'festivalBanners', fields: ['image', 'images'] },
        ];
        const allBase64Images = [];
        let totalDocuments = 0;
        for (const collection of collections) {
            const count = await collection.model.countDocuments();
            totalDocuments += count;
            console.log(`📁 ${collection.name}: ${count} documents`);
            const base64Images = await scanCollection(collection.model, collection.name, collection.fields);
            allBase64Images.push(...base64Images);
            if (base64Images.length > 0) {
                console.log(`   ⚠️  Found ${base64Images.length} Base64 images:`);
                base64Images.forEach((img) => {
                    const name = img.documentName ? ` (${img.documentName})` : '';
                    console.log(`      - ${img.fieldPath}${name}: ~${img.estimatedSizeKB} KB`);
                });
            }
            else {
                console.log(`   ✅ No Base64 images found`);
            }
            console.log('');
        }
        // Summary
        console.log('📊 Summary:');
        console.log(`   Total documents scanned: ${totalDocuments}`);
        console.log(`   Total Base64 images found: ${allBase64Images.length}`);
        if (allBase64Images.length > 0) {
            const totalSizeKB = allBase64Images.reduce((sum, img) => sum + img.estimatedSizeKB, 0);
            console.log(`   Total estimated size: ${(totalSizeKB / 1024).toFixed(2)} MB`);
            console.log(`\n📋 Detailed List:`);
            allBase64Images.forEach((img, index) => {
                const name = img.documentName ? ` - ${img.documentName}` : '';
                console.log(`   ${index + 1}. ${img.collection}.${img.fieldPath}${name} (~${img.estimatedSizeKB} KB)`);
            });
        }
        else {
            console.log(`   ✅ No Base64 images found in database!`);
        }
    }
    catch (error) {
        console.error('❌ Scan failed:', error);
        throw error;
    }
    finally {
        await (0, database_1.disconnectFromDatabase)();
    }
}
scan()
    .then(() => {
    console.log('\n🎉 Scan completed');
    process.exit(0);
})
    .catch((error) => {
    console.error('\n💥 Scan failed:', error);
    process.exit(1);
});
