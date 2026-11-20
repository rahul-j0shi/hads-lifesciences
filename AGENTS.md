# Working in this repository

- The product is a static marketing site in `apps/web` (Astro, deployed to Cloudflare). Read `README.md` first.
- All page copy lives in `apps/web/src/content.ts`. Do not strengthen health or medical claims; keep the softened wording unless the client approves a change.
- Never invent certifications, statistics, testimonials, founder details or product names.
- Brand colors come from the logo; use the tokens in `apps/web/src/styles/global.css`, and `--pink-ink` (not `--pink`) for normal-size pink text.
- Keep the page fast: no client-side framework, no new runtime dependencies without a measured reason.
- No em dashes in authored text.
- Engineering principles for a future backend live in `docs/principles/`.
