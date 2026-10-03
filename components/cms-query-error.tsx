"use client"

import { Button } from "@/components/ui/button"

export function CmsQueryError({ hasData, retry }: { hasData: boolean; retry: () => void }) {
  return (
    <div role="alert" className="grid gap-3 rounded-lg border border-destructive/30 bg-muted/30 p-4">
      <p className="text-sm">{hasData
        ? "ไม่สามารถอัปเดตข้อมูลล่าสุดได้ กำลังแสดงข้อมูลที่โหลดไว้ก่อนหน้านี้"
        : "ไม่สามารถโหลดข้อมูลได้ กรุณาลองอีกครั้ง"}</p>
      <Button variant="outline" className="w-fit" onClick={retry}>ลองอีกครั้ง</Button>
    </div>
  )
}
