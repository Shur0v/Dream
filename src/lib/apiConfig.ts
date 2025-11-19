/**
 * API Configuration
 * Centralized API base URL configuration
 */

// Use Express backend URL - default to localhost:5000 for Express server
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  'http://localhost:5000/api';

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
