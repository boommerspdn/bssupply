import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { seoMetadata } from "@/lib/metadata"
import { cmsKeys } from "@/lib/query-keys"
import { getCategories, getSiteSettings } from "@/lib/strapi/client"
import { CategoriesContent } from "./components/categories-content"

export async function generateMetadata() {
  const setting = await getSiteSettings()
  return seoMetadata(null, {
    title: "หมวดหมู่สินค้า | BS Supply",
    description: "เลือกดูหมวดหมู่อุปกรณ์ไฟฟ้า เครื่องมือ และสินค้าซัพพลายจาก BS Supply",
    image: setting.logo,
  }, { path: "/categories" })
}

export default async function CategoriesPage() {
  const queryClient = new QueryClient()
  await queryClient.fetchQuery({ queryKey: cmsKeys.categories, queryFn: getCategories })
  return <HydrationBoundary state={dehydrate(queryClient)}><CategoriesContent /></HydrationBoundary>
}
