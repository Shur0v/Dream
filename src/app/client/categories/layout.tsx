import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop by Category - Browse All Categories',
  description: 'Explore Dreamshop product categories for Bangladesh online shopping. Find fashion, electronics, beauty, home products and daily essentials with cash on delivery and fast delivery.',
  keywords: [
    'dreamshop categories',
    'product categories',
    'shop by category',
    'browse categories',
    'shopping categories',
    'bangladesh shopping categories',
    'online shopping bd categories',
    'অনলাইন শপিং ক্যাটাগরি',
    'বাংলাদেশ অনলাইন বাজার',
    'ফ্যাশন পণ্য',
    'ইলেকট্রনিক্স',
    'বিউটি প্রোডাক্ট',
    'ঘরের জিনিস',
  ],
  openGraph: {
    title: 'Shop by Category - Browse All Categories | Dreamshop',
    description: 'Explore Bangladesh online shopping categories with cash on delivery and fast delivery.',
    url: '/client/categories',
  },
  alternates: {
    canonical: '/client/categories',
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
