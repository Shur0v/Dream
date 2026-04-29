/**
 * Shared Axios client for both server and client modules.
 * Handles base URL resolution across environments plus opt-in auth headers.
 */

import axios, { AxiosInstance } from 'axios';

let authToken: string | null = null;

const resolveBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return '/api';
  }

  if (process.env.INTERNAL_API_URL) {
    return process.env.INTERNAL_API_URL;
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}/api`;
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}/api`;
  }

  return 'http://127.0.0.1:3001/api';
};

const client: AxiosInstance = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  if (typeof window !== 'undefined') {
    const userData = window.localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const email = parsed?.email ? String(parsed.email).trim().toLowerCase() : '';
        if (email) {
          config.headers = config.headers ?? {};
          config.headers['x-user-id'] = `user-${email}`;
        }
      } catch {
        // Ignore invalid local session data and let the API use its fallback user.
      }
    }
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      clearClientAuthToken();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export const setClientAuthToken = (token?: string | null) => {
  authToken = token ?? null;
};

export const clearClientAuthToken = () => {
  authToken = null;
};

export default client;

