import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "ai-canada-pulse.vercel.app" }],
        destination: "https://www.aicanadapulse.ca/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
