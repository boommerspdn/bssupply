import Link from "next/link"
import { ProductPrice } from "@/components/product-price"

import { ImagePlaceholder } from "@/components/image-placeholder"
import { ReliableImage } from "@/components/reliable-image"
import { Badge } from "@/components/ui/badge"
import { getConditionLabel, getProductPreviewDescription } from "@/lib/format"
import type { SupplyProduct } from "@/types/catalog"

export function ProductCard({ product }: { product: SupplyProduct }) {
  const image = product.images[0]
  return (
    <article className="group h-full overflow-hidden rounded-lg border bg-card transition-all hover:border-primary/40 hover:shadow-md focus-within:border-primary/40">
      <Link href={`/products/${product.documentId}`} className="grid h-full cursor-pointer grid-rows-[auto_1fr] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
        <div className="aspect-[4/3] bg-muted">
          {image ? <ReliableImage src={image.url} alt={image.alternativeText || product.name}
            className="size-full object-contain transition-transform group-hover:scale-[1.02]" /> : <ImagePlaceholder />}
        </div>
        <div className="flex min-w-0 flex-col gap-2.5 p-4">
          <div className="grid min-w-0 gap-1">
            <h3 className="line-clamp-2 h-10 min-w-0 text-sm font-semibold leading-5 group-hover:text-primary">{product.name}</h3>
            <ProductPrice product={product} className="text-sm" />
          </div>
          <div className="flex h-7 min-w-0 flex-wrap gap-2 overflow-hidden">
            {product.condition ? <Badge tone="muted">{getConditionLabel(product.condition)}</Badge> : null}
          </div>
          <p className="line-clamp-2 h-8 min-w-0 text-xs leading-4 text-muted-foreground">{getProductPreviewDescription(product)}</p>
        </div>
      </Link>
    </article>
  )
}
