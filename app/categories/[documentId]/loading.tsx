export default function CategoryLoading() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-5 w-64 animate-pulse rounded bg-muted" />
      <div className="grid gap-2">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="h-8 w-80 max-w-full animate-pulse rounded bg-muted" />
        <div className="h-5 w-full max-w-md animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
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
