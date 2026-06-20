"use client"

import { useState, type ImgHTMLAttributes } from "react"

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
  const currentSrc = retry?.src === src ? withRetryParam(src, retry.nonce) : src

  return (
    <img
      key={currentSrc}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        onError?.(event)

        if (retry?.src !== src) {
          setRetry({ src, nonce: Date.now() })
        }
      }}
      {...props}
    />
  )
}
