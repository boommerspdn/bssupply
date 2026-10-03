import Link from "next/link"
import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLineFriendAddUrl } from "@/lib/format"
import type { SiteSetting } from "@/types/catalog"

export function ContactActions({ setting, className }: { setting: SiteSetting; className?: string }) {
  return <>
          {setting.phone ? (
            <Button asChild variant="outline" className={className}>
              <a href={`tel:${setting.phone}`}>
                <Phone aria-hidden="true" />
                {setting.phone}
              </a>
            </Button>
          ) : null}
          {setting.lineId ? (
            <Button asChild className={className}>
              <a
                href={getLineFriendAddUrl(setting.lineId)}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/line-official-icon.png"
                  alt=""
                  className="size-5"
                  aria-hidden="true"
                />
                {setting.lineId}
              </a>
            </Button>
          ) : (
            <Button asChild className={className}>
              <Link href="/contact">สอบถามสินค้า</Link>
            </Button>
          )}
  </>
}
