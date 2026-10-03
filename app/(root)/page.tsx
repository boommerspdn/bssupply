import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { seoMetadata } from "@/lib/metadata"
import { PRODUCT_QUERY_GC_TIME, PRODUCT_QUERY_STALE_TIME } from "@/lib/query-cache"
import { cmsKeys } from "@/lib/query-keys"
import { getHomePage, getProducts } from "@/lib/strapi/client"
import { HomeContent } from "./components/home-content"

export async function generateMetadata() {
  const home = await getHomePage()
  return seoMetadata(home.seo, {
    title: "BS Supply | อุปกรณ์ไฟฟ้า เครื่องมือ และสินค้าอุตสาหกรรม",
    description: home.subheadline,
    image: home.heroImage,
  }, { path: "/" })
}

export default async function HomePage() {
  const queryClient = new QueryClient()
  await Promise.all([
    queryClient.fetchQuery({ queryKey: cmsKeys.home, queryFn: getHomePage }),
    queryClient.fetchQuery({
      queryKey: cmsKeys.products({ sort: "featured", pageSize: 8 }),
      queryFn: () => getProducts({ sort: "featured", pageSize: 8 }),
      staleTime: PRODUCT_QUERY_STALE_TIME,
      gcTime: PRODUCT_QUERY_GC_TIME,
    }),
  ])
  return <HydrationBoundary state={dehydrate(queryClient)}><HomeContent /></HydrationBoundary>
}
