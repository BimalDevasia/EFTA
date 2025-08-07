/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    missingSuspenseWithCSRBailout: false,
  },
  pageExtensions: ['jsx', 'js'],
  webpack(config) {
    return config;
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Force dynamic rendering for all pages to avoid build issues
  output: 'standalone',
  // Disable static generation
  distDir: '.next',
};

export default nextConfig;
