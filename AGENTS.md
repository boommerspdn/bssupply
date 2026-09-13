<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Backend

The Strapi backend for this project is located at `../strapi-global`.

## Project Shape

- Next.js 16 App Router project using React 19, TypeScript, Tailwind CSS 4, next-themes, and shadcn/ui primitives.
- Dev port is `3003`.
- This app owns the `bssupply-*` Strapi API domain.
- Product and category routes use Strapi `documentId`.

## API Rules

- Keep Strapi fetch, normalization, and filtering in `lib/strapi/client.ts`.
- Keep frontend catalog contracts in `types/catalog.ts`.
- Populate media, category relations, product specs, featured products, favicon/logo, and SEO data when needed.
- Use `STRAPI_API_TOKEN` only for server-side authenticated requests.
- Match `accounting-frontend` error handling: do not add `app/error.tsx` or `app/global-error.tsx`; fail builds on Strapi network or non-2xx API failures instead of rendering fallback CMS data.
- Match `accounting-frontend` naming for route-local UI: use `components` folders and kebab-case filenames.

## Verification

- Run `npm run typecheck` and `npm run lint` before handoff.
- Run `npm run build` when changing route generation, metadata, or Strapi data fetching behavior.

## Documentation

- Read `docs/PROJECT.md` for the repo map.
- Read `../strapi-global/docs/domains/bssupply.md` for CMS endpoint notes.
