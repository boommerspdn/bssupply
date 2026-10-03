import type {
  HomePageContent,
  ProductFilters,
  ProductPage,
  ProductSuggestion,
  SiteSetting,
  SupplyCategory,
  SupplyProduct,
} from "@/types/catalog"
import { isProductCondition } from "@/types/catalog"
import { getProductPreviewDescription } from "@/lib/format"

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  process.env.STRAPI_URL ||
  "http://localhost:1337"
const CMS_API_PREFIX =
  process.env.NEXT_PUBLIC_CMS_API_PREFIX || process.env.CMS_API_PREFIX || "/api"
const STRAPI_API_TOKEN =
  typeof window === "undefined"
    ? process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_API_TOKEN
    : process.env.NEXT_PUBLIC_API_TOKEN

type StrapiEntity = Record<string, unknown> & {
  documentId?: string
  attributes?: Record<string, unknown>
}

function getData<T>(response: unknown): T | null {
  if (!response || typeof response !== "object") return null
  return ((response as { data?: T }).data ?? null) as T | null
}

function fields(entity: StrapiEntity | null | undefined) {
  if (!entity) return {}
  return entity.attributes
    ? { ...entity.attributes, documentId: entity.documentId }
    : entity
}

function mediaUrl(url?: unknown) {
  if (typeof url !== "string" || !url) return null
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const parsed = new URL(url)
    if (parsed.pathname.startsWith("/uploads/") && ["localhost", "127.0.0.1"].includes(parsed.hostname)) {
      return `${STRAPI_URL}${parsed.pathname}${parsed.search}`
    }
    return url
  }
  return `${STRAPI_URL}${url}`
}

function normalizeMedia(value: unknown) {
  const entity = getData<StrapiEntity>(value) ?? (value as StrapiEntity | null)
  const media = fields(entity)
  const url = mediaUrl(media.url)

  if (!url) return null

  return {
    url,
    alternativeText:
      typeof media.alternativeText === "string" ? media.alternativeText : null,
  }
}

function normalizeMediaList(value: unknown) {
  const data =
    getData<StrapiEntity[]>(value) ?? (Array.isArray(value) ? value : [])
  return data
    .map(normalizeMedia)
    .filter(
      (media): media is NonNullable<ReturnType<typeof normalizeMedia>> =>
        media !== null
    )
}

function normalizeSeo(value: unknown) {
  const entity = getData<StrapiEntity>(value) ?? (value as StrapiEntity | null)
  const seo = fields(entity)
  const title = typeof seo.title === "string" ? seo.title : null
  const description =
    typeof seo.description === "string" ? seo.description : null

  return title || description ? { title, description } : null
}

function normalizeCategory(
  entity: StrapiEntity | null | undefined
): SupplyCategory | null {
  const category = fields(entity)
  const documentId =
    typeof category.documentId === "string" ? category.documentId : ""
  const name = typeof category.name === "string" ? category.name : ""

  if (!documentId || !name) return null

  return {
    documentId,
    name,
    description:
      typeof category.description === "string" ? category.description : null,
    image: normalizeMedia(category.image),
    sortOrder: typeof category.sortOrder === "number" ? category.sortOrder : 0,
  }
}

function normalizeProduct(
  entity: StrapiEntity | null | undefined
): SupplyProduct | null {
  const product = fields(entity)
  const documentId =
    typeof product.documentId === "string" ? product.documentId : ""
  const name = typeof product.name === "string" ? product.name : ""

  if (!documentId || !name) return null

  return {
    documentId,
    name,
    summary: typeof product.summary === "string" ? product.summary : null,
    description:
      typeof product.description === "string" ? product.description : null,
    images: normalizeMediaList(product.images),
    category: normalizeCategory(
      getData<StrapiEntity>(product.category) ??
        (product.category as StrapiEntity | null)
    ),
    condition: isProductCondition(product.condition) ? product.condition : null,
    brand: typeof product.brand === "string" ? product.brand : null,
    model: typeof product.model === "string" ? product.model : null,
    price: typeof product.price === "number" ? product.price : null,
    priceText: typeof product.priceText === "string" ? product.priceText : null,
    priceAfterDiscount: typeof product.priceAfterDiscount === "number" ? product.priceAfterDiscount : null,
    locationNote:
      typeof product.locationNote === "string" ? product.locationNote : null,
    tags: Array.isArray(product.tags)
      ? product.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    specs: Array.isArray(product.specs)
      ? product.specs
          .map((spec) => {
            if (!spec || typeof spec !== "object") return null
            const item = spec as Record<string, unknown>
            return {
              label: typeof item.label === "string" ? item.label : "",
              value: typeof item.value === "string" ? item.value : "",
            }
          })
          .filter((spec): spec is { label: string; value: string } =>
            Boolean(spec?.label && spec.value)
          )
      : [],
    featured: Boolean(product.featured),
    publishedAt:
      typeof product.publishedAt === "string" ? product.publishedAt : null,
  }
}

async function fetchStrapi<T>(
  path: string,
  params?: URLSearchParams,
  signal?: AbortSignal
): Promise<T> {
  const url = new URL(`${CMS_API_PREFIX}/${path}`, STRAPI_URL)
  params?.forEach((value, key) => url.searchParams.set(key, value))

  try {
    const headers: HeadersInit = {}
    if (STRAPI_API_TOKEN) {
      headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`
    }

    const response = await fetch(
      url,
      { headers, signal, cache: "no-store" }
    )
    if (!response.ok) {
      throw new Error(`Strapi request failed (${response.status}): ${path}`)
    }

    return (await response.json()) as T
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error(`Strapi request error: ${path}`)
  }
}

function populateParams() {
  const params = new URLSearchParams()
  params.set("populate", "*")
  return params
}

function productQueryParams(filters: ProductFilters = {}) {
  const params = populateParams()

  if (filters.query) {
    const query = filters.query.trim()
    params.set("filters[$or][0][name][$containsi]", query)
    params.set("filters[$or][1][summary][$containsi]", query)
    params.set("filters[$or][2][brand][$containsi]", query)
    params.set("filters[$or][3][model][$containsi]", query)
    params.set("filters[$or][4][locationNote][$containsi]", query)
    params.set("filters[$or][5][description][$containsi]", query)
    params.set("filters[$or][6][category][name][$containsi]", query)
    params.set("filters[$or][7][tags][$containsi]", query)
    params.set("filters[$or][8][specs][label][$containsi]", query)
    params.set("filters[$or][9][specs][value][$containsi]", query)
  }

  if (filters.categoryDocumentId) {
    params.set("filters[category][documentId][$eq]", filters.categoryDocumentId)
  }

  if (filters.condition) {
    params.set("filters[condition][$eq]", filters.condition)
  }

  const sortMap = {
    featured: ["featured:desc", "publishedAt:desc"],
    newest: ["publishedAt:desc"],
    "price-asc": ["price:asc"],
    "price-desc": ["price:desc"],
  } satisfies Record<NonNullable<ProductFilters["sort"]>, string[]>

  sortMap[filters.sort || "featured"].forEach((sort, index) => {
    params.set(`sort[${index}]`, sort)
  })
  // A unique tie-breaker keeps equally priced/dated products stable across pages.
  params.set(`sort[${sortMap[filters.sort || "featured"].length}]`, "documentId:asc")

  params.set("pagination[page]", String(filters.page || 1))
  params.set("pagination[pageSize]", String(filters.pageSize || 24))

  return params
}

export async function getSiteSettings(): Promise<SiteSetting> {
  const response = await fetchStrapi<unknown>(
    "bssupply-site-setting",
    populateParams()
  )
  const entity = getData<StrapiEntity>(response)
  const setting = fields(entity)

  if (!entity) {
    throw new Error("Missing bssupply-site-setting data")
  }

  const lineId = typeof setting.lineId === "string" ? setting.lineId.trim() : ""

  return {
    storeName:
      typeof setting.storeName === "string" ? setting.storeName : "BS Supply",
    logo: normalizeMedia(setting.logo),
    favicon: normalizeMedia(setting.favicon),
    phone: typeof setting.phone === "string" ? setting.phone : null,
    lineId: lineId || null,
    address: typeof setting.address === "string" ? setting.address : null,
    hours: typeof setting.hours === "string" ? setting.hours : null,
    contactNote:
      typeof setting.contactNote === "string" ? setting.contactNote : null,
    seo: normalizeSeo(setting.seo),
  }
}

export async function getHomePage(): Promise<HomePageContent> {
  const response = await fetchStrapi<unknown>(
    "bssupply-home-page",
    populateParams()
  )
  const entity = getData<StrapiEntity>(response)
  const home = fields(entity)

  if (!entity) {
    throw new Error("Missing bssupply-home-page data")
  }

  return {
    headline: typeof home.headline === "string" ? home.headline : "",
    heroImage: normalizeMedia(home.heroImage),
    subheadline:
      typeof home.subheadline === "string" ? home.subheadline : null,
    searchPlaceholder:
      typeof home.searchPlaceholder === "string"
        ? home.searchPlaceholder
        : "ค้นหาสินค้า รุ่น ยี่ห้อ หรือหมวดหมู่",
    featuredProducts: (getData<StrapiEntity[]>(home.featuredProducts) || [])
      .map(normalizeProduct)
      .filter(Boolean) as SupplyProduct[],
    seo: normalizeSeo(home.seo),
  }
}

export async function getCategories(): Promise<SupplyCategory[]> {
  const params = populateParams()
  params.set("sort[0]", "sortOrder:asc")
  params.set("sort[1]", "name:asc")
  const response = await fetchStrapi<unknown>("bssupply-categories", params)
  return (getData<StrapiEntity[]>(response) || [])
    .map(normalizeCategory)
    .filter(Boolean) as SupplyCategory[]
}

export async function getCategoryByDocumentId(
  documentId: string
): Promise<SupplyCategory | null> {
  const params = populateParams()
  params.set("filters[documentId][$eq]", documentId)
  const response = await fetchStrapi<unknown>("bssupply-categories", params)
  return normalizeCategory((getData<StrapiEntity[]>(response) || [])[0])
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<SupplyProduct[]> {
  const response = await fetchStrapi<unknown>(
    "bssupply-products",
    productQueryParams(filters)
  )
  return (getData<StrapiEntity[]>(response) || [])
    .map(normalizeProduct)
    .filter(Boolean) as SupplyProduct[]
}

export async function getProductPage(
  filters: ProductFilters,
  signal?: AbortSignal
): Promise<ProductPage> {
  const params = productQueryParams(filters)
  params.delete("populate")
  // Cards need images and the category identity, not every spec or media field.
  params.set("populate[images][fields][0]", "url")
  params.set("populate[images][fields][1]", "alternativeText")
  params.set("populate[category][fields][0]", "name")
  ;["name", "summary", "description", "price", "priceText", "priceAfterDiscount", "condition", "locationNote", "featured", "publishedAt"].forEach((field, index) => {
    params.set(`fields[${index}]`, field)
  })
  params.set("pagination[withCount]", "true")
  const response = await fetchStrapi<{
    data: StrapiEntity[]
    meta: { pagination: ProductPage["pagination"] }
  }>("bssupply-products", params, signal)
  const pagination = response.meta?.pagination
  if (!Array.isArray(response.data) || !pagination ||
    ![pagination.page, pagination.pageSize, pagination.pageCount, pagination.total].every(Number.isSafeInteger) ||
    pagination.page < 1 || pagination.pageSize < 1 || pagination.pageCount < 0 || pagination.total < 0) {
    throw new Error("Invalid bssupply-products pagination response")
  }
  return {
    products: response.data.map(normalizeProduct).filter((product): product is SupplyProduct => product !== null),
    pagination,
  }
}

export async function getProductByDocumentId(
  documentId: string
): Promise<SupplyProduct | null> {
  const params = populateParams()
  params.set("filters[documentId][$eq]", documentId)
  const response = await fetchStrapi<unknown>("bssupply-products", params)
  return normalizeProduct((getData<StrapiEntity[]>(response) || [])[0])
}

export async function getProductSuggestions(
  filters: ProductFilters,
  signal?: AbortSignal
): Promise<ProductSuggestion[]> {
  if (!filters.query || filters.query.trim().length < 2) return []
  const params = productQueryParams({ ...filters, page: 1, pageSize: 6 })
  params.delete("populate")
  params.set("pagination[withCount]", "false")
  ;["name", "summary", "description"].forEach((field, index) => params.set(`fields[${index}]`, field))
  ;["url", "alternativeText", "formats"].forEach((field, index) => params.set(`populate[images][fields][${index}]`, field))
  const response = await fetchStrapi<{ data: StrapiEntity[] }>("bssupply-products", params, signal)
  if (!Array.isArray(response.data)) throw new Error("Invalid product suggestions response")
  return response.data.map((entity) => {
    const product = fields(entity)
    if (typeof product.documentId !== "string" || typeof product.name !== "string") {
      throw new Error("Invalid product suggestion")
    }
    const images = getData<StrapiEntity[]>(product.images) ?? (Array.isArray(product.images) ? product.images : [])
    const firstImage = fields(images[0])
    const formats = firstImage.formats as Record<string, StrapiEntity> | undefined
    const image = normalizeMedia(formats?.thumbnail ?? images[0])
    return {
      documentId: product.documentId,
      name: product.name,
      description: getProductPreviewDescription({
        summary: typeof product.summary === "string" ? product.summary : null,
        description: typeof product.description === "string" ? product.description : null,
      }),
      image: image ? { ...image, alternativeText: typeof firstImage.alternativeText === "string" ? firstImage.alternativeText : null } : null,
    }
  })
}

// Build-time route discovery must traverse the collection, even past 100 items.
export async function getAllProductDocumentIds(): Promise<string[]> {
  const ids: string[] = []
  let page = 1
  let pageCount = 1
  do {
    const params = new URLSearchParams({
      "fields[0]": "name",
      "sort[0]": "documentId:asc",
      "pagination[page]": String(page),
      "pagination[pageSize]": "100",
      "pagination[withCount]": "true",
    })
    const response = await fetchStrapi<{
      data: StrapiEntity[]
      meta: { pagination: { pageCount: number } }
    }>("bssupply-products", params)
    if (!Array.isArray(response.data) || !Number.isSafeInteger(response.meta?.pagination?.pageCount)) {
      throw new Error("Invalid bssupply-products route discovery response")
    }
    for (const product of response.data) {
      if (typeof product.documentId !== "string") throw new Error("Missing product documentId")
      ids.push(product.documentId)
    }
    pageCount = response.meta.pagination.pageCount
    page += 1
  } while (page <= pageCount)
  return ids
}
