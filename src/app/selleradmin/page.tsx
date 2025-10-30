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

export default function SellerAdminLandingFull() {
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
      <Hero />
      <BrowseCategories />
      <FeaturedProducts />
      <PromoBanners />
      <BestSelling />
      <DiscountPromo />
      <ForYou />
      <FeaturesSection />
    </MainLayout>
  );
}


