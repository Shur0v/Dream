/**
 * @fileoverview Utility functions for class name merging and common operations
 * Provides utility functions for styling, formatting, and common operations
 * 
 * @description This file contains:
 * - Class name merging utilities
 * - Price formatting functions
 * - Date formatting utilities
 * - Validation helpers
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper conflict resolution
 * 
 * @description Combines clsx for conditional classes and tailwind-merge for conflict resolution
 * Ensures proper Tailwind CSS class precedence and removes duplicates
 * 
 * @param inputs - Class values to merge
 * @returns Merged class string
 * 
 * @example
 * ```tsx
 * cn('px-2 py-1', 'px-4', { 'bg-red-500': isError })
 * // Returns: 'py-1 px-4 bg-red-500' (px-2 is overridden by px-4)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price with currency symbol and proper decimal places
 * 
 * @description Formats numbers as currency with proper localization
 * Handles different currencies and decimal precision
 * 
 * @param amount - Price amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted price string
 * 
 * @example
 * ```tsx
 * formatPrice(1234.56) // Returns: '$1,234.56'
 * formatPrice(1234.56, 'EUR', 'de-DE') // Returns: '1.234,56 €'
 * ```
 */
export function formatPrice(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date with proper localization
 * 
 * @description Formats dates with customizable options
 * Provides consistent date formatting across the application
 * 
 * @param date - Date to format (string, Date, or timestamp)
 * @param options - Intl.DateTimeFormatOptions
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string
 * 
 * @example
 * ```tsx
 * formatDate(new Date()) // Returns: '12/25/2023'
 * formatDate(new Date(), { dateStyle: 'full' }) // Returns: 'Monday, December 25, 2023'
 * ```
 */
export function formatDate(
  date: string | Date | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'short' },
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Generate unique ID for components
 * 
 * @description Creates unique identifiers for React components
 * Uses timestamp and random number for uniqueness
 * 
 * @param prefix - Optional prefix for the ID
 * @returns Unique ID string
 * 
 * @example
 * ```tsx
 * generateId() // Returns: 'id_1703001234567_abc123'
 * generateId('product') // Returns: 'product_1703001234567_abc123'
 * ```
 */
export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Validate email format
 * 
 * @description Checks if email address has valid format
 * Uses regex pattern for email validation
 * 
 * @param email - Email address to validate
 * @returns Boolean indicating if email is valid
 * 
 * @example
 * ```tsx
 * isValidEmail('user@example.com') // Returns: true
 * isValidEmail('invalid-email') // Returns: false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * 
 * @description Checks password strength based on common criteria
 * Ensures password meets security requirements
 * 
 * @param password - Password to validate
 * @returns Object with validation result and message
 * 
 * @example
 * ```tsx
 * validatePassword('password123') 
 * // Returns: { isValid: true, message: 'Password is strong' }
 * ```
 */
export function validatePassword(password: string): { isValid: boolean; message: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  return { isValid: true, message: 'Password is strong' };
}

/**
 * Debounce function for performance optimization
 * 
 * @description Delays function execution until after specified time has passed
 * Useful for search inputs and API calls to prevent excessive requests
 * 
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 * 
 * @example
 * ```tsx
 * const debouncedSearch = debounce((query) => {
 *   // API call
 * }, 300);
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Truncate text with ellipsis
 * 
 * @description Truncates text to specified length with ellipsis
 * Useful for product descriptions and titles
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text with ellipsis
 * 
 * @example
 * ```tsx
 * truncateText('This is a very long text', 10) 
 * // Returns: 'This is a...'
 * ```
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Calculate discount percentage
 * 
 * @description Calculates discount percentage between original and sale price
 * Useful for displaying discount badges
 * 
 * @param originalPrice - Original price
 * @param salePrice - Sale price
 * @returns Discount percentage rounded to nearest integer
 * 
 * @example
 * ```tsx
 * calculateDiscount(100, 80) // Returns: 20
 * calculateDiscount(50, 50) // Returns: 0
 * ```
 */
export function calculateDiscount(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice >= originalPrice) return 0;
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}
