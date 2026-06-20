import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

type BadgeTone = "default" | "muted" | "success" | "warning" | "danger"

const toneClasses: Record<BadgeTone, string> = {
  default: "border-primary/15 bg-primary/10 text-primary",
  muted: "border-border bg-muted text-muted-foreground",
  success: "border-emerald-900/10 bg-emerald-50 text-emerald-800",
  warning: "border-amber-900/10 bg-amber-50 text-amber-800",
  danger: "border-red-900/10 bg-red-50 text-red-800",
}

export function Badge({
  className,
  tone = "default",
  ...props
}: ComponentProps<"span"> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  )
}
