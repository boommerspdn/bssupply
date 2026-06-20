"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, Phone } from "lucide-react"

import { APP_NAME } from "@/constants"
import type { SiteSetting, SupplyCategory } from "@/types/catalog"
import { Button } from "@/components/ui/button"
import { getLineFriendAddUrl } from "@/lib/format"
import { cn } from "@/lib/utils"

import { NAV_LINKS } from "./navbar.constants"

export function Navbar({
  setting,
  categories,
}: {
  setting: SiteSetting
  categories: SupplyCategory[]
}) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center"
          aria-label={setting.storeName || APP_NAME}
        >
          {setting.logo ? (
            <img
              src={setting.logo.url}
              alt={setting.logo.alternativeText || setting.storeName || APP_NAME}
              className="max-h-10 w-auto object-contain"
            />
          ) : (
            <span className="truncate text-base font-semibold">
              {setting.storeName || APP_NAME}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="หลัก">
          {NAV_LINKS.map((link) =>
            link.href === "/products" ? (
              <div
                key={link.href}
                className="relative"
                onMouseEnter={() => setIsCategoryOpen(true)}
                onMouseLeave={() => setIsCategoryOpen(false)}
                onFocus={() => setIsCategoryOpen(true)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsCategoryOpen(false)
                  }
                }}
              >
                <Button asChild variant="ghost" className="gap-1.5">
                  <Link href={link.href} aria-haspopup="true" onClick={() => setIsCategoryOpen(false)}>
                    {link.label}
                    <ChevronDown className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <div
                  className={cn(
                    "invisible absolute left-0 top-full z-40 w-72 translate-y-2 rounded-lg border bg-popover p-2 opacity-0 shadow-sm transition-all",
                    isCategoryOpen && "visible translate-y-1 opacity-100",
                  )}
                >
                  {categories.map((category) => (
                    <Link
                      key={category.documentId}
                      href={`/categories/${category.documentId}`}
                      className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => setIsCategoryOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Button key={link.href} asChild variant="ghost">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          {setting.phone ? (
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <a href={`tel:${setting.phone}`}>
                <Phone aria-hidden="true" />
                {setting.phone}
              </a>
            </Button>
          ) : null}
          {setting.lineId ? (
            <Button asChild className="hidden sm:inline-flex">
              <a
                href={getLineFriendAddUrl(setting.lineId)}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="/line-official-icon.png"
                  alt=""
                  className="size-5"
                  aria-hidden="true"
                />
                {setting.lineId}
              </a>
            </Button>
          ) : (
            <Button asChild className="hidden sm:inline-flex">
              <Link href="/contact">สอบถามสินค้า</Link>
            </Button>
          )}
          <Button variant="outline" size="icon" className="md:hidden" aria-label="เมนู">
            <Menu aria-hidden="true" />
          </Button>
        </div>
      </div>
    </header>
  )
}
