import { Metadata } from 'next';
import ClientLandingPage from './client/page';
import StructuredData from '@/components/SEO/StructuredData';

export const metadata: Metadata = {
  title: 'Dreamshop - Your Trusted Online Shopping Destination',
  description: 'Dreamshop - Bangladesh\'s leading online shopping platform. Shop for electronics, fashion, home & living, beauty products and more. Fast delivery, secure payments, best prices. Join thousands of happy customers at Dreamshop.',
  keywords: [
    'dreamshop',
    'online shopping bangladesh',
    'e-commerce bangladesh',
    'buy online bangladesh',
    'online store',
    'shopping website',
    'electronics',
    'fashion',
    'home & living',
    'beauty products',
    'best deals',
    'secure shopping',
    'fast delivery',
    'trusted online store',
  ],
  openGraph: {
    title: 'Dreamshop - Your Trusted Online Shopping Destination',
    description: 'Bangladesh\'s leading online shopping platform. Shop for electronics, fashion, home & living, beauty products and more.',
    url: '/',
    siteName: 'Dreamshop',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dreamshop - Online Shopping Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dreamshop - Your Trusted Online Shopping Destination',
    description: 'Bangladesh\'s leading online shopping platform. Shop for electronics, fashion, home & living, beauty products and more.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};

/**
 * Main domain landing page
 * Uses the client landing page component to avoid code duplication
 * 
 * @description Displays:
 * - Hero section with call-to-action
 * - Featured products grid
 * - Service highlights
 * - Company benefits
 * 
 * @returns JSX landing page element
 */
export default function LandingPage() {
  return (
    <>
      <StructuredData type="Organization" />
      <StructuredData type="WebSite" />
      <ClientLandingPage />
    </>
  );
}