import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { seoMetadata } from "@/lib/metadata"
import { cmsKeys } from "@/lib/query-keys"
import { getSiteSettings } from "@/lib/strapi/client"
import { ContactContent } from "./components/contact-content"

export async function generateMetadata() {
  const setting = await getSiteSettings()
  return seoMetadata(setting.seo, {
    title: "ติดต่อ BS Supply | สอบถามสินค้าและสต็อกล่าสุด",
    description: setting.contactNote,
    image: setting.logo,
  }, { path: "/contact" })
}

export default async function ContactPage() {
  const queryClient = new QueryClient()
  await queryClient.fetchQuery({ queryKey: cmsKeys.setting, queryFn: getSiteSettings })
  return <HydrationBoundary state={dehydrate(queryClient)}><ContactContent /></HydrationBoundary>
}
