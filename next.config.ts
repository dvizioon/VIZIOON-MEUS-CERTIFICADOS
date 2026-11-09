import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  generateBuildId: async () => process.env.SOURCE_COMMIT || String(Date.now()),
  async headers() {
    const imgCache = [
      {
        key: "Cache-Control",
        value: "public, max-age=2592000, stale-while-revalidate=86400",
      },
    ];
    return [
      {
        source:
          "/((?!_next/static|_next/image|favicon.ico|logos/|certificates/|avatar\\.png|.*\\.(?:png|jpe?g|webp|svg|gif|ico|pdf)).*)",
        headers: [
          { key: "Cache-Control", value: "no-store, must-revalidate" },
        ],
      },
      { source: "/logos/:path*", headers: imgCache },
      { source: "/certificates/:path*", headers: imgCache },
      { source: "/avatar.png", headers: imgCache },
    ];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
