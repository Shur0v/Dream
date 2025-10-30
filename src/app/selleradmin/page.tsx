'use client';

import React from 'react';
import MainLayout from './components/layout/MainLayout';
import Hero from './components/home/Hero';
import BrowseCategories from './components/home/BrowseCategories';
import FeaturedProducts from './components/home/FeaturedProducts';
import PromoBanners from './components/home/DiscountPromo';
import BestSelling from './components/home/BestSelling';
import DiscountPromo from './components/home/PromoBanners';
import ForYou from './components/home/ForYou';
import FeaturesSection from './components/home/FeaturesSection';
import { sampleUsers } from '@/lib/dummyData';
import { useState } from 'react';
import AddBannerModal from './components/modals/AddBannerModal';

export default function SellerAdminLandingFull() {
  const [isAddBannerOpen, setIsAddBannerOpen] = useState(false);
  return (
    <MainLayout
      user={sampleUsers[0]}
      cartCount={2}
      wishlistCount={3}
      onSearch={() => {}}
      onCartClick={() => {}}
      onWishlistClick={() => {}}
      onUserAction={() => {}}
      onNewsletterSubscribe={() => {}}
    >
      <div className="w-full bg-white">
        <div className="max-w-[1320px] mx-auto px-4 py-3 flex justify-center">
          <div className="rounded-[10px] p-[2px] bg-gradient-to-r from-[rgba(210,105,216,1)] to-[rgba(242,0,255,1)] inline-flex">
            <button
              type="button"
              onClick={() => setIsAddBannerOpen(true)}
              className="h-[44px] px-6 rounded-[8px] bg-white text-black font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Add Banner
            </button>
          </div>
        </div>
      </div>
      <Hero />
      <BrowseCategories />
      <FeaturedProducts />
      <PromoBanners />
      <BestSelling />
      <DiscountPromo />
      <ForYou />
      <FeaturesSection />
      <AddBannerModal isOpen={isAddBannerOpen} onClose={() => setIsAddBannerOpen(false)} />
    </MainLayout>
  );
}


