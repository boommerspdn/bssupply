import { DEFAULT_LOCALE } from "@/constants"
import type { ProductCondition } from "@/types/catalog"

export function formatPrice(price?: number | null, priceText?: string | null) {
  if (typeof price === "number") {
    return `${new Intl.NumberFormat(DEFAULT_LOCALE, {
      maximumFractionDigits: 0,
    }).format(price)}฿`
  }

  return priceText || "สอบถามราคา"
}

export function getConditionLabel(condition: ProductCondition) {
  const labels: Record<ProductCondition, string> = {
    new: "สินค้าใหม่",
    used: "มือสอง",
    for_parts: "อะไหล่",
    rent: "เช่า",
  }

  return labels[condition]
}

export function getProductPreviewDescription(product: { summary?: string | null; description?: string | null }) {
  return product.summary?.trim() || product.description?.trim() || ""
}

export function getLineFriendAddUrl(lineId: string) {
  const normalizedLineId = lineId.trim()
  const friendAddId = normalizedLineId.startsWith("@")
    ? normalizedLineId
    : "@" + normalizedLineId

  return "https://line.me/R/ti/p/" + friendAddId
}

export function getProductDiscount(product: { price?: number | null; priceAfterDiscount?: number | null }) {
  const { price, priceAfterDiscount } = product
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0 ||
      typeof priceAfterDiscount !== "number" || !Number.isFinite(priceAfterDiscount) ||
      priceAfterDiscount < 0 || priceAfterDiscount >= price) return null
  return { price: priceAfterDiscount, percentage: (price - priceAfterDiscount) / price * 100 }
}

export function getEffectivePrice(product: { price?: number | null; priceAfterDiscount?: number | null }) {
  return getProductDiscount(product)?.price ?? product.price
}
