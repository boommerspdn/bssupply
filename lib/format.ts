import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from "@/constants"
import type { ProductCondition } from "@/types/catalog"

export function formatPrice(price?: number | null, priceNote?: string | null) {
  if (typeof price === "number") {
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: "currency",
      currency: DEFAULT_CURRENCY,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return priceNote || "สอบถามราคา"
}

export function getConditionLabel(condition: ProductCondition) {
  const labels: Record<ProductCondition, string> = {
    new: "สินค้าใหม่",
    used: "มือสอง",
    for_parts: "อะไหล่",
  }

  return labels[condition]
}

export function getLineFriendAddUrl(lineId: string) {
  const normalizedLineId = lineId.trim()
  const friendAddId = normalizedLineId.startsWith("@")
    ? normalizedLineId
    : "@" + normalizedLineId

  return "https://line.me/R/ti/p/" + friendAddId
}
