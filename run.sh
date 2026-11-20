#!/usr/bin/env bash
# HADS website helper. Run ./run.sh --help for the options.
set -euo pipefail
cd "$(dirname "$0")"

usage() {
  cat <<'USAGE'
./run.sh             dev server with live reload          http://localhost:4321
./run.sh --rebuild   clean install + production build, served as Cloudflare will
                                                          http://localhost:8787
./run.sh --deploy    build and publish to Cloudflare (run ./run.sh --login once first)
./run.sh --login     connect this computer to your Cloudflare account
USAGE
}

wrangler() { apps/web/node_modules/.bin/wrangler "$@"; }
install() { [ -d apps/web/node_modules ] || npm ci --prefix apps/web; }

case "${1:-}" in
  "")
    install
    npm run dev --prefix apps/web
    ;;
  --rebuild)
    rm -rf apps/web/node_modules apps/web/dist apps/web/.astro
    npm ci --prefix apps/web
    wrangler dev --port 8787 # runs the production build from wrangler.jsonc first
    ;;
  --deploy)
    install
    wrangler deploy
    ;;
  --login)
    install
    wrangler login
    ;;
  -h | --help)
    usage
    ;;
  *)
    echo "Unknown option: $1" >&2
    usage
    exit 1
    ;;
esac
