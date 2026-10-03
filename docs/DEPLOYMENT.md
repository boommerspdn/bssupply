# Deploy BS Supply

BS Supply runs as a Next.js standalone Node application. Do not upload `out/` or use a static file server: exported detail routes cannot serve product IDs published after the build. CMS pages, metadata, and the sitemap fetch Strapi at request time with `no-store`. Only hardcoded assets and metadata such as robots and the social image remain static.

## Production targets

| Setting | Value |
| --- | --- |
| Website | https://subthongpoon.com |
| CMS | https://cms.fastontime.co.th |
| SSH | fastontime@103.76.183.213 |
| Site base | /home/fastontime/domains/subthongpoon.com |
| Public assets / Apache rules | public_html |
| Active runtime | bssupply-current (symlink to a release) |
| Node entry point | bssupply-current/bssupply/server.js |
| PM2 process | bssupply |
| Runtime address | 127.0.0.1:4103 |

Apache proxies page requests to Node through `public/.htaccess`. Existing hardcoded assets can be served directly. Nginx bypasses Apache for existing exported HTML; the deploy script therefore removes backed-up legacy `.html` and `.txt` payload files from the public directory. `private_html` points to `public_html`. Other sites and the Strapi PM2 process must remain untouched.

## Build and prove it locally

Run from this app directory with dependencies installed in the workspace. Configure ignored `.env.production.local` or environment variables:

```dotenv
NEXT_PUBLIC_STRAPI_URL=https://cms.fastontime.co.th
STRAPI_URL=https://cms.fastontime.co.th
NEXT_PUBLIC_SITE_URL=https://subthongpoon.com
NEXT_PUBLIC_CMS_API_PREFIX=/api
CMS_API_PREFIX=/api
STRAPI_API_TOKEN=your-server-read-token
NEXT_PUBLIC_API_TOKEN=your-browser-read-only-token
```

The browser token is public; grant only the CMS read permissions this site needs. Never commit credentials. `NEXT_PUBLIC_*` values are compiled into the browser bundle, so changing them requires a rebuild. Server-only values can be supplied to the runtime. The server can use the read-only browser token when no server token is supplied.

```powershell
npm run typecheck
npm run lint
npm run build
$env:PORT = '3003'
$env:HOSTNAME = '127.0.0.1'
npm run start
```

The build first checks Strapi connectivity. `prepare-standalone.mjs` then copies public assets, Next static chunks, and the PM2 configuration into `.next/standalone`. It removes copied environment files. Because dependencies are shared at the workspace root, deploy the entire standalone directory, not just its nested `bssupply` folder.

Open a published product URL at `http://127.0.0.1:3003/products/<documentId>/`, including a product created after a previous build. Confirm its name, images, prices, reload, and direct navigation. Test filtered listing URLs and their pagination. Product/category routes should be dynamic (`ƒ`) in the build report; they must not be generated as individual static paths.

Stop the local standalone process before rebuilding on Windows to avoid locked output files. A Python/static server on port 3003 will keep reproducing the old export problem.

## Publish

With the local checks complete, existing SSH key authentication configured, and at least 60 MiB of hosting quota available for a new release and backup:

```powershell
./scripts/deploy-runtime.ps1
```

The script uses Windows OpenSSH and tar. It packages the complete standalone output, uploads it, creates a dated release, and backs up the existing hosting rules and public directory. It switches `bssupply-current`, starts or reloads only PM2 `bssupply`, and waits for the internal runtime to answer. It then copies assets and enables the reverse proxy. A failed internal or public health check restores the previous hosting rules and runtime. It prints the release and backup paths; retain those paths for rollback.

`ecosystem.config.cjs` binds Node to localhost port 4103 and limits memory. Apache needs `mod_proxy` and `mod_proxy_http`; proxy support was verified on this host. PM2's saved process list is updated only after the public health check succeeds.

After deployment, verify the homepage, a newly published product's direct URL and reload, a category, search/filter results, and `/sitemap.xml`. Inspect only the `bssupply` process when diagnosing this deployment:

```bash
pm2 describe bssupply
pm2 logs bssupply --lines 50 --nostream
curl -I https://subthongpoon.com/products/<documentId>/
```

## Rollback

Use the backup path printed by the deployment script. Restore its `htaccess` file to `public_html/.htaccess`. For an earlier runtime release, point `bssupply-current` back to the path recorded in `previous-release`, restore the backed-up `ecosystem.config.cjs`, and run `pm2 startOrReload` for `--only bssupply --update-env`, then `pm2 save`.

For the first migration from static hosting, restoring `htaccess` re-enables the old export. Stop/delete only PM2 `bssupply`. Restore `public_html.tar.gz` before re-enabling static hosting: the old exported HTML and payload files were removed during the runtime migration. Verify the old site before removing any release. The previous static procedure is retained in `DEPLOYMENT-STATIC-ARCHIVE.md` for recovery, not for new deployments.

## Data freshness

Publishing CMS products or categories requires no frontend build or deployment. Server reads are uncached. Browser query caches remain intentional: catalog filters/pages cache briefly, and debounced search suggestions cache each query/filter combination. A fresh request or reload reads current CMS data. Newly published records must have public/read-token permissions and a valid published Strapi `documentId`.


## Verified deployment — 2026-10-03

- Active release: `/home/fastontime/domains/subthongpoon.com/releases/bssupply-20261003-192132`.
- Pre-migration backup: `/home/fastontime/domains/subthongpoon.com/runtime-backup-20261003-192132`.
- Homepage and `/products/lm73aaauxymn5i5wfbxtarig/` return HTTP 200 with Next.js `no-store` headers. The product was missing from the previous export but exists as a published Strapi record.
- Production runtime uses localhost port 4103; ports in the 3000 range are occupied by other services and must not be stopped.
- The host's account is close to its storage quota. Ensure capacity before the next release; the script checks the remaining quota and stops before switching runtimes if insufficient.
