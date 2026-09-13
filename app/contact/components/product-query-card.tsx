"use client"

import { useMemo, useSyncExternalStore } from "react"

function subscribeToLocation(callback: () => void) {
  window.addEventListener("popstate", callback)
  return () => window.removeEventListener("popstate", callback)
}

function getLocationSearch() {
  return typeof window === "undefined" ? "" : window.location.search
}

export function ProductQueryCard() {
  const locationSearch = useSyncExternalStore(
    subscribeToLocation,
    getLocationSearch,
    () => ""
  )
  const productName = useMemo(
    () => new URLSearchParams(locationSearch).get("product")?.trim(),
    [locationSearch]
  )

  if (!productName) return null

  return (
    <section className="grid gap-2 rounded-lg border bg-muted/40 p-4">
      <p className="text-sm font-medium text-muted-foreground">สินค้าที่ต้องการสอบถาม</p>
      <p className="font-semibold">{productName}</p>
      <p className="text-sm text-muted-foreground">
        ส่งชื่อสินค้านี้พร้อมรุ่นหรือรูปเพิ่มเติมทาง LINE เพื่อให้ทีมงานเช็กสต็อกและสภาพล่าสุด
      </p>
    </section>
  )
}
