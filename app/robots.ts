import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Post-booking pages carry no search value and would skew conversion tracking
        disallow: ['/thank-you', '/fr/thank-you', '/en/thank-you'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
