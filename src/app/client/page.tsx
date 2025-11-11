'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Hero from './home/components/Hero';
import BrowseCategories from './home/components/BrowseCategories';
import FeaturedProducts from './home/components/FeaturedProducts';
import PromoBanners from './home/components/DiscountPromo';
import BestSelling from './home/components/BestSelling';
import DiscountPromo from './home/components/PromoBanners';
import ForYou from './home/components/ForYou';
import { sampleUsers } from '@/lib/dummyData';

/**
 * Client Landing Page Component
 * 
 * @description Displays:
 * - Hero section with call-to-action
 * - Featured products grid
 * - Service highlights
 * - Company benefits
 * 
 * @returns JSX landing page element
 */
export default function ClientLandingPage() {
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
      {/* Hero Banner Section */}
      <Hero />

      {/* Browse Categories Section */}
      <BrowseCategories />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Promotional Banners Section */}
      <PromoBanners />

      {/* Best Selling Section */}
      <BestSelling />

      {/* Discount Promo Section */}
      <DiscountPromo />

      {/* For You Section */}
      <ForYou />
    </MainLayout>
  );
}