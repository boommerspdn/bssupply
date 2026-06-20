import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from "@/constants"

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

export function getConditionLabel(condition: string) {
  const labels: Record<string, string> = {
    new: "สินค้าใหม่",
    used: "มือสอง",
    refurbished: "ปรับสภาพแล้ว",
    for_parts: "อะไหล่",
  }

  return labels[condition] || condition
}

export function getLineFriendAddUrl(lineId: string) {
  const normalizedLineId = lineId.trim()
  const friendAddId = normalizedLineId.startsWith("@")
    ? normalizedLineId
    : "@" + normalizedLineId

  return "https://line.me/R/ti/p/" + friendAddId
}
