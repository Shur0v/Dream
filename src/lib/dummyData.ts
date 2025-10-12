/**
 * @fileoverview Dummy data for development and testing
 * Provides sample data for products, users, and other entities
 * 
 * @description This file contains:
 * - Sample product data
 * - Sample user data
 * - Sample cart and wishlist data
 * - Mock API responses
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { Product, User, CartItem, WishlistItem, Order } from '../types';

/**
 * Sample products for development
 */
export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 199.99,
    originalPrice: 249.99,
    images: [
      'https://placehold.co/400x400/purple/white?text=Headphones',
      'https://placehold.co/400x400/purple/white?text=Headphones+2',
      'https://placehold.co/400x400/purple/white?text=Headphones+3',
    ],
    category: 'Electronics',
    subcategory: 'Audio',
    brand: 'TechSound',
    sku: 'TS-WH-001',
    stock: 25,
    isActive: true,
    tags: ['wireless', 'bluetooth', 'noise-cancellation', 'premium'],
    specifications: {
      batteryLife: '30 hours',
      connectivity: 'Bluetooth 5.0',
      weight: '250g',
      color: 'Black',
    },
    sellerId: 'seller-1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking watch with heart rate monitoring, GPS, and water resistance. Track your workouts and health metrics.',
    price: 299.99,
    originalPrice: 349.99,
    images: [
      'https://placehold.co/400x400/blue/white?text=Smart+Watch',
      'https://placehold.co/400x400/blue/white?text=Smart+Watch+2',
    ],
    category: 'Electronics',
    subcategory: 'Wearables',
    brand: 'FitTech',
    sku: 'FT-SW-002',
    stock: 18,
    isActive: true,
    tags: ['fitness', 'smartwatch', 'health', 'gps'],
    specifications: {
      batteryLife: '7 days',
      waterResistance: '5ATM',
      display: '1.4" AMOLED',
      sensors: 'Heart Rate, GPS, Accelerometer',
    },
    sellerId: 'seller-2',
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z',
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable organic cotton t-shirt made from sustainable materials. Available in multiple colors and sizes.',
    price: 29.99,
    images: [
      'https://placehold.co/400x400/green/white?text=T-Shirt',
      'https://placehold.co/400x400/green/white?text=T-Shirt+2',
    ],
    category: 'Clothing',
    subcategory: 'Tops',
    brand: 'EcoWear',
    sku: 'EW-CT-003',
    stock: 50,
    isActive: true,
    tags: ['organic', 'cotton', 'sustainable', 'casual'],
    specifications: {
      material: '100% Organic Cotton',
      care: 'Machine wash cold',
      origin: 'Made in USA',
      colors: ['White', 'Black', 'Navy', 'Gray'],
    },
    sellerId: 'seller-3',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    name: 'Professional Camera Lens',
    description: 'High-quality 50mm prime lens perfect for portrait photography. Sharp images with beautiful bokeh effect.',
    price: 599.99,
    originalPrice: 699.99,
    images: [
      'https://placehold.co/400x400/orange/white?text=Camera+Lens',
      'https://placehold.co/400x400/orange/white?text=Camera+Lens+2',
    ],
    category: 'Electronics',
    subcategory: 'Photography',
    brand: 'PhotoPro',
    sku: 'PP-50L-004',
    stock: 8,
    isActive: true,
    tags: ['camera', 'lens', 'photography', 'professional'],
    specifications: {
      focalLength: '50mm',
      aperture: 'f/1.8',
      mount: 'Canon EF',
      weight: '160g',
    },
    sellerId: 'seller-1',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z',
  },
  {
    id: '5',
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.',
    price: 24.99,
    images: [
      'https://placehold.co/400x400/cyan/white?text=Water+Bottle',
      'https://placehold.co/400x400/cyan/white?text=Water+Bottle+2',
    ],
    category: 'Home & Kitchen',
    subcategory: 'Drinkware',
    brand: 'HydroLife',
    sku: 'HL-SB-005',
    stock: 75,
    isActive: true,
    tags: ['water-bottle', 'insulated', 'stainless-steel', 'eco-friendly'],
    specifications: {
      capacity: '32oz',
      material: 'Stainless Steel',
      insulation: 'Double Wall Vacuum',
      lidType: 'Screw Top',
    },
    sellerId: 'seller-4',
    createdAt: '2024-01-11T11:20:00Z',
    updatedAt: '2024-01-11T11:20:00Z',
  },
  {
    id: '6',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator.',
    price: 39.99,
    originalPrice: 49.99,
    images: [
      'https://placehold.co/400x400/red/white?text=Wireless+Charger',
      'https://placehold.co/400x400/red/white?text=Wireless+Charger+2',
    ],
    category: 'Electronics',
    subcategory: 'Accessories',
    brand: 'PowerTech',
    sku: 'PT-WC-006',
    stock: 32,
    isActive: true,
    tags: ['wireless-charging', 'qi', 'fast-charge', 'led'],
    specifications: {
      power: '15W',
      compatibility: 'Qi Standard',
      indicator: 'LED Status Light',
      material: 'Silicone + ABS',
    },
    sellerId: 'seller-2',
    createdAt: '2024-01-10T13:10:00Z',
    updatedAt: '2024-01-10T13:10:00Z',
  },
];

/**
 * Sample users for different roles
 */
export const sampleUsers: User[] = [
  {
    id: 'user-1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'client',
    avatar: 'https://placehold.co/150x150/blue/white?text=JD',
    phone: '+1-555-0123',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'seller-1',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'seller',
    avatar: 'https://placehold.co/150x150/purple/white?text=JS',
    phone: '+1-555-0456',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'reseller-1',
    email: 'mike.wilson@example.com',
    firstName: 'Mike',
    lastName: 'Wilson',
    role: 'reseller',
    avatar: 'https://placehold.co/150x150/green/white?text=MW',
    phone: '+1-555-0789',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'admin-1',
    email: 'admin@dreamstore.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'super-admin',
    avatar: 'https://placehold.co/150x150/red/white?text=Admin',
    phone: '+1-555-0000',
    address: {
      street: '100 Admin Blvd',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA',
    },
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

/**
 * Sample cart items
 */
export const sampleCartItems: CartItem[] = [
  {
    id: 'cart-item-1',
    productId: '1',
    product: sampleProducts[0],
    quantity: 1,
    price: 199.99,
    addedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'cart-item-2',
    productId: '3',
    product: sampleProducts[2],
    quantity: 2,
    price: 59.98,
    addedAt: '2024-01-15T11:00:00Z',
  },
];

/**
 * Sample wishlist items
 */
export const sampleWishlistItems: WishlistItem[] = [
  {
    id: 'wishlist-item-1',
    productId: '2',
    product: sampleProducts[1],
    addedAt: '2024-01-15T12:00:00Z',
  },
  {
    id: 'wishlist-item-2',
    productId: '4',
    product: sampleProducts[3],
    addedAt: '2024-01-15T12:30:00Z',
  },
];

/**
 * Sample orders
 */
export const sampleOrders: Order[] = [
  {
    id: 'order-1',
    userId: 'user-1',
    items: [
      {
        id: 'order-item-1',
        productId: '1',
        product: sampleProducts[0],
        quantity: 1,
        price: 199.99,
      },
    ],
    status: 'delivered',
    totalAmount: 199.99,
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    paymentMethod: 'Credit Card',
    paymentStatus: 'paid',
    trackingNumber: 'TRK123456789',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-12T15:30:00Z',
  },
];

/**
 * Categories for navigation
 */
export const categories = [
  { id: 'electronics', name: 'Electronics', slug: 'electronics' },
  { id: 'clothing', name: 'Clothing', slug: 'clothing' },
  { id: 'home-kitchen', name: 'Home & Kitchen', slug: 'home-kitchen' },
  { id: 'sports', name: 'Sports & Outdoors', slug: 'sports' },
  { id: 'books', name: 'Books', slug: 'books' },
  { id: 'beauty', name: 'Beauty & Health', slug: 'beauty' },
];

/**
 * Mock API delay for realistic testing
 */
export const mockApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
