import type { NextConfig } from "next"
import path from "node:path"

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337"

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, ".."),
  turbopack: { root: path.join(__dirname, "..") },
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
