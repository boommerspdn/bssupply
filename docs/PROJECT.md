# BS Supply Project Notes

## Purpose

`bssupply` is the BS Supply catalog site for product search, categories, product detail pages, and contact information. It is a Next.js 16 App Router project using React 19, TypeScript, Tailwind CSS 4, next-themes, and shadcn/ui primitives.

## Local Development

- Dev URL: `http://localhost:3003`
- Production URL: `https://subthongpoon.com/`
- Backend: `http://localhost:1337`
- Start only this app: `npm run dev`
- Start from workspace root: `npm run dev:bssupply`

Environment values:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3003
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-read-token
NEXT_PUBLIC_API_TOKEN=your-read-only-browser-token
```

`STRAPI_API_TOKEN` is used for build preflight and request-time server reads. `NEXT_PUBLIC_API_TOKEN` is used for browser refreshes and is visible to visitors; configure it as read-only or allow public-role reads.

## Source Map

- `app/`: App Router routes and metadata files.
- `app/(root)/components`: home-only UI.
- `app/products/components`: product listing filters.
- `app/products/[documentId]/components`: product detail UI.
- Product images use the shadcn Carousel and Dialog components: selectable thumbnails, swipe/arrow navigation, and an enlarged viewer synchronized with the main gallery. All CMS images are shown.
- `components/layouts`: navbar, footer, breadcrumbs, and layout constants.
- `components/ui`: reusable UI primitives.
- `lib/strapi/client.ts`: Strapi REST fetch, normalization, and filters.
- `types/catalog.ts`: frontend catalog contracts.

## Strapi Domain

This app consumes the `bssupply-*` Strapi API group from `../strapi-global`:

- `GET /api/bssupply-site-setting`
- `GET /api/bssupply-home-page`
- `GET /api/bssupply-categories`
- `GET /api/bssupply-categories/:id`
- `GET /api/bssupply-products`
- `GET /api/bssupply-products/:id`

Catalog pages use `documentId` for entity lookup.

## Frontend Architecture

- Keep CMS fetch and response normalization in `lib/strapi/client.ts`.
- Keep category/product TypeScript contracts in `types/catalog.ts`.
- Route-specific client controls should stay colocated in route `components` folders using kebab-case filenames.
- Homepage search uses client navigation without reloading the document. Product search submits in place using URL parameters, with Back/Forward restoring filters. Top-bar navigation starts a fresh listing: the all-products link clears all filters, and category links set only the selected category, clearing `q`. The catalog rereads the current URL when returning from a detail page so retained route UI cannot restore an old query. Server and browser share URL filter parsing. Request-time hydration contains the selected search/filter page, so direct filtered links do not display an unfiltered snapshot.
- The navbar's product label and arrow form one link. Hover or keyboard focus opens category choices; clicking the link opens the full listing and clears filters. Navbar category links update the URL and catalog filter together when already on `/products/`, on desktop and mobile.
- The product listing fetches 20 products per page from Strapi, using server-side search, category, condition, and sort parameters plus `meta.pagination` totals. Page links retain the current filters; submitting filters resets to page 1. The selected page is disabled with no link target, excluded from tab navigation, and cannot refetch the current page. Each query key includes all filters and page, and fetch consumes TanStack Query's AbortSignal. No previous-query product cards are substituted during loading.
- shadcn Skeleton renders the initial catalog load, and one results-area Spinner renders subsequent uncached search/filter/page loads. Background refreshes are silent, with no duplicate search-button spinner. The bottom row places the result count on the left and pagination on the right, wrapping on narrow screens, with Thai Previous/Next labels. Request-time catalog hydration contains at most 20 products; homepage fallback fetches only eight. The dynamic sitemap traverses all document IDs rather than stopping at 100.
- TanStack Query prefetches CMS responses on each incoming page request, hydrates client components, and refetches in the browser. All server and browser Strapi fetches use `no-store`; valid empty collections retain empty states. Build preflight still checks CMS reachability; request failures are not replaced by fallback data.
- New product and category paths render on demand with no `generateStaticParams` or `dynamicParams=false`. The root layout and sitemap are dynamic. Build output is standalone; `scripts/prepare-standalone.mjs` copies assets and excludes environment files. Apache proxies CMS pages to PM2 `bssupply` on port 4103.
- Use `node_modules/next/dist/docs/` before Next 16 API changes; this repo already includes the agent warning.

## Verification

See [DEPLOYMENT.md](DEPLOYMENT.md) for the production build, local runtime checks, SSH deployment, and rollback procedure.

Run before handoff:

```bash
npm run typecheck
npm run lint
```

`npm run typecheck` runs `next typegen` before `tsc --noEmit` so Next 16 route types are present.

Run `npm run build` when changing route generation, metadata, or Strapi data fetching behavior.

## Category navigation and recovery

Category menu links use `/products/?category=<documentId>`. Direct product/category detail routes resolve IDs against Strapi at request time, and actual missing records call `notFound()`. API data, metadata, and the sitemap are never frozen into an exported HTML snapshot. Apache serves hardcoded assets directly and proxies all page requests to the standalone Node runtime. The Thai 404 component remains the recovery view. Browser CMS failures show retry controls rather than fallback CMS data.

Search suggestions use the shared ProductSearchInput on the homepage and product filters. Strapi filters up to six matches after a 300 ms debounce and a minimum of two characters, with name, description, and a thumbnail from the first image. Suggestions respect category and condition, support Arrow/Enter/Escape keys, cancel obsolete requests, and cache each normalized query/filter combination for five minutes (inactive entries retained for 30 minutes). Catalog page/filter queries are fresh for one minute and retained for 15 minutes. These caches are in memory for the current browser session; no search text is persisted to browser storage.


Product cards are fully clickable and show the same summary-first description as suggestions. The shared search component uses the fixed placeholder `ค้นหาชื่อสินค้า รุ่น หรือยี่ห้อ` on both pages. Header and contact-page phone/LINE actions share ContactActions. The custom Tailwind `light-green` color is `#E6F4EB`, a pale tint of the supplied `#028D3B`, and supplies the global shadcn accent token with primary-colored text. Navbar menu links and shared ghost/outline buttons use this accent for hover and expanded states. Gallery thumbnails use a pointer cursor; full reloads reset scroll to the top while ordinary history navigation retains browser restoration.

Pricing uses `price` (original integer THB price), `priceAfterDiscount` (optional final price), and `priceText` (fallback when numeric price is absent). ProductPrice is shared by cards and detail pages: regular prices use the primary color. Discounted prices use green, followed inline by the smaller muted struck-through original price and a green percentage on a lime highlight. Displayed prices have the baht symbol after the amount. Structured offers use the final price. Strapi rejects discounts without a positive original price or discounts greater than/equal to the original price.

The catalog sorting menu contains latest, price ascending, and price descending; latest is the default. Legacy `sort=featured` catalog URLs normalize to latest. Homepage featured collections still use their own featured ordering.
