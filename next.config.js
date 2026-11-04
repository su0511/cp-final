
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/cp-final',
  trailingSlash: true,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.metmuseum.org',
      },
      {
        protocol: 'https',
        hostname: 'collectionapi.metmuseum.org',
      },
    ],
  },
};

module.exports = nextConfig;
