/**
 * Admin Authentication Utility
 * Handles seller admin authentication with localStorage
 */

const ADMIN_CREDENTIALS = {
  id: 'adminnn',
  password: '#24fgr_0*',
};

const AUTH_STORAGE_KEY = 'seller_admin_auth';

export interface AdminAuthData {
  isAuthenticated: boolean;
  loginTime: string;
}

/**
 * Check if admin is authenticated
 */
export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authData) return false;
    
    const parsed: AdminAuthData = JSON.parse(authData);
    return parsed.isAuthenticated === true;
  } catch {
    return false;
  }
}

/**
 * Login admin with credentials
 */
export function adminLogin(id: string, password: string): boolean {
  if (id === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
    const authData: AdminAuthData = {
      isAuthenticated: true,
      loginTime: new Date().toISOString(),
    };
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    return true;
  }
  
  return false;
}

/**
 * Logout admin and clear authentication data
 */
export function adminLogout(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Get admin auth data
 */
export function getAdminAuthData(): AdminAuthData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authData) return null;
    
    return JSON.parse(authData) as AdminAuthData;
  } catch {
    return null;
  }
}

