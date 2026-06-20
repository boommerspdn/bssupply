import { Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getLineFriendAddUrl } from "@/lib/format"
import type { SiteSetting, SupplyProduct } from "@/types/catalog"

export function ContactPanel({
  product,
  setting,
}: {
  product: SupplyProduct
  setting: SiteSetting
}) {
  const lineHref = setting.lineId ? getLineFriendAddUrl(setting.lineId) : "/contact"

  return (
    <div className="grid gap-3 rounded-lg border bg-card p-4">
      <div>
        <div className="text-sm font-semibold">สนใจสินค้านี้</div>
        <p className="mt-1 text-sm text-muted-foreground">
          แจ้งชื่อสินค้าและรหัสสินค้าให้ทีมงานตรวจสอบสภาพและสต็อกล่าสุด
        </p>
      </div>
      <div className="flex min-w-0 items-center gap-1 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
        <span className="shrink-0">ชื่อสินค้า:</span>
        <span className="min-w-0 truncate">{product.name}</span>
      </div>
      {setting.phone ? (
        <Button asChild>
          <a href={`tel:${setting.phone}`}>
            <Phone aria-hidden="true" />
            โทรสอบถาม
          </a>
        </Button>
      ) : null}
      <Button asChild variant="outline">
        <a
          href={lineHref}
          target={setting.lineId ? "_blank" : undefined}
          rel={setting.lineId ? "noreferrer" : undefined}
        >
          {setting.lineId ? (
            <img
              src="/line-official-icon.png"
              alt=""
              className="size-5"
              aria-hidden="true"
            />
          ) : null}
          {setting.lineId || "สอบถามทาง LINE"}
        </a>
      </Button>
    </div>
  )
}
