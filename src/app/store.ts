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
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import feature slices
import authSlice from '../features/auth/authSlice';
import cartSlice from '../features/cart/cartSlice';
import productsSlice from '../features/products/productsSlice';
import userSlice from '../features/user/userSlice';
import wishlistSlice from '../features/wishlist/wishlistSlice';
import ordersSlice from '../features/orders/ordersSlice';

/**
 * Redux Persist configuration
 * Defines which parts of the state should be persisted to localStorage
 * 
 * @description Persists user authentication and cart data for better UX
 * Excludes sensitive data and temporary states from persistence
 */
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart', 'wishlist'], // Only persist these slices
  blacklist: ['products'], // Don't persist products (always fetch fresh)
};

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
 * Persisted reducer wrapper
 * 
 * @description Wraps the root reducer with persistence logic
 * Automatically saves/restores state to/from localStorage
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

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
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions for serialization check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * Persistor for Redux Persist
 * 
 * @description Handles the persistence of state to storage
 * Used by PersistGate component to restore state on app load
 */
export const persistor = persistStore(store);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
