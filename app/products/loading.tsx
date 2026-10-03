import { Skeleton } from "@/components/ui/skeleton"
import { ProductCatalogSkeleton } from "./components/product-catalog-skeleton"

export default function Loading() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-5 w-48" />
      <div className="grid gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-5 w-full max-w-md" />
      </div>
      <Skeleton className="h-20 w-full" />
      <ProductCatalogSkeleton />
    </div>
  )
}
