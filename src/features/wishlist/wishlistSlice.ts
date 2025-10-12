/**
 * @fileoverview Wishlist Redux slice for managing user wishlist state
 * Handles wishlist operations like add, remove, and fetch items
 * 
 * @description This slice manages:
 * - Wishlist items
 * - Add/remove operations
 * - Wishlist persistence
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WishlistItem, Product } from '../../types';

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);
      
      if (!existingItem) {
        const newItem: WishlistItem = {
          id: `${product.id}-${Date.now()}`,
          productId: product.id,
          product,
          addedAt: new Date().toISOString(),
        };
        state.items.push(newItem);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  setLoading,
  setError,
  setWishlistItems,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
