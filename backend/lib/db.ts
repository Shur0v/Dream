/**
 * @fileoverview Database helper functions for JSON file operations
 * Provides read/write operations for the JSON database file
 * 
 * @description This file handles all database operations:
 * - Reading from database.json
 * - Writing to database.json
 * - Type-safe operations
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { Product, Order, Category, Color, User, FeaturedProduct, BestSellingProduct, HeroBanner, PromoBanner, PromoBannerVariant } from '@/types';
import { readJsonStore, writeJsonStore } from '../lib/jsonStore';
import { DatabaseSchema, DatabaseShape } from '@backend/schemas/database';

type Database = ReturnType<typeof DatabaseSchema.parse>;

// In-memory cache for products (with TTL)
let productsCache: { data: Product[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

// In-memory cache for colors
let colorsCache: { data: Color[]; timestamp: number } | null = null;
const COLORS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

/**
 * Read database from JSON file
 * @returns Promise<Database> - The entire database object
 */
export async function readDatabase(): Promise<Database> {
  const raw = await readJsonStore<DatabaseShape>('database', { fileName: 'database' });
  return DatabaseSchema.parse(raw ?? {});
}

/**
 * Write database to JSON file
 * @param data - The database object to write
 * @returns Promise<void>
 */
export async function writeDatabase(data: Database): Promise<void> {
  try {
    await writeJsonStore('database', data, { fileName: 'database' });
    console.log('Database written successfully');
  } catch (error) {
    console.error('Error writing database:', error);
    throw new Error(
      `Failed to write to database: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Get all products (with caching)
 * @returns Promise<Product[]>
 */
export async function getProducts(): Promise<Product[]> {
  // Check cache validity
  const now = Date.now();
  if (productsCache && (now - productsCache.timestamp) < CACHE_TTL) {
    return productsCache.data;
  }
  
  // Fetch from database
  const db = await readDatabase();
  const products = db.products;
  
  // Update cache
  productsCache = {
    data: products,
    timestamp: now,
  };
  
  return products;
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
  const db = await readDatabase();
  return db.products.find(p => p.id === id);
}

/**
 * Save product (create or update)
 * @param product - Product to save
 * @returns Promise<Product>
 */
export async function saveProduct(product: Product): Promise<Product> {
  try {
    const db = await readDatabase();
    const index = db.products.findIndex(p => p.id === product.id);
    
    if (index >= 0) {
      db.products[index] = product;
      console.log(`Product updated: ${product.id}`);
    } else {
      db.products.push(product);
      console.log(`Product created: ${product.id}`);
    }
    
    await writeDatabase(db);
    invalidateProductsCache(); // Invalidate cache after write
    console.log(`Total products in database: ${db.products.length}`);
    return product;
  } catch (error) {
    console.error('Error in saveProduct:', error);
    throw error;
  }
}

/**
 * Delete product (soft delete)
 * @param id - Product ID
 * @returns Promise<Product | null>
 */
export async function deleteProduct(id: string): Promise<Product | null> {
  const db = await readDatabase();
  const product = db.products.find(p => p.id === id);
  
  if (product) {
    product.isActive = false;
    product.updatedAt = new Date().toISOString();
    await writeDatabase(db);
    invalidateProductsCache(); // Invalidate cache after write
    return product;
  }
  
  return null;
}

/**
 * Remove a single image from a product
 * @param id - Product ID
 * @param imageIndex - Index of the image to remove
 * @returns Promise<Product | null>
 */
export async function removeProductImage(id: string, imageIndex: number): Promise<Product | null> {
  const db = await readDatabase();
  const productIndex = db.products.findIndex(p => p.id === id);

  if (productIndex === -1) {
    return null;
  }

  const product = db.products[productIndex];

  if (!Array.isArray(product.images) || imageIndex < 0 || imageIndex >= product.images.length) {
    return { ...product };
  }

  const updatedProduct: Product = {
    ...product,
    images: product.images.filter((_, idx) => idx !== imageIndex),
    updatedAt: new Date().toISOString(),
  };

  db.products[productIndex] = updatedProduct;
  await writeDatabase(db);

  return updatedProduct;
}

/**
 * Get all orders
 * @returns Promise<Order[]>
 */
export async function getOrders(): Promise<Order[]> {
  const db = await readDatabase();
  return db.orders;
}

/**
 * Get order by ID
 * @param id - Order ID
 * @returns Promise<Order | undefined>
 */
export async function getOrderById(id: string): Promise<Order | undefined> {
  const db = await readDatabase();
  return db.orders.find(o => o.id === id);
}

/**
 * Save order (create or update)
 * @param order - Order to save
 * @returns Promise<Order>
 */
export async function saveOrder(order: Order): Promise<Order> {
  const db = await readDatabase();
  const index = db.orders.findIndex(o => o.id === order.id);
  
  if (index >= 0) {
    db.orders[index] = order;
  } else {
    db.orders.push(order);
  }
  
  await writeDatabase(db);
  return order;
}

/**
 * Get all categories
 * @returns Promise<Category[]>
 */
export async function getCategories(): Promise<Category[]> {
  const db = await readDatabase();
  return db.categories;
}

/**
 * Get category by ID
 * @param id - Category ID
 * @returns Promise<Category | undefined>
 */
export async function getCategoryById(id: string): Promise<Category | undefined> {
  const db = await readDatabase();
  return db.categories.find(c => c.id === id);
}

/**
 * Get category by slug
 * @param slug - Category slug
 * @returns Promise<Category | undefined>
 */
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const db = await readDatabase();
  return db.categories.find(c => c.slug === slug);
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
  // Check cache validity
  const now = Date.now();
  if (colorsCache && (now - colorsCache.timestamp) < COLORS_CACHE_TTL) {
    return colorsCache.data;
  }
  
  // Fetch from database
  const db = await readDatabase();
  const colors = db.colors;
  
  // Update cache
  colorsCache = {
    data: colors,
    timestamp: now,
  };
  
  return colors;
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
  const db = await readDatabase();
  return db.colors.find(c => c.id === id);
}

/**
 * Save color (create or update)
 * @param color - Color to save
 * @returns Promise<Color>
 */
export async function saveColor(color: Color): Promise<Color> {
  const db = await readDatabase();
  const index = db.colors.findIndex(c => c.id === color.id);
  
  if (index >= 0) {
    db.colors[index] = color;
  } else {
    db.colors.push(color);
  }
  
  await writeDatabase(db);
  invalidateColorsCache(); // Invalidate cache after write
  return color;
}

/**
 * Delete color (soft delete)
 * @param id - Color ID
 * @returns Promise<Color | null>
 */
export async function deleteColor(id: string): Promise<Color | null> {
  const db = await readDatabase();
  const color = db.colors.find(c => c.id === id);
  
  if (color) {
    color.isActive = false;
    color.updatedAt = new Date().toISOString();
    await writeDatabase(db);
    invalidateColorsCache(); // Invalidate cache after write
    return color;
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
  const db = await readDatabase();
  return db.featuredProducts.filter(fp => fp.isActive);
}

/**
 * Get featured product by ID
 * @param id - Featured Product ID
 * @returns Promise<FeaturedProduct | undefined>
 */
export async function getFeaturedProductById(id: string): Promise<FeaturedProduct | undefined> {
  const db = await readDatabase();
  return db.featuredProducts.find(fp => fp.id === id);
}

/**
 * Get featured product by product ID
 * @param productId - Original Product ID
 * @returns Promise<FeaturedProduct | undefined>
 */
export async function getFeaturedProductByProductId(productId: string): Promise<FeaturedProduct | undefined> {
  const db = await readDatabase();
  return db.featuredProducts.find(fp => fp.productId === productId && fp.isActive);
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
  const db = await readDatabase();
  return db.bestSellingProducts.filter(bs => bs.isActive);
}

/**
 * Get best selling product by ID
 * @param id - Best Selling Product ID
 * @returns Promise<BestSellingProduct | undefined>
 */
export async function getBestSellingProductById(id: string): Promise<BestSellingProduct | undefined> {
  const db = await readDatabase();
  return db.bestSellingProducts.find(bs => bs.id === id);
}

/**
 * Get best selling product by product ID
 * @param productId - Original Product ID
 * @returns Promise<BestSellingProduct | undefined>
 */
export async function getBestSellingProductByProductId(productId: string): Promise<BestSellingProduct | undefined> {
  const db = await readDatabase();
  return db.bestSellingProducts.find(bs => bs.productId === productId && bs.isActive);
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
  const db = await readDatabase();
  const activeBanner = db.heroBanners.find(hb => hb.isActive);
  return activeBanner || null;
}

/**
 * Get hero banner by ID
 * @param id - Hero Banner ID
 * @returns Promise<HeroBanner | undefined>
 */
export async function getHeroBannerById(id: string): Promise<HeroBanner | undefined> {
  const db = await readDatabase();
  return db.heroBanners.find(hb => hb.id === id);
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
  const db = await readDatabase();
  return db.heroBanners;
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
  const { includeInactive = false, variant, limit } = options;
  const db = await readDatabase();

  let banners = db.promoBanners;
  if (!includeInactive) {
    banners = banners.filter(banner => banner.isActive);
  }
  if (variant) {
    banners = banners.filter(banner => banner.variant === variant);
  }

  const sorted = [...banners].sort(sortPromoBanners);

  if (limit && limit > 0) {
    return sorted.slice(0, limit);
  }

  return sorted;
}

export async function getPromoBannerById(id: string): Promise<PromoBanner | undefined> {
  const db = await readDatabase();
  return db.promoBanners.find(banner => banner.id === id);
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

