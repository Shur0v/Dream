/**
 * @fileoverview User Redux slice for managing user profile state
 * Handles user profile data and account management
 * 
 * @description This slice manages:
 * - User profile information
 * - Account settings
 * - Profile update operations
 * 
 * @author Your Name
 * @version 1.0.0
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProfile: (state, action: PayloadAction<User | null>) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
});

export const {
  setLoading,
  setError,
  setProfile,
  updateProfile,
} = userSlice.actions;

export default userSlice.reducer;
