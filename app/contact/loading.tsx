export default function ContactLoading() {
  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-5 w-40 animate-pulse rounded bg-muted" />
      <div className="grid gap-3">
        <div className="h-5 w-28 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full max-w-lg animate-pulse rounded bg-muted" />
        <div className="h-12 w-full max-w-2xl animate-pulse rounded bg-muted" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="grid gap-4 rounded-lg border bg-card p-5">
          <div className="h-7 w-36 animate-pulse rounded bg-muted" />
          <div className="h-12 animate-pulse rounded bg-muted" />
          <div className="flex gap-2">
            <div className="h-10 w-32 animate-pulse rounded bg-muted" />
            <div className="h-10 w-32 animate-pulse rounded bg-muted" />
          </div>
        </section>
        <section className="grid gap-3 rounded-lg border bg-card p-5">
          <div className="h-7 w-28 animate-pulse rounded bg-muted" />
          <div className="h-10 animate-pulse rounded bg-muted" />
          <div className="h-10 animate-pulse rounded bg-muted" />
        </section>
      </div>

      <section className="grid gap-4 rounded-lg border bg-card p-5">
        <div className="h-7 w-40 animate-pulse rounded bg-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-md bg-muted" />
          ))}
        </div>
      </section>
    </div>
  )
}
