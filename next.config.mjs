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
    // Optimize bundle splitting - REMOVED to fix date-fns not found error
    // Next.js 15 handles this well automatically
    if (!isServer) {
       // Automatic optimization is preferred
    }

    return config
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig