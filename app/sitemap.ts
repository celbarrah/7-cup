import type { MetadataRoute } from 'next';
import { CONTENT_UPDATED, SITE_URL } from '@/lib/config';
import { LOCALES } from '@/lib/i18n';

const IMAGES = ['/images/stade-hero.webp', '/images/167A1680.webp', '/images/167A1640.webp', '/images/167A1764.webp', '/images/167A1697.webp'];

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}`]));
  return LOCALES.map((lang) => ({
    url: `${SITE_URL}/${lang}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: 'weekly',
    priority: lang === 'fr' ? 1 : 0.9,
    alternates: { languages: { ...languages, 'x-default': `${SITE_URL}/fr` } },
    images: [`${SITE_URL}/og/og-${lang}.jpg`, ...IMAGES.map((p) => `${SITE_URL}${p}`)],
  }));
}
