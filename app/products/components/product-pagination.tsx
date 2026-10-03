"use client"

import { navigateCatalogLink } from "@/lib/catalog-navigation"
import {
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"

export function ProductPagination({ page, pageCount, search }: {
  page: number
  pageCount: number
  search: string
}) {
  const totalPages = Math.max(1, pageCount)
  const pages = Array.from(new Set([1, page - 1, page, page + 1, totalPages]))
    .filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b)
  const items: Array<number | string> = []
  for (const value of pages) {
    const previous = items.at(-1)
    if (typeof previous === "number" && value - previous === 2) items.push(previous + 1)
    else if (typeof previous === "number" && value - previous > 2) items.push(`gap-${value}`)
    items.push(value)
  }
  function href(target: number) {
    const params = new URLSearchParams(search)
    if (target === 1) params.delete("page")
    else params.set("page", String(target))
    return `/products/${params.size ? `?${params}` : ""}`
  }
  const previousDisabled = page <= 1
  const nextDisabled = page >= totalPages
  return (
    <Pagination aria-label="หน้าสินค้า" className="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious text="ก่อนหน้า" aria-label="หน้าก่อนหน้า"
            href={previousDisabled ? undefined : href(page - 1)}
            aria-disabled={previousDisabled} tabIndex={previousDisabled ? -1 : undefined}
            className={previousDisabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
            onClick={previousDisabled ? (event) => event.preventDefault() : navigateCatalogLink} />
        </PaginationItem>
        {items.map((item) => (
          <PaginationItem key={item}>
            {typeof item === "number" ? (
              <PaginationLink href={href(item)} isActive={item === page}
                aria-label={`หน้า ${item}`} className="cursor-pointer rounded-md shadow-none"
                onClick={navigateCatalogLink}>{item}</PaginationLink>
            ) : <PaginationEllipsis />}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext text="ถัดไป" aria-label="หน้าถัดไป"
            href={nextDisabled ? undefined : href(page + 1)}
            aria-disabled={nextDisabled} tabIndex={nextDisabled ? -1 : undefined}
            className={nextDisabled ? "pointer-events-none opacity-50" : "cursor-pointer"}
            onClick={nextDisabled ? (event) => event.preventDefault() : navigateCatalogLink} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
