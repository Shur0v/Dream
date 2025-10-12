/**
 * @fileoverview Complete Header component combining all header parts
 * Combines TopBar, MainHeader, and BottomNav components
 * 
 * @description This component includes:
 * - Top information bar with support contacts
 * - Main navigation with logo, search, and user actions
 * - Bottom navigation with main links
 * - Complete header functionality
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React from 'react';
import TopBar from './TopBar';
import MainHeader from './MainHeader';
import BottomNav from './BottomNav';

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
}

/**
 * Complete Header component combining all header parts
 * 
 * @description Renders the complete header with:
 * - Top information bar with support contacts
 * - Main navigation with logo, search, and user actions
 * - Bottom navigation with main links
 * - Mobile-responsive design
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
}) => {
  return (
    <header className="sticky top-0 z-50">
      {/* Top Information Bar */}
      <TopBar />
      
      {/* Main Navigation Header */}
      <MainHeader
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onSearch={onSearch}
        onCartClick={onCartClick}
        onWishlistClick={onWishlistClick}
      />
      
      {/* Bottom Navigation Bar */}
      <BottomNav userRole={user?.role} />
    </header>
  );
};

export default Header;
