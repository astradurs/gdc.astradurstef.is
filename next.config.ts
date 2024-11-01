/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
    ],
  },
  compiler: {
    // Remove console logs only in production
    removeConsole: process.env.NODE_ENV === "production",
  },
}

module.exports = nextConfig
