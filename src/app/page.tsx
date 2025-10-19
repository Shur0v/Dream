'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import BrowseCategories from '../components/home/BrowseCategories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import PromoBanners from '../components/home/DiscountPromo';
import BestSelling from '../components/home/BestSelling';
import DiscountPromo from '../components/home/PromoBanners';
import ForYou from '../components/home/ForYou';
import FeaturesSection from '../components/home/FeaturesSection';
import { sampleUsers } from '../lib/dummyData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Home page component showcasing the e-commerce platform
 * 
 * @description Displays:
 * - Hero section with call-to-action
 * - Featured products grid
 * - Service highlights
 * - Company benefits
 * 
 * @returns JSX home page element
 */
export default function Home() {
  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderImages = [
    '/hero/images/image1.png',
    '/hero/images/image2.jpg',
    '/hero/images/image3.png',
    '/hero/images/image4.png',
  ];

  /**
   * Auto-play slider - changes slide every 5 seconds
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  /**
   * Go to next slide
   */
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  /**
   * Go to previous slide
   */
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  /**
   * Go to specific slide
   */
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

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
      <section className="w-full py-8 bg-white">
        <div className="w-full max-w-[1320px] mx-auto">
          <div className="flex flex-col lg:flex-row justify-start items-start gap-6">
            {/* Left Side - Main Slider with Auto-play */}
            <div className="w-full lg:w-[804px] lg:flex-shrink-0 h-[513px] relative rounded-xl overflow-hidden bg-gray-100 group">
              {/* Slider Images */}
              <div className="relative w-full h-full">
                {sliderImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img 
                      className="w-full h-full object-cover rounded-xl" 
                      src={image}
                      alt={`Banner ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              {/* Previous Button */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slider Indicators */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-10 flex justify-center items-center gap-2 z-10">
                {sliderImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-[10px] ${
                      index === currentSlide 
                        ? 'w-12 h-2 bg-gradient-to-r from-blue-400 to-sky-700' 
                        : index === currentSlide - 1 || (currentSlide === 0 && index === sliderImages.length - 1)
                        ? 'w-5 h-2 bg-white'
                        : index === currentSlide - 2 || (currentSlide <= 1 && index === sliderImages.length + currentSlide - 2)
                        ? 'w-3.5 h-2 bg-white'
                        : 'w-2.5 h-2 bg-white'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - 3 Images Grid (Static) */}
            <div className="w-full lg:w-[492px] lg:flex-shrink-0 flex flex-col justify-start items-start gap-6">
              {/* Top Image - Full Width */}
              <img 
                className="w-full h-[229px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity" 
                src="/hero/images/image2.jpg" 
                alt="Banner 2"
              />
              {/* Bottom Two Images */}
              <div className="w-full flex justify-start items-center gap-6">
                <img 
                  className="w-[234px] h-[260px] rounded-xl object-cover flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity bg-cover bg-center" 
                  src="/hero/images/image3.png" 
                  alt="Banner 3"
                />
                <img 
                  className="w-[234px] h-[260px] rounded-xl object-cover flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity bg-cover bg-center" 
                  src="/hero/images/image4.png" 
                  alt="Banner 4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Features Section */}
      <FeaturesSection />
    </MainLayout>
  );
}
