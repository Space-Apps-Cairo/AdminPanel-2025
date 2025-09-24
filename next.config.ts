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
        hostname: "staging.spaceappscairo.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "adminpanel.spaceappscairo.com",
        pathname: "/**", // allow all paths from adminpanel
      },
    ],
  },
  matcher: ["/dashboard/:path*"],
};

module.exports = nextConfig;
