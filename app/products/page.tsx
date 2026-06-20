import { PageBreadcrumbs } from "@/components/layouts/page-breadcrumbs"
import { ProductCard } from "@/components/product-card"
import { EmptyState } from "@/components/ui/empty-state"
import { getCategories, getProducts } from "@/lib/strapi/client"
import type { ProductCondition } from "@/types/catalog"

import { ProductFilters } from "./_components/ProductFilters"

type ProductsSearchParams = Promise<Record<string, string | string[] | undefined>>

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: ProductsSearchParams
}) {
  const params = await searchParams
  const query = first(params.q)
  const category = first(params.category)
  const condition = first(params.condition) as ProductCondition | undefined
  const sort = first(params.sort) as "featured" | "newest" | "price-asc" | "price-desc" | undefined

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      query,
      categoryDocumentId: category,
      condition: condition || undefined,
      sort: sort || "featured",
    }),
  ])

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageBreadcrumbs
        items={[
          { label: "หน้าแรก", href: "/" },
          { label: "สินค้าทั้งหมด" },
        ]}
      />

      <div className="grid gap-2">
        <h1 className="text-2xl font-semibold">สินค้าทั้งหมด</h1>
        <p className="text-sm text-muted-foreground">
          ค้นหาจากชื่อสินค้า รุ่น ยี่ห้อ หมวดหมู่ หรือข้อมูลที่เกี่ยวข้อง
        </p>
      </div>
      <ProductFilters
        categories={categories}
        values={{
          q: query,
          category,
          condition,
          sort,
        }}
      />
      {products.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.documentId} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="ไม่พบสินค้า"
          description="ลองเปลี่ยนคำค้นหา หมวดหมู่ หรือส่งรายละเอียดให้ทีมงานช่วยตรวจสอบสินค้าใกล้เคียง"
        />
      )}
    </div>
  )
}
