/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverActions: true, // Moved from experimental
  images: {
    domains: ['localhost', 'via.placeholder.com'],
  },
  // 'experimental' block can be removed if empty, or kept if other experimental features are added later.
  // For now, let's remove it assuming serverActions was the only key.
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