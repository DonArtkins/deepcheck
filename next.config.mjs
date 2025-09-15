/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore build errors during CI
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configure CORS and other headers
  async headers() {
    return [
      {
        // Apply headers to all API routes for better handling
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization, X-API-Key",
          },
          // Increase timeout headers for large uploads
          {
            key: "Keep-Alive",
            value: "timeout=1800", // 30 minutes
          },
          // Add headers for large file handling
          {
            key: "Connection",
            value: "keep-alive",
          },
        ],
      },
      {
        // Special headers for upload endpoints
        source: "/api/dashboard/upload",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },

  // Webpack configuration for handling large files and timeouts
  webpack: (config, { isServer }) => {
    // Increase the maximum asset size for large files
    config.performance = {
      ...config.performance,
      maxAssetSize: 5 * 1024 * 1024 * 1024, // 5GB
      maxEntrypointSize: 5 * 1024 * 1024 * 1024, // 5GB
      hints: false, // Disable performance hints for large files
    };

    // Add optimizations for large file handling
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization?.splitChunks,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          ...config.optimization?.splitChunks?.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: 10,
            chunks: "all",
            maxSize: 5000000, // 5MB chunks
          },
        },
      },
    };

    return config;
  },

  // Images configuration with better handling
  images: {
    domains: ["res.cloudinary.com", "cloudinary.com"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true, // Better for Cloudinary-served images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Server configuration for better handling of large requests
  serverRuntimeConfig: {
    // Increase timeouts
    maxDuration: 1800, // 30 minutes for serverless functions (if supported)
  },

  // Compression settings optimized for large files
  compress: true,

  // Experimental features for better performance
  experimental: {
    // Enable helpful features for large file handling
    largePageDataBytes: 256 * 1000, // 256KB (increased from default)
    // Optimize for better performance
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Optional: Configure redirects
  async redirects() {
    return [
      // Add any redirects you might need
    ];
  },

  // Add rewrites for better API handling
  async rewrites() {
    return [
      // You can add API rewrites here if needed
    ];
  },

  // Output configuration
  output: process.env.NODE_ENV === "production" ? "standalone" : undefined,

  // Power optimizations
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
