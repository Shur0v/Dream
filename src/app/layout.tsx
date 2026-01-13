import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./ReduxProvider";
import ClientCacheHandler from "./ClientCacheHandler";
import StructuredData from "@/components/SEO/StructuredData";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamshoptld.com'),
  title: {
    default: "Dreamshop - Your Trusted Online Shopping Destination",
    template: "%s | Dreamshop"
  },
  description: "Dreamshop - Bangladesh's leading online shopping platform. Shop for electronics, fashion, home & living, beauty products and more. Fast delivery, secure payments, best prices. Join thousands of happy customers at Dreamshop.",
  keywords: [
    "dreamshop",
    "online shopping",
    "e-commerce",
    "bangladesh shopping",
    "buy online",
    "online store",
    "shopping website",
    "electronics",
    "fashion",
    "home & living",
    "beauty products",
    "best deals",
    "secure shopping",
    "fast delivery",
    "trusted online store"
  ],
  authors: [{ name: "Dreamshop Team" }],
  creator: "Dreamshop",
  publisher: "Dreamshop",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Dreamshop',
    title: 'Dreamshop - Your Trusted Online Shopping Destination',
    description: 'Bangladesh\'s leading online shopping platform. Shop for electronics, fashion, home & living, beauty products and more. Fast delivery, secure payments, best prices.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dreamshop - Online Shopping Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dreamshop - Your Trusted Online Shopping Destination',
    description: 'Bangladesh\'s leading online shopping platform. Shop for electronics, fashion, home & living, beauty products and more.',
    images: ['/og-image.jpg'],
    creator: '@dreamshop',
  },
  alternates: {
    canonical: '/',
  },
  category: 'E-commerce',
  classification: 'Online Shopping Platform',
  other: {
    'application-name': 'Dreamshop',
    'apple-mobile-web-app-title': 'Dreamshop',
    'apple-mobile-web-app-capable': 'yes',
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
        suppressHydrationWarning
      >
        <StructuredData type="Organization" />
        <StructuredData type="WebSite" />
        <ClientCacheHandler />
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
