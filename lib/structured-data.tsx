import { APP_NAME } from "@/constants"
import { siteUrl } from "@/lib/metadata"
import type { SiteSetting, SupplyCategory, SupplyProduct } from "@/types/catalog"

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue | undefined }

function stripUndefined(value: JsonValue | undefined): JsonValue | undefined {
  if (Array.isArray(value)) {
    return value
      .map((item) => stripUndefined(item))
      .filter((item): item is JsonValue => item !== undefined)
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, stripUndefined(item)])
        .filter((entry): entry is [string, JsonValue] => entry[1] !== undefined)
    )
  }

  return value
}

export function JsonLd({ data }: { data: JsonValue }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(stripUndefined(data)).replace(/</g, "\\u003c"),
      }}
    />
  )
}

export function localBusinessJsonLd(setting: SiteSetting | null) {
  const logo = setting?.logo?.url

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: setting?.storeName || APP_NAME,
    url: siteUrl("/"),
    logo,
    image: logo,
    telephone: setting?.phone || undefined,
    address: setting?.address
      ? {
          "@type": "PostalAddress",
          streetAddress: setting.address,
          addressCountry: "TH",
        }
      : undefined,
    contactPoint: setting?.phone
      ? {
          "@type": "ContactPoint",
          telephone: setting.phone,
          contactType: "customer service",
          areaServed: "TH",
          availableLanguage: ["th"],
        }
      : undefined,
    sameAs: setting?.lineId
      ? [`https://line.me/R/ti/p/${encodeURIComponent(setting.lineId)}`]
      : undefined,
  } satisfies JsonValue
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_NAME,
    url: siteUrl("/"),
    inLanguage: "th",
  } satisfies JsonValue
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: siteUrl(item.path),
    })),
  } satisfies JsonValue
}

export function productItemListJsonLd({
  category,
  products,
  path,
}: {
  category?: SupplyCategory | null
  products: SupplyProduct[]
  path: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: siteUrl(path),
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        brand: product.brand
          ? {
              "@type": "Brand",
              name: product.brand,
            }
          : undefined,
        category: category?.name,
        image: product.images?.[0]?.url,
        offers:
          typeof product.price === "number"
            ? {
                "@type": "Offer",
                priceCurrency: "THB",
                price: product.price,
                availability: "https://schema.org/InStock",
              }
            : undefined,
      },
    })),
  } satisfies JsonValue
}

export function categoryItemListJsonLd(categories: SupplyCategory[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    url: siteUrl("/categories"),
    itemListElement: categories.map((category, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "CollectionPage",
        name: category.name,
        description: category.description,
        url: siteUrl(`/categories/${category.documentId}`),
        image: category.image?.url,
      },
    })),
  } satisfies JsonValue
}

export function productJsonLd(product: SupplyProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary || product.description,
    image: product.images.map((image) => image.url),
    brand: product.brand
      ? {
          "@type": "Brand",
          name: product.brand,
        }
      : undefined,
    category: product.category?.name,
    model: product.model || undefined,
    offers:
      typeof product.price === "number"
        ? {
            "@type": "Offer",
            priceCurrency: "THB",
            price: product.price,
            availability: "https://schema.org/InStock",
            url: siteUrl(`/products/${product.documentId}`),
          }
        : undefined,
  } satisfies JsonValue
}
