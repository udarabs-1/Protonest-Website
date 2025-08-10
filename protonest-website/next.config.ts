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
};

export default nextConfig;
