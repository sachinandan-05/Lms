/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'randomuser.me'],
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
