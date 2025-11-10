'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import TopPart from './components/toppart';
import Reviews from './components/Reviews';
import DeliveryInfo from './components/toppart/DeliveryInfo';
import { sampleUsers } from '@/lib/dummyData';

/**
 * Product details page component
 * 
 * @description Displays:
 * - Product image gallery
 * - Product information and details
 * - Customer reviews and ratings
 * - Add to cart functionality
 * 
 * @returns JSX product details page element
 */
export default function ProductDetails() {
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
      <div className="flex flex-col gap-10 lg:gap-12">
        {/* Top Part - Contains ProductGallery, ProductInfo, and DeliveryInfo */}
        <TopPart />
        
        {/* Product Reviews Section */}
        <section className="w-full max-w-[1320px] mx-auto px-2">
          <Reviews rating={4.5} reviewsCount={100} />
        </section>

        {/* Mobile Delivery Info */}
        <section className="lg:hidden w-full max-w-[1320px] mx-auto px-2">
          <DeliveryInfo />
        </section>
      </div>
    </MainLayout>
  );
}
