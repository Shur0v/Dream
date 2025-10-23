/**
 * @fileoverview Complete Header component combining all header parts
 * Combines TopBar, MainHeader, and BottomNav components with scroll-based animations
 * 
 * @description This component includes:
 * - Top information bar with support contacts (scroll animated)
 * - Main navigation with logo, search, and user actions (always visible)
 * - Bottom navigation with main links (scroll animated)
 * - Complete header functionality with smooth scroll animations
 * - Automatic hide/show based on scroll direction
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React from 'react';
import TopBar from './TopBar';
import MainHeader from './MainHeader';
import BottomNav from './BottomNav';
import { useScrollDirection } from '../../hooks/useScrollDirection';

/**
 * Props interface for Header component
 */
interface HeaderProps {
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
   * Callback when login modal should be opened
   */
  onOpenLoginModal?: (userType?: 'client' | 'seller' | 'reseller') => void;
  
  /**
   * Callback when register modal should be opened
   */
  onOpenRegisterModal?: (userType?: 'client' | 'seller' | 'reseller') => void;
}

/**
 * Complete Header component combining all header parts
 * 
 * @description Renders the complete header with:
 * - Top information bar with support contacts (scroll animated)
 * - Main navigation with logo, search, and user actions (always visible)
 * - Bottom navigation with main links (scroll animated)
 * - Mobile-responsive design
 * - Smooth scroll-based animations
 * 
 * @param props - Header props including user data and callbacks
 * @returns JSX complete header element
 * 
 * @example
 * ```tsx
 * <Header
 *   user={currentUser}
 *   cartCount={cartItems.length}
 *   wishlistCount={wishlistItems.length}
 *   onSearch={handleSearch}
 *   onCartClick={openCart}
 *   onUserAction={handleUserAction}
 * />
 * ```
 */
export const Header: React.FC<HeaderProps> = ({
  user,
  cartCount = 0,
  wishlistCount = 0,
  onSearch,
  onCartClick,
  onWishlistClick,
  onUserAction,
  onOpenLoginModal,
  onOpenRegisterModal,
}) => {
  // Use ultra-simple hook with zero blinking
  const { shouldShowHeader } = useScrollDirection(50, 50);
  
  // Simple assignment - no complex logic needed
  const shouldShowTopBar = shouldShowHeader;
  const shouldShowBottomNav = shouldShowHeader;
  
  return (
    <header className="father sticky top-0 z-50" role="banner" data-layer="father">
      {/* father = complete header section */}
      
      <div className="daughter" data-layer="daughter">
        {/* daughter = design holder for entire header section */}
        
        {/* Top Information Bar - Ultra-stable animation */}
        <div 
          className={`layer-1 transition-all duration-500 ease-in-out overflow-hidden ${
            shouldShowTopBar 
              ? 'translate-y-0 opacity-100 max-h-screen' 
              : '-translate-y-full opacity-0 max-h-0'
          }`} 
          data-layer="1"
        >
          {/* layer-1 = top bar container */}
          <TopBar />
        </div>
        
        {/* Main Navigation Header - Always visible */}
        <div className="layer-2" data-layer="2">
          {/* layer-2 = main header container */}
          <MainHeader
            cartCount={cartCount}
            wishlistCount={wishlistCount}
            onSearch={onSearch}
            onCartClick={onCartClick}
            onWishlistClick={onWishlistClick}
            onOpenLoginModal={onOpenLoginModal}
            onOpenRegisterModal={onOpenRegisterModal}
          />
        </div>
        
        {/* Bottom Navigation Bar - Ultra-stable animation */}
        <div 
          className={`layer-3 transition-all duration-500 ease-in-out ${
            shouldShowBottomNav 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-full opacity-0'
          }`} 
          data-layer="3"
        >
          {/* layer-3 = bottom navigation container */}
          <BottomNav 
            userRole={user?.role} 
            onOpenLoginModal={onOpenLoginModal}
            onOpenRegisterModal={onOpenRegisterModal}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
