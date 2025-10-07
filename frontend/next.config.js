/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_URL: process.env.API_URL || 'http://localhost:5000',
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig