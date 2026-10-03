import { formatPrice, getProductDiscount } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { SupplyProduct } from "@/types/catalog"

export function ProductPrice({ product, className }: { product: SupplyProduct; className?: string }) {
  const discount = getProductDiscount(product)
  return (
    <div className={cn("flex flex-wrap items-center gap-2 font-semibold", className)}>
      <p className={discount ? "text-sale-green" : "text-primary"}>
        {formatPrice(discount?.price ?? product.price, product.priceText)}
      </p>
      {discount && (
        <>
          <span className="text-[0.75em] font-normal text-muted-foreground line-through" aria-label="ราคาเดิม">{formatPrice(product.price)}</span>
          <span className="bg-discount-highlight px-1 text-sale-green">{new Intl.NumberFormat("th-TH", { maximumFractionDigits: 1 }).format(discount.percentage)}%</span>
        </>
      )}
    </div>
  )
}
