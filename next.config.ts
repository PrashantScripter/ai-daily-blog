import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // Add this for Clerk images
        port: "",
        pathname: "/**",
      },
    ],
  },
  serverExternalPackages: ["pg", "@prisma/client", "@prisma/adapter-pg"],
};

export default nextConfig;
