/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Configuración experimental actualizada para Next.js 16
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dropdown-menu'],
  },

  // Configuración de Turbopack para evitar conflictos con webpack
  turbopack: {},
  
  // Configuraciรณn de rewrites para evitar CORS en desarrollo local
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8080/api/:path*',
        },
      ],
    }
  },
  
  // Headers para cache y seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Headers de cache para assets estรกticos
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          // Headers de seguridad
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'http://localhost:8080',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=300',
          },
        ],
      },
    ]
  },
  
  // Bundle analyzer (desarrollo)
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones para producciรณn
    if (!dev && !isServer) {
      // Tree shaking agresivo
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
      
      // Code splitting mejorado
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          // Separar componentes UI grandes
          ui: {
            test: /[\\/]components\/ui[\\/]/,
            name: 'ui-components',
            chunks: 'all',
          },
          // Separar librerรญas por funcionalidad
          charts: {
            test: /[\\/]components\/.*chart[\\/]/,
            name: 'chart-components',
            chunks: 'all',
          },
        },
      }
    }
    
    return config
  },
  
  // Configuraciรณn de compresiรณn
  compress: true,
  
  // Powered by header personalizado
  poweredByHeader: false,
  
  // Generar sitemap automรกticamente
  async generateBuildId() {
    return 'edusearch-build-' + Date.now()
  },
}

export default nextConfig
