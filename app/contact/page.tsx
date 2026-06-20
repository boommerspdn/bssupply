import { MessageCircle, Phone } from "lucide-react"

import { PageBreadcrumbs } from "@/components/layouts/page-breadcrumbs"
import { Button } from "@/components/ui/button"
import { getLineFriendAddUrl } from "@/lib/format"
import { getSiteSettings } from "@/lib/strapi/client"

export default async function ContactPage() {
  const setting = await getSiteSettings()

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <PageBreadcrumbs
        items={[
          { label: "หน้าแรก", href: "/" },
          { label: "ติดต่อร้าน" },
        ]}
      />

      <div className="grid gap-3">
        <p className="text-sm font-medium text-primary">ติดต่อร้าน</p>
        <h1 className="text-3xl font-semibold">สอบถามสินค้าและสต็อกล่าสุด</h1>
        <p className="max-w-2xl text-muted-foreground">
          {setting.contactNote ||
            "แจ้งชื่อสินค้า รุ่น หรือส่งรูปสินค้าที่ต้องการ ทีมงานจะช่วยตรวจสอบสินค้าใกล้เคียงให้"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="grid gap-4 rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold">ช่องทางติดต่อ</h2>
          <div className="flex flex-wrap gap-2">
            {setting.phone ? (
              <Button asChild>
                <a href={`tel:${setting.phone}`}>
                  <Phone aria-hidden="true" />
                  {setting.phone}
                </a>
              </Button>
            ) : null}
            {setting.lineId ? (
              <Button asChild variant="outline">
                <a
                  href={getLineFriendAddUrl(setting.lineId)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle aria-hidden="true" />
                  {setting.lineId}
                </a>
              </Button>
            ) : null}
          </div>
        </section>

        <section className="grid gap-3 rounded-lg border bg-card p-5 text-sm">
          <h2 className="text-lg font-semibold">ข้อมูลร้าน</h2>
          <InfoRow label="ชื่อร้าน" value={setting.storeName} />
          {setting.address ? <InfoRow label="ที่อยู่" value={setting.address} /> : null}
          {setting.hours ? <InfoRow label="เวลา" value={setting.hours} /> : null}
        </section>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b py-2 last:border-0 sm:grid-cols-[100px_1fr]">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}
