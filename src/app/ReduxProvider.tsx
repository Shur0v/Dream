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
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

/**
 * Props interface for ReduxProvider component
 */
interface ReduxProviderProps {
  children: React.ReactNode;
}

/**
 * Loading component shown while Redux state is being rehydrated
 * 
 * @description Simple loading spinner to improve UX during state restoration
 * Prevents flash of unstyled content while persisted state loads
 * 
 * @returns JSX element with loading indicator
 */
const LoadingComponent: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="text-gray-600 font-medium">Loading your shopping experience...</p>
    </div>
  </div>
);

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
      <PersistGate 
        loading={<LoadingComponent />} 
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
