/**
 * Static export (HTML/CSS/JS in `out/`) for Cloudflare Pages.
 * Redirects and headers for production live in public/_redirects and public/_headers
 * (read by Cloudflare Pages); the redirects below only exist so `next dev` behaves the same.
 * @type {import('next').NextConfig}
 */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  output: 'export',
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Inline the (small) stylesheet into the HTML: no render-blocking CSS request
    inlineCss: true,
  },
  images: {
    // No image server on a static host: images in public/ are already compressed WebP
    unoptimized: true,
  },
  ...(isDev && {
    async redirects() {
      return [
        { source: '/', destination: '/fr', permanent: false },
        {
          source: '/thank-you',
          has: [{ type: 'cookie', key: 'ic7m_lang', value: 'en' }],
          destination: '/en/thank-you',
          permanent: false,
        },
        { source: '/thank-you', destination: '/fr/thank-you', permanent: false },
        { source: '/feed.xml', destination: '/fr/feed.xml', permanent: true },
      ];
    },
  }),
};

export default nextConfig;
