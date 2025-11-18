/**
 * @fileoverview Product storage utility for reading/writing products to JSON file
 * Provides simple file-based persistence for products
 */

import { promises as fs } from 'fs';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json');

export interface StoredProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand: string;
  sku: string;
  stock: number;
  isActive: boolean;
  tags: string[];
  specifications?: Record<string, any>;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields from AddProductForm
  currency?: string;
  rating?: number;
  reviews?: number;
  isVerifiedSeller?: boolean;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  seller?: string;
  discount?: number;
}

/**
 * Read all products from JSON file
 */
export async function readProducts(): Promise<StoredProduct[]> {
  try {
    const fileContent = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error: any) {
    // If file doesn't exist or is empty, return empty array
    if (error.code === 'ENOENT' || error.message.includes('Unexpected end')) {
      return [];
    }
    console.error('Error reading products file:', error);
    return [];
  }
}

/**
 * Write products to JSON file
 */
export async function writeProducts(products: StoredProduct[]): Promise<void> {
  try {
    // Ensure directory exists
    const dir = path.dirname(PRODUCTS_FILE);
    await fs.mkdir(dir, { recursive: true });
    
    // Write products to file
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing products file:', error);
    throw error;
  }
}

/**
 * Add a new product
 */
export async function addProduct(product: StoredProduct): Promise<StoredProduct> {
  const products = await readProducts();
  products.push(product);
  await writeProducts(products);
  return product;
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<StoredProduct | null> {
  const products = await readProducts();
  return products.find(p => p.id === id) || null;
}

/**
 * Update product by ID
 */
export async function updateProduct(id: string, updates: Partial<StoredProduct>): Promise<StoredProduct | null> {
  const products = await readProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  products[index] = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await writeProducts(products);
  return products[index];
}

/**
 * Delete product by ID
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const products = await readProducts();
  const filtered = products.filter(p => p.id !== id);
  
  if (filtered.length === products.length) {
    return false; // Product not found
  }
  
  await writeProducts(filtered);
  return true;
}

