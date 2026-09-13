import Link from "next/link"

import { ImagePlaceholder } from "@/components/image-placeholder"
import { ProductCard } from "@/components/product-card"
import { ReliableImage } from "@/components/reliable-image"
import { seoMetadata } from "@/lib/metadata"
import { getHomePage, getProducts } from "@/lib/strapi/client"

import { HomeSearch } from "./components/home-search"

export async function generateMetadata() {
  const home = await getHomePage()

  return seoMetadata(
    home.seo,
    {
      title: "BS Supply | อุปกรณ์ไฟฟ้า เครื่องมือ และสินค้าอุตสาหกรรม",
      description: home.subheadline,
      image: home.heroImage,
    },
    { path: "/" }
  )
}

export default async function HomePage() {
  const [home, fallbackProducts] = await Promise.all([
    getHomePage(),
    getProducts({ sort: "featured", pageSize: 100 }),
  ])
  const featuredProducts = home.featuredProducts.length
    ? home.featuredProducts
    : fallbackProducts.slice(0, 8)

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_480px] lg:items-center">
        <div className="grid max-w-3xl gap-5">
          <p className="text-sm font-medium text-primary">สินค้าซัพพลายสำหรับงานจริง</p>
          <h1 className="text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">
            {home.headline}
          </h1>
          {home.subheadline ? (
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              {home.subheadline}
            </p>
          ) : null}
          <HomeSearch placeholder={home.searchPlaceholder} />
        </div>
        <figure className="aspect-[4/3] overflow-hidden rounded-lg bg-muted shadow-lg">
          {home.heroImage ? (
            <ReliableImage
              src={home.heroImage.url}
              alt={home.heroImage.alternativeText || home.headline}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </figure>
      </section>

      <section className="grid gap-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold">สินค้าแนะนำ</h2>
          <Link href="/products" className="text-sm font-medium text-primary">
            ดูสินค้าทั้งหมด
          </Link>
        </div>
        {featuredProducts.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.documentId} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-sm text-muted-foreground">
            ยังไม่มีสินค้าแนะนำในระบบ Strapi
          </div>
        )}
      </section>
    </div>
  )
}
