/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    /* Vercel'in görsel optimizasyonu hesabın kotası dolduğu için 402
       (OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED) dönüyordu — /_next/image
       üzerinden geçen HER görsel production'da kırıktı, ham dosyalar ise
       200 veriyordu. Optimizasyonu kapatınca next/image dosyayı olduğu gibi
       servis ediyor. Kaynaklar zaten .webp.

       Bedeli: responsive yeniden boyutlandırma ve AVIF yok, yani tam boyut
       iniyor (arc görselleri ort. 136 KB). Kota tekrar açılırsa bu satırı
       kaldırmak yeterli — başka hiçbir yeri değiştirmeye gerek yok. */
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'static.wikia.nocookie.net' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'cdn.myanimelist.net' },
    ],
    /* 1920/2048 şart: /hero.webp ve arc kapakları `sizes="100vw"` ile
       full-bleed kullanılıyor. Üst sınır 1200 iken 1440p+ ve retina
       ekranlarda görsel yukarı ölçeklenip bulanıklaşıyordu. */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async headers() {
    return [
      // Immutable cache for hashed static assets (JS, CSS, fonts)
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Long cache for public images
      {
        source: '/:path(characters|arcs|images)/:file*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ],
      },
      // Security headers for all routes
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://static.wikia.nocookie.net https://i.imgur.com https://cdn.myanimelist.net https://avatars.githubusercontent.com",
              "frame-src https://www.onepacetr.net",
              "connect-src 'self' https://va.vercel-scripts.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
