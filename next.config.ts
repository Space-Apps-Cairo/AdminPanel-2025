/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "development.spaceappscairo.com",
        pathname: "/**", // allow all paths
      },
    ],
  },
  matcher: ["/dashboard/:path*"],
};

module.exports = nextConfig;
