import { PageBreadcrumbs } from "@/components/layouts/page-breadcrumbs"
import { ProductCard } from "@/components/product-card"
import { EmptyState } from "@/components/ui/empty-state"
import { seoMetadata } from "@/lib/metadata"
import { getCategories, getCategoryByDocumentId, getProducts } from "@/lib/strapi/client"
import {
  JsonLd,
  breadcrumbJsonLd,
  productItemListJsonLd,
} from "@/lib/structured-data"

type CategoryPageParams = Promise<{ documentId: string }>

export const dynamicParams = false

export async function generateStaticParams() {
  const categories = await getCategories()

  return categories.map((category) => ({
    documentId: category.documentId,
  }))
}

export async function generateMetadata({ params }: { params: CategoryPageParams }) {
  const { documentId } = await params
  const category = await getCategoryByDocumentId(documentId)

  return seoMetadata(
    null,
    {
      title: category ? `${category.name} | BS Supply` : "ไม่พบหมวดหมู่ | BS Supply",
      description:
        category?.description ||
        "เลือกดูสินค้าซัพพลายในหมวดหมู่จาก BS Supply พร้อมตรวจสอบสภาพและสต็อกล่าสุด",
      image: category?.image,
    },
    { path: `/categories/${documentId}` }
  )
}

export default async function CategoryPage({ params }: { params: CategoryPageParams }) {
  const { documentId } = await params
  const [category, products] = await Promise.all([
    getCategoryByDocumentId(documentId),
    getProducts({ categoryDocumentId: documentId }),
  ])

  if (!category) {
    return (
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
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
