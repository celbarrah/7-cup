import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Barlow_Condensed, Inter } from 'next/font/google';
import Analytics from '@/components/Analytics';
import { SITE_NAME, SITE_URL } from '@/lib/config';
import { DEFAULT_LANG, LOCALES, getDict, isLang } from '@/lib/i18n';
import '../globals.css';

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: '800', // the only display weight the design uses → 2 font files instead of 6
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang);
  const ogImage = { url: `/og/og-${lang}.jpg`, width: 1200, height: 630, alt: t.meta.ogTitle, type: 'image/jpeg' };
  return {
    metadataBase: new URL(SITE_URL),
    title: t.meta.title,
    description: t.meta.description,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: 'sports',
    formatDetection: { telephone: false, email: false, address: false },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    keywords: [
      'International Seven Cup',
      'International 7 Cup',
      'corporate football tournament',
      'tournoi inter-entreprises',
      'team building Marrakech',
      'Grand Stade de Marrakech',
    ],
    alternates: {
      canonical: `/${lang}`,
      languages: { fr: '/fr', en: '/en', 'x-default': `/${DEFAULT_LANG}` },
      types: { 'application/rss+xml': [{ url: `/${lang}/feed.xml`, title: SITE_NAME }] },
    },
    openGraph: {
      type: 'website',
      url: `/${lang}`,
      siteName: SITE_NAME,
      locale: lang === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: lang === 'fr' ? ['en_US'] : ['fr_FR'],
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      images: [ogImage],
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#07070a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <html lang={lang} className={`${display.variable} ${body.variable}`}>
      <head>
        {/* Warm up the third-party origins we'll need first */}
        <link rel="preconnect" href="https://link.clientx.ai" />
        <link rel="preconnect" href="https://stream.mux.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://image.mux.com" />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
