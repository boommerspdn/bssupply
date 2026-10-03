import type { MouseEvent } from "react"

// Keep catalog filtering in the current document; preserve normal link behavior
// for other pages and modified clicks (for example, opening a new tab).
export function navigateCatalogLink(event: MouseEvent<HTMLAnchorElement>) {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return
  const target = new URL(event.currentTarget.href)
  if (
    window.location.pathname.replace(/\/$/, "") !== "/products" ||
    target.pathname.replace(/\/$/, "") !== "/products"
  )
    return
  event.preventDefault()
  if (target.href !== window.location.href) {
    window.history.pushState(
      null,
      "",
      target.pathname + target.search + target.hash
    )
  }
  window.dispatchEvent(
    new PopStateEvent("popstate", { state: window.history.state })
  )
}
