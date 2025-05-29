import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'export', // Removed for Server Action support
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // unoptimized: true, // No longer needed as not using static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
