import type {
  HomePageContent,
  ProductFilters,
  SiteSetting,
  SupplyCategory,
  SupplyProduct,
} from "@/types/catalog"
import { isProductCondition } from "@/types/catalog"

const STRAPI_URL = process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

type StrapiEntity = Record<string, unknown> & {
  documentId?: string
  attributes?: Record<string, unknown>
}

const FALLBACK_SITE_SETTING: SiteSetting = {
  storeName: "BS Supply",
  logo: null,
  phone: "02-000-0000",
  lineId: "",
  address: "กรุงเทพฯ และพื้นที่ใกล้เคียง",
  hours: "ติดต่อสอบถามเวลาทำการ",
  contactNote: "ส่งชื่อสินค้า รุ่น หรือรูปสินค้าที่สนใจมาให้ทีมงานตรวจสอบสต็อกได้",
  seo: {
    title: "BS Supply | อุปกรณ์ไฟฟ้า เครื่องมือ และสินค้าซัพพลาย",
    description: "แคตตาล็อกสินค้าซัพพลาย อุปกรณ์ไฟฟ้า และเครื่องมือสำหรับงานจริง",
  },
}

const FALLBACK_HOME: HomePageContent = {
  headline: "อุปกรณ์ไฟฟ้า เครื่องมือ และสินค้าซัพพลายมือสองที่คัดมาให้ใช้งานจริง",
  subheadline:
    "ค้นหาสินค้าตามชื่อ รุ่น หมวดหมู่ หรือรายละเอียด แล้วติดต่อทีมงานเพื่อตรวจสอบสภาพและสต็อกล่าสุด",
  searchPlaceholder: "ค้นหาสินค้า รุ่น ยี่ห้อ หรือหมวดหมู่",
  heroImage: null,
  featuredProducts: [],
  seo: {
    title: "BS Supply | อุปกรณ์ไฟฟ้า เครื่องมือ และสินค้าอุตสาหกรรม",
    description:
      "เลือกซื้ออุปกรณ์ไฟฟ้า เครื่องมือ และสินค้าอุตสาหกรรมมือหนึ่งและมือสองจาก BS Supply พร้อมตรวจสอบสภาพและสต็อกล่าสุด",
  },
}

function getData<T>(response: unknown): T | null {
  if (!response || typeof response !== "object") return null
  return ((response as { data?: T }).data ?? null) as T | null
}

function fields(entity: StrapiEntity | null | undefined) {
  if (!entity) return {}
  return entity.attributes ? { ...entity.attributes, documentId: entity.documentId } : entity
}

function mediaUrl(url?: unknown) {
  if (typeof url !== "string" || !url) return null
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`
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
  const data = getData<StrapiEntity[]>(value) ?? (Array.isArray(value) ? value : [])
  return data
    .map(normalizeMedia)
    .filter(
      (media): media is NonNullable<ReturnType<typeof normalizeMedia>> => media !== null
    )
}

function normalizeSeo(value: unknown) {
  const entity = getData<StrapiEntity>(value) ?? (value as StrapiEntity | null)
  const seo = fields(entity)
  const title = typeof seo.title === "string" ? seo.title : null
  const description = typeof seo.description === "string" ? seo.description : null

  return title || description ? { title, description } : null
}

function normalizeCategory(entity: StrapiEntity | null | undefined): SupplyCategory | null {
  const category = fields(entity)
  const documentId = typeof category.documentId === "string" ? category.documentId : ""
  const name = typeof category.name === "string" ? category.name : ""

  if (!documentId || !name) return null

  return {
    documentId,
    name,
    description: typeof category.description === "string" ? category.description : null,
    image: normalizeMedia(category.image),
    sortOrder: typeof category.sortOrder === "number" ? category.sortOrder : 0,
  }
}

function normalizeProduct(entity: StrapiEntity | null | undefined): SupplyProduct | null {
  const product = fields(entity)
  const documentId = typeof product.documentId === "string" ? product.documentId : ""
  const name = typeof product.name === "string" ? product.name : ""

  if (!documentId || !name) return null

  return {
    documentId,
    name,
    summary: typeof product.summary === "string" ? product.summary : null,
    description: typeof product.description === "string" ? product.description : null,
    images: normalizeMediaList(product.images),
    category: normalizeCategory(getData<StrapiEntity>(product.category)),
    condition: isProductCondition(product.condition) ? product.condition : null,
    brand: typeof product.brand === "string" ? product.brand : null,
    model: typeof product.model === "string" ? product.model : null,
    price: typeof product.price === "number" ? product.price : null,
    priceNote: typeof product.priceNote === "string" ? product.priceNote : null,
    locationNote: typeof product.locationNote === "string" ? product.locationNote : null,
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
          .filter((spec): spec is { label: string; value: string } => Boolean(spec?.label && spec.value))
      : [],
    featured: Boolean(product.featured),
    publishedAt: typeof product.publishedAt === "string" ? product.publishedAt : null,
  }
}

async function fetchStrapi<T>(path: string, params?: URLSearchParams): Promise<T | null> {
  const url = new URL(`/api/${path}`, STRAPI_URL)
  params?.forEach((value, key) => url.searchParams.set(key, value))

  try {
    const headers: HeadersInit = {}
    if (STRAPI_API_TOKEN) {
      headers.Authorization = `Bearer ${STRAPI_API_TOKEN}`
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 60 },
    })
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
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

  params.set("pagination[page]", String(filters.page || 1))
  params.set("pagination[pageSize]", "24")

  return params
}

export async function getSiteSettings(): Promise<SiteSetting> {
  const response = await fetchStrapi<unknown>("bssupply-site-setting", populateParams())
  const entity = getData<StrapiEntity>(response)
  const setting = fields(entity)

  if (!entity) return FALLBACK_SITE_SETTING

  const lineId = typeof setting.lineId === "string" ? setting.lineId.trim() : ""

  return {
    storeName: typeof setting.storeName === "string" ? setting.storeName : "BS Supply",
    logo: normalizeMedia(setting.logo),
    phone: typeof setting.phone === "string" ? setting.phone : null,
    lineId: lineId || null,
    address: typeof setting.address === "string" ? setting.address : null,
    hours: typeof setting.hours === "string" ? setting.hours : null,
    contactNote: typeof setting.contactNote === "string" ? setting.contactNote : null,
    seo: normalizeSeo(setting.seo),
  }
}

export async function getHomePage(): Promise<HomePageContent> {
  const response = await fetchStrapi<unknown>("bssupply-home-page", populateParams())
  const entity = getData<StrapiEntity>(response)
  const home = fields(entity)

  if (!entity) return FALLBACK_HOME

  return {
    headline: typeof home.headline === "string" ? home.headline : FALLBACK_HOME.headline,
    heroImage: normalizeMedia(home.heroImage),
    subheadline:
      typeof home.subheadline === "string" ? home.subheadline : FALLBACK_HOME.subheadline,
    searchPlaceholder:
      typeof home.searchPlaceholder === "string"
        ? home.searchPlaceholder
        : FALLBACK_HOME.searchPlaceholder,
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

export async function getCategoryByDocumentId(documentId: string): Promise<SupplyCategory | null> {
  const params = populateParams()
  params.set("filters[documentId][$eq]", documentId)
  const response = await fetchStrapi<unknown>("bssupply-categories", params)
  return normalizeCategory((getData<StrapiEntity[]>(response) || [])[0])
}

export async function getProducts(filters: ProductFilters = {}): Promise<SupplyProduct[]> {
  const response = await fetchStrapi<unknown>("bssupply-products", productQueryParams(filters))
  return (getData<StrapiEntity[]>(response) || [])
    .map(normalizeProduct)
    .filter(Boolean) as SupplyProduct[]
}

export async function getProductByDocumentId(documentId: string): Promise<SupplyProduct | null> {
  const params = populateParams()
  params.set("filters[documentId][$eq]", documentId)
  const response = await fetchStrapi<unknown>("bssupply-products", params)
  return normalizeProduct((getData<StrapiEntity[]>(response) || [])[0])
}
