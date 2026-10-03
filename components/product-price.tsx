import { formatPrice, getProductDiscount } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { SupplyProduct } from "@/types/catalog"

export function ProductPrice({ product, className }: { product: SupplyProduct; className?: string }) {
  const discount = getProductDiscount(product)
  return (
    <div className={cn("flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold leading-6", className)}>
      <div className="inline-flex flex-wrap items-baseline gap-x-2">
        <p className={cn("whitespace-nowrap tabular-nums", discount ? "text-sale-green" : "text-primary")}>
          {formatPrice(discount?.price ?? product.price, product.priceText)}
        </p>
        {discount && (
          <span className="whitespace-nowrap text-[0.75em] font-normal text-muted-foreground line-through decoration-muted-foreground/60" aria-label="ราคาเดิม">
            {formatPrice(product.price)}
          </span>
        )}
      </div>
      {discount && (
        <span className="inline-flex shrink-0 items-center rounded-full bg-light-green px-2.5 py-0.5 text-xs font-medium leading-5 text-sale-green ring-1 ring-inset ring-sale-green/10">
          ลด {new Intl.NumberFormat("th-TH", { maximumFractionDigits: 1 }).format(discount.percentage)}%
        </span>
      )}
    </div>
  )
}
