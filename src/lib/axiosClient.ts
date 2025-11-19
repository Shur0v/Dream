/**
 * Shared Axios client for both server and client modules.
 * Handles base URL resolution across environments plus opt-in auth headers.
 */

import axios, { AxiosInstance } from 'axios';

let authToken: string | null = null;

const resolveBaseUrl = (): string => {
  const explicitInternal = process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (explicitInternal) {
    return explicitInternal;
  }

  if (typeof window === 'undefined') {
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl) {
      return `https://${vercelUrl}/api`;
    }
    return 'http://localhost:3000/api';
  }

  return '/api';
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

