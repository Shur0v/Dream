import { Metadata } from 'next';
import ClientLandingPage from './client/page';
import StructuredData from '@/components/SEO/StructuredData';

export const metadata: Metadata = {
  title: 'Dreamshop - Your Trusted Online Shopping Destination',
  description: 'Dreamshop - Bangladesh online shopping website for local buyers. Shop fashion, electronics, beauty, home products and daily essentials with cash on delivery, fast delivery and fair prices.',
  keywords: [
    'dreamshop',
    'dreamshop bd',
    'dream shop bangladesh',
    'online shopping bangladesh',
    'online shopping bd',
    'e-commerce bangladesh',
    'buy online bangladesh',
    'cash on delivery bangladesh',
    'cod shopping bd',
    'home delivery bangladesh',
    'dhaka online shopping',
    'bd online shop',
    'bangladesh online shop',
    'অনলাইন শপিং',
    'বাংলাদেশ অনলাইন শপিং',
    'অনলাইন বাজার',
    'ক্যাশ অন ডেলিভারি',
    'হোম ডেলিভারি বাংলাদেশ',
    'কম দামে পণ্য',
    'সেরা দাম',
    'বাংলাদেশে অনলাইনে কেনাকাটা',
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
    description: 'Bangladesh online shopping website with cash on delivery, fast delivery and fair prices.',
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
    description: 'Bangladesh online shopping website with cash on delivery, fast delivery and fair prices.',
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
