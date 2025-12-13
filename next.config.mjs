import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    // Allow local proxy route with query strings for next/image
    // This fixes: `next/image` Un-configured localPatterns for /api/proxy/file?url=...
    localPatterns: [
      {
        pathname: '/api/proxy/file',
        // Omitting `search` allows any query string (e.g., ?url=...)
      },
      {
        pathname: '/images/**',
      },
      {
        pathname: '/media/**',
      },
      {
        pathname: '/brand/**',
        search: '',
      },
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.ctfassets.net' },
      { protocol: 'https', hostname: 'videos.ctfassets.net' },
      { protocol: 'https', hostname: 'assets.ctfassets.net' },
      { protocol: 'https', hostname: 'zoq5l15g49wj.cdn.contentful.com' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
      // Developer and CDN domains for new data files
      { protocol: 'https', hostname: 'cdn.properties.emaar.com' },
      { protocol: 'https', hostname: 'properties.emaar.com' },
      { protocol: 'https', hostname: 'sobharealty.com' },
      { protocol: 'https', hostname: 'www.sobharealty.com' },
      { protocol: 'https', hostname: 'nakheel.com' },
      { protocol: 'https', hostname: 'www.nakheel.com' },
      { protocol: 'https', hostname: 'nakheel-aut.sitefinity.cloud' },
      // Binghatti domains - wildcard for imgix
      { protocol: 'https', hostname: 'binghatti.com' },
      { protocol: 'https', hostname: 'www.binghatti.com' },
      { protocol: 'https', hostname: 'binghattiweb.imgix.net', pathname: '/**' },
      // DAMAC domains
      { protocol: 'https', hostname: 'damacproperties.com' },
      { protocol: 'https', hostname: 'www.damacproperties.com' },
      { protocol: 'https', hostname: 'prod-cdn.damacproperties.com' },
      { protocol: 'https', hostname: 'cdn.damacproperties.com' },
      // PropertyFinder media CDN
      { protocol: 'https', hostname: 'new-projects-media.propertyfinder.com' },
      { protocol: 'https', hostname: '*.propertyfinder.com' },
      // Image CDNs
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'storage.googleapis.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/**' },
      { protocol: 'https', hostname: 'img.youtube.com', pathname: '/**' },
      // CloudFront CDNs
      { protocol: 'https', hostname: '*.cloudfront.net', pathname: '/**' },
      // External APIs for 3D tours
      { protocol: 'https', hostname: 'aframe.io' },
      { protocol: 'https', hostname: 'cdn.aframe.io' },
      { protocol: 'https', hostname: 'api.propvr.tech' },
      { protocol: 'https', hostname: 'storagecdn.propvr.tech' },
      { protocol: 'https', hostname: 'cdn.propvr.tech' },
      { protocol: 'https', hostname: 'propvr-in-31420.appspot.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'storagecdn.propvr.ai' },
      { protocol: 'https', hostname: 'my.matterport.com' },
      { protocol: 'https', hostname: 'static.matterport.com' },
      { protocol: 'https', hostname: 'cdn.pannellum.org' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
      { protocol: 'https', hostname: 'ajax.googleapis.com' },
      { protocol: 'https', hostname: 'www.googletagmanager.com' },
      { protocol: 'https', hostname: 'www.google-analytics.com' },
      { protocol: 'https', hostname: '*.google-analytics.com' },
      { protocol: 'https', hostname: '*.analytics.google.com' },
      { protocol: 'https', hostname: '*.googletagmanager.com' },
      { protocol: 'https', hostname: '*.google.com' },
      { protocol: 'https', hostname: '*.google.co.in' },
      { protocol: 'https', hostname: '*.clarity.ms' },
      { protocol: 'https', hostname: 'scripts.clarity.ms' },
      { protocol: 'https', hostname: 'www.clarity.ms' },
    ],
    // إعدادات تحسين الصور
    deviceSizes: [480, 768, 1024, 1366, 1600, 1920],
    imageSizes: [128, 256, 384],
    formats: ['image/avif', 'image/webp'],
  },

  reactStrictMode: true,
  poweredByHeader: false,

  // Balanced CSP for production security
  async headers() {
    const csp = [
      "default-src 'self'",
      // Next.js requires 'unsafe-inline' and 'unsafe-eval' in production for hydration
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https: https://fonts.gstatic.com",
      "connect-src 'self'",
      "media-src 'self' https: blob:",
      "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://my.matterport.com https://view.propvr.tech https://docs.google.com https://*.google.com",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: ['swiper', 'framer-motion', 'lucide-react'],
  },

  // Compression and optimization
  compress: true,
};
export default nextConfig;
