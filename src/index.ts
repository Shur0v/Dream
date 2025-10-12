/**
 * @fileoverview Main export file for easy component imports
 * Provides centralized exports for all components and utilities
 * 
 * @description This file exports:
 * - All UI components
 * - Layout components
 * - Product components
 * - Utility functions
 * - Custom hooks
 * - API services
 * 
 * @author Your Name
 * @version 1.0.0
 */

// UI Components
export { default as Button } from './components/ui/Button';
export { default as Input } from './components/ui/Input';
export { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './components/ui/Card';

// Layout Components
export { default as Header } from './components/layout/Header';
export { default as Footer } from './components/layout/Footer';
export { default as MainLayout } from './components/layout/MainLayout';

// Product Components
export { default as ProductCard } from './components/product/ProductCard';

// Auth Pages
export { default as LoginPage } from './pages/auth/LoginPage';
export { default as RegisterPage } from './pages/auth/RegisterPage';

// Redux Store
export { store, persistor } from './app/store';
export { default as ReduxProvider } from './app/ReduxProvider';

// Redux Slices
export { default as authSlice } from './features/auth/authSlice';
export { default as cartSlice } from './features/cart/cartSlice';
export { default as productsSlice } from './features/products/productsSlice';
export { default as userSlice } from './features/user/userSlice';
export { default as wishlistSlice } from './features/wishlist/wishlistSlice';
export { default as ordersSlice } from './features/orders/ordersSlice';

// Custom Hooks
export { useApi, useForm, useLocalStorage, useDebounce, useIntersectionObserver } from './hooks';

// API Service
export { default as apiService } from './services/api';

// Utilities
export { cn, formatPrice, formatDate, generateId, isValidEmail, validatePassword, debounce, truncateText, calculateDiscount } from './lib/utils';

// Types
export type {
  User,
  Product,
  CartItem,
  Cart,
  Order,
  OrderItem,
  WishlistItem,
  Wishlist,
  UserRole,
  OrderStatus,
  ApiResponse,
  PaginatedResponse,
  ProductFilters,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RootState,
  AuthState,
  CartState,
  ProductsState,
  UserState,
  WishlistState,
  OrdersState,
} from './types';

// Dummy Data
export { sampleProducts, sampleUsers, sampleCartItems, sampleWishlistItems, sampleOrders, categories } from './lib/dummyData';
