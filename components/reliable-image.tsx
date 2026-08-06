"use client"

import { useState, type ImgHTMLAttributes } from "react"

import { ImagePlaceholder } from "@/components/image-placeholder"
import { cn } from "@/lib/utils"

type ReliableImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string
  alt: string
}

function withRetryParam(src: string, nonce: number) {
  const separator = src.includes("?") ? "&" : "?"
  return `${src}${separator}retry=${nonce}`
}

export function ReliableImage({ src, alt, onError, ...props }: ReliableImageProps) {
  const [retry, setRetry] = useState<{ src: string; nonce: number } | null>(null)
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const currentSrc = retry?.src === src ? withRetryParam(src, retry.nonce) : src

  if (failedSrc === src) {
    return <ImagePlaceholder className={cn("size-full", props.className)} />
  }

  return (
    <img
      key={currentSrc}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        onError?.(event)

        if (retry?.src !== src) {
          setRetry({ src, nonce: Date.now() })
        } else {
          setFailedSrc(src)
        }
      }}
      {...props}
    />
  )
}
