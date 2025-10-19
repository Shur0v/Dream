'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProductList from './components/ProductList';
import { sampleUsers } from '@/lib/dummyData';

/**
 * Products page component
 * 
 * @description Displays:
 * - All available products with filtering and sorting
 * - Product search functionality
 * - Category filtering
 * - Pagination
 * 
 * @returns JSX products page element
 */
export default function Products() {
  /**
   * Handle search functionality
   */
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
    // TODO: Implement search functionality
  };

  /**
   * Handle cart click
   */
  const handleCartClick = () => {
    console.log('Cart clicked');
    // TODO: Open cart sidebar or navigate to cart page
  };

  /**
   * Handle wishlist click
   */
  const handleWishlistClick = () => {
    console.log('Wishlist clicked');
    // TODO: Open wishlist or navigate to wishlist page
  };

  /**
   * Handle user actions
   */
  const handleUserAction = (action: string) => {
    console.log('User action:', action);
    // TODO: Handle login/register navigation
  };

  /**
   * Handle newsletter subscription
   */
  const handleNewsletterSubscribe = (email: string) => {
    console.log('Newsletter subscription:', email);
    // TODO: Implement newsletter subscription
  };

  return (
    <MainLayout
      user={sampleUsers[0]} // Using sample user for demo
      cartCount={2}
      wishlistCount={3}
      onSearch={handleSearch}
      onCartClick={handleCartClick}
      onWishlistClick={handleWishlistClick}
      onUserAction={handleUserAction}
      onNewsletterSubscribe={handleNewsletterSubscribe}
    >
      {/* Products Section */}
      <ProductList />
    </MainLayout>
  );
}
