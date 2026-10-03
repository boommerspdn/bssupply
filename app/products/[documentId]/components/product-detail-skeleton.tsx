import { Skeleton } from "@/components/ui/skeleton"

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
      <div className="grid gap-6">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-36" />
        </div>

        <Skeleton className="aspect-square rounded-lg" />

        <section className="grid gap-4">
          <Skeleton className="h-7 w-20 rounded-full" />
          <div className="grid gap-2">
            <Skeleton className="h-8 w-full max-w-2xl" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-5 w-full max-w-3xl" />
            <Skeleton className="h-5 w-3/4 max-w-2xl" />
          </div>
        </section>

        <section className="grid gap-3">
          <Skeleton className="h-6 w-40" />
          <div className="grid gap-3 rounded-lg border bg-card p-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="grid gap-3 rounded-lg border bg-card p-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </aside>
    </div>
  )
}
