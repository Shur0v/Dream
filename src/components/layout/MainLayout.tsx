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

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FeaturesSection from '@/app/client/home/components/FeaturesSection';

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
  const handleOpenLoginModal = (userType: 'client' | 'seller' | 'reseller' = 'client') => {
    window.dispatchEvent(new CustomEvent('openLoginModal', { detail: { userType } }));
  };

  const handleOpenRegisterModal = (userType: 'client' | 'seller' | 'reseller' = 'client') => {
    window.dispatchEvent(new CustomEvent('openRegisterModal', { detail: { userType } }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header - full width */}
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

      {/* Main Content - fluid/scaled container */}
      <div className="desktop-fluid-shell">
        <div className="desktop-fluid-content">
          <main className={`flex-1 ${className || ''}`}>
            {children}
          </main>
        </div>
      </div>

      {/* Features Section - full width */}
      <FeaturesSection />

      {/* Footer - full width */}
      {showFooter && (
        <Footer 
          onOpenLoginModal={handleOpenLoginModal}
          onOpenRegisterModal={handleOpenRegisterModal}
        />
      )}
    </div>
  );
};

export default MainLayout;
