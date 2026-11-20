#!/usr/bin/env bash
# HADS website helper.
#
#   ./run.sh             start the dev server with live reload    http://localhost:4321
#   ./run.sh --rebuild   clean install + production build, then serve it exactly as
#                        Cloudflare will                          http://localhost:8787
#   ./run.sh --deploy    build and publish to Cloudflare (run `npx wrangler login` once first)
set -euo pipefail
cd "$(dirname "$0")/apps/web"

usage() {
  cat <<'USAGE'
./run.sh             dev server with live reload          http://localhost:4321
./run.sh --rebuild   clean install + production build, served as Cloudflare will
                                                          http://localhost:8787
./run.sh --deploy    build and publish to Cloudflare (run `npx wrangler login` once first)
USAGE
}

install() { [ -d node_modules ] || npm ci; }

case "${1:-}" in
  "")
    install
    npm run dev
    ;;
  --rebuild)
    rm -rf node_modules dist .astro
    npm ci
    npm run build
    npx wrangler dev --port 8787
    ;;
  --deploy)
    install
    npm run deploy
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
