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
}

export const products: Product[] = [
  {
    id: 1,
    name: 'MacBook Pro 16-inch M3',
    price: 809.99,
    originalPrice: 1000,
    currency: '৳',
    image: '/common/allproduct/product1.png',
    rating: 5,
    reviews: 7,
    isVerifiedSeller: true,
    category: 'Electronics',
    brand: 'Apple',
    sizes: ['L', 'XL'],
    description: 'The most powerful MacBook Pro ever with M3 chip, featuring incredible performance and all-day battery life.',
    colors: ['Space Gray', 'Silver'],
    inStock: true,
    seller: 'Apple Store'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    price: 1299.99,
    originalPrice: 1500,
    currency: '৳',
    image: '/common/allproduct/product2.png',
    rating: 4,
    reviews: 23,
    isVerifiedSeller: true,
    category: 'Electronics',
    brand: 'Samsung',
    sizes: ['M', 'L'],
    description: 'The ultimate smartphone with advanced AI features, professional-grade camera, and S Pen.',
    colors: ['Titanium Black', 'Titanium Gray', 'Titanium Violet'],
    inStock: true,
    seller: 'Samsung Store'
  },
  {
    id: 3,
    name: 'Sony WH-1000XM5',
    price: 399.99,
    originalPrice: 499,
    currency: '৳',
    image: '/common/allproduct/product3.png',
    rating: 5,
    reviews: 156,
    isVerifiedSeller: true,
    category: 'Electronics',
    brand: 'Sony',
    sizes: ['S', 'M', 'L'],
    description: 'Industry-leading noise canceling wireless headphones with exceptional sound quality.',
    colors: ['Black', 'Silver'],
    inStock: true,
    seller: 'Sony Store'
  },
  {
    id: 4,
    name: 'iPhone 15 Pro Max',
    price: 1199.99,
    originalPrice: 1399,
    currency: '৳',
    image: '/common/allproduct/product4.png',
    rating: 5,
    reviews: 89,
    isVerifiedSeller: true,
    category: 'Electronics',
    brand: 'Apple',
    sizes: ['M', 'L'],
    description: 'The most advanced iPhone with titanium design, A17 Pro chip, and professional camera system.',
    colors: ['Natural Titanium', 'Blue Titanium', 'White Titanium', 'Black Titanium'],
    inStock: true,
    seller: 'Apple Store'
  },
  {
    id: 5,
    name: 'Dell XPS 13',
    price: 999.99,
    originalPrice: 1199,
    currency: '৳',
    image: '/common/allproduct/product5.png',
    rating: 4,
    reviews: 45,
    isVerifiedSeller: true,
    category: 'Electronics',
    brand: 'Samsung',
    sizes: ['L', 'XL'],
    description: 'Ultra-thin laptop with stunning display and powerful performance for professionals.',
    colors: ['Platinum Silver', 'Frost White'],
    inStock: true,
    seller: 'Dell Store'
  },
  {
    id: 6,
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
    seller: 'Apple Store'
  },
  {
    id: 7,
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
    seller: 'Apple Store'
  },
  {
    id: 8,
    name: 'Surface Laptop 5',
    price: 899.99,
    originalPrice: 1099,
    currency: '৳',
    image: '/common/allproduct/product8.png',
    rating: 4,
    reviews: 34,
    isVerifiedSeller: true,
    category: 'Electronics',
    brand: 'Samsung',
    sizes: ['L', 'XL'],
    description: 'Premium laptop with touchscreen, all-day battery life, and Windows 11.',
    colors: ['Platinum', 'Matte Black', 'Sage'],
    inStock: true,
    seller: 'Microsoft Store'
  },
  {
    id: 9,
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
    seller: 'Apple Store'
  },
  {
    id: 10,
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
    seller: 'Nike Store'
  },
  {
    id: 11,
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
    seller: 'Adidas Store'
  },
  {
    id: 12,
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
    seller: 'Nike Store'
  },
  {
    id: 13,
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
    seller: 'Adidas Store'
  },
  {
    id: 14,
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
    seller: 'Nike Store'
  },
  {
    id: 15,
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
    seller: 'Adidas Store'
  },
  {
    id: 16,
    name: 'Smart Garden Kit',
    price: 199.99,
    originalPrice: 249,
    currency: '৳',
    image: '/common/allproduct/product16.png',
    rating: 4,
    reviews: 34,
    isVerifiedSeller: true,
    category: 'Home & Garden',
    brand: 'Samsung',
    sizes: ['M', 'L'],
    description: 'Automated indoor garden system with LED grow lights and smart watering.',
    colors: ['White', 'Black'],
    inStock: true,
    seller: 'Smart Home Store'
  },
  {
    id: 17,
    name: 'Robot Vacuum Cleaner',
    price: 299.99,
    originalPrice: 399,
    currency: '৳',
    image: '/common/allproduct/product17.png',
    rating: 5,
    reviews: 89,
    isVerifiedSeller: true,
    category: 'Home & Garden',
    brand: 'Sony',
    sizes: ['L', 'XL'],
    description: 'Smart robot vacuum with mapping technology and powerful suction.',
    colors: ['Black', 'White'],
    inStock: true,
    seller: 'Smart Home Store'
  },
  {
    id: 18,
    name: 'Smart LED Strip Lights',
    price: 49.99,
    originalPrice: 69,
    currency: '৳',
    image: '/common/allproduct/product18.png',
    rating: 4,
    reviews: 156,
    isVerifiedSeller: true,
    category: 'Home & Garden',
    brand: 'Samsung',
    sizes: ['M', 'L'],
    description: 'WiFi-enabled LED strip lights with millions of colors and smart home integration.',
    colors: ['White', 'RGB'],
    inStock: true,
    seller: 'Smart Home Store'
  },
  {
    id: 19,
    name: 'Indoor Plant Pot Set',
    price: 39.99,
    originalPrice: 59,
    currency: '৳',
    image: '/common/allproduct/product19.png',
    rating: 5,
    reviews: 67,
    isVerifiedSeller: true,
    category: 'Home & Garden',
    brand: 'Sony',
    sizes: ['S', 'M', 'L'],
    description: 'Modern ceramic plant pots with drainage holes and saucers.',
    colors: ['White', 'Gray', 'Terracotta'],
    inStock: true,
    seller: 'Garden Store'
  },
  {
    id: 20,
    name: 'Yoga Mat Premium',
    price: 59.99,
    originalPrice: 79,
    currency: '৳',
    image: '/common/allproduct/product20.png',
    rating: 4,
    reviews: 123,
    isVerifiedSeller: true,
    category: 'Sports',
    brand: 'Nike',
    sizes: ['M', 'L'],
    description: 'Non-slip yoga mat with excellent grip and cushioning for all yoga practices.',
    colors: ['Purple', 'Blue', 'Pink', 'Gray'],
    inStock: true,
    seller: 'Sports Store'
  },
  {
    id: 21,
    name: 'Dumbbell Set 20kg',
    price: 149.99,
    originalPrice: 199,
    currency: '৳',
    image: '/common/allproduct/product21.png',
    rating: 5,
    reviews: 89,
    isVerifiedSeller: true,
    category: 'Sports',
    brand: 'Adidas',
    sizes: ['L', 'XL'],
    description: 'Adjustable dumbbell set with multiple weight options for home workouts.',
    colors: ['Black', 'Silver'],
    inStock: true,
    seller: 'Sports Store'
  },
  {
    id: 22,
    name: 'Resistance Bands Set',
    price: 29.99,
    originalPrice: 39,
    currency: '৳',
    image: '/common/allproduct/product22.png',
    rating: 4,
    reviews: 67,
    isVerifiedSeller: true,
    category: 'Sports',
    brand: 'Nike',
    sizes: ['S', 'M', 'L'],
    description: 'Complete resistance band set with different resistance levels and accessories.',
    colors: ['Black', 'Blue', 'Red', 'Green'],
    inStock: true,
    seller: 'Sports Store'
  },
  {
    id: 23,
    name: 'JavaScript Complete Guide',
    price: 49.99,
    originalPrice: 69,
    currency: '৳',
    image: '/common/allproduct/product23.png',
    rating: 5,
    reviews: 234,
    isVerifiedSeller: true,
    category: 'Books',
    brand: 'Samsung',
    sizes: ['M'],
    description: 'Comprehensive guide to JavaScript programming with modern ES6+ features.',
    colors: ['N/A'],
    inStock: true,
    seller: 'Book Store'
  },
  {
    id: 24,
    name: 'React Development Handbook',
    price: 39.99,
    originalPrice: 59,
    currency: '৳',
    image: '/common/allproduct/product24.png',
    rating: 4,
    reviews: 156,
    isVerifiedSeller: true,
    category: 'Books',
    brand: 'Sony',
    sizes: ['M'],
    description: 'Complete guide to React development with hooks, context, and best practices.',
    colors: ['N/A'],
    inStock: true,
    seller: 'Book Store'
  },
  {
    id: 25,
    name: 'Python Programming Master',
    price: 59.99,
    originalPrice: 79,
    currency: '৳',
    image: '/common/allproduct/product25.png',
    rating: 5,
    reviews: 189,
    isVerifiedSeller: true,
    category: 'Books',
    brand: 'Samsung',
    sizes: ['M'],
    description: 'Master Python programming from basics to advanced concepts and frameworks.',
    colors: ['N/A'],
    inStock: true,
    seller: 'Book Store'
  },
  {
    id: 26,
    name: 'Wireless Gaming Mouse',
    price: 79.99,
    originalPrice: 99,
    currency: '৳',
    image: '/common/allproduct/product26.png',
    rating: 4,
    reviews: 145,
    isVerifiedSeller: true,
    category: 'Electronics',
    brand: 'Sony',
    sizes: ['M', 'L'],
    description: 'High-precision wireless gaming mouse with customizable RGB lighting.',
    colors: ['Black', 'White'],
    inStock: true,
    seller: 'Gaming Store'
  },
  {
    id: 27,
    name: 'Bluetooth Speaker Pro',
    price: 129.99,
    originalPrice: 159,
    currency: '৳',
    image: '/common/allproduct/product27.png',
    rating: 5,
    reviews: 203,
    isVerifiedSeller: true,
    category: 'Electronics',
    brand: 'Samsung',
    sizes: ['M', 'L'],
    description: 'Premium Bluetooth speaker with 360-degree sound and waterproof design.',
    colors: ['Black', 'White', 'Blue'],
    inStock: true,
    seller: 'Audio Store'
  },
  {
    id: 28,
    name: 'Smart Fitness Watch',
    price: 199.99,
    originalPrice: 249,
    currency: '৳',
    image: '/common/allproduct/product28.png',
    rating: 5,
    reviews: 167,
    isVerifiedSeller: true,
    category: 'Electronics',
    brand: 'Apple',
    sizes: ['S', 'M', 'L'],
    description: 'Advanced fitness watch with health monitoring, GPS, and water resistance.',
    colors: ['Space Gray', 'Silver', 'Gold'],
    inStock: true,
    seller: 'Apple Store'
  },
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
