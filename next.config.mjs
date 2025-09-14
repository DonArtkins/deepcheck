/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore build errors during CI
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Experimental features
  experimental: {
    // Note: bodySizeLimit has been removed from Next.js experimental features
    // You'll need to handle large uploads differently (see comments below)
  },

  // Configure CORS and other headers
  async headers() {
    return [
      {
        // Apply headers to upload API routes
        source: "/api/dashboard/upload",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          // Increase timeout headers for large uploads
          {
            key: "Keep-Alive",
            value: "timeout=300",
          },
        ],
      },
    ];
  },

  // Webpack configuration for handling large files
  webpack: (config, { isServer }) => {
    // Increase the maximum asset size for large files
    config.performance = {
      ...config.performance,
      maxAssetSize: 3 * 1024 * 1024 * 1024, // 3GB
      maxEntrypointSize: 3 * 1024 * 1024 * 1024, // 3GB
    };

    return config;
  },

  // Images configuration
  images: {
    domains: ["res.cloudinary.com"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
  },

  // Compression settings
  compress: true,

  // Note: swcMinify is now enabled by default in Next.js 13+ and the option has been removed

  // Optional: Configure redirects
  async redirects() {
    return [
      // Add any redirects you might need
    ];
  },
};

export default nextConfig;
