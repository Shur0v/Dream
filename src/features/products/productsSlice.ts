/**
 * @fileoverview Products Redux slice for managing product catalog state
 * Handles product fetching, filtering, and search operations
 * 
 * @description This slice manages:
 * - Product catalog data
 * - Search and filter states
 * - Pagination for product lists
 * - Current product details
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductFilters, PaginationParams } from '../../types';

interface ProductsState {
  products: Product[];
  currentProduct: Product | null;
  filters: ProductFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  currentProduct: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setCurrentProduct: (state, action: PayloadAction<Product | null>) => {
      state.currentProduct = action.payload;
    },
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
    },
    setPagination: (state, action: PayloadAction<typeof initialState.pagination>) => {
      state.pagination = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setProducts,
  setCurrentProduct,
  setFilters,
  setPagination,
} = productsSlice.actions;

export default productsSlice.reducer;
