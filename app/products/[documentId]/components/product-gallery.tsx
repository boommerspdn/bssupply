"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Expand } from "lucide-react"
import { ImagePlaceholder } from "@/components/image-placeholder"
import { ReliableImage } from "@/components/reliable-image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type { SupplyProduct } from "@/types/catalog"

export function ProductGallery({ product }: { product: SupplyProduct }) {
  const [selected, setSelected] = useState(0)
  const [open, setOpen] = useState(false)
  const selectImage = useCallback((index: number) => setSelected(index), [])
  if (!product.images.length)
    return (
      <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
        <ImagePlaceholder />
      </div>
    )
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <GalleryCarousel
        product={product}
        selected={selected}
        onSelect={selectImage}
        onExpand={() => setOpen(true)}
      />
      <DialogContent className="max-h-[95dvh] w-[calc(100%-2rem)] max-w-5xl gap-3 overflow-y-auto p-4 sm:max-w-5xl">
        <DialogTitle className="pr-8">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">
          ดูรูปสินค้า ใช้ปุ่มลูกศรหรือเลื่อนเพื่อดูรูปถัดไป
        </DialogDescription>
        <GalleryCarousel
          product={product}
          selected={selected}
          onSelect={selectImage}
          enlarged
        />
      </DialogContent>
    </Dialog>
  )
}

function GalleryCarousel({
  product,
  selected,
  onSelect,
  onExpand,
  enlarged = false,
}: {
  product: SupplyProduct
  selected: number
  onSelect: (index: number) => void
  onExpand?: () => void
  enlarged?: boolean
}) {
  const [api, setApi] = useState<CarouselApi>()
  const [startIndex] = useState(selected)
  const options = useMemo(
    () => ({ startIndex, loop: product.images.length > 1 }),
    [startIndex, product.images.length]
  )
  useEffect(() => {
    if (!api) return
    const handleSelect = () => onSelect(api.selectedScrollSnap())
    api.on("select", handleSelect)
    return () => {
      api.off("select", handleSelect)
    }
  }, [api, onSelect])
  useEffect(() => {
    if (api && api.selectedScrollSnap() !== selected)
      api.scrollTo(selected, true)
  }, [api, selected])
  const imageLabel = (index: number) =>
    product.images[index].alternativeText ||
    `${product.name} รูปที่ ${index + 1}`
  return (
    <div
      className="grid min-w-0 gap-3"
      onKeyDownCapture={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
        event.preventDefault()
        event.stopPropagation()
        if (event.key === "ArrowLeft") api?.scrollPrev()
        else api?.scrollNext()
      }}
    >
      <Carousel
        setApi={setApi}
        opts={options}
        aria-label={enlarged ? "รูปสินค้าขนาดใหญ่" : "รูปสินค้า"}
        className="min-w-0"
      >
        <CarouselContent className="ml-0">
          {product.images.map((image, index) => (
            <CarouselItem key={`${image.url}-${index}`} className="pl-0">
              {enlarged ? (
                <div className="flex h-[min(65dvh,720px)] items-center justify-center rounded-lg bg-muted/30">
                  <ReliableImage
                    src={image.url}
                    alt={imageLabel(index)}
                    className="size-full object-contain"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onExpand}
                  aria-label={`ขยายรูปที่ ${index + 1}`}
                  className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-lg border bg-muted/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <ReliableImage
                    src={image.url}
                    alt={imageLabel(index)}
                    className="size-full object-contain"
                  />
                  <span className="absolute right-3 bottom-3 rounded-md bg-black/60 p-2 text-white">
                    <Expand className="size-4" aria-hidden="true" />
                  </span>
                </button>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        {product.images.length > 1 && (
          <>
            <CarouselPrevious
              aria-label="รูปก่อนหน้า"
              className="left-2 cursor-pointer size-10 rounded-md border-0 bg-black/50 text-white hover:bg-black/70 hover:text-white"
            />
            <CarouselNext
              aria-label="รูปถัดไป"
              className="right-2 cursor-pointer size-10 rounded-md border-0 bg-black/50 text-white hover:bg-black/70 hover:text-white"
            />
          </>
        )}
        <span
          aria-live="polite"
          className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white"
        >
          {selected + 1} / {product.images.length}
        </span>
      </Carousel>
      {product.images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          aria-label="เลือกรูปสินค้า"
        >
          {product.images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              aria-label={`ดูรูปที่ ${index + 1}`}
              aria-pressed={selected === index}
              onClick={() => {
                api?.scrollTo(index)
                onSelect(index)
              }}
              className={cn(
                "size-20 cursor-pointer shrink-0 overflow-hidden rounded-md border-2 bg-muted/30 p-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:size-24",
                selected === index
                  ? "border-primary"
                  : "border-transparent hover:border-primary/40"
              )}
            >
              <ReliableImage
                src={image.url}
                alt={imageLabel(index)}
                className="size-full object-contain"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
