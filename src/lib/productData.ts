/**
 * Shared product data structure and utilities
 * Used by both categories page and product details page
 */

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  currency: string;
  image: string;
  rating: number;
  reviews: number;
  isVerifiedSeller: boolean;
  category: string;
  brand: string;
  sizes: string[];
  description?: string;
  colors?: string[];
  inStock?: boolean;
  seller?: string;
  // Additional fields from other data sources
  tags?: string[];
  sku?: string;
  stock?: number;
  isActive?: boolean;
  specifications?: Record<string, any>;
  sellerId?: string;
  createdAt?: string;
  updatedAt?: string;
  discount?: number;
  subcategory?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'AirPods Pro 2',
    price: 249.99,
    originalPrice: 299,
    currency: '৳',
    image: '/common/allproduct/product6.png',
    rating: 5,
    reviews: 234,
    isVerifiedSeller: true,
    category: 'Electronics',
    brand: 'Apple',
    sizes: ['S', 'M'],
    description: 'Active noise cancellation, spatial audio, and adaptive transparency for the ultimate listening experience.',
    colors: ['White'],
    inStock: true,
    seller: 'Apple Store',
    tags: ['airpods', 'apple', 'wireless', 'noise-canceling', 'earbuds', 'spatial-audio'],
    sku: 'APP2-005',
    stock: 35,
    isActive: true,
    specifications: {
      batteryLife: '6 hours + 24 hours case',
      noiseCanceling: 'Active',
      audio: 'Spatial Audio',
      chip: 'H2',
    },
    sellerId: 'seller-apple',
    createdAt: '2024-01-06T10:15:00Z',
    updatedAt: '2024-01-06T10:15:00Z',
    discount: 17,
    subcategory: 'Audio'
  },
  {
    id: 2,
    name: 'iPad Pro 12.9',
    price: 1099.99,
    originalPrice: 1299,
    currency: '৳',
    image: '/common/allproduct/product7.png',
    rating: 5,
    reviews: 67,
    isVerifiedSeller: true,
    category: 'Electronics',
    brand: 'Apple',
    sizes: ['M', 'L'],
    description: 'The most advanced iPad with M2 chip, Liquid Retina XDR display, and Apple Pencil support.',
    colors: ['Space Gray', 'Silver'],
    inStock: true,
    seller: 'Apple Store',
    tags: ['ipad', 'apple', 'tablet', 'm2', 'pro', 'apple-pencil'],
    sku: 'IPP12.9-006',
    stock: 20,
    isActive: true,
    specifications: {
      processor: 'Apple M2',
      memory: '8GB',
      storage: '128GB',
      display: '12.9" Liquid Retina XDR',
    },
    sellerId: 'seller-apple',
    createdAt: '2024-01-05T16:30:00Z',
    updatedAt: '2024-01-05T16:30:00Z',
    discount: 15,
    subcategory: 'Tablets'
  },
  {
    id: 3,
    name: 'Surface Laptop 5',
    price: 899.99,
    originalPrice: 1099,
    currency: '৳',
    image: '/common/allproduct/product8.png',
    rating: 4,
    reviews: 34,
    isVerifiedSeller: true,
    category: 'Electronics',
    brand: 'Microsoft',
    sizes: ['L', 'XL'],
    description: 'Premium laptop with touchscreen, all-day battery life, and Windows 11.',
    colors: ['Platinum', 'Matte Black', 'Sage'],
    inStock: true,
    seller: 'Microsoft Store',
    tags: ['laptop', 'microsoft', 'surface', 'touchscreen', 'windows', 'premium'],
    sku: 'SL5-007',
    stock: 14,
    isActive: true,
    specifications: {
      processor: 'Intel Core i7',
      memory: '16GB',
      storage: '512GB SSD',
      display: '13.5" PixelSense Touch',
    },
    sellerId: 'seller-microsoft',
    createdAt: '2024-01-04T11:45:00Z',
    updatedAt: '2024-01-04T11:45:00Z',
    discount: 18,
    subcategory: 'Computers'
  },
  {
    id: 4,
    name: 'MacBook Air M2',
    price: 999.99,
    originalPrice: 1199,
    currency: '৳',
    image: '/common/allproduct/product9.png',
    rating: 5,
    reviews: 123,
    isVerifiedSeller: true,
    category: 'Electronics',
    brand: 'Apple',
    sizes: ['M', 'L'],
    description: 'Ultra-thin and light laptop with M2 chip, all-day battery life, and stunning Liquid Retina display.',
    colors: ['Space Gray', 'Silver', 'Starlight', 'Midnight'],
    inStock: true,
    seller: 'Apple Store',
    tags: ['macbook', 'apple', 'air', 'm2', 'ultrabook', 'lightweight'],
    sku: 'MBA-M2-008',
    stock: 25,
    isActive: true,
    specifications: {
      processor: 'Apple M2',
      memory: '8GB',
      storage: '256GB SSD',
      display: '13.6" Liquid Retina',
    },
    sellerId: 'seller-apple',
    createdAt: '2024-01-03T13:20:00Z',
    updatedAt: '2024-01-03T13:20:00Z',
    discount: 17,
    subcategory: 'Computers'
  },
  {
    id: 5,
    name: 'Nike Air Max 270',
    price: 149.99,
    originalPrice: 199,
    currency: '৳',
    image: '/common/allproduct/product10.png',
    rating: 4,
    reviews: 89,
    isVerifiedSeller: true,
    category: 'Fashion',
    brand: 'Nike',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Comfortable running shoes with Max Air cushioning and breathable upper.',
    colors: ['Black', 'White', 'Red', 'Blue'],
    inStock: true,
    seller: 'Nike Store',
    tags: ['nike', 'shoes', 'running', 'air-max', 'sneakers', 'athletic'],
    sku: 'NAM270-009',
    stock: 40,
    isActive: true,
    specifications: {
      cushioning: 'Max Air',
      upper: 'Mesh',
      sole: 'Rubber',
      weight: '320g',
    },
    sellerId: 'seller-nike',
    createdAt: '2024-01-02T09:30:00Z',
    updatedAt: '2024-01-02T09:30:00Z',
    discount: 25,
    subcategory: 'Footwear'
  },
  {
    id: 6,
    name: 'Adidas Ultraboost 22',
    price: 179.99,
    originalPrice: 229,
    currency: '৳',
    image: '/common/allproduct/product11.png',
    rating: 5,
    reviews: 156,
    isVerifiedSeller: true,
    category: 'Fashion',
    brand: 'Adidas',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'High-performance running shoes with Boost midsole and Primeknit upper.',
    colors: ['Black', 'White', 'Core Black'],
    inStock: true,
    seller: 'Adidas Store',
    tags: ['adidas', 'ultraboost', 'running', 'boost', 'primeknit', 'athletic'],
    sku: 'AUB22-010',
    stock: 32,
    isActive: true,
    specifications: {
      midsole: 'Boost',
      upper: 'Primeknit',
      sole: 'Continental Rubber',
      weight: '310g',
    },
    sellerId: 'seller-adidas',
    createdAt: '2024-01-01T15:45:00Z',
    updatedAt: '2024-01-01T15:45:00Z',
    discount: 21,
    subcategory: 'Footwear'
  },
  {
    id: 7,
    name: 'Nike Dri-FIT T-Shirt',
    price: 29.99,
    originalPrice: 39,
    currency: '৳',
    image: '/common/allproduct/product12.png',
    rating: 4,
    reviews: 67,
    isVerifiedSeller: true,
    category: 'Fashion',
    brand: 'Nike',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Moisture-wicking t-shirt perfect for workouts and everyday wear.',
    colors: ['Black', 'White', 'Gray', 'Navy'],
    inStock: true,
    seller: 'Nike Store',
    tags: ['nike', 't-shirt', 'dri-fit', 'moisture-wicking', 'athletic', 'casual'],
    sku: 'NDFT-011',
    stock: 60,
    isActive: true,
    specifications: {
      material: 'Dri-FIT',
      care: 'Machine wash',
      fit: 'Regular',
      weight: '150g',
    },
    sellerId: 'seller-nike',
    createdAt: '2023-12-31T12:00:00Z',
    updatedAt: '2023-12-31T12:00:00Z',
    discount: 23,
    subcategory: 'Tops'
  },
  {
    id: 8,
    name: 'Adidas Originals Hoodie',
    price: 79.99,
    originalPrice: 99,
    currency: '৳',
    image: '/common/allproduct/product13.png',
    rating: 5,
    reviews: 123,
    isVerifiedSeller: true,
    category: 'Fashion',
    brand: 'Adidas',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    description: 'Classic hoodie with three stripes and comfortable fleece lining.',
    colors: ['Black', 'White', 'Gray', 'Navy'],
    inStock: true,
    seller: 'Adidas Store',
    tags: ['adidas', 'hoodie', 'originals', 'three-stripes', 'casual', 'warm'],
    sku: 'AOH-012',
    stock: 45,
    isActive: true,
    specifications: {
      material: 'Cotton/Polyester',
      lining: 'Fleece',
      care: 'Machine wash',
      weight: '450g',
    },
    sellerId: 'seller-adidas',
    createdAt: '2023-12-30T14:15:00Z',
    updatedAt: '2023-12-30T14:15:00Z',
    discount: 19,
    subcategory: 'Outerwear'
  },
  {
    id: 9,
    name: 'Nike Basketball Shorts',
    price: 39.99,
    originalPrice: 49,
    currency: '৳',
    image: '/common/allproduct/product14.png',
    rating: 4,
    reviews: 45,
    isVerifiedSeller: true,
    category: 'Fashion',
    brand: 'Nike',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Performance basketball shorts with Dri-FIT technology.',
    colors: ['Black', 'White', 'Red', 'Blue'],
    inStock: true,
    seller: 'Nike Store',
    tags: ['nike', 'shorts', 'basketball', 'dri-fit', 'athletic', 'performance'],
    sku: 'NBS-013',
    stock: 38,
    isActive: true,
    specifications: {
      material: 'Dri-FIT',
      length: '7"',
      care: 'Machine wash',
      weight: '200g',
    },
    sellerId: 'seller-nike',
    createdAt: '2023-12-29T16:30:00Z',
    updatedAt: '2023-12-29T16:30:00Z',
    discount: 18,
    subcategory: 'Bottoms'
  },
  {
    id: 10,
    name: 'Adidas Running Jacket',
    price: 89.99,
    originalPrice: 119,
    currency: '৳',
    image: '/common/allproduct/product15.png',
    rating: 5,
    reviews: 78,
    isVerifiedSeller: true,
    category: 'Fashion',
    brand: 'Adidas',
    sizes: ['M', 'L', 'XL', '2XL'],
    description: 'Lightweight running jacket with windproof and water-resistant features.',
    colors: ['Black', 'White', 'Gray', 'Blue'],
    inStock: true,
    seller: 'Adidas Store',
    tags: ['adidas', 'jacket', 'running', 'windproof', 'water-resistant', 'athletic'],
    sku: 'ARJ-014',
    stock: 28,
    isActive: true,
    specifications: {
      material: 'Polyester',
      features: 'Windproof, Water-resistant',
      care: 'Machine wash',
      weight: '300g',
    },
    sellerId: 'seller-adidas',
    createdAt: '2023-12-28T10:45:00Z',
    updatedAt: '2023-12-28T10:45:00Z',
    discount: 24,
    subcategory: 'Outerwear'
  },
  {
    id: 11,
    name: 'Smart Garden Kit',
    price: 199.99,
    originalPrice: 249,
    currency: '৳',
    image: '/common/allproduct/product16.png',
    rating: 4,
    reviews: 34,
    isVerifiedSeller: true,
    category: 'Home & Garden',
    brand: 'SmartHome',
    sizes: ['M', 'L'],
    description: 'Automated indoor garden system with LED grow lights and smart watering.',
    colors: ['White', 'Black'],
    inStock: true,
    seller: 'Smart Home Store',
    tags: ['smart-garden', 'indoor-garden', 'led-lights', 'automated', 'home', 'gardening'],
    sku: 'SGK-015',
    stock: 15,
    isActive: true,
    specifications: {
      lights: 'LED Grow Lights',
      watering: 'Automated',
      capacity: '12 plants',
      power: 'USB-C',
    },
    sellerId: 'seller-smarthome',
    createdAt: '2023-12-27T13:20:00Z',
    updatedAt: '2023-12-27T13:20:00Z',
    discount: 20,
    subcategory: 'Garden'
  },
  {
    id: 12,
    name: 'Robot Vacuum Cleaner',
    price: 299.99,
    originalPrice: 399,
    currency: '৳',
    image: '/common/allproduct/product17.png',
    rating: 5,
    reviews: 89,
    isVerifiedSeller: true,
    category: 'Home & Garden',
    brand: 'RoboClean',
    sizes: ['L', 'XL'],
    description: 'Smart robot vacuum with mapping technology and powerful suction.',
    colors: ['Black', 'White'],
    inStock: true,
    seller: 'Smart Home Store',
    tags: ['robot-vacuum', 'smart-home', 'mapping', 'automated', 'cleaning', 'wi-fi'],
    sku: 'RVC-016',
    stock: 12,
    isActive: true,
    specifications: {
      suction: '2000Pa',
      battery: '2.5 hours',
      mapping: 'LIDAR',
      connectivity: 'Wi-Fi',
    },
    sellerId: 'seller-smarthome',
    createdAt: '2023-12-26T11:30:00Z',
    updatedAt: '2023-12-26T11:30:00Z',
    discount: 25,
    subcategory: 'Cleaning'
  },
  {
    id: 13,
    name: 'Smart LED Strip Lights',
    price: 49.99,
    originalPrice: 69,
    currency: '৳',
    image: '/common/allproduct/product18.png',
    rating: 4,
    reviews: 156,
    isVerifiedSeller: true,
    category: 'Home & Garden',
    brand: 'SmartLight',
    sizes: ['M', 'L'],
    description: 'WiFi-enabled LED strip lights with millions of colors and smart home integration.',
    colors: ['White', 'RGB'],
    inStock: true,
    seller: 'Smart Home Store',
    tags: ['led-strips', 'smart-lighting', 'rgb', 'wi-fi', 'home-automation', 'colors'],
    sku: 'SLS-017',
    stock: 50,
    isActive: true,
    specifications: {
      length: '5m',
      colors: '16.7 million',
      connectivity: 'Wi-Fi',
      power: '12V',
    },
    sellerId: 'seller-smarthome',
    createdAt: '2023-12-25T15:45:00Z',
    updatedAt: '2023-12-25T15:45:00Z',
    discount: 28,
    subcategory: 'Lighting'
  },
  {
    id: 14,
    name: 'Indoor Plant Pot Set',
    price: 39.99,
    originalPrice: 59,
    currency: '৳',
    image: '/common/allproduct/product19.png',
    rating: 5,
    reviews: 67,
    isVerifiedSeller: true,
    category: 'Home & Garden',
    brand: 'GardenPro',
    sizes: ['S', 'M', 'L'],
    description: 'Modern ceramic plant pots with drainage holes and saucers.',
    colors: ['White', 'Gray', 'Terracotta'],
    inStock: true,
    seller: 'Garden Store',
    tags: ['plant-pots', 'ceramic', 'indoor-plants', 'drainage', 'modern', 'home'],
    sku: 'IPP-018',
    stock: 35,
    isActive: true,
    specifications: {
      material: 'Ceramic',
      drainage: 'Yes',
      saucers: 'Included',
      finish: 'Glazed',
    },
    sellerId: 'seller-garden',
    createdAt: '2023-12-24T09:15:00Z',
    updatedAt: '2023-12-24T09:15:00Z',
    discount: 32,
    subcategory: 'Planters'
  },
  {
    id: 15,
    name: 'Yoga Mat Premium',
    price: 59.99,
    originalPrice: 79,
    currency: '৳',
    image: '/common/allproduct/product20.png',
    rating: 4,
    reviews: 123,
    isVerifiedSeller: true,
    category: 'Sports',
    brand: 'YogaPro',
    sizes: ['M', 'L'],
    description: 'Non-slip yoga mat with excellent grip and cushioning for all yoga practices.',
    colors: ['Purple', 'Blue', 'Pink', 'Gray'],
    inStock: true,
    seller: 'Sports Store',
    tags: ['yoga-mat', 'non-slip', 'premium', 'fitness', 'yoga', 'exercise'],
    sku: 'YM-019',
    stock: 42,
    isActive: true,
    specifications: {
      thickness: '6mm',
      material: 'TPE',
      grip: 'Non-slip',
      weight: '1.2kg',
    },
    sellerId: 'seller-sports',
    createdAt: '2023-12-23T14:30:00Z',
    updatedAt: '2023-12-23T14:30:00Z',
    discount: 24,
    subcategory: 'Fitness'
  },
  {
    id: 16,
    name: 'Dumbbell Set 20kg',
    price: 149.99,
    originalPrice: 199,
    currency: '৳',
    image: '/common/allproduct/product21.png',
    rating: 5,
    reviews: 89,
    isVerifiedSeller: true,
    category: 'Sports',
    brand: 'FitPro',
    sizes: ['L', 'XL'],
    description: 'Adjustable dumbbell set with multiple weight options for home workouts.',
    colors: ['Black', 'Silver'],
    inStock: true,
    seller: 'Sports Store',
    tags: ['dumbbells', 'weights', 'home-gym', 'fitness', 'strength-training', 'adjustable'],
    sku: 'DS20-020',
    stock: 18,
    isActive: true,
    specifications: {
      weight: '20kg total',
      plates: 'Adjustable',
      material: 'Cast Iron',
      grip: 'Rubber',
    },
    sellerId: 'seller-sports',
    createdAt: '2023-12-22T12:00:00Z',
    updatedAt: '2023-12-22T12:00:00Z',
    discount: 25,
    subcategory: 'Strength'
  }
];

/**
 * Get product by ID
 */
export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

/**
 * Get products by category
 */
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

/**
 * Get products by brand
 */
export const getProductsByBrand = (brand: string): Product[] => {
  return products.filter(product => product.brand === brand);
};

/**
 * Search products by name
 */
export const searchProducts = (query: string): Product[] => {
  return products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase())
  );
};

/**
 * Get featured products (first 4 products)
 */
export const getFeaturedProducts = (): Product[] => {
  return products.slice(0, 4);
};

/**
 * Get best selling products (products 5-8)
 */
export const getBestSellingProducts = (): Product[] => {
  return products.slice(4, 8);
};

/**
 * Get "For You" products (products 9-12)
 */
export const getForYouProducts = (): Product[] => {
  return products.slice(8, 12);
};
