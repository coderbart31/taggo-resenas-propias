import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the app root so Turbopack doesn't walk up to the home directory
  // (there is a stray package-lock.json in ~/).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
