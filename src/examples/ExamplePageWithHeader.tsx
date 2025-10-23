/**
 * @fileoverview Example usage of Header component with scroll animations
 * Demonstrates how to use the Header component across different pages
 * 
 * @description This example shows:
 * - How to integrate Header with scroll animations
 * - Proper prop handling for different page contexts
 * - State management for cart and user data
 * 
 * @author Your Name
 * @version 1.0.0
 */

import React, { useState } from 'react';
import Header from '../components/layout/Header';

/**
 * Example page component showing Header usage
 * 
 * @description This component demonstrates how to use the Header
 * with scroll animations across different pages
 * 
 * @returns JSX example page with animated header
 * 
 * @example
 * ```tsx
 * <ExamplePageWithHeader />
 * ```
 */
export const ExamplePageWithHeader: React.FC = () => {
  // Example state management
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(1);
  const [user, setUser] = useState(null);

  // Example handlers
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // Implement search logic here
  };

  const handleCartClick = () => {
    console.log('Cart clicked');
    // Implement cart logic here
  };

  const handleWishlistClick = () => {
    console.log('Wishlist clicked');
    // Implement wishlist logic here
  };

  const handleUserAction = (action: string) => {
    console.log('User action:', action);
    // Implement user action logic here
  };

  const handleOpenLoginModal = (userType?: 'client' | 'seller' | 'reseller') => {
    console.log('Open login modal for:', userType);
    // Implement login modal logic here
  };

  const handleOpenRegisterModal = (userType?: 'client' | 'seller' | 'reseller') => {
    console.log('Open register modal for:', userType);
    // Implement register modal logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with scroll animations */}
      <Header
        user={user}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onSearch={handleSearch}
        onCartClick={handleCartClick}
        onWishlistClick={handleWishlistClick}
        onUserAction={handleUserAction}
        onOpenLoginModal={handleOpenLoginModal}
        onOpenRegisterModal={handleOpenRegisterModal}
      />

      {/* Page content */}
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Example Page with Animated Header
          </h1>
          
          <div className="space-y-8">
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Scroll Behavior</h2>
              <p className="text-gray-600 mb-4">
                This page demonstrates the scroll-based header animation:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Scroll down to see TopBar and BottomNav hide smoothly</li>
                <li>Only MainHeader remains visible during scroll</li>
                <li>Scroll up to see TopBar and BottomNav reappear</li>
                <li>At the top of the page, all header sections are visible</li>
              </ul>
            </section>

            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Usage Instructions</h2>
              <p className="text-gray-600 mb-4">
                To use this Header component on any page:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Import the Header component</li>
                <li>Pass the required props (user, cartCount, etc.)</li>
                <li>Implement the callback handlers for your specific needs</li>
                <li>The scroll animations work automatically</li>
              </ol>
            </section>

            {/* Dummy content to enable scrolling */}
            <div className="space-y-4">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium mb-2">Content Section {i + 1}</h3>
                  <p className="text-gray-600">
                    This is dummy content to demonstrate the scroll behavior. 
                    Scroll up and down to see the header animation in action.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExamplePageWithHeader;
