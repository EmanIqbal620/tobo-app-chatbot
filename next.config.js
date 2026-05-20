/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Hugging Face Spaces
  output: 'export',
  
  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    unoptimized: true, // Required for static export
  },
  
  // Enable compression
  compress: true,
  
  // Keep API proxying
  // NOTE: Rewrites removed because Vercel uses HTTP redirect for external URLs,
  // which strips the Authorization header on cross-origin redirects.
  // Frontend now makes direct CORS requests to the backend instead.
  // trailingSlash: true, -- disabled to avoid 308 redirects that cause auth issues
  
  // Optimize bundle size
  webpack: (config, { isServer, dev }) => {
    if (!dev) {
      // Production optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig