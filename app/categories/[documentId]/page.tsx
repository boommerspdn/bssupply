import { notFound } from "next/navigation"

import { PageBreadcrumbs } from "@/components/layouts/page-breadcrumbs"
import { ProductCard } from "@/components/product-card"
import { EmptyState } from "@/components/ui/empty-state"
import { getCategoryByDocumentId, getProducts } from "@/lib/strapi/client"

type CategoryPageParams = Promise<{ documentId: string }>

export default async function CategoryPage({ params }: { params: CategoryPageParams }) {
  const { documentId } = await params
  const [category, products] = await Promise.all([
    getCategoryByDocumentId(documentId),
    getProducts({ categoryDocumentId: documentId }),
  ])

  if (!category) notFound()

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <PageBreadcrumbs
        items={[
          { label: "หน้าแรก", href: "/" },
          { label: "สินค้าทั้งหมด", href: "/products" },
          { label: category.name },
        ]}
      />

      <div className="grid gap-2">
        <p className="text-sm font-medium text-primary">หมวดหมู่สินค้า</p>
        <h1 className="text-2xl font-semibold">{category.name}</h1>
        {category.description ? (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {category.description}
          </p>
        ) : null}
      </div>
      {products.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.documentId} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="ยังไม่มีสินค้าในหมวดหมู่นี้"
          description="ลองดูหมวดหมู่อื่น หรือส่งรายละเอียดสินค้าให้ทีมงานช่วยตรวจสอบ"
        />
      )}
    </div>
  )
}
