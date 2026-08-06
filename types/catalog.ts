export const PRODUCT_CONDITIONS = ["new", "used", "for_parts"] as const

export type ProductCondition = (typeof PRODUCT_CONDITIONS)[number]

export function isProductCondition(value: unknown): value is ProductCondition {
  return (
    typeof value === "string" &&
    (PRODUCT_CONDITIONS as readonly string[]).includes(value)
  )
}

export interface MediaAsset {
  url: string
  alternativeText?: string | null
}

export interface SeoData {
  title?: string | null
  description?: string | null
}

export interface ProductSpec {
  label: string
  value: string
}

export interface SupplyCategory {
  documentId: string
  name: string
  description?: string | null
  image?: MediaAsset | null
  sortOrder: number
}

export interface SupplyProduct {
  documentId: string
  name: string
  summary?: string | null
  description?: string | null
  images: MediaAsset[]
  category?: SupplyCategory | null
  condition: ProductCondition | null
  brand?: string | null
  model?: string | null
  price?: number | null
  priceNote?: string | null
  locationNote?: string | null
  tags: string[]
  specs: ProductSpec[]
  featured: boolean
  publishedAt?: string | null
}

export interface HomePageContent {
  headline: string
  heroImage?: MediaAsset | null
  subheadline?: string | null
  searchPlaceholder: string
  featuredProducts: SupplyProduct[]
  seo?: SeoData | null
}

export interface SiteSetting {
  storeName: string
  logo?: MediaAsset | null
  phone?: string | null
  lineId?: string | null
  address?: string | null
  hours?: string | null
  contactNote?: string | null
  seo?: SeoData | null
}

export interface ProductFilters {
  query?: string
  categoryDocumentId?: string
  condition?: ProductCondition
  sort?: "featured" | "newest" | "price-asc" | "price-desc"
  page?: number
}
