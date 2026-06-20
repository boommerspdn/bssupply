import Link from "next/link"

import { ReliableImage } from "@/components/reliable-image"
import { Badge } from "@/components/ui/badge"
import { formatPrice, getConditionLabel } from "@/lib/format"
import type { SupplyProduct } from "@/types/catalog"

export function ProductCard({ product }: { product: SupplyProduct }) {
  const image = product.images[0]

  return (
    <Link
      href={`/products/${product.documentId}`}
      className="group grid overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary/40"
    >
      <div className="h-48 bg-white sm:h-52 lg:h-56">
        {image ? (
          <ReliableImage
            src={image.url}
            alt={image.alternativeText || product.name}
            className="size-full object-contain transition-transform group-hover:scale-[1.02]"
          />
        ) : (
          <div className="grid size-full place-items-center px-4 text-center text-sm text-muted-foreground">
            ไม่มีรูปสินค้า
          </div>
        )}
      </div>
      <div className="grid gap-3 p-4">
        <div className="grid gap-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-6">{product.name}</h3>
          <p className="text-sm font-semibold text-primary">
            {formatPrice(product.price, product.priceNote)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="muted">{getConditionLabel(product.condition)}</Badge>
        </div>
      </div>
    </Link>
  )
}
