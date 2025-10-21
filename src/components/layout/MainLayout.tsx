/**
 * @fileoverview Main Layout component that wraps all pages
 * Provides consistent layout structure across the application
 * 
 * @description This component includes:
 * - Header with navigation
 * - Main content area
 * - Footer
 * - Responsive design
 * - Loading states
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoginModal from '@/components/modals/LoginModal';
import RegisterModal from '@/components/modals/RegisterModal';

/**
 * Props interface for MainLayout component
 */
interface MainLayoutProps {
  /**
   * Page content to render
   */
  children: React.ReactNode;
  
  /**
   * Current user data (if authenticated)
   */
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
  } | null;
  
  /**
   * Cart items count
   * @default 0
   */
  cartCount?: number;
  
  /**
   * Wishlist items count
   * @default 0
   */
  wishlistCount?: number;
  
  /**
   * Callback when search is performed
   */
  onSearch?: (query: string) => void;
  
  /**
   * Callback when cart is clicked
   */
  onCartClick?: () => void;
  
  /**
   * Callback when wishlist is clicked
   */
  onWishlistClick?: () => void;
  
  /**
   * Callback when user menu item is clicked
   */
  onUserAction?: (action: string) => void;
  
  /**
   * Callback when newsletter is subscribed
   */
  onNewsletterSubscribe?: (email: string) => void;
  
  /**
   * Whether to show footer
   * @default true
   */
  showFooter?: boolean;
  
  /**
   * Custom className for main content
   */
  className?: string;
}

/**
 * Main Layout component that wraps all pages
 * 
 * @description Provides consistent layout structure with:
 * - Responsive header with navigation
 * - Flexible main content area
 * - Footer with links and information
 * - Proper spacing and styling
 * - Mobile-friendly design
 * 
 * @param props - MainLayout props including user data and callbacks
 * @returns JSX layout element
 * 
 * @example
 * ```tsx
 * <MainLayout
 *   user={currentUser}
 *   cartCount={cartItems.length}
 *   onSearch={handleSearch}
 *   onCartClick={openCart}
 * >
 *   <ProductList />
 * </MainLayout>
 * ```
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  user,
  cartCount = 0,
  wishlistCount = 0,
  onSearch,
  onCartClick,
  onWishlistClick,
  onUserAction,
  onNewsletterSubscribe,
  showFooter = true,
  className,
}) => {
  // Modal state management
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<'client' | 'seller' | 'reseller'>('client');

  // Handle opening login modal
  const handleOpenLoginModal = (userType: 'client' | 'seller' | 'reseller' = 'client') => {
    setCurrentUserType(userType);
    setIsLoginModalOpen(true);
  };

  // Handle opening register modal
  const handleOpenRegisterModal = (userType: 'client' | 'seller' | 'reseller' = 'client') => {
    setCurrentUserType(userType);
    setIsRegisterModalOpen(true);
  };

  // Handle closing modals
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  // Handle switching user types
  const handleSwitchUserType = (userType: 'client' | 'seller' | 'reseller') => {
    setCurrentUserType(userType);
  };

  // Handle opening register modal from login modal
  const handleOpenRegisterFromLogin = (userType: 'client' | 'seller' | 'reseller') => {
    setIsLoginModalOpen(false);
    setCurrentUserType(userType);
    setIsRegisterModalOpen(true);
  };

  // Handle opening login modal from register modal
  const handleOpenLoginFromRegister = (userType: 'client' | 'seller' | 'reseller') => {
    setIsRegisterModalOpen(false);
    setCurrentUserType(userType);
    setIsLoginModalOpen(true);
  };

  // Handle successful login/registration
  const handleLoginSuccess = () => {
    console.log('Login successful');
    // TODO: Update user state, show success message, etc.
  };

  const handleRegisterSuccess = () => {
    console.log('Registration successful');
    // TODO: Update user state, show success message, etc.
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header
        user={user}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onSearch={onSearch}
        onCartClick={onCartClick}
        onWishlistClick={onWishlistClick}
        onUserAction={onUserAction}
        onOpenLoginModal={handleOpenLoginModal}
        onOpenRegisterModal={handleOpenRegisterModal}
      />
      
      {/* Main Content */}
      <main className={`flex-1 ${className || ''}`}>
        {children}
      </main>
      
      {/* Footer */}
      {showFooter && (
        <Footer />
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        userType={currentUserType}
        onLoginSuccess={handleLoginSuccess}
        onSwitchUserType={handleSwitchUserType}
        onOpenRegisterModal={handleOpenRegisterFromLogin}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={handleCloseRegisterModal}
        userType={currentUserType}
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchUserType={handleSwitchUserType}
        onOpenLoginModal={handleOpenLoginFromRegister}
      />
    </div>
  );
};

export default MainLayout;
