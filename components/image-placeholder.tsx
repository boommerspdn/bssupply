import { ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid size-full place-items-center bg-muted text-muted-foreground",
        className
      )}
      role="img"
      aria-label="Image unavailable"
    >
      <ImageIcon className="size-10 opacity-70" aria-hidden="true" />
    </div>
  )
}
