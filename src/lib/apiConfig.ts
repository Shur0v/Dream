/**
 * API Configuration
 * Centralized API base URL configuration
 */

// Use Express backend URL - automatically detect production or development
const getApiBaseUrl = (): string => {
  // If explicitly set, use that
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In browser (client-side)
  if (typeof window !== 'undefined') {
    // Production: use same domain for backend (assuming backend is on same domain or subdomain)
    const hostname = window.location.hostname;
    if (hostname === 'dreamshopltd.com' || hostname === 'www.dreamshopltd.com' || hostname.includes('dreamshopltd.com')) {
      // Try to use backend API on same domain or subdomain
      // If backend is on api.dreamshopltd.com, use that
      // Otherwise, try same domain
      return `https://${hostname.replace('www.', '')}/api`;
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

// Helper function for fetch calls
export const apiFetch = async (endpoint: string, options?: RequestInit): Promise<Response> => {
  const url = getApiUrl(endpoint);
  return fetch(url, options);
};
