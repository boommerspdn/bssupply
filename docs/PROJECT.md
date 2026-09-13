# BS Supply Project Notes

## Purpose

`bssupply` is the BS Supply catalog site for product search, categories, product detail pages, and contact information. It is a Next.js 16 App Router project using React 19, TypeScript, Tailwind CSS 4, next-themes, and shadcn/ui primitives.

## Local Development

- Dev URL: `http://localhost:3003`
- Backend: `http://localhost:1337`
- Start only this app: `npm run dev`
- Start from workspace root: `npm run dev:bssupply`

Environment values:

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3003
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-read-token
```

`STRAPI_API_TOKEN` is optional for public-role reads, but set it when the local Strapi permissions are locked down.

## Source Map

- `app/`: App Router routes, loading states, and metadata files.
- `app/(root)/components`: home-only UI.
- `app/products/components`: product listing filters.
- `app/products/[documentId]/components`: product detail UI.
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
- Use stable empty/loading states for valid empty collections. Strapi network and non-2xx API failures should fail the static build.
- Use `node_modules/next/dist/docs/` before Next 16 API changes; this repo already includes the agent warning.

## Verification

Run before handoff:

```bash
npm run typecheck
npm run lint
```

`npm run typecheck` runs `next typegen` before `tsc --noEmit` so Next 16 route types are present.

Run `npm run build` when changing route generation, metadata, or Strapi data fetching behavior.
