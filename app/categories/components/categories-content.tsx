"use client"

import { CmsQueryError } from "@/components/cms-query-error"

import { categoryHref } from "@/lib/category-link"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"

import { ImagePlaceholder } from "@/components/image-placeholder"
import { PageBreadcrumbs } from "@/components/layouts/page-breadcrumbs"
import { ReliableImage } from "@/components/reliable-image"
import { cmsKeys } from "@/lib/query-keys"
import { getCategories } from "@/lib/strapi/client"
import {
  JsonLd,
  breadcrumbJsonLd,
  categoryItemListJsonLd,
} from "@/lib/structured-data"

export function CategoriesContent() {
  const { data: categories, isError: categoriesError, refetch: refetchCategories } = useQuery({ queryKey: cmsKeys.categories, queryFn: getCategories })
  const errorNotice = categoriesError ? <CmsQueryError hasData={categories !== undefined} retry={() => { void refetchCategories() }} /> : null
  if (!categories) return errorNotice

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {errorNotice}
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
            href={categoryHref(category.documentId)}
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
