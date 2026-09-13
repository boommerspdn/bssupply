import Link from "next/link"

import { ImagePlaceholder } from "@/components/image-placeholder"
import { PageBreadcrumbs } from "@/components/layouts/page-breadcrumbs"
import { ReliableImage } from "@/components/reliable-image"
import { seoMetadata } from "@/lib/metadata"
import { getCategories, getSiteSettings } from "@/lib/strapi/client"
import {
  JsonLd,
  breadcrumbJsonLd,
  categoryItemListJsonLd,
} from "@/lib/structured-data"

export async function generateMetadata() {
  const setting = await getSiteSettings()

  return seoMetadata(
    null,
    {
      title: "หมวดหมู่สินค้า | BS Supply",
      description:
        "เลือกดูหมวดหมู่อุปกรณ์ไฟฟ้า เครื่องมือ และสินค้าซัพพลายจาก BS Supply",
      image: setting.logo,
    },
    { path: "/categories" }
  )
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "หน้าแรก", path: "/" },
          { name: "หมวดหมู่สินค้า", path: "/categories" },
        ])}
      />
      <JsonLd data={categoryItemListJsonLd(categories)} />
      <PageBreadcrumbs
        items={[
          { label: "หน้าแรก", href: "/" },
          { label: "หมวดหมู่สินค้า" },
        ]}
      />

      <div className="grid gap-2">
        <p className="text-sm font-medium text-primary">หมวดหมู่สินค้า</p>
        <h1 className="text-2xl font-semibold">เลือกดูสินค้าตามหมวดหมู่</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          รวมหมวดหมู่สินค้าซัพพลายสำหรับค้นหาอะไหล่ อุปกรณ์ไฟฟ้า เครื่องมือ และสินค้าอุตสาหกรรม
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.documentId}
            href={`/categories/${category.documentId}`}
            className="group grid overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary/40"
          >
            <div className="aspect-[4/3] bg-muted">
              {category.image ? (
                <ReliableImage
                  src={category.image.url}
                  alt={category.image.alternativeText || category.name}
                  className="size-full object-cover transition-transform group-hover:scale-[1.02]"
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
            <div className="grid gap-2 p-4">
              <h2 className="font-semibold group-hover:text-primary">{category.name}</h2>
              {category.description ? (
                <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {category.description}
                </p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
