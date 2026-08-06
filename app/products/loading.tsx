export default function ProductsLoading() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-5 w-40 animate-pulse rounded bg-muted" />
      <div className="grid gap-2">
        <div className="h-8 w-52 animate-pulse rounded bg-muted" />
        <div className="h-5 w-full max-w-md animate-pulse rounded bg-muted" />
      </div>
      <div className="h-16 animate-pulse rounded-lg border bg-card" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="grid overflow-hidden rounded-lg border bg-card">
            <div className="h-48 animate-pulse bg-muted sm:h-52 lg:h-56" />
            <div className="grid gap-3 p-4">
              <div className="h-5 animate-pulse rounded bg-muted" />
              <div className="h-5 w-20 animate-pulse rounded bg-muted" />
              <div className="h-8 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
