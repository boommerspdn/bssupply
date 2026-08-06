import type { Metadata } from "next"

import { APP_NAME } from "@/constants"
import type { MediaAsset, SeoData } from "@/types/catalog"

const DEFAULT_DESCRIPTION =
  "แคตตาล็อกสินค้าซัพพลาย อุปกรณ์ไฟฟ้า และเครื่องมือสำหรับงานจริง"

function clean(value?: string | null) {
  return typeof value === "string" ? value.trim() : ""
}

export function seoMetadata(
  seo: SeoData | null | undefined,
  fallback: {
    title: string
    description?: string | null
    icon?: MediaAsset | null
    image?: MediaAsset | null
  }
): Metadata {
  const title = clean(seo?.title) || fallback.title
  const description = clean(seo?.description) || clean(fallback.description) || DEFAULT_DESCRIPTION
  const icon = fallback.icon?.url
  const image = fallback.image?.url

  return {
    title,
    description,
    ...(icon
      ? {
          icons: {
            icon,
            shortcut: icon,
            apple: icon,
          },
        }
      : {}),
    openGraph: {
      title,
      description,
      siteName: APP_NAME,
      locale: "th_TH",
      type: "website",
      ...(image
        ? {
            images: [
              {
                url: image,
                alt: title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}
