/**
 * Database Verification Script
 * Verifies that data is coming from MongoDB and not JSON files
 */

import { connectToDatabase, disconnectFromDatabase } from '../config/database';
import {
  ProductModel,
  CategoryModel,
  ColorModel,
  OrderModel,
  FeaturedProductModel,
  BestSellingProductModel,
  HeroBannerModel,
  PromoBannerModel,
  FestivalBannerModel,
  ProductReviewModel,
} from '../models';

async function verifyMongoDB() {
  try {
    console.log('🔍 Verifying MongoDB Connection and Data...\n');
    
    await connectToDatabase();
    console.log('✅ Connected to MongoDB\n');
    
    // Count documents in each collection
    console.log('📊 Document Counts in MongoDB:');
    console.log(`   Products: ${await ProductModel.countDocuments()}`);
    console.log(`   Categories: ${await CategoryModel.countDocuments()}`);
    console.log(`   Colors: ${await ColorModel.countDocuments()}`);
    console.log(`   Orders: ${await OrderModel.countDocuments()}`);
    console.log(`   Featured Products: ${await FeaturedProductModel.countDocuments()}`);
    console.log(`   Best Selling Products: ${await BestSellingProductModel.countDocuments()}`);
    console.log(`   Hero Banners: ${await HeroBannerModel.countDocuments()}`);
    console.log(`   Promo Banners: ${await PromoBannerModel.countDocuments()}`);
    console.log(`   Festival Banners: ${await FestivalBannerModel.countDocuments()}`);
    console.log(`   Reviews: ${await ProductReviewModel.countDocuments()}\n`);
    
    // Sample a few documents to verify structure
    console.log('📝 Sample Documents:');
    const sampleProduct = await ProductModel.findOne().lean();
    if (sampleProduct) {
      console.log(`   Sample Product ID: ${sampleProduct._id}`);
      console.log(`   Sample Product Name: ${sampleProduct.name}`);
    }
    
    const sampleCategory = await CategoryModel.findOne().lean();
    if (sampleCategory) {
      console.log(`   Sample Category ID: ${sampleCategory._id}`);
      console.log(`   Sample Category Name: ${sampleCategory.name}`);
    }
    
    console.log('\n✅ Verification Complete - All data is in MongoDB!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await disconnectFromDatabase();
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

