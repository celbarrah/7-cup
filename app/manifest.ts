import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'International 7 Cup Marrakech 2027',
    short_name: '7 Cup',
    description: 'The international inter-company football tournament at the Grand Stadium of Marrakech.',
    start_url: '/fr',
    scope: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    lang: 'fr',
    categories: ['sports', 'events', 'business'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
