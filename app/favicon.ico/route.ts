import { NextResponse } from "next/server"
import sharp from "sharp"

import { getSiteSettings } from "@/lib/strapi/client"

export async function GET() {
  const setting = await getSiteSettings()

  if (!setting.logo?.url) {
    return new NextResponse("BSSupply logo favicon not found", { status: 404 })
  }

  const logoResponse = await fetch(setting.logo.url, {
    next: { revalidate: 60 },
  })

  if (!logoResponse.ok) {
    return new NextResponse("BSSupply logo favicon not available", { status: 404 })
  }

  const source = Buffer.from(await logoResponse.arrayBuffer())
  const metadata = await sharp(source).metadata()
  const height = metadata.height || 182
  const markWidth = Math.min(metadata.width || 935, Math.round(height * 1.35))
  const favicon = await sharp(source)
    .extract({ left: 0, top: 0, width: markWidth, height })
    .resize(64, 64, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer()

  return new NextResponse(new Uint8Array(favicon), {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=60",
      "Content-Type": "image/png",
    },
  })
}
