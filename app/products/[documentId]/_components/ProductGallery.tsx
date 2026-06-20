import { ReliableImage } from "@/components/reliable-image"
import type { SupplyProduct } from "@/types/catalog"

export function ProductGallery({ product }: { product: SupplyProduct }) {
  const [primary, ...rest] = product.images

  return (
    <div className="grid gap-3">
      <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-white">
        {primary ? (
          <ReliableImage
            src={primary.url}
            alt={primary.alternativeText || product.name}
            className="size-full object-contain"
          />
        ) : (
          <div className="grid size-full place-items-center text-sm text-muted-foreground">
            ไม่มีรูปสินค้า
          </div>
        )}
      </div>
      {rest.length ? (
        <div className="grid grid-cols-4 gap-3">
          {rest.slice(0, 4).map((image) => (
            <div
              key={image.url}
              className="aspect-square overflow-hidden rounded-md border bg-white"
            >
              <ReliableImage
                src={image.url}
                alt={image.alternativeText || product.name}
                className="size-full object-contain"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
