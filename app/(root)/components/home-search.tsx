"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { ProductSearchInput } from "@/components/product-search-input"

export function HomeSearch() {
  const router = useRouter()

  return (
    <form
      action="/products/"
      className="flex w-full max-w-2xl gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        const query = String(new FormData(event.currentTarget).get("q") ?? "").trim()
        const params = new URLSearchParams()
        if (query) params.set("q", query)
        router.push(`/products/${params.size ? `?${params}` : ""}`)
      }}
    >
      <ProductSearchInput className="h-12" />
      <Button type="submit" className="h-12 cursor-pointer px-5">
        ค้นหา
      </Button>
    </form>
  )
}
