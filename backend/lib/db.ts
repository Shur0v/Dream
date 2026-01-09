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
  // Prioritize stored id field, fallback to _id.toString()
  // This matches the ProductSchema toJSON transform behavior
  const id = (rest as any).id || _id?.toString();
  return { ...rest, id } as T;
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
  
  // Log sample product IDs for debugging
  if (typedProducts.length > 0) {
    console.log('[MongoDB] getProducts: Sample product IDs:', typedProducts.slice(0, 3).map(p => ({
      id: p.id,
      name: p.name,
      idType: typeof p.id,
      idLength: p.id?.length
    })));
  }
  
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
  
  // Try MongoDB ObjectId first
  let product = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    product = await ProductModel.findById(id).lean();
  }
  
  // If not found, try custom id field
  if (!product) {
    product = await ProductModel.findOne({ id: id }).lean();
  }
  
  // If still not found, try _id as string
  if (!product) {
    const allProducts = await ProductModel.find({}).lean();
    product = allProducts.find(p => p._id?.toString() === id) || null;
  }
  
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
      id: id, // Include the id field so it's stored in MongoDB
      updatedAt: new Date().toISOString(),
    };
    
    let saved;
    if (id && mongoose.Types.ObjectId.isValid(id)) {
      // Update existing document by MongoDB ObjectId
      saved = await ProductModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true, setDefaultsOnInsert: true }
      ).lean();
    } else if (id) {
      // Try to find by custom id field first
      const existing = await ProductModel.findOne({ id: id }).lean();
      if (existing) {
        // Update existing document
        saved = await ProductModel.findByIdAndUpdate(
          existing._id,
          updateData,
          { new: true, setDefaultsOnInsert: true }
        ).lean();
      } else {
        // Create new document
        saved = await ProductModel.create(updateData);
        saved = saved.toObject();
      }
    } else {
      // Create new document without id (MongoDB will generate _id)
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
    
    console.log(`[deleteProduct] Attempting to delete product with ID: ${id}`);
    
    // Priority 1: Try MongoDB ObjectId first (most common case since id field is often undefined)
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await ProductModel.findById(id).lean();
      if (product) {
        productIdToDelete = id;
        console.log(`[deleteProduct] Found product by MongoDB ObjectId: ${id}`);
      }
    }
    
    // Priority 2: Try to find by the custom id field (string)
    if (!product) {
      product = await ProductModel.findOne({ id: id }).lean();
      if (product && product._id) {
        productIdToDelete = product._id.toString();
        console.log(`[deleteProduct] Found product by custom id field: ${id}, MongoDB _id: ${productIdToDelete}`);
      }
    }
    
    // Priority 3: If still not found and id starts with "product-", try to extract timestamp
    // and find by matching the stored id field more flexibly
    if (!product && id.startsWith('product-')) {
      // Try exact match first
      product = await ProductModel.findOne({ id: id }).lean();
      if (product && product._id) {
        productIdToDelete = product._id.toString();
        console.log(`[deleteProduct] Found product by custom id (product- prefix): ${id}`);
      }
      
      // If still not found, try partial match or find by any product with similar pattern
      if (!product) {
        const allProducts = await ProductModel.find({}).lean();
        // Try to find by checking if any product's stored id matches
        const found = allProducts.find(p => {
          const storedId = (p as any).id;
          if (storedId === id) return true;
          // Also check _id.toString() in case the id was transformed
          if (p._id?.toString() === id) return true;
          return false;
        });
        if (found) {
          product = found;
          productIdToDelete = found._id.toString();
          console.log(`[deleteProduct] Found product by scanning (product- prefix): ${id}`);
        }
      }
    }
    
    // Priority 4: Final fallback - scan all products and match by _id.toString()
    // This handles cases where id might be the _id string but ObjectId validation failed
    if (!product) {
      const allProducts = await ProductModel.find({}).lean();
      const found = allProducts.find(p => {
        // Check if _id.toString() matches the provided id
        if (p._id?.toString() === id) return true;
        // Check if stored id field matches
        if ((p as any).id === id) return true;
        return false;
      });
      if (found) {
        product = found;
        productIdToDelete = found._id.toString();
        console.log(`[deleteProduct] Found product by final scan: ${id}`);
      }
    }
    
    if (!product || !productIdToDelete) {
      console.warn(`[deleteProduct] Product not found with ID: ${id}`);
      console.warn(`[deleteProduct] ID type: ${typeof id}, length: ${id.length}, isObjectId: ${mongoose.Types.ObjectId.isValid(id)}`);
      
      // Log all product IDs for debugging (first 20)
      const allProducts = await ProductModel.find({}).select('id _id name').lean().limit(20);
      const productInfo = allProducts.map(p => {
        const storedId = (p as any).id;
        const mongoId = p._id?.toString();
        // Check what the API would return (via toJSON transform)
        const apiId = storedId || mongoId;
        return {
          storedId: storedId || 'undefined',
          mongoId: mongoId,
          apiId: apiId, // This is what the API actually returns
          name: (p as any).name,
          mongoIdMatches: mongoId === id,
          storedIdMatches: storedId === id,
          apiIdMatches: apiId === id
        };
      });
      console.log(`[deleteProduct] Available products (first 20):`, productInfo);
      
      // If id starts with "product-", it's likely a custom ID that wasn't stored
      // Try to find by matching the timestamp part or suggest using MongoDB ObjectId
      if (id.startsWith('product-')) {
        console.log(`[deleteProduct] ID starts with "product-", this is a custom ID format`);
        console.log(`[deleteProduct] The database doesn't store this format - products use MongoDB ObjectIds`);
        console.log(`[deleteProduct] The API should return MongoDB ObjectIds, but frontend is using custom ID`);
        console.log(`[deleteProduct] This suggests the frontend has cached/stale data`);
        console.log(`[deleteProduct] Solution: Clear browser cache and refresh the page`);
      }
      
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
  await ensureConnection();
  
  const { id, ...categoryData } = category;
  const updateData = {
    ...categoryData,
    updatedAt: new Date().toISOString(),
  };
  
  let saved;
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    saved = await CategoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, setDefaultsOnInsert: true }
    ).lean();
  } else if (id) {
    const existing = await CategoryModel.findOne({ id: id }).lean();
    if (existing) {
      saved = await CategoryModel.findByIdAndUpdate(
        existing._id,
        updateData,
        { new: true, setDefaultsOnInsert: true }
      ).lean();
    } else {
      saved = await CategoryModel.create({ ...updateData, id: id });
      saved = saved.toObject();
    }
  } else {
    saved = await CategoryModel.create(updateData);
    saved = saved.toObject();
  }
  
  return toType<Category>(saved);
}

/**
 * Delete category (soft delete)
 * @param id - Category ID
 * @returns Promise<Category | null>
 */
export async function deleteCategory(id: string): Promise<Category | null> {
  await ensureConnection();
  
  let category;
  if (mongoose.Types.ObjectId.isValid(id)) {
    category = await CategoryModel.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date().toISOString() },
      { new: true }
    ).lean();
  } else {
    const existing = await CategoryModel.findOne({ id: id }).lean();
    if (existing) {
      category = await CategoryModel.findByIdAndUpdate(
        existing._id,
        { isActive: false, updatedAt: new Date().toISOString() },
        { new: true }
      ).lean();
    }
  }
  
  return category ? toType<Category>(category) : null;
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
  await ensureConnection();
  const users = await UserModel.find({}).lean();
  return users.map(toType<User>);
}

/**
 * Get user by ID
 * @param id - User ID
 * @returns Promise<User | undefined>
 */
export async function getUserById(id: string): Promise<User | undefined> {
  await ensureConnection();
  let user;
  if (mongoose.Types.ObjectId.isValid(id)) {
    user = await UserModel.findById(id).lean();
  } else {
    user = await UserModel.findOne({ id: id }).lean();
  }
  return user ? toType<User>(user) : undefined;
}

/**
 * Get user by email
 * @param email - User email
 * @returns Promise<User | undefined>
 */
export async function getUserByEmail(email: string): Promise<User | undefined> {
  await ensureConnection();
  const user = await UserModel.findOne({ email }).lean();
  return user ? toType<User>(user) : undefined;
}

/**
 * Save user (create or update)
 * @param user - User to save
 * @returns Promise<User>
 */
export async function saveUser(user: Partial<User> & { email: string }): Promise<User> {
  await ensureConnection();
  
  // Check if user exists by email
  const existingUser = await UserModel.findOne({ email: user.email }).lean();
  
  let saved;
  if (existingUser) {
    // Update existing user
    const updateData = {
      ...user,
      lastName: user.lastName !== undefined ? user.lastName : existingUser.lastName || '',
      updatedAt: new Date().toISOString(),
    };
    saved = await UserModel.findByIdAndUpdate(
      existingUser._id,
      updateData,
      { new: true, setDefaultsOnInsert: true }
    ).lean();
  } else {
    // Create new user
    const newUserData = {
      ...user,
      lastName: user.lastName || '', // Ensure lastName is always set
      role: user.role || 'client',
      isEmailVerified: user.isEmailVerified || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saved = await UserModel.create(newUserData);
    saved = saved.toObject();
  }
  
  return toType<User>(saved);
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
  await ensureConnection();
  
  // Check if already featured
  const existing = await FeaturedProductModel.findOne({ productId, isActive: true }).lean();
  if (existing) {
    return toType<FeaturedProduct>(existing);
  }
  
  // Get the original product
  const product = await getProductById(productId);
  if (!product) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  // Create a copy of the product as featured product
  const featuredProductData: Partial<FeaturedProduct> = {
    ...product,
    id: `featured-${productId}-${Date.now()}`,
    productId: product.id,
    featuredAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  
  const saved = await FeaturedProductModel.create(featuredProductData);
  return toType<FeaturedProduct>(saved.toObject());
}

/**
 * Remove product from featured (soft delete)
 * @param productId - Product ID to remove from featured
 * @returns Promise<FeaturedProduct | null>
 */
export async function removeFeaturedProduct(productId: string): Promise<FeaturedProduct | null> {
  await ensureConnection();
  const featuredProduct = await FeaturedProductModel.findOneAndUpdate(
    { productId, isActive: true },
    { isActive: false, updatedAt: new Date().toISOString() },
    { new: true }
  ).lean();
  
  return featuredProduct ? toType<FeaturedProduct>(featuredProduct) : null;
}

/**
 * Remove featured product by featured product ID
 * @param id - Featured Product ID
 * @returns Promise<FeaturedProduct | null>
 */
export async function removeFeaturedProductById(id: string): Promise<FeaturedProduct | null> {
  await ensureConnection();
  let featuredProduct;
  
  if (mongoose.Types.ObjectId.isValid(id)) {
    featuredProduct = await FeaturedProductModel.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date().toISOString() },
      { new: true }
    ).lean();
  } else {
    const existing = await FeaturedProductModel.findOne({ id }).lean();
    if (existing) {
      featuredProduct = await FeaturedProductModel.findByIdAndUpdate(
        existing._id,
        { isActive: false, updatedAt: new Date().toISOString() },
        { new: true }
      ).lean();
    }
  }
  
  return featuredProduct ? toType<FeaturedProduct>(featuredProduct) : null;
}

/**
 * Update featured product data (syncs with original product)
 * @param productId - Original Product ID
 * @returns Promise<FeaturedProduct | null>
 */
export async function updateFeaturedProduct(productId: string): Promise<FeaturedProduct | null> {
  await ensureConnection();
  const featuredProduct = await FeaturedProductModel.findOne({ productId, isActive: true }).lean();
  
  if (!featuredProduct) {
    return null;
  }
  
  const product = await getProductById(productId);
  if (!product) {
    return null;
  }
  
  const updateData = {
    ...product,
    id: featuredProduct.id,
    productId: product.id,
    featuredAt: featuredProduct.featuredAt,
    updatedAt: new Date().toISOString(),
  };
  
  const updated = await FeaturedProductModel.findByIdAndUpdate(
    featuredProduct._id,
    updateData,
    { new: true }
  ).lean();
  
  return updated ? toType<FeaturedProduct>(updated) : null;
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
  await ensureConnection();
  
  // Check if already best selling
  const existing = await BestSellingProductModel.findOne({ productId, isActive: true }).lean();
  if (existing) {
    return toType<BestSellingProduct>(existing);
  }
  
  // Get the original product
  const product = await getProductById(productId);
  if (!product) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  // Create a copy of the product as best selling product
  const bestSellingProductData: Partial<BestSellingProduct> = {
    ...product,
    id: `bestselling-${productId}-${Date.now()}`,
    productId: product.id,
    bestSellingAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  
  const saved = await BestSellingProductModel.create(bestSellingProductData);
  return toType<BestSellingProduct>(saved.toObject());
}

/**
 * Remove product from best selling (soft delete)
 * @param productId - Product ID to remove from best selling
 * @returns Promise<BestSellingProduct | null>
 */
export async function removeBestSellingProduct(productId: string): Promise<BestSellingProduct | null> {
  await ensureConnection();
  const bestSellingProduct = await BestSellingProductModel.findOneAndUpdate(
    { productId, isActive: true },
    { isActive: false, updatedAt: new Date().toISOString() },
    { new: true }
  ).lean();
  
  return bestSellingProduct ? toType<BestSellingProduct>(bestSellingProduct) : null;
}

/**
 * Remove best selling product by best selling product ID
 * @param id - Best Selling Product ID
 * @returns Promise<BestSellingProduct | null>
 */
export async function removeBestSellingProductById(id: string): Promise<BestSellingProduct | null> {
  await ensureConnection();
  let bestSellingProduct;
  
  if (mongoose.Types.ObjectId.isValid(id)) {
    bestSellingProduct = await BestSellingProductModel.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date().toISOString() },
      { new: true }
    ).lean();
  } else {
    const existing = await BestSellingProductModel.findOne({ id }).lean();
    if (existing) {
      bestSellingProduct = await BestSellingProductModel.findByIdAndUpdate(
        existing._id,
        { isActive: false, updatedAt: new Date().toISOString() },
        { new: true }
      ).lean();
    }
  }
  
  return bestSellingProduct ? toType<BestSellingProduct>(bestSellingProduct) : null;
}

/**
 * Update best selling product data (syncs with original product)
 * @param productId - Original Product ID
 * @returns Promise<BestSellingProduct | null>
 */
export async function updateBestSellingProduct(productId: string): Promise<BestSellingProduct | null> {
  await ensureConnection();
  const bestSellingProduct = await BestSellingProductModel.findOne({ productId, isActive: true }).lean();
  
  if (!bestSellingProduct) {
    return null;
  }
  
  const product = await getProductById(productId);
  if (!product) {
    return null;
  }
  
  const updateData = {
    ...product,
    id: bestSellingProduct.id,
    productId: product.id,
    bestSellingAt: bestSellingProduct.bestSellingAt,
    updatedAt: new Date().toISOString(),
  };
  
  const updated = await BestSellingProductModel.findByIdAndUpdate(
    bestSellingProduct._id,
    updateData,
    { new: true }
  ).lean();
  
  return updated ? toType<BestSellingProduct>(updated) : null;
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
  await ensureConnection();
  
  const { id, ...bannerData } = heroBanner;
  const updateData = {
    ...bannerData,
    id: id || `hero-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };
  
  // If this banner is set to active, deactivate all others
  if (heroBanner.isActive) {
    await HeroBannerModel.updateMany(
      { isActive: true, id: { $ne: updateData.id } },
      { isActive: false }
    );
  }
  
  let saved;
  if (id && mongoose.Types.ObjectId.isValid(id)) {
    saved = await HeroBannerModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, setDefaultsOnInsert: true, upsert: true }
    ).lean();
  } else if (id) {
    const existing = await HeroBannerModel.findOne({ id }).lean();
    if (existing) {
      saved = await HeroBannerModel.findByIdAndUpdate(
        existing._id,
        updateData,
        { new: true }
      ).lean();
    } else {
      saved = await HeroBannerModel.create({ ...updateData, createdAt: new Date().toISOString() });
      saved = saved.toObject();
    }
  } else {
    saved = await HeroBannerModel.create({ ...updateData, createdAt: new Date().toISOString() });
    saved = saved.toObject();
  }
  
  return toType<HeroBanner>(saved);
}

/**
 * Delete hero banner (soft delete)
 * @param id - Hero Banner ID
 * @returns Promise<HeroBanner | null>
 */
export async function deleteHeroBanner(id: string): Promise<HeroBanner | null> {
  await ensureConnection();
  let heroBanner;
  
  if (mongoose.Types.ObjectId.isValid(id)) {
    heroBanner = await HeroBannerModel.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date().toISOString() },
      { new: true }
    ).lean();
  } else {
    const existing = await HeroBannerModel.findOne({ id }).lean();
    if (existing) {
      heroBanner = await HeroBannerModel.findByIdAndUpdate(
        existing._id,
        { isActive: false, updatedAt: new Date().toISOString() },
        { new: true }
      ).lean();
    }
  }
  
  return heroBanner ? toType<HeroBanner>(heroBanner) : null;
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
  await ensureConnection();
  
  const count = await PromoBannerModel.countDocuments();
  const normalized: Partial<PromoBanner> = {
    ...promoBanner,
    id: promoBanner.id || `promo-${Date.now()}`,
    initialTime: promoBanner.initialTime ?? defaultPromoCountdown(),
    variant: promoBanner.variant ?? 'slider',
    order: typeof promoBanner.order === 'number' ? promoBanner.order : count,
    updatedAt: new Date().toISOString(),
    isActive: promoBanner.isActive !== undefined ? promoBanner.isActive : true,
  };

  let saved;
  if (normalized.id && mongoose.Types.ObjectId.isValid(normalized.id)) {
    saved = await PromoBannerModel.findByIdAndUpdate(
      normalized.id,
      normalized,
      { new: true, setDefaultsOnInsert: true, upsert: true }
    ).lean();
  } else if (normalized.id) {
    const existing = await PromoBannerModel.findOne({ id: normalized.id }).lean();
    if (existing) {
      saved = await PromoBannerModel.findByIdAndUpdate(
        existing._id,
        normalized,
        { new: true }
      ).lean();
    } else {
      saved = await PromoBannerModel.create({ ...normalized, createdAt: new Date().toISOString() });
      saved = saved.toObject();
    }
  } else {
    saved = await PromoBannerModel.create({ ...normalized, createdAt: new Date().toISOString() });
    saved = saved.toObject();
  }

  return toType<PromoBanner>(saved);
}

export async function deletePromoBanner(id: string): Promise<PromoBanner | null> {
  await ensureConnection();
  let banner;
  
  if (mongoose.Types.ObjectId.isValid(id)) {
    banner = await PromoBannerModel.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date().toISOString() },
      { new: true }
    ).lean();
  } else {
    const existing = await PromoBannerModel.findOne({ id }).lean();
    if (existing) {
      banner = await PromoBannerModel.findByIdAndUpdate(
        existing._id,
        { isActive: false, updatedAt: new Date().toISOString() },
        { new: true }
      ).lean();
    }
  }

  return banner ? toType<PromoBanner>(banner) : null;
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
  await ensureConnection();
  
  const count = await FestivalBannerModel.countDocuments();
  const normalized: Partial<FestivalBanner> = {
    ...banner,
    id: banner.id || `festival-${Date.now()}`,
    coupons: normalizeCoupons(banner.coupons),
    order: typeof banner.order === 'number' ? banner.order : count,
    updatedAt: new Date().toISOString(),
    isActive: banner.isActive !== undefined ? banner.isActive : true,
  };

  let saved;
  if (normalized.id && mongoose.Types.ObjectId.isValid(normalized.id)) {
    saved = await FestivalBannerModel.findByIdAndUpdate(
      normalized.id,
      normalized,
      { new: true, setDefaultsOnInsert: true, upsert: true }
    ).lean();
  } else if (normalized.id) {
    const existing = await FestivalBannerModel.findOne({ id: normalized.id }).lean();
    if (existing) {
      saved = await FestivalBannerModel.findByIdAndUpdate(
        existing._id,
        { ...normalized, coupons: normalizeCoupons(normalized.coupons || []) },
        { new: true }
      ).lean();
    } else {
      saved = await FestivalBannerModel.create({ ...normalized, createdAt: new Date().toISOString() });
      saved = saved.toObject();
    }
  } else {
    saved = await FestivalBannerModel.create({ ...normalized, createdAt: new Date().toISOString() });
    saved = saved.toObject();
  }

  return toType<FestivalBanner>(saved);
}

export async function deleteFestivalBanner(id: string): Promise<FestivalBanner | null> {
  await ensureConnection();
  let banner;
  
  if (mongoose.Types.ObjectId.isValid(id)) {
    banner = await FestivalBannerModel.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date().toISOString() },
      { new: true }
    ).lean();
  } else {
    const existing = await FestivalBannerModel.findOne({ id }).lean();
    if (existing) {
      banner = await FestivalBannerModel.findByIdAndUpdate(
        existing._id,
        { isActive: false, updatedAt: new Date().toISOString() },
        { new: true }
      ).lean();
    }
  }

  return banner ? toType<FestivalBanner>(banner) : null;
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

export async function getReviews(productId?: string, productName?: string): Promise<ProductReview[]> {
  const startTime = Date.now();
  await ensureConnection();
  
  let query: any = {};
  if (productId) {
    // Support both ObjectId and string productId matching
    // Try exact match first
    query.productId = productId;
    console.log(`[MongoDB] getReviews: Searching for productId="${productId}"`);
    
    // If productName is also provided, use OR query to find by either productId or productName
    if (productName) {
      query = {
        $or: [
          { productId: productId },
          { productName: productName }
        ]
      };
      console.log(`[MongoDB] getReviews: Also searching for productName="${productName}"`);
    }
  } else {
    console.log('[MongoDB] getReviews: Fetching all reviews...');
  }
  
  const reviews = await ProductReviewModel.find(query).lean();
  const typed = reviews.map(toType<ProductReview>);
  
  console.log(`[MongoDB] getReviews: Fetched ${typed.length} reviews in ${Date.now() - startTime}ms`);
  if (productId && typed.length === 0) {
    console.warn(`[MongoDB] getReviews: No reviews found for productId="${productId}". Checking all reviews...`);
    // Debug: Show all reviews to see what productIds exist
    const allReviews = await ProductReviewModel.find({}).lean().limit(10);
    console.log(`[MongoDB] getReviews: Sample productIds in database:`, 
      allReviews.map((r: any) => ({ id: r._id?.toString(), productId: r.productId, productName: r.productName }))
    );
  }
  
  return typed;
}

export async function getReviewById(id: string): Promise<ProductReview | undefined> {
  await ensureConnection();
  const review = await ProductReviewModel.findById(id).lean();
  return review ? toType<ProductReview>(review) : undefined;
}

export async function getReviewsByProduct(productId: string, productName?: string): Promise<ProductReview[]> {
  return getReviews(productId, productName);
}

export async function saveReview(review: ProductReview): Promise<ProductReview> {
  await ensureConnection();
  
  // Get product name from MongoDB if productId is provided
  let productName: string | undefined;
  if (review.productId) {
    try {
      const product = await ProductModel.findById(review.productId).lean();
      if (product) {
        productName = product.name;
      }
    } catch (error) {
      console.warn('Could not fetch product name for review:', error);
    }
  }
  
  const normalized = normalizeReview(review, productName);
  
  // Check if review exists (only if id is a valid MongoDB ObjectId)
  let existingReview = null;
  if (normalized.id && mongoose.Types.ObjectId.isValid(normalized.id)) {
    existingReview = await ProductReviewModel.findById(normalized.id).lean();
  }
  
  let saved;
  if (existingReview) {
    // Update existing review
    const { id, createdAt, ...updateData } = normalized;
    // Preserve original createdAt when updating
    updateData.updatedAt = new Date().toISOString();
    saved = await ProductReviewModel.findByIdAndUpdate(
      existingReview._id,
      updateData,
      { new: true }
    ).lean();
  } else {
    // Create new review - MongoDB will generate _id
    const { id, ...createData } = normalized;
    // Ensure timestamps are set
    if (!createData.createdAt) {
      createData.createdAt = new Date().toISOString();
    }
    if (!createData.updatedAt) {
      createData.updatedAt = new Date().toISOString();
    }
    saved = await ProductReviewModel.create(createData);
    saved = saved.toObject();
  }
  
  return toType<ProductReview>(saved);
}

export async function deleteReview(id: string): Promise<ProductReview | null> {
  await ensureConnection();
  
  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.warn(`Invalid review ID format: ${id}`);
    return null;
  }
  
  const deleted = await ProductReviewModel.findByIdAndDelete(id).lean();
  
  if (!deleted) {
    return null;
  }
  
  return toType<ProductReview>(deleted);
}
