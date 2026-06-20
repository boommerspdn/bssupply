import { notFound } from "next/navigation"

import { PageBreadcrumbs } from "@/components/layouts/page-breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { formatPrice, getConditionLabel } from "@/lib/format"
import { getProductByDocumentId, getSiteSettings } from "@/lib/strapi/client"

import { ContactPanel } from "./_components/ContactPanel"
import { ProductGallery } from "./_components/ProductGallery"

type ProductPageParams = Promise<{ documentId: string }>

export default async function ProductPage({ params }: { params: ProductPageParams }) {
  const { documentId } = await params
  const [product, setting] = await Promise.all([
    getProductByDocumentId(documentId),
    getSiteSettings(),
  ])

  if (!product) notFound()

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
      <div className="grid gap-6">
        <PageBreadcrumbs
          items={[
            { label: "หน้าแรก", href: "/" },
            { label: "สินค้าทั้งหมด", href: "/products" },
            ...(product.category
              ? [
                  {
                    label: product.category.name,
                    href: `/categories/${product.category.documentId}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />

        <ProductGallery product={product} />

        <section className="grid gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="muted">{getConditionLabel(product.condition)}</Badge>
          </div>
          <div>
            <h1 className="text-2xl font-semibold leading-tight">{product.name}</h1>
            <p className="mt-2 text-xl font-semibold text-primary">
              {formatPrice(product.price, product.priceNote)}
            </p>
          </div>
          {product.summary ? (
            <p className="max-w-3xl leading-7 text-muted-foreground">{product.summary}</p>
          ) : null}
        </section>

        <section className="grid gap-3">
          <h2 className="text-lg font-semibold">รายละเอียดสินค้า</h2>
          <div className="grid gap-2 rounded-lg border bg-card p-4 text-sm">
            {product.brand ? <SpecRow label="ยี่ห้อ" value={product.brand} /> : null}
            {product.model ? <SpecRow label="รุ่น" value={product.model} /> : null}
            {product.locationNote ? (
              <SpecRow label="หมายเหตุสถานที่" value={product.locationNote} />
            ) : null}
            {product.specs.map((spec) => (
              <SpecRow key={`${spec.label}-${spec.value}`} label={spec.label} value={spec.value} />
            ))}
          </div>
          {product.description ? (
            <div className="whitespace-pre-wrap rounded-lg border bg-card p-4 text-sm leading-7 text-muted-foreground">
              {product.description}
            </div>
          ) : null}
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <ContactPanel product={product} setting={setting} />
      </aside>
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b py-2 last:border-0 sm:grid-cols-[160px_1fr]">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}
