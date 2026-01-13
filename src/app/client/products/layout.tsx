import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - Shop All Categories',
  description: 'Browse our complete product catalog at Dreamshop. Find electronics, fashion, home & living, beauty products and more. Best prices, fast delivery, secure shopping.',
  keywords: [
    'dreamshop products',
    'online shopping products',
    'buy products online',
    'product catalog',
    'shopping bangladesh',
  ],
  openGraph: {
    title: 'Products - Shop All Categories | Dreamshop',
    description: 'Browse our complete product catalog. Find electronics, fashion, home & living, beauty products and more.',
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
