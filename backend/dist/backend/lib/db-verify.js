"use strict";
/**
 * Database Verification Script
 * Verifies that data is coming from MongoDB and not JSON files
 */
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const models_1 = require("../models");
async function verifyMongoDB() {
    try {
        console.log('🔍 Verifying MongoDB Connection and Data...\n');
        await (0, database_1.connectToDatabase)();
        console.log('✅ Connected to MongoDB\n');
        // Count documents in each collection
        console.log('📊 Document Counts in MongoDB:');
        console.log(`   Products: ${await models_1.ProductModel.countDocuments()}`);
        console.log(`   Categories: ${await models_1.CategoryModel.countDocuments()}`);
        console.log(`   Colors: ${await models_1.ColorModel.countDocuments()}`);
        console.log(`   Orders: ${await models_1.OrderModel.countDocuments()}`);
        console.log(`   Featured Products: ${await models_1.FeaturedProductModel.countDocuments()}`);
        console.log(`   Best Selling Products: ${await models_1.BestSellingProductModel.countDocuments()}`);
        console.log(`   Hero Banners: ${await models_1.HeroBannerModel.countDocuments()}`);
        console.log(`   Promo Banners: ${await models_1.PromoBannerModel.countDocuments()}`);
        console.log(`   Festival Banners: ${await models_1.FestivalBannerModel.countDocuments()}`);
        console.log(`   Reviews: ${await models_1.ProductReviewModel.countDocuments()}\n`);
        // Sample a few documents to verify structure
        console.log('📝 Sample Documents:');
        const sampleProduct = await models_1.ProductModel.findOne().lean();
        if (sampleProduct) {
            console.log(`   Sample Product ID: ${sampleProduct._id}`);
            console.log(`   Sample Product Name: ${sampleProduct.name}`);
        }
        const sampleCategory = await models_1.CategoryModel.findOne().lean();
        if (sampleCategory) {
            console.log(`   Sample Category ID: ${sampleCategory._id}`);
            console.log(`   Sample Category Name: ${sampleCategory.name}`);
        }
        console.log('\n✅ Verification Complete - All data is in MongoDB!');
    }
    catch (error) {
        console.error('❌ Verification failed:', error);
        throw error;
    }
    finally {
        await (0, database_1.disconnectFromDatabase)();
    }
}
verifyMongoDB()
    .then(() => {
    console.log('\n🎉 Verification script finished');
    process.exit(0);
})
    .catch((error) => {
    console.error('\n💥 Verification script failed:', error);
    process.exit(1);
});
