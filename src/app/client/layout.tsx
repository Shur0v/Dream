import React from 'react';
import Footer from '@/components/layout/Footer';
import { MainHeader } from '@/components/layout/MainHeader';
import FeaturesSection from './home/components/FeaturesSection';

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
