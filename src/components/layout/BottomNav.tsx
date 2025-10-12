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
  className = '' 
}) => {
  const navigationLinks = [
    { text: "Home", active: true, href: "/" },
    { text: "Offers", active: false, href: "/offers" },
    { text: "Become a Seller", active: false, href: "/seller/register" },
    { text: "Re seller", active: false, href: "/reseller/register" },
  ];

  return (
    <nav className={`w-full bg-gradient-to-r from-[rgba(210,105,216,1)] to-[rgba(242,0,255,1)] py-3 ${className}`}>
      <div className="w-full max-w-[1320px] mx-auto flex items-center justify-center">
        <div className="inline-flex items-center gap-4 sm:gap-8 lg:gap-12">
          {navigationLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="inline-flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity font-bold"
            >
              <div
                className={`font-bold text-white text-sm text-center tracking-[-0.28px] leading-[25.2px] whitespace-nowrap ${
                  link.active ? 'font-bold' : 'font-bold'
                }`}
              >
                {link.text}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;