import { PageBreadcrumbs } from "@/components/layouts/page-breadcrumbs"
import { seoMetadata } from "@/lib/metadata"
import { getCategories, getProducts, getSiteSettings } from "@/lib/strapi/client"
import {
  JsonLd,
  breadcrumbJsonLd,
  productItemListJsonLd,
} from "@/lib/structured-data"

import { ProductCatalog } from "./components/product-catalog"

export async function generateMetadata() {
  const setting = await getSiteSettings()

  return seoMetadata(
    null,
    {
      title: "สินค้าทั้งหมด | BS Supply",
      description:
        "ค้นหาอุปกรณ์ไฟฟ้า เครื่องมือ และสินค้าซัพพลายมือหนึ่งและมือสองจาก BS Supply ตามชื่อสินค้า รุ่น ยี่ห้อ หรือหมวดหมู่",
      image: setting.logo,
    },
    { path: "/products" }
  )
}

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ pageSize: 100 }),
  ])

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "หน้าแรก", path: "/" },
          { name: "สินค้าทั้งหมด", path: "/products" },
        ])}
      />
      <JsonLd data={productItemListJsonLd({ products, path: "/products" })} />
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
      <ProductCatalog categories={categories} products={products} />
    </div>
  )
}
