
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
<<<<<<< HEAD
  basePath: process.env.GITHUB_PAGES === 'true' ? '/cp-final' : '',
  trailingSlash: true,
=======
  basePath: '/cp-final',
  trailingSlash: true,

>>>>>>> 70d2fcc6e3a7f206b49f522d206fcb324d8dbc51
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
