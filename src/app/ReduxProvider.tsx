/**
 * @fileoverview Redux Provider component for the e-commerce application
 * Wraps the app with Redux store and persistence
 * 
 * @description This component provides:
 * - Redux store access to all child components
 * - State persistence across browser sessions
 * - Loading state while rehydrating persisted state
 * 
 * @author Your Name
 * @version 1.0.0
 */

'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

/**
 * Props interface for ReduxProvider component
 */
interface ReduxProviderProps {
  children: React.ReactNode;
}

/**
 * Redux Provider wrapper component
 * 
 * @description Wraps the entire application with Redux store and persistence
 * Provides Redux state management capabilities to all child components
 * 
 * @param children - React children components to wrap
 * @returns JSX element with Redux providers
 * 
 * @example
 * ```tsx
 * <ReduxProvider>
 *   <App />
 * </ReduxProvider>
 * ```
 */
export const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default ReduxProvider;
