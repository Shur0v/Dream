/**
 * Database helper functions for Express backend
 * Handles read/write operations for separate JSON database files
 */

import { promises as fs } from 'fs';
import path from 'path';
import { Product, Order, Category, Color, User } from '../../src/types';

// Database file paths
const DB_DIR = path.join(process.cwd(), 'backend', 'database');
const PRODUCTS_DB = path.join(DB_DIR, 'products.json');
const ORDERS_DB = path.join(DB_DIR, 'orders.json');
const CATEGORIES_DB = path.join(DB_DIR, 'categories.json');
const COLORS_DB = path.join(DB_DIR, 'colors.json');
const USERS_DB = path.join(DB_DIR, 'users.json');

// In-memory cache with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

let productsCache: CacheEntry<Product[]> | null = null;
let ordersCache: CacheEntry<Order[]> | null = null;
let categoriesCache: CacheEntry<Category[]> | null = null;
let colorsCache: CacheEntry<Color[]> | null = null;
let usersCache: CacheEntry<User[]> | null = null;

/**
 * Ensure database directory exists
 */
async function ensureDbDir(): Promise<void> {
  try {
    await fs.mkdir(DB_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating database directory:', error);
  }
}

/**
 * Read JSON file with caching
 */
async function readJsonFile<T>(filePath: string, cache: CacheEntry<T> | null): Promise<T> {
  const now = Date.now();
  
  // Check cache
  if (cache && (now - cache.timestamp) < CACHE_TTL) {
    return cache.data;
  }
  
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content) as T;
    return data;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist, return empty array
      return [] as unknown as T;
    }
    throw error;
  }
}

/**
 * Write JSON file and invalidate cache
 */
async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  try {
    await ensureDbDir();
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content, 'utf-8');
    console.log(`[db] Successfully wrote to ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`[db] Error writing to ${filePath}:`, error);
    throw new Error(`Failed to write to database file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Products
export async function getProducts(): Promise<Product[]> {
  const data = await readJsonFile<Product[]>(PRODUCTS_DB, productsCache);
  productsCache = { data, timestamp: Date.now() };
  return data;
}

export async function saveProducts(products: Product[]): Promise<void> {
  await writeJsonFile(PRODUCTS_DB, products);
  productsCache = null; // Invalidate cache
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(p => p.id === id);
}

export async function saveProduct(product: Product): Promise<Product> {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === product.id);
  
  if (index >= 0) {
    products[index] = product;
  } else {
    products.push(product);
  }
  
  await saveProducts(products);
  return product;
}

export async function deleteProduct(id: string): Promise<Product | null> {
  const products = await getProducts();
  const product = products.find(p => p.id === id);
  
  if (product) {
    product.isActive = false;
    product.updatedAt = new Date().toISOString();
    await saveProducts(products);
    return product;
  }
  
  return null;
}

// Orders
export async function getOrders(): Promise<Order[]> {
  const data = await readJsonFile<Order[]>(ORDERS_DB, ordersCache);
  // Always update cache after reading
  ordersCache = { data, timestamp: Date.now() };
  console.log(`[db] Retrieved ${data.length} orders from database`);
  return data;
}

export async function saveOrders(orders: Order[]): Promise<void> {
  // Invalidate cache before writing
  ordersCache = null;
  await writeJsonFile(ORDERS_DB, orders);
  // Invalidate cache again after writing to ensure fresh reads
  ordersCache = null;
  console.log(`[db] Orders saved. Total orders: ${orders.length}`);
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find(o => o.id === id);
}

export async function saveOrder(order: Order): Promise<Order> {
  // Invalidate cache first to ensure we get fresh data
  ordersCache = null;
  
  const orders = await getOrders();
  const index = orders.findIndex(o => o.id === order.id);
  
  if (index >= 0) {
    orders[index] = order;
    console.log(`[db] Updating order: ${order.id}`);
  } else {
    orders.push(order);
    console.log(`[db] Creating new order: ${order.id} - Total orders now: ${orders.length + 1}`);
  }
  
  // Invalidate cache before saving
  ordersCache = null;
  await saveOrders(orders);
  // Invalidate cache after saving to ensure next read is fresh
  ordersCache = null;
  console.log(`[db] Order saved successfully. Total orders in database: ${orders.length}`);
  return order;
}

// Categories
export async function getCategories(): Promise<Category[]> {
  const data = await readJsonFile<Category[]>(CATEGORIES_DB, categoriesCache);
  categoriesCache = { data, timestamp: Date.now() };
  return data;
}

export async function saveCategories(categories: Category[]): Promise<void> {
  await writeJsonFile(CATEGORIES_DB, categories);
  categoriesCache = null;
}

export async function getCategoryById(id: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find(c => c.id === id);
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find(c => c.slug === slug);
}

export async function saveCategory(category: Category): Promise<Category> {
  try {
    const categories = await getCategories();
    const index = categories.findIndex(c => c.id === category.id);
    
    if (index >= 0) {
      categories[index] = category;
      console.log(`[db] Updating category: ${category.id}`);
    } else {
      categories.push(category);
      console.log(`[db] Creating new category: ${category.id}`);
    }
    
    await saveCategories(categories);
    console.log(`[db] Total categories in database: ${categories.length}`);
    return category;
  } catch (error) {
    console.error('[db] Error saving category:', error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<Category | null> {
  const categories = await getCategories();
  const category = categories.find(c => c.id === id);
  
  if (category) {
    category.isActive = false;
    category.updatedAt = new Date().toISOString();
    await saveCategories(categories);
    return category;
  }
  
  return null;
}

// Colors
export async function getColors(): Promise<Color[]> {
  const data = await readJsonFile<Color[]>(COLORS_DB, colorsCache);
  colorsCache = { data, timestamp: Date.now() };
  return data;
}

export async function saveColors(colors: Color[]): Promise<void> {
  await writeJsonFile(COLORS_DB, colors);
  colorsCache = null;
}

export async function getColorById(id: string): Promise<Color | undefined> {
  const colors = await getColors();
  return colors.find(c => c.id === id);
}

export async function saveColor(color: Color): Promise<Color> {
  try {
    const colors = await getColors();
    const index = colors.findIndex(c => c.id === color.id);
    
    if (index >= 0) {
      colors[index] = color;
      console.log(`[db] Updating color: ${color.id}`);
    } else {
      colors.push(color);
      console.log(`[db] Creating new color: ${color.id}`);
    }
    
    await saveColors(colors);
    console.log(`[db] Total colors in database: ${colors.length}`);
    return color;
  } catch (error) {
    console.error('[db] Error saving color:', error);
    throw error;
  }
}

export async function deleteColor(id: string): Promise<Color | null> {
  const colors = await getColors();
  const color = colors.find(c => c.id === id);
  
  if (color) {
    color.isActive = false;
    color.updatedAt = new Date().toISOString();
    await saveColors(colors);
    return color;
  }
  
  return null;
}

// Users
export async function getUsers(): Promise<User[]> {
  const data = await readJsonFile<User[]>(USERS_DB, usersCache);
  usersCache = { data, timestamp: Date.now() };
  return data;
}

export async function saveUsers(users: User[]): Promise<void> {
  await writeJsonFile(USERS_DB, users);
  usersCache = null;
}

export async function getUserById(id: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find(u => u.id === id);
}

export async function saveUser(user: User): Promise<User> {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === user.id);
  
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  
  await saveUsers(users);
  return user;
}

// Cache invalidation helpers
export function invalidateProductsCache(): void {
  productsCache = null;
}

export function invalidateOrdersCache(): void {
  ordersCache = null;
}

export function invalidateCategoriesCache(): void {
  categoriesCache = null;
}

export function invalidateColorsCache(): void {
  colorsCache = null;
}

export function invalidateUsersCache(): void {
  usersCache = null;
}

