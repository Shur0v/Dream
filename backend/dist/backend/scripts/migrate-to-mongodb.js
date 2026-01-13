"use strict";
/**
 * Migration Script: JSON to MongoDB
 * Transfers all data from JSON files to MongoDB
 */
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const models_1 = require("../models");
const jsonStore_1 = require("../lib/jsonStore");
const database_2 = require("../schemas/database");
async function migrate() {
    try {
        console.log('🚀 Starting MongoDB Migration...\n');
        // Connect to MongoDB
        await (0, database_1.connectToDatabase)();
        console.log('✅ Connected to MongoDB\n');
        // Read JSON database
        console.log('📖 Reading JSON database...');
        const rawData = await (0, jsonStore_1.readJsonStore)('database', { fileName: 'database' });
        const db = database_2.DatabaseSchema.parse(rawData ?? {});
        console.log('✅ JSON database loaded\n');
        // Clear existing collections (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing collections...');
        await models_1.ProductModel.deleteMany({});
        await models_1.CategoryModel.deleteMany({});
        await models_1.ColorModel.deleteMany({});
        await models_1.UserModel.deleteMany({});
        await models_1.OrderModel.deleteMany({});
        await models_1.FeaturedProductModel.deleteMany({});
        await models_1.BestSellingProductModel.deleteMany({});
        await models_1.HeroBannerModel.deleteMany({});
        await models_1.PromoBannerModel.deleteMany({});
        await models_1.FestivalBannerModel.deleteMany({});
        await models_1.ProductReviewModel.deleteMany({});
        console.log('✅ Collections cleared\n');
        // Migrate Products
        if (db.products && db.products.length > 0) {
            console.log(`📦 Migrating ${db.products.length} products...`);
            const productsToInsert = db.products.map((product) => {
                const { id, ...productData } = product;
                // Make SKU unique by appending product ID if needed
                const uniqueSku = productData.sku || `SKU-${id || Date.now()}-${Math.random().toString(36).substring(7)}`;
                return {
                    ...productData,
                    sku: uniqueSku,
                };
            });
            // Insert products one by one to handle duplicates gracefully
            let insertedCount = 0;
            let skippedCount = 0;
            for (const product of productsToInsert) {
                try {
                    // Check if SKU already exists
                    const existing = await models_1.ProductModel.findOne({ sku: product.sku });
                    if (existing) {
                        // Make SKU unique by appending timestamp
                        product.sku = `${product.sku}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
                    }
                    await models_1.ProductModel.create(product);
                    insertedCount++;
                }
                catch (error) {
                    if (error.code === 11000) {
                        // Duplicate key error - make SKU unique and retry
                        product.sku = `${product.sku}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
                        try {
                            await models_1.ProductModel.create(product);
                            insertedCount++;
                        }
                        catch (retryError) {
                            console.warn(`⚠️  Skipped product with SKU: ${product.sku}`, retryError);
                            skippedCount++;
                        }
                    }
                    else {
                        console.warn(`⚠️  Skipped product: ${product.name}`, error.message);
                        skippedCount++;
                    }
                }
            }
            console.log(`✅ Migrated ${insertedCount} products${skippedCount > 0 ? `, skipped ${skippedCount}` : ''}\n`);
        }
        // Migrate Categories
        if (db.categories && db.categories.length > 0) {
            console.log(`📁 Migrating ${db.categories.length} categories...`);
            const categoriesToInsert = db.categories.map((category) => {
                const { id, ...categoryData } = category;
                return {
                    ...categoryData,
                };
            });
            await models_1.CategoryModel.insertMany(categoriesToInsert);
            console.log(`✅ Migrated ${db.categories.length} categories\n`);
        }
        // Migrate Colors
        if (db.colors && db.colors.length > 0) {
            console.log(`🎨 Migrating ${db.colors.length} colors...`);
            const colorsToInsert = db.colors.map((color) => {
                const { id, ...colorData } = color;
                return {
                    ...colorData,
                };
            });
            await models_1.ColorModel.insertMany(colorsToInsert);
            console.log(`✅ Migrated ${db.colors.length} colors\n`);
        }
        // Migrate Users
        if (db.users && db.users.length > 0) {
            console.log(`👥 Migrating ${db.users.length} users...`);
            const usersToInsert = db.users.map((user) => {
                const { id, ...userData } = user;
                return {
                    ...userData,
                };
            });
            await models_1.UserModel.insertMany(usersToInsert);
            console.log(`✅ Migrated ${db.users.length} users\n`);
        }
        // Migrate Orders
        if (db.orders && db.orders.length > 0) {
            console.log(`📋 Migrating ${db.orders.length} orders...`);
            const ordersToInsert = db.orders.map((order) => {
                const { id, ...orderData } = order;
                return {
                    ...orderData,
                };
            });
            await models_1.OrderModel.insertMany(ordersToInsert);
            console.log(`✅ Migrated ${db.orders.length} orders\n`);
        }
        // Migrate Featured Products
        if (db.featuredProducts && db.featuredProducts.length > 0) {
            console.log(`⭐ Migrating ${db.featuredProducts.length} featured products...`);
            const featuredToInsert = db.featuredProducts.map((fp) => {
                const { id, ...fpData } = fp;
                return {
                    ...fpData,
                    featuredAt: fp.featuredAt || new Date().toISOString(),
                };
            });
            await models_1.FeaturedProductModel.insertMany(featuredToInsert);
            console.log(`✅ Migrated ${db.featuredProducts.length} featured products\n`);
        }
        // Migrate Best Selling Products
        if (db.bestSellingProducts && db.bestSellingProducts.length > 0) {
            console.log(`🔥 Migrating ${db.bestSellingProducts.length} best selling products...`);
            const bestSellingToInsert = db.bestSellingProducts.map((bs) => {
                const { id, ...bsData } = bs;
                return {
                    ...bsData,
                    bestSellingAt: bs.bestSellingAt || new Date().toISOString(),
                };
            });
            await models_1.BestSellingProductModel.insertMany(bestSellingToInsert);
            console.log(`✅ Migrated ${db.bestSellingProducts.length} best selling products\n`);
        }
        // Migrate Hero Banners
        if (db.heroBanners && db.heroBanners.length > 0) {
            console.log(`🖼️  Migrating ${db.heroBanners.length} hero banners...`);
            const heroBannersToInsert = db.heroBanners.map((hb) => {
                const { id, ...hbData } = hb;
                return {
                    ...hbData,
                };
            });
            await models_1.HeroBannerModel.insertMany(heroBannersToInsert);
            console.log(`✅ Migrated ${db.heroBanners.length} hero banners\n`);
        }
        // Migrate Promo Banners
        if (db.promoBanners && db.promoBanners.length > 0) {
            console.log(`🎯 Migrating ${db.promoBanners.length} promo banners...`);
            const promoBannersToInsert = db.promoBanners.map((pb) => {
                const { id, ...pbData } = pb;
                return {
                    ...pbData,
                };
            });
            await models_1.PromoBannerModel.insertMany(promoBannersToInsert);
            console.log(`✅ Migrated ${db.promoBanners.length} promo banners\n`);
        }
        // Migrate Festival Banners
        if (db.festivalBanners && db.festivalBanners.length > 0) {
            console.log(`🎉 Migrating ${db.festivalBanners.length} festival banners...`);
            const festivalBannersToInsert = db.festivalBanners.map((fb) => {
                const { id, ...fbData } = fb;
                return {
                    ...fbData,
                };
            });
            await models_1.FestivalBannerModel.insertMany(festivalBannersToInsert);
            console.log(`✅ Migrated ${db.festivalBanners.length} festival banners\n`);
        }
        // Migrate Reviews
        if (db.reviews && db.reviews.length > 0) {
            console.log(`💬 Migrating ${db.reviews.length} reviews...`);
            const reviewsToInsert = db.reviews.map((review) => {
                const { id, ...reviewData } = review;
                return {
                    ...reviewData,
                    date: review.date || new Date().toISOString(),
                };
            });
            await models_1.ProductReviewModel.insertMany(reviewsToInsert);
            console.log(`✅ Migrated ${db.reviews.length} reviews\n`);
        }
        // Verify migration
        console.log('📊 Migration Summary:');
        console.log(`   Products: ${await models_1.ProductModel.countDocuments()}`);
        console.log(`   Categories: ${await models_1.CategoryModel.countDocuments()}`);
        console.log(`   Colors: ${await models_1.ColorModel.countDocuments()}`);
        console.log(`   Users: ${await models_1.UserModel.countDocuments()}`);
        console.log(`   Orders: ${await models_1.OrderModel.countDocuments()}`);
        console.log(`   Featured Products: ${await models_1.FeaturedProductModel.countDocuments()}`);
        console.log(`   Best Selling Products: ${await models_1.BestSellingProductModel.countDocuments()}`);
        console.log(`   Hero Banners: ${await models_1.HeroBannerModel.countDocuments()}`);
        console.log(`   Promo Banners: ${await models_1.PromoBannerModel.countDocuments()}`);
        console.log(`   Festival Banners: ${await models_1.FestivalBannerModel.countDocuments()}`);
        console.log(`   Reviews: ${await models_1.ProductReviewModel.countDocuments()}\n`);
        console.log('✅ Migration completed successfully!');
    }
    catch (error) {
        console.error('❌ Migration failed:', error);
        throw error;
    }
    finally {
        await (0, database_1.disconnectFromDatabase)();
    }
}
// Run migration
migrate()
    .then(() => {
    console.log('\n🎉 Migration script finished');
    process.exit(0);
})
    .catch((error) => {
    console.error('\n💥 Migration script failed:', error);
    process.exit(1);
});
