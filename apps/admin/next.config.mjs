/** @type {import('next').NextConfig} */
const nextConfig = {
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
