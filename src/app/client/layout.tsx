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
    <div className="desktop-fluid-shell">
      <div className="desktop-fluid-content">
        <div className="min-h-screen bg-white flex flex-col">
          <MainHeader />
          <main className="flex-1">
            {children}
          </main>
          <FeaturesSection />
          <Footer />
        </div>
      </div>
    </div>
  );
}
