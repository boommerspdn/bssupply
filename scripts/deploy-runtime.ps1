$ErrorActionPreference = 'Stop'
$appRoot = Split-Path $PSScriptRoot -Parent
$runtimeRoot = Join-Path $appRoot '.next/standalone'
if (!(Test-Path -LiteralPath (Join-Path $runtimeRoot 'bssupply/server.js'))) { throw 'Build the standalone runtime first' }
$archive = Join-Path $env:TEMP ('bssupply-runtime-' + [guid]::NewGuid().ToString('N') + '.tar.gz')
$deployTar = 'C:/Windows/System32/tar.exe'
$deployScp = 'C:/Windows/System32/OpenSSH/scp.exe'
$deploySsh = 'C:/Windows/System32/OpenSSH/ssh.exe'
& $deployTar -czf $archive -C $runtimeRoot .
if ($LASTEXITCODE -ne 0) { throw 'Packaging failed' }
& $deployScp -o BatchMode=yes -o ConnectTimeout=10 $archive 'fastontime@103.76.183.213:/home/fastontime/domains/subthongpoon.com/codex-runtime-upload.tar.gz'
if ($LASTEXITCODE -ne 0) { throw 'Upload failed' }
@'
set -eu
# Leave room for a new release and a public-directory rollback archive.
if ! quota -w 2>/dev/null | awk '$1 ~ /^\// {gsub(/\*/, "", $2); if ($4 > 0 && $4 - $2 < 61440) exit 1}'; then
  printf 'Deployment requires at least 60 MiB of available hosting quota; no release changed.\n' >&2
  exit 1
fi
base=/home/fastontime/domains/subthongpoon.com
site="$base/public_html"
release=$(date +%Y%m%d-%H%M%S)
stage="$base/releases/bssupply-$release"
backup="$base/runtime-backup-$release"
test "$(readlink -f "$site")" = "$base/public_html"
mkdir -p "$base/releases"
mkdir -m 700 "$backup"
cp "$site/.htaccess" "$backup/htaccess"
tar -czf "$backup/public_html.tar.gz" -C "$site" .
if test -e "$base/bssupply-current"; then
  test -L "$base/bssupply-current"
  readlink "$base/bssupply-current" > "$backup/previous-release"
fi
if test -f "$base/ecosystem.config.cjs"; then cp "$base/ecosystem.config.cjs" "$backup/ecosystem.config.cjs"; fi
switched=0
rollback() {
  tar -xzf "$backup/public_html.tar.gz" -C "$site"
  cp "$backup/htaccess" "$site/.htaccess"
  if test -f "$backup/previous-release"; then
    previous=$(cat "$backup/previous-release")
    case "$previous" in "$base"/releases/*) ;; *) return 1 ;; esac
    ln -s "$previous" "$base/.bssupply-rollback-$release"
    mv -Tf "$base/.bssupply-rollback-$release" "$base/bssupply-current"
    cp "$backup/ecosystem.config.cjs" "$base/ecosystem.config.cjs"
    pm2 startOrReload "$base/ecosystem.config.cjs" --only bssupply --update-env
  else
    pm2 delete bssupply || true
    if test -L "$base/bssupply-current" && test "$(readlink "$base/bssupply-current")" = "$stage"; then rm "$base/bssupply-current"; fi
  fi
}
trap 'status=$?; if test "$status" -ne 0 && test "$switched" = 1; then rollback; fi' EXIT
mkdir "$stage"
tar -xzf "$base/codex-runtime-upload.tar.gz" -C "$stage"
test -f "$stage/bssupply/server.js"
test -f "$stage/ecosystem.config.cjs"
rm "$base/codex-runtime-upload.tar.gz"
ln -s "$stage" "$base/.bssupply-current-$release"
mv -Tf "$base/.bssupply-current-$release" "$base/bssupply-current"
switched=1
cp "$stage/ecosystem.config.cjs" "$base/ecosystem.config.cjs"
pm2 startOrReload "$base/ecosystem.config.cjs" --only bssupply --update-env
healthy=0
for attempt in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:4103/ -o /dev/null; then healthy=1; break; fi
  sleep 1
done
if test "$healthy" != 1; then exit 1; fi
mkdir -p "$site/_next/static"
rsync -a "$stage/bssupply/.next/static/" "$site/_next/static/"
rsync -a --exclude=.htaccess "$stage/bssupply/public/" "$site/"
cp "$stage/bssupply/public/.htaccess" "$site/.htaccess"
# Nginx serves existing exported pages before Apache; remove backed-up HTML/RSC files.
find "$site" -type f \( -name '*.html' -o -name '*.txt' \) ! -path "$site/.well-known/*" -delete
if ! curl -fsS https://subthongpoon.com/ -o /dev/null; then
  printf 'Proxy check failed; previous hosting rules restored\n' >&2
  exit 1
fi
switched=0
pm2 save
printf 'Runtime published; release: %s; backup: %s\n' "$stage" "$backup"
'@ | & $deploySsh -o BatchMode=yes -o ConnectTimeout=10 fastontime@103.76.183.213 "tr -d '\r' | bash -s"
if ($LASTEXITCODE -ne 0) { throw 'Runtime deployment failed; inspect the saved backup and PM2 diagnostics' }
