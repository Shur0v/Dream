/**
 * Admin Dashboard IndexedDB Cache
 * 
 * Specialized cache for admin dashboard data (orders, stats, products)
 * Provides instant loading from cache with background updates
 */

import { getCachedResponse } from './apiCache';
import apiCacheDB from './apiCache';
import { getApiUrl } from '@/lib/apiConfig';

// Cache TTL: 24 hours for admin data (longer than client-side)
const ADMIN_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get admin orders from cache or API
 * Returns cached data instantly, updates in background
 */
export async function getAdminOrders(options: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
} = {}): Promise<{ success: boolean; data: any[]; pagination?: any; error?: string }> {
  const { page = 1, limit = 1000, sortBy = 'createdAt', sortOrder = 'desc' } = options;
  
  const cacheKey = getApiUrl(`admin/orders?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
  
  // Try cache first (instant)
  const cachedData = await getCachedResponse(cacheKey);
  
  if (cachedData && cachedData.success) {
    // Return cached data instantly
    // Update in background (don't await)
    updateAdminOrdersInBackground(cacheKey, options).catch(() => {});
    return cachedData;
  }
  
  // No cache, fetch from API
  return fetchAdminOrdersFromAPI(cacheKey, options);
}

/**
 * Fetch orders from API and cache
 */
async function fetchAdminOrdersFromAPI(
  cacheKey: string,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }
): Promise<{ success: boolean; data: any[]; pagination?: any }> {
  try {
    const response = await fetch(cacheKey, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    const result = await response.json();
    
    // Cache the response
    if (result.success) {
      await apiCacheDB.setResponse(cacheKey, result, [], ADMIN_CACHE_TTL);
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return { success: false, data: [] };
  }
}

/**
 * Update orders in background
 */
async function updateAdminOrdersInBackground(
  cacheKey: string,
  options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }
): Promise<void> {
  try {
    await fetchAdminOrdersFromAPI(cacheKey, options);
  } catch (error) {
    // Silent fail - cache is still valid
    console.warn('Background update failed:', error);
  }
}

/**
 * Invalidate admin orders cache
 * Call this when new order is created or updated
 */
/**
 * Invalidate admin orders cache
 * Call this when new order is created or updated
 */
export async function invalidateAdminOrdersCache(): Promise<void> {
  try {
    // Delete all admin/orders cache entries
    // Common cache keys to invalidate
    const cacheKeys = [
      getApiUrl('admin/orders?limit=1000&sortBy=createdAt&sortOrder=desc'),
      getApiUrl('admin/orders?page=1&limit=10&sortBy=createdAt&sortOrder=desc'),
      getApiUrl('admin/orders?page=1&limit=20&sortBy=createdAt&sortOrder=desc'),
    ];
    
    // Delete each cache key
    for (const key of cacheKeys) {
      try {
        await apiCacheDB.deleteResponse(key);
      } catch (e) {
        // Silent fail for individual deletions
      }
    }
    
    console.log('Admin orders cache invalidated');
  } catch (error) {
    console.warn('Error invalidating cache:', error);
  }
}

/**
 * Get dashboard stats from cache or API
 */
export async function getDashboardStats(): Promise<{
  totalAmount: number;
  totalProducts: number;
}> {
  const cacheKey = getApiUrl('admin/orders?limit=1000&sortBy=createdAt&sortOrder=desc');
  
  // Try cache first
  const cachedData = await getCachedResponse(cacheKey);
  
  if (cachedData && cachedData.success && cachedData.data) {
    // Calculate stats from cached data
    const stats = calculateStats(cachedData.data);
    
    // Update in background
    updateAdminOrdersInBackground(cacheKey, { limit: 1000 }).catch(() => {});
    
    return stats;
  }
  
  // No cache, fetch from API
  const result = await fetchAdminOrdersFromAPI(cacheKey, { limit: 1000 });
  
  if (result.success && result.data) {
    return calculateStats(result.data);
  }
  
  return { totalAmount: 0, totalProducts: 0 };
}

/**
 * Calculate stats from orders data
 */
function calculateStats(orders: any[]): {
  totalAmount: number;
  totalProducts: number;
} {
  const acceptedOrders = orders.filter((order: any) =>
    ['approved', 'confirmed', 'shipped', 'delivered'].includes(String(order.status || '').toLowerCase())
  );

  const totalAmount = acceptedOrders.reduce((sum: number, order: any) => {
    return sum + (order.totalAmount || 0);
  }, 0);

  const totalProducts = acceptedOrders.reduce((sum: number, order: any) => {
    const itemsCount = order.items?.reduce((itemSum: number, item: any) => {
      return itemSum + (item.quantity || 1);
    }, 0) || 0;
    return sum + itemsCount;
  }, 0);

  return { totalAmount, totalProducts };
}

/**
 * Get recent orders from cache or API
 */
export async function getRecentOrders(options: {
  page?: number;
  limit?: number;
} = {}): Promise<{ success: boolean; data: any[]; pagination?: any; error?: string }> {
  const { page = 1, limit = 10 } = options;
  
  return getAdminOrders({
    page,
    limit,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
}

