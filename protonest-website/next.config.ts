import type { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";

const noindexPaths = [
  '/dashboard/:path*',
  '/down',
  '/forgot-password',
  '/reset-password',
  '/signin',
  '/signup',
  '/submit-cv',
  '/unsubscribe',
  '/careers/opengraph-image.jpg',
];

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  async headers() {
    return noindexPaths.map((source) => ({
      source,
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex, nofollow',
        },
      ],
    }));
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.protonest.co',
          },
        ],
        destination: 'https://protonest.co/:path*',
        permanent: true,
      },
      {
        source: '/our-services',
        destination: '/',
        permanent: true,
      },
      {
        source: '/welcome-to-protonest-where-iot-ideas-take-flight',
        destination: '/',
        permanent: true,
      },
    ];
  },
  images: {
    // Lets next/image load media from a CMS running on localhost during development
    dangerouslyAllowLocalIP: isDev,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [50, 60, 65, 70, 75, 80, 85, 90, 95, 100],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'protonestwebsite.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.protonest.co',
        port: '',
        pathname: '/api/media/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.dev.protonest.co',
        port: '',
        pathname: '/api/media/**',
      },
      ...(isDev
        ? [{ protocol: 'http' as const, hostname: 'localhost', port: '3001', pathname: '/api/media/**' }]
        : []),
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

const bundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);
