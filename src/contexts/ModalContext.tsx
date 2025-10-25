'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Modal state interface
 */
interface ModalState {
  isLoginModalOpen: boolean;
  isRegisterModalOpen: boolean;
  currentUserType: 'client' | 'seller' | 'reseller';
}

/**
 * Modal actions interface
 */
interface ModalActions {
  openLoginModal: (userType?: 'client' | 'seller' | 'reseller') => void;
  openRegisterModal: (userType?: 'client' | 'seller' | 'reseller') => void;
  closeLoginModal: () => void;
  closeRegisterModal: () => void;
  switchUserType: (userType: 'client' | 'seller' | 'reseller') => void;
  openRegisterFromLogin: (userType: 'client' | 'seller' | 'reseller') => void;
  openLoginFromRegister: (userType: 'client' | 'seller' | 'reseller') => void;
}

/**
 * Combined modal context type
 */
type ModalContextType = ModalState & ModalActions;

/**
 * Modal context
 */
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/**
 * Props interface for ModalProvider
 */
interface ModalProviderProps {
  children: ReactNode;
}

/**
 * Modal Provider Component
 * 
 * @description Provides global modal state management for login/signup modals
 * across all routes and components
 * 
 * @param props - ModalProvider props
 * @returns JSX provider element
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  // Modal state management
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<'client' | 'seller' | 'reseller'>('client');

  // Handle opening login modal
  const openLoginModal = (userType: 'client' | 'seller' | 'reseller' = 'client') => {
    setCurrentUserType(userType);
    setIsLoginModalOpen(true);
  };

  // Handle opening register modal
  const openRegisterModal = (userType: 'client' | 'seller' | 'reseller' = 'client') => {
    setCurrentUserType(userType);
    setIsRegisterModalOpen(true);
  };

  // Handle closing modals
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  // Handle switching user types
  const switchUserType = (userType: 'client' | 'seller' | 'reseller') => {
    setCurrentUserType(userType);
  };

  // Handle opening register modal from login modal
  const openRegisterFromLogin = (userType: 'client' | 'seller' | 'reseller') => {
    setIsLoginModalOpen(false);
    setCurrentUserType(userType);
    setIsRegisterModalOpen(true);
  };

  // Handle opening login modal from register modal
  const openLoginFromRegister = (userType: 'client' | 'seller' | 'reseller') => {
    setIsRegisterModalOpen(false);
    setCurrentUserType(userType);
    setIsLoginModalOpen(true);
  };

  const value: ModalContextType = {
    // State
    isLoginModalOpen,
    isRegisterModalOpen,
    currentUserType,
    
    // Actions
    openLoginModal,
    openRegisterModal,
    closeLoginModal,
    closeRegisterModal,
    switchUserType,
    openRegisterFromLogin,
    openLoginFromRegister,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

/**
 * Hook to use modal context
 * 
 * @description Custom hook to access modal state and actions
 * @returns Modal context value
 * @throws Error if used outside of ModalProvider
 */
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  
  return context;
};

export default ModalContext;


