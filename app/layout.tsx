import type { Metadata } from "next"
import { Geist_Mono, Noto_Sans_Thai } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/layouts/footer"
import { Navbar } from "@/components/layouts/navbar"
import { APP_NAME } from "@/constants"
import { seoMetadata } from "@/lib/metadata"
import { getCategories, getSiteSettings } from "@/lib/strapi/client"
import {
  JsonLd,
  localBusinessJsonLd,
  websiteJsonLd,
} from "@/lib/structured-data"
import { cn } from "@/lib/utils"

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

  return seoMetadata(setting.seo, {
    title: APP_NAME,
    description:
      "แคตตาล็อกสินค้าซัพพลาย อุปกรณ์ไฟฟ้า และเครื่องมือสำหรับงานจริง",
    icon: setting.favicon,
    image: setting.logo,
  })
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [setting, categories] = await Promise.all([
    getSiteSettings(),
    getCategories(),
  ])

  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, fontSans.variable)}
    >
      <body>
        <JsonLd data={localBusinessJsonLd(setting)} />
        <JsonLd data={websiteJsonLd()} />
        <ThemeProvider>
          <div className="flex min-h-svh flex-col">
            <Navbar setting={setting} categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer setting={setting} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
