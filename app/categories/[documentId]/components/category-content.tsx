"use client"

import { CmsQueryError } from "@/components/cms-query-error"

import { useQuery } from "@tanstack/react-query"
import { PageBreadcrumbs } from "@/components/layouts/page-breadcrumbs"
import { ProductCard } from "@/components/product-card"
import { EmptyState } from "@/components/ui/empty-state"
import { PRODUCT_QUERY_GC_TIME, PRODUCT_QUERY_STALE_TIME } from "@/lib/query-cache"
import { cmsKeys } from "@/lib/query-keys"
import { getCategoryByDocumentId, getProducts } from "@/lib/strapi/client"
import {
  JsonLd,
  breadcrumbJsonLd,
  productItemListJsonLd,
} from "@/lib/structured-data"

export function CategoryContent({ documentId }: { documentId: string }) {
  const { data: category, isError: categoryError, refetch: refetchCategory } = useQuery({
    queryKey: cmsKeys.category(documentId),
    queryFn: () => getCategoryByDocumentId(documentId),
  })
  const { data: products, isError: productsError, refetch: refetchProducts } = useQuery({
    queryKey: cmsKeys.products({ categoryDocumentId: documentId }),
    queryFn: () => getProducts({ categoryDocumentId: documentId }),
    staleTime: PRODUCT_QUERY_STALE_TIME,
    gcTime: PRODUCT_QUERY_GC_TIME,
  })
  const errorNotice = categoryError || productsError ? <CmsQueryError hasData={category !== undefined && products !== undefined} retry={() => { void refetchCategory(); void refetchProducts() }} /> : null
  if (category === undefined || !products) return errorNotice

  if (!category) {
    return (
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {errorNotice}
        <PageBreadcrumbs
          items={[
            { label: "หน้าแรก", href: "/" },
            { label: "สินค้าทั้งหมด", href: "/products" },
            { label: "ไม่พบหมวดหมู่" },
          ]}
        />
        <EmptyState
          title="ไม่พบหมวดหมู่นี้"
          description="หมวดหมู่อาจถูกลบหรือยังไม่พร้อมแสดงผล ลองดูสินค้าทั้งหมดแทน"
        />
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {errorNotice}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "หน้าแรก", path: "/" },
          { name: "สินค้าทั้งหมด", path: "/products" },
          { name: category.name, path: `/categories/${category.documentId}` },
        ])}
      />
      <JsonLd
        data={productItemListJsonLd({
          category,
          products,
          path: `/categories/${category.documentId}`,
        })}
      />
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
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
