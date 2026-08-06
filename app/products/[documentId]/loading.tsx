export default function ProductLoading() {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
      <div className="grid gap-6">
        <div className="h-5 w-72 animate-pulse rounded bg-muted" />
        <div className="aspect-square max-h-[620px] animate-pulse rounded-lg border bg-muted" />
        <div className="grid gap-3">
          <div className="h-6 w-20 animate-pulse rounded bg-muted" />
          <div className="h-9 w-full max-w-xl animate-pulse rounded bg-muted" />
          <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-muted" />
        </div>
      </div>
      <aside className="h-60 animate-pulse rounded-lg border bg-card" />
    </div>
  )
}
