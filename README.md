# BS Supply

BS Supply is a Next.js 16 App Router catalog frontend backed by the shared Strapi backend in `../strapi-global`.

## Local Development

Create `.env` with the local Strapi URL:

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3003
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-api-token-here
```

Run the app:

```bash
npm run dev
```

The app runs at `http://localhost:3003` and consumes the `bssupply-*` Strapi API domain.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

## Project Documentation

- `docs/PROJECT.md` describes this frontend's source layout, Strapi domain, and verification workflow.
- `../strapi-global/docs/domains/bssupply.md` documents the BS Supply CMS endpoints.
