import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Optional: proxy legacy static during dev if backend runs on 4000
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    return [
      {
        source: "/legacy/:path*",
        destination: `${api}/:path*`,
      },
    ];
  },
};

export default nextConfig;
