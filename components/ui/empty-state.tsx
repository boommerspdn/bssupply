import { SearchX } from "lucide-react"

export function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 px-6 text-center">
      <SearchX className="mb-3 size-8 text-muted-foreground" aria-hidden="true" />
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
