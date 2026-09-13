import type { MetadataRoute } from "next"

import { siteUrl } from "@/lib/metadata"
import { getCategories, getProducts } from "@/lib/strapi/client"

export const dynamic = "force-static"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ pageSize: 100 }),
  ])

  const staticRoutes = ["/", "/products", "/categories", "/contact"]
  const categoryRoutes = categories.map(
    (category) => `/categories/${category.documentId}`
  )
  const productRoutes = products.map((product) => `/products/${product.documentId}`)

  return [...staticRoutes, ...categoryRoutes, ...productRoutes].map((path) => ({
    url: siteUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority:
      path === "/"
        ? 1
        : path.startsWith("/products/") || path.startsWith("/categories/")
          ? 0.7
          : 0.8,
  }))
}
