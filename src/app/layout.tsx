import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./ReduxProvider";
import ClientCacheHandler from "./ClientCacheHandler";
import StructuredData from "@/components/SEO/StructuredData";
import ThemeBootstrap from "@/components/theme/ThemeBootstrap";
import GlobalAuthModals from "@/components/modals/GlobalAuthModals";
import ToastProvider from "@/components/ui/ToastProvider";
import ReferralTracker from "@/components/referral/ReferralTracker";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamshopltd.com'),
  title: {
    default: "Dreamshop - Your Trusted Online Shopping Destination",
    template: "%s | Dreamshop"
  },
  description: "Dreamshop - Bangladesh online shopping website for local buyers. Shop fashion, electronics, home products, beauty items and daily essentials with cash on delivery, fast delivery and fair prices across Bangladesh.",
  keywords: [
    "dreamshop",
    "dreamshop bd",
    "dream shop bangladesh",
    "online shopping",
    "online shopping bangladesh",
    "online shopping bd",
    "e-commerce",
    "bangladesh shopping",
    "bd online shop",
    "bangladesh online shop",
    "buy online",
    "buy online bangladesh",
    "cash on delivery bangladesh",
    "cod shopping bd",
    "home delivery bangladesh",
    "dhaka online shopping",
    "chittagong online shopping",
    "sylhet online shopping",
    "rajshahi online shopping",
    "khulna online shopping",
    "barisal online shopping",
    "rangpur online shopping",
    "mymensingh online shopping",
    "অনলাইন শপিং",
    "বাংলাদেশ অনলাইন শপিং",
    "বাংলাদেশ অনলাইন মার্কেট",
    "অনলাইন বাজার",
    "অনলাইন শপ",
    "ঢাকা অনলাইন শপিং",
    "চট্টগ্রাম অনলাইন শপিং",
    "ক্যাশ অন ডেলিভারি",
    "হোম ডেলিভারি বাংলাদেশ",
    "কম দামে পণ্য",
    "সেরা দাম",
    "বাংলাদেশে অনলাইনে কেনাকাটা",
    "মোবাইল এক্সেসরিজ",
    "ফ্যাশন পণ্য",
    "ইলেকট্রনিক্স",
    "বিউটি প্রোডাক্ট",
    "ঘরের জিনিস",
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
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: ['/favicon.png'],
    apple: [
      { url: '/favicon.png', type: 'image/png' },
    ],
  },
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
    description: 'Bangladesh online shopping website for local buyers. Shop fashion, electronics, home products, beauty items and daily essentials with cash on delivery and fast delivery.',
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
    description: 'Bangladesh online shopping website with cash on delivery, fast delivery and fair prices.',
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
    'geo.region': 'BD',
    'geo.placename': 'Bangladesh',
    'ICBM': '23.6850, 90.3563',
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
    <html lang="en-BD">
      <body
        className={`${poppins.variable} antialiased`}
        suppressHydrationWarning
      >
        <StructuredData type="Organization" />
        <StructuredData type="WebSite" />
        <ClientCacheHandler />
        <ThemeBootstrap />
        <ReduxProvider>
          <ReferralTracker />
          {children}
          <ToastProvider />
          <GlobalAuthModals />
        </ReduxProvider>
      </body>
    </html>
  );
}
