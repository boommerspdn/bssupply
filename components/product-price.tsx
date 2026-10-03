import { formatPrice, getProductDiscount } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { SupplyProduct } from "@/types/catalog"

export function ProductPrice({ product, className }: { product: SupplyProduct; className?: string }) {
  const discount = getProductDiscount(product)
  return (
    <div className={cn("font-semibold", className)}>
      <p className="text-primary">
        {formatPrice(discount?.price ?? product.price, product.priceText)}
      </p>
      {discount && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-normal text-muted-foreground line-through" aria-label="ราคาเดิม">{formatPrice(product.price)}</span>
          <span className="text-primary">ลด {new Intl.NumberFormat("th-TH", { maximumFractionDigits: 1 }).format(discount.percentage)}%</span>
        </div>
      )}
    </div>
  )
}
