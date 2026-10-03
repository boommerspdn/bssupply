import { notFound } from "next/navigation"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { seoMetadata } from "@/lib/metadata"
import { cmsKeys } from "@/lib/query-keys"
import { getProductByDocumentId, getSiteSettings } from "@/lib/strapi/client"
import { ProductContent } from "./components/product-content"

type ProductPageParams = Promise<{ documentId: string }>
export async function generateMetadata({ params }: { params: ProductPageParams }) {
  const { documentId } = await params
  const product = await getProductByDocumentId(documentId)
  if (!product) notFound()
  return seoMetadata(null, {
    title: product ? `${product.name} | BS Supply` : "ไม่พบสินค้า | BS Supply",
    description: product?.summary || product?.description || "ดูรายละเอียดสินค้า อุปกรณ์ไฟฟ้า เครื่องมือ และสินค้าซัพพลายจาก BS Supply พร้อมสอบถามสต็อกล่าสุด",
    image: product?.images[0],
  }, { path: `/products/${documentId}` })
}

export default async function ProductPage({ params }: { params: ProductPageParams }) {
  const { documentId } = await params
  const queryClient = new QueryClient()
  await Promise.all([
    queryClient.fetchQuery({ queryKey: cmsKeys.product(documentId), queryFn: () => getProductByDocumentId(documentId) }),
    queryClient.fetchQuery({ queryKey: cmsKeys.setting, queryFn: getSiteSettings }),
  ])
  if (!queryClient.getQueryData(cmsKeys.product(documentId))) notFound()
  return <HydrationBoundary state={dehydrate(queryClient)}><ProductContent documentId={documentId} /></HydrationBoundary>
}
