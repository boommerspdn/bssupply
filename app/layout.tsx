import type { Metadata } from "next"
import { Geist_Mono, Noto_Sans_Thai } from "next/font/google"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import "./globals.css"
import { LiveSiteShell } from "@/components/live-site-shell"
import { QueryProvider } from "@/components/query-provider"
import { APP_NAME } from "@/constants"
import { seoMetadata } from "@/lib/metadata"
import { getCategories, getSiteSettings } from "@/lib/strapi/client"
import { cmsKeys } from "@/lib/query-keys"
import { cn } from "@/lib/utils"

export const dynamic = "force-dynamic"

const fontSans = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getSiteSettings()

  return seoMetadata(
    setting.seo,
    {
      title: APP_NAME,
      description:
        "แคตตาล็อกสินค้าซัพพลาย อุปกรณ์ไฟฟ้า และเครื่องมือสำหรับงานจริง",
      icon: setting.favicon,
      image: setting.logo,
    },
    { path: "/" }
  )
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const queryClient = new QueryClient()
  await Promise.all([
    queryClient.fetchQuery({ queryKey: cmsKeys.setting, queryFn: getSiteSettings }),
    queryClient.fetchQuery({ queryKey: cmsKeys.categories, queryFn: getCategories }),
  ])

  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, fontSans.variable)}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: `if(performance.getEntriesByType('navigation')[0]?.type==='reload'){history.scrollRestoration='manual';window.addEventListener('pageshow',()=>{requestAnimationFrame(()=>{window.scrollTo({top:0,left:0,behavior:'instant'});history.scrollRestoration='auto'})},{once:true})}` }} />
        <QueryProvider>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <LiveSiteShell>{children}</LiveSiteShell>
          </HydrationBoundary>
        </QueryProvider>
      </body>
    </html>
  )
}
