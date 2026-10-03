import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { seoMetadata } from "@/lib/metadata"
import { cmsKeys } from "@/lib/query-keys"
import { getCategories, getCategoryByDocumentId, getProducts } from "@/lib/strapi/client"
import { CategoryContent } from "./components/category-content"

type CategoryPageParams = Promise<{ documentId: string }>
export const dynamicParams = false

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map(({ documentId }) => ({ documentId }))
}

export async function generateMetadata({ params }: { params: CategoryPageParams }) {
  const { documentId } = await params
  const category = await getCategoryByDocumentId(documentId)
  return seoMetadata(null, {
    title: category ? `${category.name} | BS Supply` : "ไม่พบหมวดหมู่ | BS Supply",
    description: category?.description || "เลือกดูสินค้าซัพพลายในหมวดหมู่จาก BS Supply พร้อมตรวจสอบสภาพและสต็อกล่าสุด",
    image: category?.image,
  }, { path: `/categories/${documentId}` })
}

export default async function CategoryPage({ params }: { params: CategoryPageParams }) {
  const { documentId } = await params
  const queryClient = new QueryClient()
  await Promise.all([
    queryClient.fetchQuery({ queryKey: cmsKeys.category(documentId), queryFn: () => getCategoryByDocumentId(documentId) }),
    queryClient.fetchQuery({ queryKey: cmsKeys.products({ categoryDocumentId: documentId }), queryFn: () => getProducts({ categoryDocumentId: documentId }) }),
  ])
  return <HydrationBoundary state={dehydrate(queryClient)}><CategoryContent documentId={documentId} /></HydrationBoundary>
}
