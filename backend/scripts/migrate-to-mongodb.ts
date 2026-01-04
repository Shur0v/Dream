/**
 * Migration Script: JSON to MongoDB
 * Transfers all data from JSON files to MongoDB
 */

import { connectToDatabase, disconnectFromDatabase } from '../config/database';
import {
  ProductModel,
  CategoryModel,
  ColorModel,
  UserModel,
  OrderModel,
  FeaturedProductModel,
  BestSellingProductModel,
  HeroBannerModel,
  PromoBannerModel,
  FestivalBannerModel,
  ProductReviewModel,
} from '../models';
import { readJsonStore } from '../lib/jsonStore';
import { DatabaseSchema } from '../schemas/database';
import path from 'path';

async function migrate() {
  try {
    console.log('🚀 Starting MongoDB Migration...\n');

    // Connect to MongoDB
    await connectToDatabase();
    console.log('✅ Connected to MongoDB\n');

    // Read JSON database
    console.log('📖 Reading JSON database...');
    const rawData = await readJsonStore<any>('database', { fileName: 'database' });
    const db = DatabaseSchema.parse(rawData ?? {});
    console.log('✅ JSON database loaded\n');

    // Clear existing collections (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing collections...');
    await ProductModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await ColorModel.deleteMany({});
    await UserModel.deleteMany({});
    await OrderModel.deleteMany({});
    await FeaturedProductModel.deleteMany({});
    await BestSellingProductModel.deleteMany({});
    await HeroBannerModel.deleteMany({});
    await PromoBannerModel.deleteMany({});
    await FestivalBannerModel.deleteMany({});
    await ProductReviewModel.deleteMany({});
    console.log('✅ Collections cleared\n');

    // Migrate Products
    if (db.products && db.products.length > 0) {
      console.log(`📦 Migrating ${db.products.length} products...`);
      const productsToInsert = db.products.map((product: any) => {
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
          const existing = await ProductModel.findOne({ sku: product.sku });
          if (existing) {
            // Make SKU unique by appending timestamp
            product.sku = `${product.sku}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
          }
          await ProductModel.create(product);
          insertedCount++;
        } catch (error: any) {
          if (error.code === 11000) {
            // Duplicate key error - make SKU unique and retry
            product.sku = `${product.sku}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
            try {
              await ProductModel.create(product);
              insertedCount++;
            } catch (retryError) {
              console.warn(`⚠️  Skipped product with SKU: ${product.sku}`, retryError);
              skippedCount++;
            }
          } else {
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
      const categoriesToInsert = db.categories.map((category: any) => {
        const { id, ...categoryData } = category;
        return {
          ...categoryData,
        };
      });
      await CategoryModel.insertMany(categoriesToInsert);
      console.log(`✅ Migrated ${db.categories.length} categories\n`);
    }

    // Migrate Colors
    if (db.colors && db.colors.length > 0) {
      console.log(`🎨 Migrating ${db.colors.length} colors...`);
      const colorsToInsert = db.colors.map((color: any) => {
        const { id, ...colorData } = color;
        return {
          ...colorData,
        };
      });
      await ColorModel.insertMany(colorsToInsert);
      console.log(`✅ Migrated ${db.colors.length} colors\n`);
    }

    // Migrate Users
    if (db.users && db.users.length > 0) {
      console.log(`👥 Migrating ${db.users.length} users...`);
      const usersToInsert = db.users.map((user: any) => {
        const { id, ...userData } = user;
        return {
          ...userData,
        };
      });
      await UserModel.insertMany(usersToInsert);
      console.log(`✅ Migrated ${db.users.length} users\n`);
    }

    // Migrate Orders
    if (db.orders && db.orders.length > 0) {
      console.log(`📋 Migrating ${db.orders.length} orders...`);
      const ordersToInsert = db.orders.map((order: any) => {
        const { id, ...orderData } = order;
        return {
          ...orderData,
        };
      });
      await OrderModel.insertMany(ordersToInsert);
      console.log(`✅ Migrated ${db.orders.length} orders\n`);
    }

    // Migrate Featured Products
    if (db.featuredProducts && db.featuredProducts.length > 0) {
      console.log(`⭐ Migrating ${db.featuredProducts.length} featured products...`);
      const featuredToInsert = db.featuredProducts.map((fp: any) => {
        const { id, ...fpData } = fp;
        return {
          ...fpData,
          featuredAt: fp.featuredAt || new Date().toISOString(),
        };
      });
      await FeaturedProductModel.insertMany(featuredToInsert);
      console.log(`✅ Migrated ${db.featuredProducts.length} featured products\n`);
    }

    // Migrate Best Selling Products
    if (db.bestSellingProducts && db.bestSellingProducts.length > 0) {
      console.log(`🔥 Migrating ${db.bestSellingProducts.length} best selling products...`);
      const bestSellingToInsert = db.bestSellingProducts.map((bs: any) => {
        const { id, ...bsData } = bs;
        return {
          ...bsData,
          bestSellingAt: bs.bestSellingAt || new Date().toISOString(),
        };
      });
      await BestSellingProductModel.insertMany(bestSellingToInsert);
      console.log(`✅ Migrated ${db.bestSellingProducts.length} best selling products\n`);
    }

    // Migrate Hero Banners
    if (db.heroBanners && db.heroBanners.length > 0) {
      console.log(`🖼️  Migrating ${db.heroBanners.length} hero banners...`);
      const heroBannersToInsert = db.heroBanners.map((hb: any) => {
        const { id, ...hbData } = hb;
        return {
          ...hbData,
        };
      });
      await HeroBannerModel.insertMany(heroBannersToInsert);
      console.log(`✅ Migrated ${db.heroBanners.length} hero banners\n`);
    }

    // Migrate Promo Banners
    if (db.promoBanners && db.promoBanners.length > 0) {
      console.log(`🎯 Migrating ${db.promoBanners.length} promo banners...`);
      const promoBannersToInsert = db.promoBanners.map((pb: any) => {
        const { id, ...pbData } = pb;
        return {
          ...pbData,
        };
      });
      await PromoBannerModel.insertMany(promoBannersToInsert);
      console.log(`✅ Migrated ${db.promoBanners.length} promo banners\n`);
    }

    // Migrate Festival Banners
    if (db.festivalBanners && db.festivalBanners.length > 0) {
      console.log(`🎉 Migrating ${db.festivalBanners.length} festival banners...`);
      const festivalBannersToInsert = db.festivalBanners.map((fb: any) => {
        const { id, ...fbData } = fb;
        return {
          ...fbData,
        };
      });
      await FestivalBannerModel.insertMany(festivalBannersToInsert);
      console.log(`✅ Migrated ${db.festivalBanners.length} festival banners\n`);
    }

    // Migrate Reviews
    if (db.reviews && db.reviews.length > 0) {
      console.log(`💬 Migrating ${db.reviews.length} reviews...`);
      const reviewsToInsert = db.reviews.map((review: any) => {
        const { id, ...reviewData } = review;
        return {
          ...reviewData,
          date: review.date || new Date().toISOString(),
        };
      });
      await ProductReviewModel.insertMany(reviewsToInsert);
      console.log(`✅ Migrated ${db.reviews.length} reviews\n`);
    }

    // Verify migration
    console.log('📊 Migration Summary:');
    console.log(`   Products: ${await ProductModel.countDocuments()}`);
    console.log(`   Categories: ${await CategoryModel.countDocuments()}`);
    console.log(`   Colors: ${await ColorModel.countDocuments()}`);
    console.log(`   Users: ${await UserModel.countDocuments()}`);
    console.log(`   Orders: ${await OrderModel.countDocuments()}`);
    console.log(`   Featured Products: ${await FeaturedProductModel.countDocuments()}`);
    console.log(`   Best Selling Products: ${await BestSellingProductModel.countDocuments()}`);
    console.log(`   Hero Banners: ${await HeroBannerModel.countDocuments()}`);
    console.log(`   Promo Banners: ${await PromoBannerModel.countDocuments()}`);
    console.log(`   Festival Banners: ${await FestivalBannerModel.countDocuments()}`);
    console.log(`   Reviews: ${await ProductReviewModel.countDocuments()}\n`);

    console.log('✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await disconnectFromDatabase();
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

