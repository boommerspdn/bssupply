import { ImageResponse } from "next/og"

import { APP_NAME } from "@/constants"

export const dynamic = "force-static"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1c1917 0%, #b45309 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 32, opacity: 0.8, marginBottom: 24 }}>{APP_NAME}</div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2, maxWidth: 960 }}>
          อุปกรณ์ไฟฟ้า เครื่องมือ และสินค้าซัพพลาย
        </div>
        <div style={{ fontSize: 28, opacity: 0.85, marginTop: 32, maxWidth: 900 }}>
          แคตตาล็อกสินค้าซัพพลาย อุปกรณ์ไฟฟ้า และเครื่องมือสำหรับงานจริง
        </div>
      </div>
    ),
    { ...size }
  )
}
