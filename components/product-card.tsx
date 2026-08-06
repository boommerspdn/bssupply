import Link from "next/link"

import { ImagePlaceholder } from "@/components/image-placeholder"
import { ReliableImage } from "@/components/reliable-image"
import { Badge } from "@/components/ui/badge"
import { formatPrice, getConditionLabel } from "@/lib/format"
import type { SupplyProduct } from "@/types/catalog"

export function ProductCard({ product }: { product: SupplyProduct }) {
  const image = product.images[0]
  const productHref = `/products/${product.documentId}`

  return (
    <article className="group grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-lg border bg-card transition-colors hover:border-primary/40">
      <Link href={productHref} className="block">
        <div className="h-48 bg-muted sm:h-52 lg:h-56">
          {image ? (
            <ReliableImage
              src={image.url}
              alt={image.alternativeText || product.name}
              className="size-full object-contain transition-transform group-hover:scale-[1.02]"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
      </Link>
      <div className="grid min-w-0 grid-rows-[auto_auto_auto] gap-3 p-4">
        <div className="grid min-w-0 gap-1">
          <h3 className="h-12 min-w-0 text-sm font-semibold leading-6">
            <Link href={productHref} className="line-clamp-2 block hover:text-primary">
              {product.name}
            </Link>
          </h3>
          <p className="h-5 truncate text-sm font-semibold text-primary">
            {formatPrice(product.price, product.priceNote)}
          </p>
        </div>
        <div className="flex h-7 min-w-0 flex-wrap gap-2 overflow-hidden">
          {product.condition ? (
            <Badge tone="muted">{getConditionLabel(product.condition)}</Badge>
          ) : null}
        </div>
        <p className="line-clamp-2 h-8 min-w-0 text-xs leading-4 text-muted-foreground">
          {product.locationNote}
        </p>
      </div>
    </article>
  )
}
