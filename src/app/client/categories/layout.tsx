import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop by Category - Browse All Categories',
  description: 'Explore all product categories at Dreamshop. Find electronics, fashion, home & living, beauty, sports and more. Shop by category for easy browsing.',
  keywords: [
    'dreamshop categories',
    'product categories',
    'shop by category',
    'browse categories',
    'shopping categories',
  ],
  openGraph: {
    title: 'Shop by Category - Browse All Categories | Dreamshop',
    description: 'Explore all product categories. Find electronics, fashion, home & living, beauty, sports and more.',
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
