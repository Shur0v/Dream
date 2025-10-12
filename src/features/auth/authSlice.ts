/**
 * @fileoverview Authentication Redux slice for managing user auth state
 * Handles login, logout, registration, and user session management
 * 
 * @description This slice manages:
 * - User authentication state
 * - JWT token storage and validation
 * - User profile information
 * - Authentication loading states
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthResponse, LoginCredentials, RegisterData } from '../../types';

/**
 * Initial state for the auth slice
 * 
 * @description Starts with no authenticated user and null token
 * State is persisted to maintain login sessions across browser refreshes
 */
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Auth slice with reducers for authentication operations
 * 
 * @description Uses Redux Toolkit's createSlice for:
 * - Automatic action creators
 * - Immutable state updates with Immer
 * - Simplified reducer syntax
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set loading state for async auth operations
     * 
     * @description Manages loading state during login/register/logout
     * Provides better UX feedback during network requests
     * 
     * @param state - Current auth state
     * @param action - Payload containing loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null; // Clear error when starting new operation
      }
    },

    /**
     * Set error state for failed auth operations
     * 
     * @description Captures and stores error messages from failed operations
     * Allows components to display appropriate error messages
     * 
     * @param state - Current auth state
     * @param action - Payload containing error message
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    /**
     * Login success - set user data and tokens
     * 
     * @description Called after successful login to store user data
     * Sets authentication state and user information
     * 
     * @param state - Current auth state
     * @param action - Payload containing auth response data
     */
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Registration success - set user data and tokens
     * 
     * @description Called after successful registration to store user data
     * Similar to login success but for new user accounts
     * 
     * @param state - Current auth state
     * @param action - Payload containing auth response data
     */
    registerSuccess: (state, action: PayloadAction<AuthResponse>) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Logout user and clear auth state
     * 
     * @description Clears all authentication data and returns to initial state
     * Called on logout, token expiration, or auth errors
     * 
     * @param state - Current auth state
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Update user profile information
     * 
     * @description Updates user data after profile modifications
     * Maintains authentication state while updating user info
     * 
     * @param state - Current auth state
     * @param action - Payload containing updated user data
     */
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    /**
     * Refresh authentication token
     * 
     * @description Updates tokens after successful refresh
     * Maintains user session without requiring re-login
     * 
     * @param state - Current auth state
     * @param action - Payload containing new tokens
     */
    refreshTokens: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },

    /**
     * Clear error state
     * 
     * @description Manually clear error messages
     * Useful for dismissing error notifications
     * 
     * @param state - Current auth state
     */
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions for use in components
export const {
  setLoading,
  setError,
  loginSuccess,
  registerSuccess,
  logout,
  updateProfile,
  refreshTokens,
  clearError,
} = authSlice.actions;

// Export reducer for store configuration
export default authSlice.reducer;

// Selector functions for components
/**
 * Select current user from state
 * 
 * @description Memoized selector for current user
 * Use with useSelector hook in components
 */
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;

/**
 * Select authentication status
 * 
 * @description Memoized selector for authentication status
 * Returns boolean indicating if user is logged in
 */
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;

/**
 * Select authentication token
 * 
 * @description Memoized selector for auth token
 * Useful for API requests that require authentication
 */
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;

/**
 * Select auth loading state
 * 
 * @description Memoized selector for auth loading state
 * Useful for showing loading indicators during auth operations
 */
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;

/**
 * Select auth error state
 * 
 * @description Memoized selector for auth error state
 * Useful for displaying error messages
 */
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
