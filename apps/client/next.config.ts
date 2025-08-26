import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // allow remote images if you later fetch from CMS/CDN
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
