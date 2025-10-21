/**
 * @fileoverview Bottom Navigation Bar component
 * Provides main navigation links
 * 
 * @description This component displays:
 * - Main navigation links
 * - Role-specific navigation
 * - Mobile-friendly navigation
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React from 'react';
import Link from 'next/link';

/**
 * Props interface for BottomNav component
 */
interface BottomNavProps {
  /**
   * Current user role
   */
  userRole?: string;
  
  /**
   * Custom className
   */
  className?: string;
  
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
 * Bottom Navigation Bar component
 * 
 * @description Renders the bottom navigation with:
 * - Main navigation links
 * - Role-based navigation options
 * - Mobile-responsive design
 * - Consistent purple theme
 * 
 * @param props - BottomNav props including user role
 * @returns JSX bottom navigation element
 * 
 * @example
 * ```tsx
 * <BottomNav userRole="client" />
 * ```
 */
export const BottomNav: React.FC<BottomNavProps> = ({ 
  userRole = 'client',
  className = '',
  onOpenLoginModal,
  onOpenRegisterModal
}) => {
  const navigationLinks = [
    { text: "Home", active: true, href: "/" },
    { text: "Offers", active: false, href: "/offers" },
    { text: "Become a Seller", active: false, href: "#", onClick: () => onOpenRegisterModal?.('seller') },
    { text: "Re seller", active: false, href: "#", onClick: () => onOpenRegisterModal?.('reseller') },
  ];

  return (
    <nav className={`father w-full bg-gradient-to-r from-[rgba(210,105,216,1)] to-[rgba(242,0,255,1)] py-3 ${className}`} role="navigation" aria-label="Main navigation" data-layer="father">
      {/* father = full width bottom navigation section */}
      
      <div className="daughter w-full max-w-[1320px] mx-auto flex items-center justify-center" data-layer="daughter">
        {/* daughter = design holder for entire bottom navigation section */}
        
        <div className="layer-1 inline-flex items-center gap-4 sm:gap-8 lg:gap-12" data-layer="1">
          {/* layer-1 = navigation links container */}
          
          {navigationLinks.map((link, index) => {
            // Check if this link has an onClick handler (modal links)
            if (link.onClick) {
              return (
                <button
                  key={index}
                  onClick={link.onClick}
                  className="layer-2 inline-flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity font-bold"
                  aria-label={`Open ${link.text} modal`}
                  data-layer="2"
                >
                  {/* layer-2 = individual navigation button */}
                  
                  <div
                    className={`layer-3 font-bold text-white text-sm text-center tracking-[-0.28px] leading-[25.2px] whitespace-nowrap ${
                      link.active ? 'font-bold' : 'font-bold'
                    }`}
                    data-layer="3"
                  >
                    {/* layer-3 = navigation button text */}
                    {link.text}
                  </div>
                </button>
              );
            }
            
            // Regular navigation links
            return (
              <Link
                key={index}
                href={link.href}
                className="layer-2 inline-flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity font-bold"
                aria-label={`Navigate to ${link.text}`}
                data-layer="2"
              >
                {/* layer-2 = individual navigation link */}
                
                <div
                  className={`layer-3 font-bold text-white text-sm text-center tracking-[-0.28px] leading-[25.2px] whitespace-nowrap ${
                    link.active ? 'font-bold' : 'font-bold'
                  }`}
                  data-layer="3"
                >
                  {/* layer-3 = navigation link text */}
                  {link.text}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;