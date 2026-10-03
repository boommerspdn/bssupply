"use client"

import { useQuery } from "@tanstack/react-query"

import { Footer } from "@/components/layouts/footer"
import { Navbar } from "@/components/layouts/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { cmsKeys } from "@/lib/query-keys"
import { getCategories, getSiteSettings } from "@/lib/strapi/client"
import { JsonLd, localBusinessJsonLd, websiteJsonLd } from "@/lib/structured-data"

export function LiveSiteShell({ children }: { children: React.ReactNode }) {
  const { data: setting } = useQuery({ queryKey: cmsKeys.setting, queryFn: getSiteSettings })
  const { data: categories } = useQuery({ queryKey: cmsKeys.categories, queryFn: getCategories })
  if (!setting || !categories) return null

  return <>
    <JsonLd data={localBusinessJsonLd(setting)} />
    <JsonLd data={websiteJsonLd()} />
    <ThemeProvider>
      <div className="flex min-h-svh flex-col">
        <Navbar setting={setting} categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer setting={setting} />
      </div>
    </ThemeProvider>
  </>
}
