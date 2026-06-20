import Link from "next/link"
import { Clock, MapPin, Phone } from "lucide-react"

import type { SiteSetting } from "@/types/catalog"
import { APP_NAME } from "@/constants"
import { getLineFriendAddUrl } from "@/lib/format"

export function Footer({ setting }: { setting: SiteSetting }) {
  const currentYear = new Date().getFullYear()
  const storeName = setting.storeName || APP_NAME

  return (
    <footer className="border-t bg-secondary/45">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] md:items-start">
          <div className="max-w-2xl">
            <Link
              href="/"
              className="inline-flex max-w-full items-center"
              aria-label={storeName}
            >
              {setting.logo ? (
                <img
                  src={setting.logo.url}
                  alt={setting.logo.alternativeText || storeName}
                  className="max-h-10 w-auto object-contain"
                />
              ) : (
                <span className="truncate font-semibold">{APP_NAME}</span>
              )}
            </Link>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {setting.contactNote ||
                "แคตตาล็อกสินค้าอุปกรณ์ไฟฟ้า เครื่องมือ และซัพพลายสำหรับงานจริง"}
            </p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex flex-wrap gap-2">
              {setting.phone ? (
                <a
                  href={`tel:${setting.phone}`}
                  className="inline-flex min-h-9 items-center gap-2 rounded-lg border bg-background px-3 font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Phone className="size-4 text-primary" aria-hidden="true" />
                  {setting.phone}
                </a>
              ) : null}
              {setting.lineId ? (
                <a
                  href={getLineFriendAddUrl(setting.lineId)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-primary px-3 font-medium text-primary-foreground transition-colors hover:bg-primary/85"
                >
                  <img
                    src="/line-official-icon.png"
                    alt=""
                    className="size-4 rounded-sm"
                    aria-hidden="true"
                  />
                  {setting.lineId}
                </a>
              ) : null}
            </div>

            <div className="grid gap-2 text-muted-foreground">
              {setting.address ? (
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{setting.address}</span>
                </div>
              ) : null}
              {setting.hours ? (
                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{setting.hours}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {currentYear} {storeName}. All rights reserved.</span>
          <Link href="/products" className="font-medium text-foreground hover:underline">
            ดูสินค้าทั้งหมด
          </Link>
        </div>
      </div>
    </footer>
  )
}
