"use client"

import { ProductPrice } from "@/components/product-price"
import { categoryHref } from "@/lib/category-link"

import { useQuery } from "@tanstack/react-query"
import { PageBreadcrumbs } from "@/components/layouts/page-breadcrumbs"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { getConditionLabel, getProductPreviewDescription } from "@/lib/format"
import { cmsKeys } from "@/lib/query-keys"
import { getProductByDocumentId, getSiteSettings } from "@/lib/strapi/client"
import { JsonLd, breadcrumbJsonLd, productJsonLd } from "@/lib/structured-data"

import { ContactPanel } from "./contact-panel"
import { ProductGallery } from "./product-gallery"

export function ProductContent({ documentId }: { documentId: string }) {
  const { data: product } = useQuery({
    queryKey: cmsKeys.product(documentId),
    queryFn: () => getProductByDocumentId(documentId),
  })
  const { data: setting } = useQuery({ queryKey: cmsKeys.setting, queryFn: getSiteSettings })
  if (product === undefined || !setting) return null

  if (!product) {
    return (
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <PageBreadcrumbs
          items={[
            { label: "หน้าแรก", href: "/" },
            { label: "สินค้าทั้งหมด", href: "/products" },
            { label: "ไม่พบสินค้า" },
          ]}
        />
        <EmptyState
          title="ไม่พบสินค้านี้"
          description="สินค้าอาจถูกลบหรือยังไม่พร้อมแสดงผล ลองดูสินค้าทั้งหมดหรือส่งรายละเอียดให้ทีมงานช่วยตรวจสอบ"
        />
      </div>
    )
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "หน้าแรก", path: "/" },
          { name: "สินค้าทั้งหมด", path: "/products" },
          ...(product.category
            ? [
                {
                  name: product.category.name,
                  path: `/categories/${product.category.documentId}`,
                },
              ]
            : []),
          { name: product.name, path: `/products/${product.documentId}` },
        ])}
      />
      <JsonLd data={productJsonLd(product)} />
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
                    href: categoryHref(product.category.documentId),
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />

        <ProductGallery product={product} />

        <section className="grid gap-4">
          {product.condition ? (
            <div className="flex flex-wrap gap-2">
              <Badge tone="muted">{getConditionLabel(product.condition)}</Badge>
            </div>
          ) : null}
          <div>
            <h1 className="text-2xl font-semibold leading-tight">{product.name}</h1>
            <ProductPrice product={product} className="mt-2 text-xl" />
          </div>
          {product.summary ? (
            <p className="max-w-3xl leading-7 text-muted-foreground">{getProductPreviewDescription(product)}</p>
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
    </>
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
