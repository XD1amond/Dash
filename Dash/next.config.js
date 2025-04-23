/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'via.placeholder.com'],
  },
  experimental: {
    serverActions: true,
  },
  async rewrites() {
    return [
      {
        source: '/demo',
        destination: '/?show=demo', // Rewrite /demo to root page with query param
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/demo',
        permanent: true, // Use true for permanent redirect (SEO friendly)
      },
    ]
  },
}

module.exports = nextConfig