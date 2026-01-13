import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Dreamshop - Online Shopping',
    short_name: 'Dreamshop',
    description: 'Bangladesh\'s leading online shopping platform. Shop for electronics, fashion, home & living, beauty products and more.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#a855f7',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['shopping', 'ecommerce'],
    orientation: 'portrait',
  };
}
