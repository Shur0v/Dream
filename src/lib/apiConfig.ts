/**
 * API Configuration
 * Centralized API base URL configuration
 */

// Use Express backend URL - automatically detect production or development
const getApiBaseUrl = (): string => {
  // If explicitly set, use that (highest priority)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In browser (client-side)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Production: Check if not localhost (any production domain)
    // If it's not localhost, localhost IP, or 127.0.0.1, assume production
    const isProduction = 
      hostname !== 'localhost' && 
      hostname !== '127.0.0.1' && 
      !hostname.startsWith('192.168.') &&
      !hostname.startsWith('10.') &&
      !hostname.endsWith('.local');
    
    if (isProduction) {
      // Production: Use same domain /api (reverse proxy setup)
      // This is the most common VPS setup - backend proxied through Nginx
      const baseHost = hostname.replace('www.', '');
      return `${protocol}//${baseHost}/api`;
    }
    
    // Development: use localhost
    return 'http://localhost:5000/api';
  }

  // Server-side: default to localhost
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Helper function for fetch calls with error handling
export const apiFetch = async (endpoint: string, options?: RequestInit): Promise<Response> => {
  const url = getApiUrl(endpoint);
  
  try {
    // Create AbortController for timeout (fallback for browsers without AbortSignal.timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    // Log error but don't throw - let caller handle
    console.error(`[apiFetch] Error fetching ${url}:`, error);
    throw error;
  }
};
