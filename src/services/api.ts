/**
 * @fileoverview API service functions for making HTTP requests
 * Provides centralized API communication with proper error handling
 * 
 * @description This file contains:
 * - Base API configuration
 * - Authentication helpers
 * - CRUD operations for all entities
 * - Error handling and response formatting
 * 
 * @author Your Name
 * @version 1.0.0
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse, Product, User, CartItem, Order, WishlistItem } from '../types';

/**
 * Base API configuration
 * 
 * @description Sets up axios instance with:
 * - Base URL configuration
 * - Request/response interceptors
 * - Error handling
 * - Authentication headers
 */
class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   * 
   * @description Handles:
   * - Adding authentication tokens
   * - Request/response logging
   * - Error handling and formatting
   */
  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearAuthToken();
          window.location.href = '/auth/login';
        }
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Get authentication token from localStorage
   * 
   * @returns JWT token or null
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  /**
   * Clear authentication token from localStorage
   */
  private clearAuthToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }

  /**
   * Format API error for consistent error handling
   * 
   * @param error - Axios error object
   * @returns Formatted error message
   */
  private formatError(error: any): string {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  // Authentication API methods

  /**
   * Login user with email and password
   * 
   * @param credentials - Login credentials
   * @returns Promise with authentication response
   */
  async login(credentials: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string; refreshToken: string }>> {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  /**
   * Register new user
   * 
   * @param userData - User registration data
   * @returns Promise with registration response
   */
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    phone?: string;
  }): Promise<ApiResponse<{ user: User; token: string; refreshToken: string }>> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  /**
   * Get current user data
   * 
   * @returns Promise with user data
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  /**
   * Logout user
   * 
   * @returns Promise with logout response
   */
  async logout(): Promise<ApiResponse<null>> {
    const response = await this.api.post('/auth/logout');
    this.clearAuthToken();
    return response.data;
  }

  // Products API methods

  /**
   * Get products list with filtering and pagination
   * 
   * @param params - Query parameters
   * @returns Promise with products list
   */
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Product>> {
    const response = await this.api.get('/products', { params });
    return response.data;
  }

  /**
   * Get single product by ID
   * 
   * @param id - Product ID
   * @returns Promise with product data
   */
  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await this.api.get(`/products/${id}`);
    return response.data;
  }

  /**
   * Create new product (seller/admin only)
   * 
   * @param productData - Product data
   * @returns Promise with created product
   */
  async createProduct(productData: Partial<Product>): Promise<ApiResponse<Product>> {
    const response = await this.api.post('/products', productData);
    return response.data;
  }

  /**
   * Update product (seller/admin only)
   * 
   * @param id - Product ID
   * @param productData - Updated product data
   * @returns Promise with updated product
   */
  async updateProduct(id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    const response = await this.api.put(`/products/${id}`, productData);
    return response.data;
  }

  /**
   * Delete product (admin only)
   * 
   * @param id - Product ID
   * @returns Promise with deletion response
   */
  async deleteProduct(id: string): Promise<ApiResponse<null>> {
    const response = await this.api.delete(`/products/${id}`);
    return response.data;
  }

  // Cart API methods

  /**
   * Get user's cart
   * 
   * @returns Promise with cart data
   */
  async getCart(): Promise<ApiResponse<{ items: CartItem[]; totalItems: number; totalPrice: number }>> {
    const response = await this.api.get('/cart');
    return response.data;
  }

  /**
   * Add item to cart
   * 
   * @param productId - Product ID
   * @param quantity - Quantity to add
   * @returns Promise with updated cart
   */
  async addToCart(productId: string, quantity: number = 1): Promise<ApiResponse<{ items: CartItem[]; totalItems: number; totalPrice: number }>> {
    const response = await this.api.post('/cart', { productId, quantity });
    return response.data;
  }

  /**
   * Update cart item quantity
   * 
   * @param productId - Product ID
   * @param quantity - New quantity
   * @returns Promise with updated cart
   */
  async updateCartItem(productId: string, quantity: number): Promise<ApiResponse<{ items: CartItem[]; totalItems: number; totalPrice: number }>> {
    const response = await this.api.put('/cart', { productId, quantity });
    return response.data;
  }

  /**
   * Remove item from cart
   * 
   * @param productId - Product ID
   * @returns Promise with updated cart
   */
  async removeFromCart(productId: string): Promise<ApiResponse<{ items: CartItem[]; totalItems: number; totalPrice: number }>> {
    const response = await this.api.delete(`/cart?productId=${productId}`);
    return response.data;
  }

  /**
   * Clear entire cart
   * 
   * @returns Promise with empty cart
   */
  async clearCart(): Promise<ApiResponse<{ items: CartItem[]; totalItems: number; totalPrice: number }>> {
    const response = await this.api.delete('/cart/clear');
    return response.data;
  }

  // Wishlist API methods

  /**
   * Get user's wishlist
   * 
   * @returns Promise with wishlist data
   */
  async getWishlist(): Promise<ApiResponse<WishlistItem[]>> {
    const response = await this.api.get('/wishlist');
    return response.data;
  }

  /**
   * Add item to wishlist
   * 
   * @param productId - Product ID
   * @returns Promise with updated wishlist
   */
  async addToWishlist(productId: string): Promise<ApiResponse<WishlistItem[]>> {
    const response = await this.api.post('/wishlist', { productId });
    return response.data;
  }

  /**
   * Remove item from wishlist
   * 
   * @param productId - Product ID
   * @returns Promise with updated wishlist
   */
  async removeFromWishlist(productId: string): Promise<ApiResponse<WishlistItem[]>> {
    const response = await this.api.delete(`/wishlist?productId=${productId}`);
    return response.data;
  }

  // Orders API methods

  /**
   * Get user's orders
   * 
   * @returns Promise with orders list
   */
  async getOrders(): Promise<ApiResponse<Order[]>> {
    const response = await this.api.get('/orders');
    return response.data;
  }

  /**
   * Get single order by ID
   * 
   * @param id - Order ID
   * @returns Promise with order data
   */
  async getOrder(id: string): Promise<ApiResponse<Order>> {
    const response = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  /**
   * Create new order
   * 
   * @param orderData - Order data
   * @returns Promise with created order
   */
  async createOrder(orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    const response = await this.api.post('/orders', orderData);
    return response.data;
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
