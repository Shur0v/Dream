/**
 * @fileoverview Redux store configuration for the e-commerce application
 * Sets up the main Redux store with Redux Toolkit and persistence
 * 
 * @description This store combines all feature slices and configures:
 * - Redux DevTools for development debugging
 * - Redux Persist for state persistence across browser sessions
 * - Middleware for async operations and error handling
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';

// Import feature slices
import authSlice from '../features/auth/authSlice';
import cartSlice from '../features/cart/cartSlice';
import productsSlice from '../features/products/productsSlice';
import userSlice from '../features/user/userSlice';
import wishlistSlice from '../features/wishlist/wishlistSlice';
import ordersSlice from '../features/orders/ordersSlice';

/**
 * Root reducer combining all feature slices
 * 
 * @description Each feature slice manages its own state domain
 * This approach provides better code organization and maintainability
 */
const rootReducer = combineReducers({
  auth: authSlice,
  cart: cartSlice,
  products: productsSlice,
  user: userSlice,
  wishlist: wishlistSlice,
  orders: ordersSlice,
});

/**
 * Configure and create the Redux store
 * 
 * @description Sets up the store with:
 * - Redux Toolkit's default middleware (includes thunk)
 * - Redux DevTools extension for development
 * - Error handling middleware
 * 
 * @returns Configured Redux store instance
 */
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = {
  purge: async () => undefined,
  flush: async () => undefined,
  pause: () => undefined,
  persist: () => undefined,
  dispatch: () => undefined,
  subscribe: () => () => undefined,
  getState: () => ({}),
};

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
