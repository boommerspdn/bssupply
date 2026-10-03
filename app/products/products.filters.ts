import { isProductCondition, type ProductFilters } from "@/types/catalog"
import { CATALOG_PAGE_SIZE } from "./products.constants"

export function parseCatalogFilters(params: URLSearchParams): ProductFilters & { page: number; pageSize: number; sort: NonNullable<ProductFilters["sort"]> } {
  const value = (key: string) => params.get(key)?.trim() || undefined
  const condition = value("condition")
  const sort = value("sort")
  const rawPage = params.get("page") ?? "1"
  const page = Number(rawPage)
  return {
    query: value("q"),
    categoryDocumentId: value("category"),
    condition: isProductCondition(condition) ? condition : undefined,
    sort: sort === "price-asc" || sort === "price-desc" ? sort : "newest",
    page: /^\d+$/.test(rawPage) && Number.isSafeInteger(page) && page > 0 ? page : 1,
    pageSize: CATALOG_PAGE_SIZE,
  }
}
