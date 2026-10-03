export const CATALOG_PAGE_SIZE = 20

export const INITIAL_CATALOG_FILTERS = {
  sort: "newest",
  page: 1,
  pageSize: CATALOG_PAGE_SIZE,
} as const

export const CONDITION_OPTIONS = [
  { value: "", label: "ทุกสภาพ" },
  { value: "new", label: "สินค้าใหม่" },
  { value: "used", label: "มือสอง" },
  { value: "for_parts", label: "อะไหล่" },
  { value: "rent", label: "เช่า" },
]

export const SORT_OPTIONS = [
  { value: "newest", label: "ล่าสุด" },
  { value: "price-asc", label: "ราคาต่ำไปสูง" },
  { value: "price-desc", label: "ราคาสูงไปต่ำ" },
]
