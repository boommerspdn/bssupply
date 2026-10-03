# Historical static-export deployment (superseded)

Do not use this process for current BS Supply. See [runtime deployment](DEPLOYMENT.md).

# Deploy BS Supply

BS Supply is a static Next.js export. Build on your computer and upload the complete
`bssupply/out/` directory. The web server serves the export directly; this frontend
does not need a PM2 restart or `next start`.

## Production targets

| Setting | Value |
| --- | --- |
| Website | `https://subthongpoon.com` |
| CMS | `https://cms.fastontime.co.th` |
| CMS API prefix | `/api` |
| SSH | `fastontime@103.76.183.213`, port 22 |
| Website directory | `/home/fastontime/domains/subthongpoon.com/public_html` |
| HTTPS directory | `private_html` is a symlink to `public_html` |

The commands below use PowerShell on Windows. Run local commands from this workspace.
Keep the sibling `scripts/check-strapi.mjs`: the build script depends on it.
SSH authentication uses your existing key in your user profile's `.ssh` directory.
The examples use the Windows OpenSSH executables explicitly because they may not be on PATH.

## 1. Configure and build against production

Create an ignored `bssupply/.env.production.local` containing:

```dotenv
NEXT_PUBLIC_STRAPI_URL=https://cms.fastontime.co.th
STRAPI_URL=https://cms.fastontime.co.th
NEXT_PUBLIC_SITE_URL=https://subthongpoon.com
NEXT_PUBLIC_CMS_API_PREFIX=/api
CMS_API_PREFIX=/api
STRAPI_API_TOKEN=your-production-build-read-token
NEXT_PUBLIC_API_TOKEN=your-production-browser-read-token
```

Replace the token placeholders with valid production credentials. The browser token
is public in the exported JavaScript and must have read-only CMS permissions.
Use a separate server credential for `STRAPI_API_TOKEN` if available. Do not commit
environment files. An old local Strapi token will not authenticate to production.
Remove conflicting values from your shell environment and `.env.local` before building.

Run from the `bssupply` folder:

```powershell
# Set these explicitly so the build preflight and Next.js use the same CMS.
$env:NEXT_PUBLIC_STRAPI_URL = 'https://cms.fastontime.co.th'
$env:STRAPI_URL = 'https://cms.fastontime.co.th'
$env:NEXT_PUBLIC_SITE_URL = 'https://subthongpoon.com'
$env:NEXT_PUBLIC_CMS_API_PREFIX = '/api'
$env:CMS_API_PREFIX = '/api'

# Preserve, but stop reusing, cached CMS responses from a previous build.
if (Test-Path -LiteralPath '.next/cache/fetch-cache') {
    Rename-Item -LiteralPath '.next/cache/fetch-cache' -NewName ('fetch-cache-before-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
}

npm run typecheck
if ($LASTEXITCODE -ne 0) { throw 'Typecheck failed' }
npm run lint
if ($LASTEXITCODE -ne 0) { throw 'Lint failed' }
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Build failed; do not deploy the previous out directory' }
```

The build checks CMS reachability, exports the routes, then runs
`scripts/alias-next-prefetch.mjs`. Keep the `.txt` payloads and their aliases together
with the HTML, JavaScript, CSS, fonts, images, sitemap, and 404 files.
Confirm each newly published product/category has `out/<route>/<documentId>/index.html`.
New detail URLs require a rebuild even though catalog data refreshes in the browser.
Category navigation uses `/products/?category=<documentId>` to support live categories.

## 2. Verify the export locally

Serve `out/`, rather than using `npm run dev`, to exercise the exact deployment:

```powershell
python -m http.server 3003 --bind 127.0.0.1 --directory out
```

Open `http://127.0.0.1:3003/`. Check category selection, a product card click,
refresh on the product detail URL, and browser console errors. Inspect `/404.html`
for the exported recovery UI. Python's standard server uses its own response for
missing URLs; the production server must map those to the exported 404 page.

For the October 3 verification, the workspace helper
`output/playwright/serve-export.py` also serves the exported 404 document with HTTP 404.
It runs on port 3003 from the workspace root.

## 3. Package and upload the verified export

From `bssupply`, with `out/` still containing the locally verified build:

```powershell
$deploySsh = 'C:/Windows/System32/OpenSSH/ssh.exe'
$deployScp = 'C:/Windows/System32/OpenSSH/scp.exe'
$deployTar = 'C:/Windows/System32/tar.exe'
$release = Get-Date -Format 'yyyyMMdd-HHmmss'
$archive = Join-Path $env:TEMP "bssupply-$release.tar.gz"

& $deployTar -czf $archive -C out .
if ($LASTEXITCODE -ne 0) { throw 'Packaging failed' }
& $deployScp -o BatchMode=yes -o ConnectTimeout=10 $archive 'fastontime@103.76.183.213:/home/fastontime/domains/subthongpoon.com/codex-upload.tar.gz'
if ($LASTEXITCODE -ne 0) { throw 'Upload failed' }
```

Run one deployment at a time. The uploaded archive is staged outside the public website.

## 4. Back up and publish

Run this PowerShell command after the upload succeeds:

```powershell
@'
set -eu
base=/home/fastontime/domains/subthongpoon.com
site="$base/public_html"
release=$(date +%Y%m%d-%H%M%S)
stage="$base/.deploy-stage-$release"
backup="$base/public_html-backup-$release.tar.gz"
test "$(readlink -f "$site")" = /home/fastontime/domains/subthongpoon.com/public_html
test -f "$site/index.html"
test ! -e "$backup"
tar -czf "$backup" -C "$site" .
mkdir "$stage"
tar -xzf "$base/codex-upload.tar.gz" -C "$stage"
test -f "$stage/index.html"
test -f "$stage/404.html"
test -d "$stage/_next/static"
# Publish new assets before HTML that references them.
rsync -a "$stage/_next/" "$site/_next/"
rsync -a --exclude=.htaccess --exclude=.well-known/ "$stage/" "$site/"
printf 'Published; rollback backup: %s\n' "$backup"
'@ | & $deploySsh -o BatchMode=yes -o ConnectTimeout=10 fastontime@103.76.183.213 "tr -d '\r' | bash -s"
if ($LASTEXITCODE -ne 0) { throw 'Remote deployment failed; inspect before retrying' }
```

This preserves the server's `.htaccess`, certificate challenge files, and older hashed
assets needed by browsers that already have the previous page open. It does not delete
old route files. Backups and staging directories stay outside `public_html`.

### When hosting rules change

The deployment above deliberately preserves `.htaccess`. If `public/.htaccess` changes,
compare it with the server file, then deploy the reviewed rules separately:

```powershell
& $deployScp -o BatchMode=yes public/.htaccess 'fastontime@103.76.183.213:/home/fastontime/domains/subthongpoon.com/.htaccess-incoming'
if ($LASTEXITCODE -ne 0) { throw 'Hosting rules upload failed' }
@'
set -eu
base=/home/fastontime/domains/subthongpoon.com
site="$base/public_html"
test "$(readlink -f "$site")" = /home/fastontime/domains/subthongpoon.com/public_html
cp "$site/.htaccess" "$base/.htaccess-backup-$(date +%Y%m%d-%H%M%S)"
cp "$base/.htaccess-incoming" "$site/.htaccess"
'@ | & $deploySsh -o BatchMode=yes fastontime@103.76.183.213 "tr -d '\r' | bash -s"
if ($LASTEXITCODE -ne 0) { throw 'Hosting rules publish failed' }
```

Immediately verify page and payload responses. Restore the saved `.htaccess` if page
requests return 500. Apache reads these directory rules without a frontend restart.

## 5. Verify production

In a fresh browser session, visit the homepage, category listing, filtered products,
and the newly published detail URLs. Click a product, refresh it, and use Back.
Verify a deliberately missing URL returns HTTP 404 and the Thai recovery page.

For example:

```powershell
curl.exe -I https://subthongpoon.com/categories/maznqa1pnyrycg638c8zf177/
curl.exe -I https://subthongpoon.com/products/beu7jsx90z4sot8dmm98zdbk/
curl.exe -I https://subthongpoon.com/deployment-missing-page/
```

Page URLs must return `text/html`; Next.js `.txt` navigation payloads return
`text/plain`. A 200 response alone does not prove browser navigation works.

If a browser displays `$Sreact.fragment` or route JSON as text, inspect the exact URL,
document request, response content type, redirects, and caching. Compare the clean
page URL with `index.txt` and `__next._full.txt`. Do not treat the raw payload as a CMS
error. Apache must retain `Options -MultiViews` and `DirectoryIndex index.html`;
missing pages must use the exported 404 document. The public `Server: nginx` header
may identify a proxy in front of Apache. A standalone nginx host needs equivalent
HTML directory-index and 404 rules; it does not read `.htaccess`.

The reported fragment was reproduced at
`/products/beu7jsx90z4sot8dmm98zdbk/index.txt/`: this is a payload URL, not a page.
The updated `.htaccess` redirects `index.txt/` to the enclosing page and also redirects
bare `index.txt` when `Sec-Fetch-Dest: document` identifies a browser page visit.
Ordinary fetch requests to bare `index.txt` remain untouched. Check all three cases;
redirecting every `.txt` request would break Next.js client navigation.

## Roll back

SSH into the server and replace the backup filename below with the one printed by
your deployment. This restores backed-up files while retaining newly added assets/routes.

```bash
set -eu
base=/home/fastontime/domains/subthongpoon.com
site="$base/public_html"
backup="$base/public_html-backup-YYYYMMDD-HHMMSS.tar.gz"
restore="$base/.rollback-$(date +%Y%m%d-%H%M%S)"
test "$(readlink -f "$site")" = /home/fastontime/domains/subthongpoon.com/public_html
test -f "$backup"
mkdir "$restore"
tar -xzf "$backup" -C "$restore"
test -f "$restore/index.html"
rsync -a "$restore/" "$site/"
```

Repeat the browser checks after rollback. Do not restart or change the CMS/database
for a static frontend deployment.

## October 3, 2026 deployment

The locally verified export includes the formerly missing category
`maznqa1pnyrycg638c8zf177`, product `beu7jsx90z4sot8dmm98zdbk`, category filter selection,
Strapi 5 category relation normalization, CMS retry banners, and the Thai 404 page.
Local browser checks covered product click/refresh, a simulated CMS 503 followed by
Retry recovery, and the 404 recovery link. Screenshots are in the workspace's
`output/playwright/` directory.

The published category, product, and 404 files were checked by SHA-256 against that
local export. A fresh production browser session passed filtered product navigation
and product detail refresh with an HTML 200 response and no console errors.
The follow-up report supplied the exact `index.txt/` URL, which reproduced the plain
text payload. The hosting redirect fix was then deployed separately. HTTP checks
confirmed payload page visits redirect, normal product URLs return HTML 200, and
Next.js payload fetches still return text 200.

Backup for this deployment:
`/home/fastontime/domains/subthongpoon.com/public_html-backup-local-verified-20261003-161851.tar.gz`.

Hosting-rule backup before the redirect fix:
`/home/fastontime/domains/subthongpoon.com/.htaccess-before-payload-redirect-20261003-162317`.

The product image carousel was subsequently verified locally on desktop and a 390px
mobile viewport, then deployed with `.htaccess` preserved. Checks covered thumbnail
selection, the enlarged viewer, arrows, keyboard navigation, Escape, and gallery/viewer
synchronization. Gallery deployment backup:
`/home/fastontime/domains/subthongpoon.com/public_html-backup-gallery-20261003-163613.tar.gz`.

The catalog now requests 20 products per page from Strapi with search, category,
condition, and sort filters applied before pagination. shadcn Skeleton handles cold
loads and Spinner handles subsequent search/filter/page requests. Page links retain
filters, filter submissions reset to page 1, and the combined navbar product link
opens categories on hover and resets filters on click. Product route and sitemap
discovery traverse all CMS pages at build time.

Verification covered actual filtered Strapi requests and metadata, delayed initial
skeleton/search spinner states, CMS 503 retry recovery, out-of-range page recovery,
and mobile navigation. A browser-only 45-product fixture checked 20/20/5 page sizes,
Previous/Next boundaries, filter preservation in both URLs and outgoing CMS requests,
and Back navigation. The fixture did not change CMS data. Screenshots:
`output/playwright/product-initial-skeleton.png`,
`output/playwright/product-search-spinner.png`, and
`output/playwright/product-pagination-filtered.png` in the workspace root.

Pagination deployment backup:
`/home/fastontime/domains/subthongpoon.com/public_html-backup-pagination-20261003-172358.tar.gz`.

## October 3, 2026 catalog UI release

The complete BS Supply export was published after the selected pagination page was disabled (no href, aria-disabled, skipped tab order, and no click navigation). This release also publishes the previously local shared search suggestions, six-result limit, centered 46px empty state, pale-green `#E6F4EB` hover accents, shared contact actions, pricing fields, gallery pointers, and reload scroll reset.

Typecheck, lint, and production-CMS build passed; lint retains six image warnings. A browser-only 45-product fixture verified that other page links work and retain search/category filters, while clicking the selected page does not navigate or request products again. CMS records were not modified by this fixture.

Fresh production checks confirmed disabled current-page pagination, the shared hover color and placeholder, compact empty state, product detail HTML reload, no JavaScript page errors, the 404 response, and the existing payload redirect. Live product/listing HTML matched the local export byte for byte. The server `.htaccess` was preserved.

Rollback backup: `/home/fastontime/domains/subthongpoon.com/public_html-backup-selected-pagination-20261003-183240.tar.gz`.
