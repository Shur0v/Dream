/**
 * @fileoverview Offers page
 * Displays current offers and deals
 * 
 * @description This page shows:
 * - Special offers
 * - Discounted products
 * - Limited time deals
 * 
 * @author Your Name
 * @version 1.0.0
 */

'use client';

import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import ProductCard from '../../components/product/ProductCard';
import { Card, CardContent } from '../../components/ui/Card';
import { sampleProducts, sampleUsers } from '../../lib/dummyData';
import { Tag, TrendingDown, Clock } from 'lucide-react';

/**
 * Offers page component
 * 
 * @description Renders the offers page with:
 * - Featured deals
 * - Discounted products
 * - Special promotions
 * 
 * @returns JSX offers page element
 */
export default function OffersPage() {
  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleCartClick = () => {
    console.log('Cart clicked');
  };

  const handleWishlistClick = () => {
    console.log('Wishlist clicked');
  };

  const handleUserAction = (action: string) => {
    console.log('User action:', action);
  };

  const handleNewsletterSubscribe = (email: string) => {
    console.log('Newsletter subscription:', email);
  };

  const handleAddToCart = (product: any) => {
    console.log('Add to cart:', product);
  };

  const handleAddToWishlist = (product: any) => {
    console.log('Add to wishlist:', product);
  };

  const handleProductClick = (product: any) => {
    console.log('Product clicked:', product);
  };

  // Filter products with discounts
  const discountedProducts = sampleProducts.filter(p => p.discount && p.discount > 0);

  return (
    <MainLayout
      user={sampleUsers[0]}
      cartCount={2}
      wishlistCount={3}
      onSearch={handleSearch}
      onCartClick={handleCartClick}
      onWishlistClick={handleWishlistClick}
      onUserAction={handleUserAction}
      onNewsletterSubscribe={handleNewsletterSubscribe}
    >
      {/* Page Header */}
      <section className="w-full py-12 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Special Offers & Deals
            </h1>
            <p className="text-xl text-blue-100">
              Save big on your favorite products with our exclusive offers
            </p>
          </div>
        </div>
      </section>

      {/* Offer Highlights */}
      <section className="py-12 bg-white">
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <Tag className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Up to 50% Off</h3>
                <p className="text-gray-600">Amazing discounts on selected items</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrendingDown className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flash Sales</h3>
                <p className="text-gray-600">Limited time offers you can't miss</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Daily Deals</h3>
                <p className="text-gray-600">New offers added every day</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Discounted Products */}
      <section className="py-16 bg-gray-50">
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Deals
            </h2>
            <p className="text-lg text-gray-600">
              Don't miss out on these amazing discounts
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {discountedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Subscribe to Get Exclusive Offers
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Be the first to know about our latest deals and promotions
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

