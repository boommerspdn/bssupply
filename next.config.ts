import type { NextConfig } from "next"

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      new URL(`${strapiUrl}/uploads/**`),
      new URL(`${strapiUrl}/wp-content/uploads/**`),
    ],
  },
  allowedDevOrigins: ["192.168.1.13"],
}

export default nextConfig
