import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-96 max-w-7xl flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="text-2xl font-semibold">ไม่พบหน้าที่ต้องการ</h1>
      <p className="max-w-md text-muted-foreground">หน้าหรือหมวดหมู่นี้อาจมีการเปลี่ยนแปลง ลองเลือกหมวดหมู่จากหน้าสินค้าทั้งหมด</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild><Link href="/products/">ดูสินค้าทั้งหมด</Link></Button>
        <Button asChild variant="outline"><Link href="/">กลับหน้าแรก</Link></Button>
      </div>
    </div>
  )
}
