import type { ProductFilters } from "@/types/catalog"

export const cmsKeys = {
  setting: ["bssupply", "setting"] as const,
  categories: ["bssupply", "categories"] as const,
  home: ["bssupply", "home"] as const,
  products: (filters: ProductFilters = {}) => ["bssupply", "products", filters] as const,
  productPage: (filters: ProductFilters) => ["bssupply", "product-page", filters] as const,
  productSuggestions: (filters: ProductFilters) => ["bssupply", "product-suggestions", filters] as const,
  category: (documentId: string) => ["bssupply", "category", documentId] as const,
  product: (documentId: string) => ["bssupply", "product", documentId] as const,
}
