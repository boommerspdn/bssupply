"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { ReliableImage } from "@/components/reliable-image"
import { ImagePlaceholder } from "@/components/image-placeholder"
import { Spinner } from "@/components/ui/spinner"
import { cmsKeys } from "@/lib/query-keys"
import { getProductSuggestions } from "@/lib/strapi/client"
import { cn } from "@/lib/utils"
import type { ProductCondition } from "@/types/catalog"

function previewText(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/[#*_`]/g, "").replace(/\s+/g, " ").trim().slice(0, 180)
}

export function ProductSearchInput({ defaultValue = "", className, categoryDocumentId, condition }: {
  defaultValue?: string
  className?: string
  categoryDocumentId?: string
  condition?: ProductCondition
}) {
  const router = useRouter()
  const root = useRef<HTMLDivElement>(null)
  const listId = useId()
  const [value, setValue] = useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [composing, setComposing] = useState(false)
  const query = value.trim().toLocaleLowerCase()
  useEffect(() => {
    if (composing) return
    const timer = window.setTimeout(() => setDebouncedQuery(query), 300)
    return () => window.clearTimeout(timer)
  }, [query, composing])
  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", closeOutside)
    return () => document.removeEventListener("pointerdown", closeOutside)
  }, [open])
  const visible = open && query.length >= 2 && !composing
  const filters = { query: debouncedQuery, categoryDocumentId, condition, sort: "featured" as const, page: 1, pageSize: 6 }
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: cmsKeys.productSuggestions(filters),
    queryFn: ({ signal }) => getProductSuggestions(filters, signal),
    enabled: visible && query === debouncedQuery,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    refetchOnWindowFocus: false,
  })
  const waiting = query !== debouncedQuery || isPending
  const suggestions = query === debouncedQuery ? data ?? [] : []
  return (
    <div ref={root} className="relative min-w-0 flex-1"
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input name="q" value={value} placeholder="ค้นหาชื่อสินค้า รุ่น หรือยี่ห้อ"
        aria-label="ค้นหาชื่อสินค้า รุ่น หรือยี่ห้อ" role="combobox" aria-autocomplete="list"
        aria-expanded={visible} aria-controls={visible ? listId : undefined}
        aria-activedescendant={visible && !waiting && activeIndex >= 0 && suggestions[activeIndex] ? `${listId}-${activeIndex}` : undefined}
        autoComplete="off" className={cn("pl-9", className)}
        onFocus={() => setOpen(true)}
        onChange={(event) => { setValue(event.target.value); setActiveIndex(-1); setOpen(true) }}
        onCompositionStart={() => setComposing(true)} onCompositionEnd={() => setComposing(false)}
        onKeyDown={(event) => {
          if (event.nativeEvent.isComposing) return
          if (event.key === "Escape") { event.preventDefault(); setOpen(false); setActiveIndex(-1) }
          else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault()
            setOpen(true)
            if (!waiting && suggestions.length) {
              const direction = event.key === "ArrowDown" ? 1 : -1
              setActiveIndex((index) => index < 0
                ? direction > 0 ? 0 : suggestions.length - 1
                : (index + direction + suggestions.length) % suggestions.length)
            }
          } else if (event.key === "Enter") {
            if (visible && !waiting && suggestions[activeIndex]) {
              event.preventDefault()
              router.push(`/products/${encodeURIComponent(suggestions[activeIndex].documentId)}/`)
            }
            setOpen(false)
          }
        }} />
      {visible && (
        <div className="absolute top-full right-0 left-0 z-40 mt-2 overflow-hidden rounded-lg border bg-popover text-popover-foreground shadow-lg">
          {waiting ? <p role="status" className="flex items-center justify-center gap-2 p-4 text-center text-sm text-muted-foreground"><Spinner aria-hidden="true" />กำลังค้นหาสินค้า</p>
            : isError ? <div role="alert" className="grid justify-items-center gap-2 p-4 text-center text-sm"><p>ไม่สามารถโหลดคำแนะนำได้</p><button type="button" className="w-fit cursor-pointer text-primary underline" onClick={() => void refetch()}>ลองอีกครั้ง</button></div>
            : suggestions.length === 0 ? <p role="status" className="p-4 text-center text-sm text-muted-foreground">ไม่พบสินค้าที่ตรงกับคำค้นหา</p> : null}
          <ul id={listId} role="listbox" aria-label="สินค้าแนะนำจากการค้นหา" className="max-h-80 overflow-y-auto p-1">
            {!waiting && suggestions.map((product, index) => (
              <li key={product.documentId} role="presentation">
                <Link id={`${listId}-${index}`} href={`/products/${product.documentId}/`} prefetch={false}
                  role="option" aria-selected={index === activeIndex} tabIndex={-1}
                  className={cn("flex cursor-pointer items-center gap-3 rounded-md p-3 hover:bg-accent focus:bg-accent", index === activeIndex && "bg-accent")}
                  onMouseEnter={() => setActiveIndex(index)} onClick={() => setOpen(false)}>
                  <span className="size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                    {product.image ? <ReliableImage src={product.image.url} alt={product.image.alternativeText || product.name} className="size-full object-contain" /> : <ImagePlaceholder className="[&_svg]:size-5" />}
                  </span>
                  <span className="grid min-w-0 gap-1">
                    <span className="line-clamp-1 text-sm font-medium">{product.name}</span>
                    <span className="line-clamp-2 text-xs text-muted-foreground">{previewText(product.description) || "ดูรายละเอียดสินค้า"}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
