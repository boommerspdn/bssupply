"use client"

import { useEffect, useMemo, useState, useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { CmsQueryError } from "@/components/cms-query-error"
import { ProductCard } from "@/components/product-card"
import { EmptyState } from "@/components/ui/empty-state"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { cmsKeys } from "@/lib/query-keys"
import { getCategories, getProductPage } from "@/lib/strapi/client"
import { parseCatalogFilters } from "../products.filters"
import { ProductFilters } from "./product-filters"
import { ProductCatalogSkeleton } from "./product-catalog-skeleton"
import { ProductPagination } from "./product-pagination"

function subscribeToLocation(callback: () => void) {
  window.addEventListener("popstate", callback)
  return () => window.removeEventListener("popstate", callback)
}

function getLocationSearch() {
  return typeof window === "undefined" ? "" : window.location.search
}

function updateLocation(params: URLSearchParams, replace = false) {
  const nextSearch = params.size ? `?${params}` : ""
  if (nextSearch === window.location.search) return
  window.history[replace ? "replaceState" : "pushState"](
    null, "", `${window.location.pathname}${nextSearch}${window.location.hash}`
  )
  window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }))
}

export function ProductCatalog({ initialSearch = "" }: { initialSearch?: string }) {
  const isCatalogRoute = usePathname().replace(/\/$/, "") === "/products"
  const locationSearch = useSyncExternalStore(
    subscribeToLocation,
    () => isCatalogRoute ? getLocationSearch() : "",
    () => initialSearch
  )
  const searchParams = useMemo(() => new URLSearchParams(locationSearch ?? ""), [locationSearch])
  const filters = parseCatalogFilters(searchParams)
  const { query, categoryDocumentId: category, condition, sort, page } = filters
  const {
    data: categories, isError: categoriesError, refetch: refetchCategories,
  } = useQuery({ queryKey: cmsKeys.categories, queryFn: getCategories })
  const {
    data, isError: productsError, isFetching, refetch: refetchProducts,
  } = useQuery({
    queryKey: cmsKeys.productPage(filters),
    queryFn: ({ signal }) => getProductPage(filters, signal),
    enabled: locationSearch !== null && isCatalogRoute,
    staleTime: 60_000,
    gcTime: 15 * 60_000,
  })
  const [hasLoaded, setHasLoaded] = useState(false)
  if (!hasLoaded && data && locationSearch !== null) setHasLoaded(true)
  // A collection may shrink between requests. Recover to its last valid page.
  useEffect(() => {
    if (!data || isFetching || !isCatalogRoute || locationSearch === null) return
    const lastPage = Math.max(1, data.pagination.pageCount)
    if (page > lastPage) {
      const params = new URLSearchParams(locationSearch)
      if (lastPage === 1) params.delete("page")
      else params.set("page", String(lastPage))
      updateLocation(params, true)
    }
  }, [data, isFetching, isCatalogRoute, locationSearch, page])

  const loading = locationSearch === null || (!data && !productsError)
  const errorNotice = categoriesError || productsError ? (
    <CmsQueryError hasData={categories !== undefined && data !== undefined}
      retry={() => { void refetchCategories(); void refetchProducts() }} />
  ) : null
  return (
    <>
      {errorNotice}
      {categories ? (
        <ProductFilters key={locationSearch ?? "hydrating"} categories={categories}
          isLoading={loading && hasLoaded}
          onApply={(params) => {
            params.delete("page")
            if (params.toString() === new URLSearchParams(window.location.search).toString()) {
              void refetchProducts()
            } else updateLocation(params)
          }}
          values={{ q: query, category, condition, sort }} />
      ) : !categoriesError ? <Skeleton className="h-20 w-full" aria-label="กำลังโหลดตัวกรอง" /> : null}
      <section aria-label="ผลการค้นหาสินค้า" aria-busy={loading || isFetching} className="grid gap-5">
        {loading ? hasLoaded ? (
          <div role="status" className="flex min-h-60 items-center justify-center gap-2 text-sm text-muted-foreground">
            <Spinner aria-hidden="true" /> กำลังค้นหาสินค้า
          </div>
        ) : <ProductCatalogSkeleton /> : data ? (
          <>
            {data.products.length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {data.products.map((product) => <ProductCard key={product.documentId} product={product} />)}
              </div>
            ) : <EmptyState title="ไม่พบสินค้า" description="ลองเปลี่ยนคำค้นหา หมวดหมู่ หรือส่งรายละเอียดให้ทีมงานช่วยตรวจสอบสินค้าใกล้เคียง" />}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
              <p className="text-sm text-muted-foreground">{data.pagination.total ? `แสดง ${(page - 1) * filters.pageSize + 1}–${(page - 1) * filters.pageSize + data.products.length} จาก ${data.pagination.total} รายการ` : "0 รายการ"}</p>
              <ProductPagination page={page} pageCount={data.pagination.pageCount} search={locationSearch ?? ""} />
            </div>
          </>
        ) : null}
      </section>
    </>
  )
}
