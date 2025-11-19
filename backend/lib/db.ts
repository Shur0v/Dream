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

import { Product, Order, Category, Color, User } from '@/types';
import { readJsonStore, writeJsonStore } from '../lib/jsonStore';
import { DatabaseSchema, DatabaseShape } from '@backend/schemas/database';

type Database = ReturnType<typeof DatabaseSchema.parse>;

// In-memory cache for products (with TTL)
let productsCache: { data: Product[]; timestamp: number } | null = null;
const CACHE_TTL = 5000; // 5 seconds cache

// In-memory cache for colors
let colorsCache: { data: Color[]; timestamp: number } | null = null;

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
  if (colorsCache && (now - colorsCache.timestamp) < CACHE_TTL) {
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

