export default function HomeLoading() {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-center">
        <div className="grid max-w-3xl gap-5">
          <div className="h-5 w-48 animate-pulse rounded bg-muted" />
          <div className="h-20 w-full max-w-2xl animate-pulse rounded bg-muted sm:h-28" />
          <div className="h-14 w-full max-w-xl animate-pulse rounded bg-muted" />
          <div className="h-12 w-full max-w-2xl animate-pulse rounded-lg border bg-card" />
        </div>
        <div className="aspect-[4/3] animate-pulse rounded-lg bg-muted" />
      </section>

      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-4">
          <div className="h-7 w-32 animate-pulse rounded bg-muted" />
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
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
      </section>
    </div>
  )
}
