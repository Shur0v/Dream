import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - Shop All Categories',
  description: 'Browse Dreamshop products in Bangladesh. Buy fashion, electronics, beauty, home products and daily essentials online with cash on delivery, fast delivery and fair prices.',
  keywords: [
    'dreamshop products',
    'online shopping products',
    'buy products online',
    'product catalog',
    'shopping bangladesh',
    'online shopping bd',
    'buy online bangladesh',
    'cash on delivery bangladesh',
    'dhaka online shopping',
    'বাংলাদেশ অনলাইন শপিং',
    'অনলাইন পণ্য',
    'ক্যাশ অন ডেলিভারি',
    'কম দামে পণ্য',
    'সেরা দাম',
  ],
  openGraph: {
    title: 'Products - Shop All Categories | Dreamshop',
    description: 'Browse Bangladesh online shopping products with cash on delivery, fast delivery and fair prices.',
    url: '/client/products',
  },
  alternates: {
    canonical: '/client/products',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
