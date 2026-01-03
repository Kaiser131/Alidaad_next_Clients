/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['page.jsx', 'page.js', 'page.tsx', 'page.ts'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  compress: true,
  poweredByHeader: false,
  output: "standalone",
};

export default nextConfig;
