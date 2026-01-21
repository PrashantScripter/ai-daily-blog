import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gemini.google.com",
        port: "",
        pathname: "/**", // Allow all paths from this host
      },
    ],
  },
};

export default nextConfig;
