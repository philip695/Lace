import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@lace/db', '@lace/ui', '@lace/config'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
