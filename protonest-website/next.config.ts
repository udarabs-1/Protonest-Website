import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/our-services',
        destination: '/',
        permanent: true, // 301 redirect
      },
      {
        source: '/welcome-to-protonest-where-iot-ideas-take-flight',
        destination: '/',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'protonestwebsite.blob.core.windows.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;