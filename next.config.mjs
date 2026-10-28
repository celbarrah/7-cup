/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  experimental: {
    // Inline the (small) stylesheet into the HTML: no render-blocking CSS request
    inlineCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [96, 120, 160, 256, 384],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      // Same behaviour as the current site: root goes to the French page
      { source: '/', destination: '/fr', permanent: false },
      // Single post-booking URL for the calendar; lands on the visitor's language
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
      {
        source: '/:dir(images|logos|posters|og|icons)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
