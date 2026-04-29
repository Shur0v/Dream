import React from 'react';
import Footer from '@/components/layout/Footer';
import { MainHeader } from '@/components/layout/MainHeader';
import FeaturesSection from './home/components/FeaturesSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Dreamshop - Your Trusted Online Shopping Destination',
    template: '%s | Dreamshop',
  },
  description: 'Dreamshop - Bangladesh online shopping website for local buyers. Shop fashion, electronics, beauty, home products and daily essentials with cash on delivery and fast delivery.',
  keywords: [
    'dreamshop bd',
    'online shopping bangladesh',
    'online shopping bd',
    'cash on delivery bangladesh',
    'home delivery bangladesh',
    'অনলাইন শপিং',
    'বাংলাদেশ অনলাইন শপিং',
    'ক্যাশ অন ডেলিভারি',
    'হোম ডেলিভারি বাংলাদেশ',
  ],
};

/**
 * Layout for all client pages
 * Wraps client pages with client-specific layout and navigation
 */
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - full width */}
      <MainHeader />

      {/* Main - fluid/scaled container */}
      <div className="desktop-fluid-shell">
        <div className="desktop-fluid-content">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>

      {/* Features - full width */}
      <FeaturesSection />

      {/* Footer - full width */}
      <Footer />
    </div>
  );
}
