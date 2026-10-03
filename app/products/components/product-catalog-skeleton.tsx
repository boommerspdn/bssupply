import { Skeleton } from "@/components/ui/skeleton"
import { CATALOG_PAGE_SIZE } from "../products.constants"

export function ProductCatalogSkeleton() {
  return (
    <div role="status" aria-label="กำลังโหลดสินค้า" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <span className="sr-only">กำลังโหลดสินค้า</span>
      {Array.from({ length: CATALOG_PAGE_SIZE }, (_, index) => (
        <div key={index} aria-hidden="true" className="overflow-hidden rounded-lg border bg-card">
          <Skeleton className="h-48 rounded-none sm:h-52 lg:h-56" />
          <div className="grid gap-3 p-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
