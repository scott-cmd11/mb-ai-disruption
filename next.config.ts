import type { NextConfig } from "next";
import path from "node:path";

const projectRoot = path.resolve();

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "ai-canada-pulse.vercel.app" }],
        destination: "https://www.aidisruption.ca/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
