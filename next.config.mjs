/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [],
  },
  trailingSlash: false,

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  experimental: {
    // Removido optimizePackageImports para corrigir erro de chunking do lucide-react
  },

  webpack: (config, { isServer }) => {
    // Fix chunk loading errors
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    // Optimize bundle splitting
    if (!isServer) {
      // Ensure splitChunks is an object
      if (!config.optimization.splitChunks || typeof config.optimization.splitChunks !== 'object') {
        config.optimization.splitChunks = {}
      }
      
      config.optimization.splitChunks.chunks = 'all'
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        radix: {
          test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
          name: 'radix-ui',
          chunks: 'all',
          priority: 20,
        },
        lucide: {
          test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
          name: 'lucide-react',
          chunks: 'all',
          priority: 20,
        },
      }
    }

    return config
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig