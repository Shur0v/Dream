/**
 * @fileoverview Database helper functions for MongoDB operations
 * Provides read/write operations using MongoDB
 * 
 * @description This file handles all database operations:
 * - Reading from MongoDB
 * - Writing to MongoDB
 * - Type-safe operations
 * 
 * @author Your Name
 * @version 2.0.0
 */

import {
  Product,
  Order,
  Category,
  Color,
  User,
  FeaturedProduct,
  BestSellingProduct,
  HeroBanner,
  PromoBanner,
  PromoBannerVariant,
  FestivalBanner,
  ProductReview,
  ReviewSource,
} from '@/types';
import { ensureConnection } from '../config/database';
import mongoose from 'mongoose';
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

// In-memory cache for products (with TTL)
let productsCache: { data: Product[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

// In-memory cache for colors
let colorsCache: { data: Color[]; timestamp: number } | null = null;
const COLORS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

/**
 * Helper to convert MongoDB document to type with id
 */
function toType<T extends { id?: string }>(doc: any): T {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return { ...rest, id: _id?.toString() || doc.id } as T;
}

/**
 * Get all products (with caching)
 * @returns Promise<Product[]>
 */
export async function getProducts(): Promise<Product[]> {
  const startTime = Date.now();
  await ensureConnection();
  
  // Check cache validity
  const now = Date.now();
  if (productsCache && (now - productsCache.timestamp) < CACHE_TTL) {
    console.log(`[MongoDB] getProducts: Using cache (${Date.now() - startTime}ms)`);
    return productsCache.data;
  }
  
  // Fetch from MongoDB
  console.log('[MongoDB] getProducts: Fetching from MongoDB...');
  const products = await ProductModel.find({ isActive: true }).lean().limit(1000);
  const typedProducts = products.map(toType<Product>);
  const fetchTime = Date.now() - startTime;
  console.log(`[MongoDB] getProducts: Fetched ${typedProducts.length} products in ${fetchTime}ms`);
  
  // Update cache
  productsCache = {
    data: typedProducts,
    timestamp: now,
  };
  
  return typedProducts;
}

/**
 * Invalidate products cache (call after write operations)
 */
export function invalidateProductsCache(): void {
  productsCache = null;
}

/**
 * Get product by ID
 * @param id - Product ID
 * @returns Promise<Product | undefined>
 */
export async function getProductById(id: string): Promise<Product | undefined> {
  await ensureConnection();
  const product = await ProductModel.findById(id).lean();
  return product ? toType<Product>(product) : undefined;
}

/**
 * Save product (create or update)
 * @param product - Product to save
 * @returns Promise<Product>
 */
export async function saveProduct(product: Product): Promise<Product> {
  try {
    await ensureConnection();
    
    const { id, ...productData } = product;
    const updateData = {
      ...productData,
      updatedAt: new Date().toISOString(),
    };
    
    let saved;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      // Update existing document
      saved = await ProductModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, setDefaultsOnInsert: true }
      ).lean();
    } else {
      // Create new document
      saved = await ProductModel.create(updateData);
      saved = saved.toObject();
    }
    
    invalidateProductsCache();
    return toType<Product>(saved);
  } catch (error) {
    console.error('Error in saveProduct:', error);
    throw error;
  }
}

/**
 * Delete product (hard delete - permanently removes from database)
 * @param id - Product ID (can be MongoDB ObjectId or string)
 * @returns Promise<Product | null>
 */
export async function deleteProduct(id: string): Promise<Product | null> {
  try {
    await ensureConnection();
    
    // Validate ID format
    if (!id) {
      throw new Error('Product ID is required');
    }
    
    let product = null;
    let productIdToDelete = null;
    
    // Try to find by MongoDB ObjectId first
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await ProductModel.findById(id).lean();
      if (product) {
        productIdToDelete = id;
      }
    }
    
    // If not found by ObjectId, try to find by the id field (string)
    if (!product) {
      product = await ProductModel.findOne({ id: id }).lean();
      if (product && product._id) {
        productIdToDelete = product._id.toString();
      }
    }
    
    // If still not found, try to find by _id converted to string
    if (!product) {
      // Get all products and find by matching id string
      const allProducts = await ProductModel.find({}).lean();
      const found = allProducts.find(p => p._id?.toString() === id);
      if (found) {
        product = found;
        productIdToDelete = found._id.toString();
      }
    }
    
    if (!product || !productIdToDelete) {
      console.warn(`Product not found with ID: ${id}`);
      return null;
    }
    
    // Convert to Product type before deletion
    const productToReturn = toType<Product>(product);
    const productIdForCleanup = productToReturn.id || productIdToDelete;
    
    // Hard delete - actually remove from database using ObjectId
    await ProductModel.findByIdAndDelete(productIdToDelete);
    
    // Also remove from featured products if exists (don't throw error if not found)
    try {
      await FeaturedProductModel.findOneAndDelete({ productId: productIdForCleanup });
    } catch (err) {
      console.warn('Error removing from featured products (non-critical):', err);
    }
    
    // Also remove from best selling products if exists (don't throw error if not found)
    try {
      await BestSellingProductModel.findOneAndDelete({ productId: productIdForCleanup });
    } catch (err) {
      console.warn('Error removing from best selling products (non-critical):', err);
    }
    
    // Invalidate cache
    invalidateProductsCache();
    
    return productToReturn;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

/**
 * Remove a single image from a product
 * @param id - Product ID
 * @param imageIndex - Index of the image to remove
 * @returns Promise<Product | null>
 */
export async function removeProductImage(id: string, imageIndex: number): Promise<Product | null> {
  await ensureConnection();
  const product = await ProductModel.findById(id).lean();
  
  if (!product) {
    return null;
  }

  if (!Array.isArray(product.images) || imageIndex < 0 || imageIndex >= product.images.length) {
    return toType<Product>(product);
  }

  const updatedImages = product.images.filter((_: any, idx: number) => idx !== imageIndex);
  const updated = await ProductModel.findByIdAndUpdate(
    id,
    { images: updatedImages, updatedAt: new Date().toISOString() },
    { new: true }
  ).lean();
  
  invalidateProductsCache();
  return updated ? toType<Product>(updated) : null;
}

/**
 * Get all orders
 * @returns Promise<Order[]>
 */
export async function getOrders(): Promise<Order[]> {
  await ensureConnection();
  const orders = await OrderModel.find({}).lean();
  return orders.map(toType<Order>);
}

/**
 * Get order by ID
 * @param id - Order ID
 * @returns Promise<Order | undefined>
 */
export async function getOrderById(id: string): Promise<Order | undefined> {
  await ensureConnection();
  const order = await OrderModel.findById(id).lean();
  return order ? toType<Order>(order) : undefined;
}

/**
 * Save order (create or update)
 * @param order - Order to save
 * @returns Promise<Order>
 */
export async function saveOrder(order: Order): Promise<Order> {
  await ensureConnection();
  
  const { id, ...orderData } = order;
  const updateData = {
    ...orderData,
    updatedAt: new Date().toISOString(),
  };
  
  let saved;
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    saved = await OrderModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, setDefaultsOnInsert: true }
    ).lean();
  } else {
    saved = await OrderModel.create(updateData);
    saved = saved.toObject();
  }
  
  return toType<Order>(saved);
}

/**
 * Get all categories
 * @returns Promise<Category[]>
 */
export async function getCategories(): Promise<Category[]> {
  const startTime = Date.now();
  await ensureConnection();
  console.log('[MongoDB] getCategories: Fetching from MongoDB...');
  const categories = await CategoryModel.find({ isActive: true }).lean();
  const typedCategories = categories.map(toType<Category>);
  console.log(`[MongoDB] getCategories: Fetched ${typedCategories.length} categories in ${Date.now() - startTime}ms`);
  return typedCategories;
}

/**
 * Get category by ID
 * @param id - Category ID
 * @returns Promise<Category | undefined>
 */
export async function getCategoryById(id: string): Promise<Category | undefined> {
  await ensureConnection();
  const category = await CategoryModel.findById(id).lean();
  return category ? toType<Category>(category) : undefined;
}

/**
 * Get category by slug
 * @param slug - Category slug
 * @returns Promise<Category | undefined>
 */
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  await ensureConnection();
  const category = await CategoryModel.findOne({ slug, isActive: true }).lean();
  return category ? toType<Category>(category) : undefined;
}

/**
 * Save category (create or update)
 * @param category - Category to save
 * @returns Promise<Category>
 */
export async function saveCategory(category: Category): Promise<Category> {
  const db = await readDatabase();
  const index = db.categories.findIndex(c => c.id === category.id);
  
  if (index >= 0) {
    db.categories[index] = category;
  } else {
    db.categories.push(category);
  }
  
  await writeDatabase(db);
  return category;
}

/**
 * Delete category (soft delete)
 * @param id - Category ID
 * @returns Promise<Category | null>
 */
export async function deleteCategory(id: string): Promise<Category | null> {
  const db = await readDatabase();
  const category = db.categories.find(c => c.id === id);
  
  if (category) {
    category.isActive = false;
    category.updatedAt = new Date().toISOString();
    await writeDatabase(db);
    return category;
  }
  
  return null;
}

/**
 * Get all colors (with caching)
 * @returns Promise<Color[]>
 */
export async function getColors(): Promise<Color[]> {
  const startTime = Date.now();
  // Check cache validity
  const now = Date.now();
  if (colorsCache && (now - colorsCache.timestamp) < COLORS_CACHE_TTL) {
    console.log(`[MongoDB] getColors: Using cache (${Date.now() - startTime}ms)`);
    return colorsCache.data;
  }
  
  // Fetch from MongoDB
  await ensureConnection();
  console.log('[MongoDB] getColors: Fetching from MongoDB...');
  const colors = await ColorModel.find({ isActive: true }).lean();
  const typedColors = colors.map(toType<Color>);
  console.log(`[MongoDB] getColors: Fetched ${typedColors.length} colors in ${Date.now() - startTime}ms`);
  
  // Update cache
  colorsCache = {
    data: typedColors,
    timestamp: now,
  };
  
  return typedColors;
}

/**
 * Invalidate colors cache (call after write operations)
 */
export function invalidateColorsCache(): void {
  colorsCache = null;
}

/**
 * Get color by ID
 * @param id - Color ID
 * @returns Promise<Color | undefined>
 */
export async function getColorById(id: string): Promise<Color | undefined> {
  await ensureConnection();
  const color = await ColorModel.findById(id).lean();
  return color ? toType<Color>(color) : undefined;
}

/**
 * Save color (create or update)
 * @param color - Color to save
 * @returns Promise<Color>
 */
export async function saveColor(color: Color): Promise<Color> {
  await ensureConnection();
  
  const { id, ...colorData } = color;
  const updateData = {
    ...colorData,
    updatedAt: new Date().toISOString(),
  };
  
  let saved;
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    saved = await ColorModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, setDefaultsOnInsert: true }
    ).lean();
  } else {
    saved = await ColorModel.create(updateData);
    saved = saved.toObject();
  }
  
  invalidateColorsCache();
  return toType<Color>(saved);
}

/**
 * Delete color (soft delete)
 * @param id - Color ID
 * @returns Promise<Color | null>
 */
export async function deleteColor(id: string): Promise<Color | null> {
  await ensureConnection();
  const color = await ColorModel.findByIdAndUpdate(
    id,
    { isActive: false, updatedAt: new Date().toISOString() },
    { new: true }
  ).lean();
  
  if (color) {
    invalidateColorsCache();
    return toType<Color>(color);
  }
  
  return null;
}

/**
 * Get all users
 * @returns Promise<User[]>
 */
export async function getUsers(): Promise<User[]> {
  const db = await readDatabase();
  return db.users;
}

/**
 * Get user by ID
 * @param id - User ID
 * @returns Promise<User | undefined>
 */
export async function getUserById(id: string): Promise<User | undefined> {
  const db = await readDatabase();
  return db.users.find(u => u.id === id);
}

/**
 * Get all featured products (only active ones)
 * @returns Promise<FeaturedProduct[]>
 */
export async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  const startTime = Date.now();
  await ensureConnection();
  console.log('[MongoDB] getFeaturedProducts: Fetching from MongoDB...');
  const featuredProducts = await FeaturedProductModel.find({ isActive: true }).lean();
  const typed = featuredProducts.map(toType<FeaturedProduct>);
  console.log(`[MongoDB] getFeaturedProducts: Fetched ${typed.length} products in ${Date.now() - startTime}ms`);
  return typed;
}

/**
 * Get featured product by ID
 * @param id - Featured Product ID
 * @returns Promise<FeaturedProduct | undefined>
 */
export async function getFeaturedProductById(id: string): Promise<FeaturedProduct | undefined> {
  await ensureConnection();
  const featuredProduct = await FeaturedProductModel.findById(id).lean();
  return featuredProduct ? toType<FeaturedProduct>(featuredProduct) : undefined;
}

/**
 * Get featured product by product ID
 * @param productId - Original Product ID
 * @returns Promise<FeaturedProduct | undefined>
 */
export async function getFeaturedProductByProductId(productId: string): Promise<FeaturedProduct | undefined> {
  await ensureConnection();
  const featuredProduct = await FeaturedProductModel.findOne({ productId, isActive: true }).lean();
  return featuredProduct ? toType<FeaturedProduct>(featuredProduct) : undefined;
}

/**
 * Add product as featured (creates a copy from the original product)
 * @param productId - Product ID to feature
 * @returns Promise<FeaturedProduct>
 */
export async function addFeaturedProduct(productId: string): Promise<FeaturedProduct> {
  const db = await readDatabase();
  
  // Check if already featured
  const existing = db.featuredProducts.find(fp => fp.productId === productId && fp.isActive);
  if (existing) {
    return existing;
  }
  
  // Get the original product
  const product = db.products.find(p => p.id === productId);
  if (!product) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  // Create a copy of the product as featured product
  const featuredProduct: FeaturedProduct = {
    ...product,
    id: `featured-${productId}-${Date.now()}`, // Unique ID for featured product
    productId: product.id, // Reference to original
    featuredAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  db.featuredProducts.push(featuredProduct);
  await writeDatabase(db);
  
  return featuredProduct;
}

/**
 * Remove product from featured (soft delete)
 * @param productId - Product ID to remove from featured
 * @returns Promise<FeaturedProduct | null>
 */
export async function removeFeaturedProduct(productId: string): Promise<FeaturedProduct | null> {
  const db = await readDatabase();
  const featuredProduct = db.featuredProducts.find(fp => fp.productId === productId && fp.isActive);
  
  if (featuredProduct) {
    featuredProduct.isActive = false;
    featuredProduct.updatedAt = new Date().toISOString();
    await writeDatabase(db);
    return featuredProduct;
  }
  
  return null;
}

/**
 * Remove featured product by featured product ID
 * @param id - Featured Product ID
 * @returns Promise<FeaturedProduct | null>
 */
export async function removeFeaturedProductById(id: string): Promise<FeaturedProduct | null> {
  const db = await readDatabase();
  const featuredProduct = db.featuredProducts.find(fp => fp.id === id);
  
  if (featuredProduct) {
    featuredProduct.isActive = false;
    featuredProduct.updatedAt = new Date().toISOString();
    await writeDatabase(db);
    return featuredProduct;
  }
  
  return null;
}

/**
 * Update featured product data (syncs with original product)
 * @param productId - Original Product ID
 * @returns Promise<FeaturedProduct | null>
 */
export async function updateFeaturedProduct(productId: string): Promise<FeaturedProduct | null> {
  const db = await readDatabase();
  const featuredProductIndex = db.featuredProducts.findIndex(fp => fp.productId === productId && fp.isActive);
  
  if (featuredProductIndex === -1) {
    return null;
  }
  
  const product = db.products.find(p => p.id === productId);
  if (!product) {
    return null;
  }
  
  // Update featured product with latest product data
  const featuredProduct = db.featuredProducts[featuredProductIndex];
  db.featuredProducts[featuredProductIndex] = {
    ...product,
    id: featuredProduct.id, // Keep the featured product ID
    productId: product.id,
    featuredAt: featuredProduct.featuredAt, // Keep original featured date
    updatedAt: new Date().toISOString(),
  };
  
  await writeDatabase(db);
  return db.featuredProducts[featuredProductIndex];
}

/**
 * Get all best selling products (only active ones)
 * @returns Promise<BestSellingProduct[]>
 */
export async function getBestSellingProducts(): Promise<BestSellingProduct[]> {
  const startTime = Date.now();
  await ensureConnection();
  console.log('[MongoDB] getBestSellingProducts: Fetching from MongoDB...');
  const bestSellingProducts = await BestSellingProductModel.find({ isActive: true }).lean();
  const typed = bestSellingProducts.map(toType<BestSellingProduct>);
  console.log(`[MongoDB] getBestSellingProducts: Fetched ${typed.length} products in ${Date.now() - startTime}ms`);
  return typed;
}

/**
 * Get best selling product by ID
 * @param id - Best Selling Product ID
 * @returns Promise<BestSellingProduct | undefined>
 */
export async function getBestSellingProductById(id: string): Promise<BestSellingProduct | undefined> {
  await ensureConnection();
  const bestSellingProduct = await BestSellingProductModel.findById(id).lean();
  return bestSellingProduct ? toType<BestSellingProduct>(bestSellingProduct) : undefined;
}

/**
 * Get best selling product by product ID
 * @param productId - Original Product ID
 * @returns Promise<BestSellingProduct | undefined>
 */
export async function getBestSellingProductByProductId(productId: string): Promise<BestSellingProduct | undefined> {
  await ensureConnection();
  const bestSellingProduct = await BestSellingProductModel.findOne({ productId, isActive: true }).lean();
  return bestSellingProduct ? toType<BestSellingProduct>(bestSellingProduct) : undefined;
}

/**
 * Add product as best selling (creates a copy from the original product)
 * @param productId - Product ID to mark as best selling
 * @returns Promise<BestSellingProduct>
 */
export async function addBestSellingProduct(productId: string): Promise<BestSellingProduct> {
  const db = await readDatabase();
  
  // Check if already best selling
  const existing = db.bestSellingProducts.find(bs => bs.productId === productId && bs.isActive);
  if (existing) {
    return existing;
  }
  
  // Get the original product
  const product = db.products.find(p => p.id === productId);
  if (!product) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  // Create a copy of the product as best selling product
  const bestSellingProduct: BestSellingProduct = {
    ...product,
    id: `bestselling-${productId}-${Date.now()}`, // Unique ID for best selling product
    productId: product.id, // Reference to original
    bestSellingAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  db.bestSellingProducts.push(bestSellingProduct);
  await writeDatabase(db);
  
  return bestSellingProduct;
}

/**
 * Remove product from best selling (soft delete)
 * @param productId - Product ID to remove from best selling
 * @returns Promise<BestSellingProduct | null>
 */
export async function removeBestSellingProduct(productId: string): Promise<BestSellingProduct | null> {
  const db = await readDatabase();
  const bestSellingProduct = db.bestSellingProducts.find(bs => bs.productId === productId && bs.isActive);
  
  if (bestSellingProduct) {
    bestSellingProduct.isActive = false;
    bestSellingProduct.updatedAt = new Date().toISOString();
    await writeDatabase(db);
    return bestSellingProduct;
  }
  
  return null;
}

/**
 * Remove best selling product by best selling product ID
 * @param id - Best Selling Product ID
 * @returns Promise<BestSellingProduct | null>
 */
export async function removeBestSellingProductById(id: string): Promise<BestSellingProduct | null> {
  const db = await readDatabase();
  const bestSellingProduct = db.bestSellingProducts.find(bs => bs.id === id);
  
  if (bestSellingProduct) {
    bestSellingProduct.isActive = false;
    bestSellingProduct.updatedAt = new Date().toISOString();
    await writeDatabase(db);
    return bestSellingProduct;
  }
  
  return null;
}

/**
 * Update best selling product data (syncs with original product)
 * @param productId - Original Product ID
 * @returns Promise<BestSellingProduct | null>
 */
export async function updateBestSellingProduct(productId: string): Promise<BestSellingProduct | null> {
  const db = await readDatabase();
  const bestSellingProductIndex = db.bestSellingProducts.findIndex(bs => bs.productId === productId && bs.isActive);
  
  if (bestSellingProductIndex === -1) {
    return null;
  }
  
  const product = db.products.find(p => p.id === productId);
  if (!product) {
    return null;
  }
  
  // Update best selling product with latest product data
  const bestSellingProduct = db.bestSellingProducts[bestSellingProductIndex];
  db.bestSellingProducts[bestSellingProductIndex] = {
    ...product,
    id: bestSellingProduct.id, // Keep the best selling product ID
    productId: product.id,
    bestSellingAt: bestSellingProduct.bestSellingAt, // Keep original best selling date
    updatedAt: new Date().toISOString(),
  };
  
  await writeDatabase(db);
  return db.bestSellingProducts[bestSellingProductIndex];
}

/**
 * Get active hero banner
 * @returns Promise<HeroBanner | null>
 */
export async function getHeroBanner(): Promise<HeroBanner | null> {
  const startTime = Date.now();
  await ensureConnection();
  console.log('[MongoDB] getHeroBanner: Fetching from MongoDB...');
  const heroBanner = await HeroBannerModel.findOne({ isActive: true }).lean();
  const result = heroBanner ? toType<HeroBanner>(heroBanner) : null;
  console.log(`[MongoDB] getHeroBanner: Fetched in ${Date.now() - startTime}ms`);
  return result;
}

/**
 * Get hero banner by ID
 * @param id - Hero Banner ID
 * @returns Promise<HeroBanner | undefined>
 */
export async function getHeroBannerById(id: string): Promise<HeroBanner | undefined> {
  await ensureConnection();
  const heroBanner = await HeroBannerModel.findById(id).lean();
  return heroBanner ? toType<HeroBanner>(heroBanner) : undefined;
}

/**
 * Save hero banner (create or update)
 * @param heroBanner - Hero Banner to save
 * @returns Promise<HeroBanner>
 */
export async function saveHeroBanner(heroBanner: HeroBanner): Promise<HeroBanner> {
  const db = await readDatabase();
  const index = db.heroBanners.findIndex(hb => hb.id === heroBanner.id);
  
  if (index >= 0) {
    // Update existing
    db.heroBanners[index] = {
      ...heroBanner,
      updatedAt: new Date().toISOString(),
    };
  } else {
    // Create new
    const newBanner: HeroBanner = {
      ...heroBanner,
      id: heroBanner.id || `hero-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.heroBanners.push(newBanner);
  }
  
  // If this banner is set to active, deactivate all others
  if (heroBanner.isActive) {
    db.heroBanners.forEach((hb, idx) => {
      if (hb.id !== heroBanner.id && hb.isActive) {
        db.heroBanners[idx].isActive = false;
      }
    });
  }
  
  await writeDatabase(db);
  return db.heroBanners.find(hb => hb.id === heroBanner.id) || heroBanner;
}

/**
 * Delete hero banner (soft delete)
 * @param id - Hero Banner ID
 * @returns Promise<HeroBanner | null>
 */
export async function deleteHeroBanner(id: string): Promise<HeroBanner | null> {
  const db = await readDatabase();
  const heroBanner = db.heroBanners.find(hb => hb.id === id);
  
  if (heroBanner) {
    heroBanner.isActive = false;
    heroBanner.updatedAt = new Date().toISOString();
    await writeDatabase(db);
    return heroBanner;
  }
  
  return null;
}

/**
 * Get all hero banners (including inactive)
 * @returns Promise<HeroBanner[]>
 */
export async function getAllHeroBanners(): Promise<HeroBanner[]> {
  await ensureConnection();
  const banners = await HeroBannerModel.find({}).lean();
  return banners.map(toType<HeroBanner>);
}

const defaultPromoCountdown = (): PromoBanner['initialTime'] => ({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

type PromoBannerQueryOptions = {
  includeInactive?: boolean;
  variant?: PromoBannerVariant;
  limit?: number;
};

const sortPromoBanners = (a: PromoBanner, b: PromoBanner) => {
  if ((a.order ?? 0) !== (b.order ?? 0)) {
    return (a.order ?? 0) - (b.order ?? 0);
  }
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};

export async function getPromoBanners(options: PromoBannerQueryOptions = {}): Promise<PromoBanner[]> {
  const startTime = Date.now();
  const { includeInactive = false, variant, limit } = options;
  await ensureConnection();
  console.log('[MongoDB] getPromoBanners: Fetching from MongoDB...');

  let query: any = {};
  if (!includeInactive) {
    query.isActive = true;
  }
  if (variant) {
    query.variant = variant;
  }

  let banners = await PromoBannerModel.find(query).lean();
  banners = banners.map(toType<PromoBanner>);

  const sorted = [...banners].sort(sortPromoBanners);

  const result = limit && limit > 0 ? sorted.slice(0, limit) : sorted;
  console.log(`[MongoDB] getPromoBanners: Fetched ${result.length} banners in ${Date.now() - startTime}ms`);
  return result;
}

export async function getPromoBannerById(id: string): Promise<PromoBanner | undefined> {
  await ensureConnection();
  const promoBanner = await PromoBannerModel.findById(id).lean();
  return promoBanner ? toType<PromoBanner>(promoBanner) : undefined;
}

export async function savePromoBanner(promoBanner: PromoBanner): Promise<PromoBanner> {
  const db = await readDatabase();
  const normalized: PromoBanner = {
    ...promoBanner,
    id: promoBanner.id || `promo-${Date.now()}`,
    initialTime: promoBanner.initialTime ?? defaultPromoCountdown(),
    variant: promoBanner.variant ?? 'slider',
    order: typeof promoBanner.order === 'number' ? promoBanner.order : db.promoBanners.length,
    createdAt: promoBanner.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: promoBanner.isActive !== undefined ? promoBanner.isActive : true,
  };

  const index = db.promoBanners.findIndex(banner => banner.id === normalized.id);

  if (index >= 0) {
    db.promoBanners[index] = {
      ...db.promoBanners[index],
      ...normalized,
      updatedAt: new Date().toISOString(),
    };
  } else {
    db.promoBanners.push(normalized);
  }

  await writeDatabase(db);
  return db.promoBanners.find(banner => banner.id === normalized.id) || normalized;
}

export async function deletePromoBanner(id: string): Promise<PromoBanner | null> {
  const db = await readDatabase();
  const banner = db.promoBanners.find(pb => pb.id === id);

  if (!banner) {
    return null;
  }

  banner.isActive = false;
  banner.updatedAt = new Date().toISOString();
  await writeDatabase(db);

  return banner;
}

type FestivalBannerQueryOptions = {
  includeInactive?: boolean;
  limit?: number;
};

const sortFestivalBanners = (a: FestivalBanner, b: FestivalBanner) => {
  if ((a.order ?? 0) !== (b.order ?? 0)) {
    return (a.order ?? 0) - (b.order ?? 0);
  }
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
};

const normalizeCoupons = (coupons?: FestivalBanner['coupons']): FestivalBanner['coupons'] => {
  if (!Array.isArray(coupons)) return [];
  return coupons
    .map(coupon => ({
      code: String(coupon?.code ?? '').trim(),
      amount: String(coupon?.amount ?? '').trim(),
    }))
    .filter(coupon => coupon.code && coupon.amount);
};

export async function getFestivalBanners(options: FestivalBannerQueryOptions = {}): Promise<FestivalBanner[]> {
  const startTime = Date.now();
  const { includeInactive = false, limit } = options;
  await ensureConnection();
  console.log('[MongoDB] getFestivalBanners: Fetching from MongoDB...');

  let query: any = {};
  if (!includeInactive) {
    query.isActive = true;
  }

  let banners = await FestivalBannerModel.find(query).lean();
  banners = banners.map(toType<FestivalBanner>);

  const sorted = [...banners].sort(sortFestivalBanners);
  const result = limit && limit > 0 ? sorted.slice(0, limit) : sorted;
  console.log(`[MongoDB] getFestivalBanners: Fetched ${result.length} banners in ${Date.now() - startTime}ms`);
  return result;
}

export async function getFestivalBannerById(id: string): Promise<FestivalBanner | undefined> {
  await ensureConnection();
  const banner = await FestivalBannerModel.findById(id).lean();
  return banner ? toType<FestivalBanner>(banner) : undefined;
}

export async function saveFestivalBanner(banner: FestivalBanner): Promise<FestivalBanner> {
  const db = await readDatabase();
  const normalized: FestivalBanner = {
    ...banner,
    id: banner.id || `festival-${Date.now()}`,
    coupons: normalizeCoupons(banner.coupons),
    order: typeof banner.order === 'number' ? banner.order : db.festivalBanners.length,
    createdAt: banner.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: banner.isActive !== undefined ? banner.isActive : true,
  };

  const index = db.festivalBanners.findIndex(item => item.id === normalized.id);

  if (index >= 0) {
    db.festivalBanners[index] = {
      ...db.festivalBanners[index],
      ...normalized,
      coupons: normalizeCoupons(normalized.coupons),
      updatedAt: new Date().toISOString(),
    };
  } else {
    db.festivalBanners.push(normalized);
  }

  await writeDatabase(db);
  return db.festivalBanners.find(item => item.id === normalized.id) || normalized;
}

export async function deleteFestivalBanner(id: string): Promise<FestivalBanner | null> {
  const db = await readDatabase();
  const banner = db.festivalBanners.find(item => item.id === id);

  if (!banner) {
    return null;
  }

  banner.isActive = false;
  banner.updatedAt = new Date().toISOString();
  await writeDatabase(db);

  return banner;
}

const clampRating = (value: number) => {
  if (Number.isNaN(value)) return 5;
  if (value < 1) return 1;
  if (value > 5) return 5;
  return Number(value);
};

const normalizeReview = (
  review: ProductReview,
  fallbackProductName?: string
): ProductReview => {
  const now = new Date().toISOString();
  const trimmedComment = (review.comment || '').trim();
  const trimmedAuthor = (review.author || 'Anonymous').trim() || 'Anonymous';
  return {
    id: review.id || `rev-${Date.now()}`,
    productId: String(review.productId),
    productName: review.productName || fallbackProductName,
    author: trimmedAuthor,
    rating: clampRating(review.rating ?? 5),
    comment: trimmedComment,
    date: review.date || now,
    verified: Boolean(review.verified),
    source: review.source || ('admin' as ReviewSource),
    createdAt: review.createdAt || now,
    updatedAt: now,
  };
};

export async function getReviews(productId?: string): Promise<ProductReview[]> {
  const startTime = Date.now();
  await ensureConnection();
  console.log('[MongoDB] getReviews: Fetching from MongoDB...');
  
  let query: any = {};
  if (productId) {
    query.productId = productId;
  }
  
  const reviews = await ProductReviewModel.find(query).lean();
  const typed = reviews.map(toType<ProductReview>);
  console.log(`[MongoDB] getReviews: Fetched ${typed.length} reviews in ${Date.now() - startTime}ms`);
  return typed;
}

export async function getReviewById(id: string): Promise<ProductReview | undefined> {
  await ensureConnection();
  const review = await ProductReviewModel.findById(id).lean();
  return review ? toType<ProductReview>(review) : undefined;
}

export async function getReviewsByProduct(productId: string): Promise<ProductReview[]> {
  return getReviews(productId);
}

export async function saveReview(review: ProductReview): Promise<ProductReview> {
  const db = await readDatabase();
  const product = db.products.find(p => p.id === String(review.productId));
  const normalized = normalizeReview(review, product?.name);

  const index = db.reviews.findIndex(r => r.id === normalized.id);
  if (index >= 0) {
    db.reviews[index] = normalized;
  } else {
    db.reviews.push(normalized);
  }

  await writeDatabase(db);
  return normalized;
}

export async function deleteReview(id: string): Promise<ProductReview | null> {
  const db = await readDatabase();
  const index = db.reviews.findIndex(review => review.id === id);
  if (index === -1) {
    return null;
  }

  const [removed] = db.reviews.splice(index, 1);
  await writeDatabase(db);
  return removed;
}
