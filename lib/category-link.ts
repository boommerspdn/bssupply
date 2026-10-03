// The product listing is exported once and filters live CMS categories in the browser.
// Category detail paths only exist for IDs present at build time.
export function categoryHref(documentId: string) {
  return `/products/?category=${encodeURIComponent(documentId)}`
}
