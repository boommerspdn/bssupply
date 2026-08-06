import type { ReactNode } from "react"
import { MapPin, MessageCircle, PackageCheck, Phone, Truck } from "lucide-react"

import { PageBreadcrumbs } from "@/components/layouts/page-breadcrumbs"
import { Button } from "@/components/ui/button"
import { getLineFriendAddUrl } from "@/lib/format"
import { seoMetadata } from "@/lib/metadata"
import { getSiteSettings } from "@/lib/strapi/client"

type ContactSearchParams = Promise<Record<string, string | string[] | undefined>>

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export async function generateMetadata() {
  const setting = await getSiteSettings()

  return seoMetadata(setting.seo, {
    title: "ติดต่อ BS Supply | สอบถามสินค้าและสต็อกล่าสุด",
    description: setting.contactNote,
    image: setting.logo,
  })
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: ContactSearchParams
}) {
  const [setting, params] = await Promise.all([getSiteSettings(), searchParams])
  const productName = first(params.product)

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

      {productName ? (
        <section className="grid gap-2 rounded-lg border bg-muted/40 p-4">
          <p className="text-sm font-medium text-muted-foreground">สินค้าที่ต้องการสอบถาม</p>
          <p className="font-semibold">{productName}</p>
          <p className="text-sm text-muted-foreground">
            ส่งชื่อสินค้านี้พร้อมรุ่นหรือรูปเพิ่มเติมทาง LINE เพื่อให้ทีมงานเช็กสต็อกและสภาพล่าสุด
          </p>
        </section>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <section className="grid gap-4 rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold">ช่องทางติดต่อ</h2>
          <p className="text-sm text-muted-foreground">
            ส่งรูปสินค้าเก่า ป้ายรุ่น หรือสเปกที่ต้องการได้เลย ทีมงานจะช่วยเทียบสินค้าใกล้เคียงให้
          </p>
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

      <section className="grid gap-4 rounded-lg border bg-card p-5">
        <h2 className="text-lg font-semibold">รับสินค้าและจัดส่ง</h2>
        <div className="grid gap-4 text-sm md:grid-cols-3">
          <InfoCard
            icon={<MapPin aria-hidden="true" />}
            title="พื้นที่ให้บริการ"
            description={setting.address || "กรุงเทพฯ และพื้นที่ใกล้เคียง"}
          />
          <InfoCard
            icon={<PackageCheck aria-hidden="true" />}
            title="เช็กก่อนนัดรับ"
            description="กรุณาสอบถามสต็อกและสภาพสินค้าล่าสุดก่อนเข้ารับหรือโอนชำระ"
          />
          <InfoCard
            icon={<Truck aria-hidden="true" />}
            title="จัดส่ง"
            description="รองรับนัดรับหน้าร้านหรือจัดส่งตามตกลง โดยขึ้นอยู่กับขนาดและน้ำหนักสินค้า"
          />
        </div>
      </section>
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

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <div className="grid gap-2 rounded-md bg-muted/40 p-4">
      <div className="flex items-center gap-2 font-medium">
        <span className="text-primary [&_svg]:size-4">{icon}</span>
        {title}
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
