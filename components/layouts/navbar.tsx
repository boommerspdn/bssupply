"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, Menu, Phone, X } from "lucide-react"

import { APP_NAME } from "@/constants"
import type { SiteSetting, SupplyCategory } from "@/types/catalog"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  function closeMenus() {
    setIsCategoryOpen(false)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center"
          aria-label={setting.storeName || APP_NAME}
          onClick={closeMenus}
        >
          {setting.logo ? (
            <img
              src={setting.logo.url}
              alt={
                setting.logo.alternativeText || setting.storeName || APP_NAME
              }
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
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsCategoryOpen(false)
                  }
                }}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isCategoryOpen}
                  aria-controls="desktop-category-menu"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "gap-1.5"
                  )}
                  onClick={() => setIsCategoryOpen((isOpen) => !isOpen)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      setIsCategoryOpen(false)
                    }
                  }}
                >
                  {link.label}
                  <ChevronDown className="size-4" aria-hidden="true" />
                </button>
                <div
                  id="desktop-category-menu"
                  className={cn(
                    "invisible absolute top-full left-0 z-40 w-72 translate-y-2 rounded-lg border bg-popover p-2 opacity-0 shadow-sm transition-all",
                    isCategoryOpen && "visible translate-y-1 opacity-100"
                  )}
                >
                  <Link
                    href={link.href}
                    className="block rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    onClick={() => setIsCategoryOpen(false)}
                  >
                    ดูสินค้าทั้งหมด
                  </Link>
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
              <Link
                key={link.href}
                href={link.href}
                className={buttonVariants({ variant: "ghost" })}
              >
                {link.label}
              </Link>
            )
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
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="bg-white hover:bg-white/90 md:hidden"
                aria-label="เมนู"
              >
                {isMobileMenuOpen ? (
                  <X aria-hidden="true" />
                ) : (
                  <Menu aria-hidden="true" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(22rem,85vw)] p-0 md:hidden"
            >
              <SheetHeader className="border-b">
                <SheetTitle>เมนู</SheetTitle>
                <SheetDescription className="sr-only">
                  ลิงก์นำทางหลักและหมวดหมู่สินค้า
                </SheetDescription>
              </SheetHeader>
              <nav className="grid gap-1 px-4" aria-label="เมนูมือถือ">
                {NAV_LINKS.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                {categories.length ? (
                  <div className="mt-2 grid gap-1 border-t pt-2">
                    <p className="px-3 py-1 text-xs font-medium text-muted-foreground">
                      หมวดหมู่สินค้า
                    </p>
                    {categories.map((category) => (
                      <SheetClose key={category.documentId} asChild>
                        <Link
                          href={`/categories/${category.documentId}`}
                          className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {category.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                ) : null}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
