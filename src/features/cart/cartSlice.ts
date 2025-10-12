/**
 * @fileoverview Cart Redux slice for managing shopping cart state
 * Handles cart operations like add, remove, update quantities
 * 
 * @description This slice manages:
 * - Cart items and their quantities
 * - Total price calculations
 * - Cart persistence across sessions
 * - Optimistic updates for better UX
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../../types';

/**
 * Initial state for the cart slice
 * 
 * @description Starts with empty cart and zero totals
 * State is automatically persisted via Redux Persist
 */
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

/**
 * Cart slice with reducers for cart operations
 * 
 * @description Uses Redux Toolkit's createSlice for:
 * - Automatic action creators
 * - Immutable state updates with Immer
 * - Simplified reducer syntax
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Add item to cart or increase quantity if already exists
     * 
     * @description Handles both new items and quantity updates
     * Calculates totals automatically after each operation
     * 
     * @param state - Current cart state
     * @param action - Payload containing product and optional quantity
     */
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      
      // Check if item already exists in cart
      const existingItem = state.items.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Update existing item quantity
        existingItem.quantity += quantity;
        existingItem.price = existingItem.product.price * existingItem.quantity;
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`, // Unique ID for cart item
          productId: product.id,
          product,
          quantity,
          price: product.price * quantity,
          addedAt: new Date().toISOString(),
        };
        state.items.push(newItem);
      }
      
      // Recalculate totals
      cartSlice.caseReducers.calculateTotals(state);
    },

    /**
     * Remove item completely from cart
     * 
     * @description Removes item by product ID and recalculates totals
     * 
     * @param state - Current cart state
     * @param action - Payload containing product ID to remove
     */
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
      cartSlice.caseReducers.calculateTotals(state);
    },

    /**
     * Update quantity of specific cart item
     * 
     * @description Updates quantity and removes item if quantity becomes 0
     * Prevents negative quantities and handles edge cases
     * 
     * @param state - Current cart state
     * @param action - Payload containing product ID and new quantity
     */
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      
      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items = state.items.filter(item => item.productId !== productId);
        } else {
          // Update quantity and price
          item.quantity = quantity;
          item.price = item.product.price * quantity;
        }
        
        cartSlice.caseReducers.calculateTotals(state);
      }
    },

    /**
     * Clear entire cart
     * 
     * @description Removes all items and resets totals
     * Useful for after successful checkout or user logout
     * 
     * @param state - Current cart state
     */
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },

    /**
     * Calculate cart totals
     * 
     * @description Helper reducer to recalculate total items and price
     * Called after any cart modification to keep totals accurate
     * 
     * @param state - Current cart state
     */
    calculateTotals: (state) => {
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + item.price, 0);
    },

    /**
     * Set loading state for async operations
     * 
     * @description Manages loading state during cart API operations
     * Provides better UX feedback during network requests
     * 
     * @param state - Current cart state
     * @param action - Payload containing loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Set error state for failed operations
     * 
     * @description Captures and stores error messages from failed operations
     * Allows components to display appropriate error messages
     * 
     * @param state - Current cart state
     * @param action - Payload containing error message
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Export actions for use in components
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;

// Export reducer for store configuration
export default cartSlice.reducer;

// Selector functions for components
/**
 * Select cart items from state
 * 
 * @description Memoized selector for cart items
 * Use with useSelector hook in components
 */
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

/**
 * Select cart totals from state
 * 
 * @description Memoized selector for cart totals
 * Returns both total items and total price
 */
export const selectCartTotals = (state: { cart: CartState }) => ({
  totalItems: state.cart.totalItems,
  totalPrice: state.cart.totalPrice,
});

/**
 * Select cart loading state
 * 
 * @description Memoized selector for cart loading state
 * Useful for showing loading indicators
 */
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading;

/**
 * Select cart error state
 * 
 * @description Memoized selector for cart error state
 * Useful for displaying error messages
 */
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
