export type ProductCondition = "new" | "used" | "refurbished" | "for_parts"

export interface MediaAsset {
  url: string
  alternativeText?: string | null
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
  condition: ProductCondition
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
}

export interface SiteSetting {
  storeName: string
  logo?: MediaAsset | null
  phone?: string | null
  lineId?: string | null
  address?: string | null
  hours?: string | null
  contactNote?: string | null
}

export interface ProductFilters {
  query?: string
  categoryDocumentId?: string
  condition?: ProductCondition
  sort?: "featured" | "newest" | "price-asc" | "price-desc"
  page?: number
}
