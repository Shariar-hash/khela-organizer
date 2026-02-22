/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'generativelanguage.googleapis.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
