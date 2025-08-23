/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  // Critical for glass effect performance  
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  // Enable PWA functionality
  images: {
    unoptimized: true,
  },
  // Webpack configuration for Three.js and other modules
  webpack: (config, { isServer }) => {
    // Handle Three.js on server side
    if (isServer) {
      config.externals.push('three', '@react-three/fiber', '@react-three/drei')
    }
    
    // Handle audio files and other assets
    config.module.rules.push({
      test: /\.(mp3|wav|ogg|m4a)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/audio/[name].[hash][ext]'
      }
    })

    // Handle WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'asset/resource',
    })

    return config
  },
  // Transpile specific packages that need it
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', 'howler'],
  // Proxy API requests to backend server
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig