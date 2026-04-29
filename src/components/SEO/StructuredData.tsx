'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  type?: 'Organization' | 'WebSite' | 'Product' | 'BreadcrumbList';
  data?: any;
}

export default function StructuredData({ type = 'Organization', data }: StructuredDataProps) {
  useEffect(() => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
    };

    let structuredData;

    switch (type) {
      case 'Organization':
        structuredData = {
          ...baseData,
          name: 'Dreamshop',
          url: process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamshopltd.com',
          logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamshopltd.com'}/common/logo.svg`,
          description: 'Dreamshop - Bangladesh online shopping website with cash on delivery and fast delivery',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+880-XXX-XXXXXX',
            contactType: 'Customer Service',
            areaServed: 'BD',
            availableLanguage: ['en', 'bn'],
          },
          sameAs: [
            'https://www.facebook.com/dreamshop',
            'https://www.twitter.com/dreamshop',
            'https://www.instagram.com/dreamshop',
          ],
        };
        break;

      case 'WebSite':
        structuredData = {
          ...baseData,
          name: 'Dreamshop',
          url: process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamshopltd.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dreamshopltd.com'}/client/products?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        };
        break;

      case 'Product':
        structuredData = {
          ...baseData,
          ...data,
        };
        break;

      case 'BreadcrumbList':
        structuredData = {
          ...baseData,
          itemListElement: data?.items || [],
        };
        break;

      default:
        structuredData = baseData;
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    script.id = `structured-data-${type.toLowerCase()}`;
    
    // Remove existing script if present
    const existing = document.getElementById(script.id);
    if (existing) {
      existing.remove();
    }
    
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(script.id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
}
