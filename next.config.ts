import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'amethyst-quick-sailfish-437.mypinata.cloud', // Replace with your image host (e.g., 'cdn.sanity.io', 'res.cloudinary.com')
        port: '', // Leave empty if no specific port is needed
        pathname: '/**', // Use '/**' to allow all paths, or be more specific
      },
    ],
  },
};

export default nextConfig;
