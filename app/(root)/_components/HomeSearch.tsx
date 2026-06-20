import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HomeSearch({ placeholder }: { placeholder: string }) {
  return (
    <form action="/products" className="flex w-full max-w-2xl gap-2">
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input name="q" placeholder={placeholder} className="h-12 pl-9" />
      </div>
      <Button type="submit" className="h-12 px-5">
        ค้นหา
      </Button>
    </form>
  )
}
