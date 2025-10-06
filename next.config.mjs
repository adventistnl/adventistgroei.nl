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
    
    return config
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig