import type { Metadata } from "next"
import { Geist_Mono, Noto_Sans_Thai } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/layouts/footer"
import { Navbar } from "@/components/layouts/navbar"
import { APP_NAME } from "@/constants"
import { getCategories, getSiteSettings } from "@/lib/strapi/client"
import { cn } from "@/lib/utils"

const fontSans = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: APP_NAME,
  description: "แคตตาล็อกสินค้าซัพพลาย อุปกรณ์ไฟฟ้า และเครื่องมือสำหรับงานจริง",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [setting, categories] = await Promise.all([getSiteSettings(), getCategories()])

  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, fontSans.variable)}
    >
      <body>
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
