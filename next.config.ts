import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: `${process.env.API_URL ?? "http://localhost:4000"}/auth/:path*`,
      },
      {
        source: "/chapters",
        destination: `${process.env.API_URL ?? "http://localhost:4000"}/chapters`,
      },
      {
        source: "/chapters/:path*",
        destination: `${process.env.API_URL ?? "http://localhost:4000"}/chapters/:path*`,
      },
    ];
  },
};

export default nextConfig;
