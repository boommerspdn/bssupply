"use client"

import { useMemo, useSyncExternalStore } from "react"

import { ProductCard } from "@/components/product-card"
import { EmptyState } from "@/components/ui/empty-state"
import {
  isProductCondition,
  type SupplyCategory,
  type SupplyProduct,
} from "@/types/catalog"

import { ProductFilters } from "./product-filters"

type ProductSort = "featured" | "newest" | "price-asc" | "price-desc"

function first(value: string | null) {
  return value?.trim() || undefined
}

function subscribeToLocation(callback: () => void) {
  window.addEventListener("popstate", callback)
  return () => window.removeEventListener("popstate", callback)
}

function getLocationSearch() {
  return typeof window === "undefined" ? "" : window.location.search
}

function includesQuery(product: SupplyProduct, query: string) {
  const haystack = [
    product.name,
    product.summary,
    product.description,
    product.brand,
    product.model,
    product.locationNote,
    product.category?.name,
    ...product.tags,
    ...product.specs.flatMap((spec) => [spec.label, spec.value]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase()

  return haystack.includes(query.toLocaleLowerCase())
}

function sortProducts(products: SupplyProduct[], sort: ProductSort) {
  return [...products].sort((a, b) => {
    if (sort === "newest") {
      return (b.publishedAt || "").localeCompare(a.publishedAt || "")
    }

    if (sort === "price-asc" || sort === "price-desc") {
      const missingPrice =
        sort === "price-asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
      const aPrice =
        typeof a.price === "number" ? a.price : missingPrice
      const bPrice =
        typeof b.price === "number" ? b.price : missingPrice
      return sort === "price-asc" ? aPrice - bPrice : bPrice - aPrice
    }

    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return (b.publishedAt || "").localeCompare(a.publishedAt || "")
  })
}

export function ProductCatalog({
  categories,
  products,
}: {
  categories: SupplyCategory[]
  products: SupplyProduct[]
}) {
  const locationSearch = useSyncExternalStore(
    subscribeToLocation,
    getLocationSearch,
    () => ""
  )
  const searchParams = useMemo(
    () => new URLSearchParams(locationSearch),
    [locationSearch]
  )
  const query = first(searchParams.get("q"))
  const category = first(searchParams.get("category"))
  const conditionParam = first(searchParams.get("condition"))
  const condition = isProductCondition(conditionParam) ? conditionParam : undefined
  const sortParam = first(searchParams.get("sort"))
  const sort: ProductSort =
    sortParam === "newest" ||
    sortParam === "price-asc" ||
    sortParam === "price-desc"
      ? sortParam
      : "featured"

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (query && !includesQuery(product, query)) return false
      if (category && product.category?.documentId !== category) return false
      if (condition && product.condition !== condition) return false
      return true
    })

    return sortProducts(filtered, sort)
  }, [category, condition, products, query, sort])

  return (
    <>
      <ProductFilters
        categories={categories}
        values={{
          q: query,
          category,
          condition,
          sort,
        }}
      />
      {filteredProducts.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.documentId} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="ไม่พบสินค้า"
          description="ลองเปลี่ยนคำค้นหา หมวดหมู่ หรือส่งรายละเอียดให้ทีมงานช่วยตรวจสอบสินค้าใกล้เคียง"
        />
      )}
    </>
  )
}
