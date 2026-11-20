# HADS Lifesciences

Marketing website for HADS Lifesciences, live at **https://hads.life**.

A single static page built with [Astro](https://astro.build) and served from Cloudflare's edge. It ships no JavaScript framework: one HTML file with inlined CSS, one web font, and a few SVG and WebP images, about 60 KB in total.

## Run it

Needs Node.js 22.23 or newer.

```bash
./run.sh             # dev server with live reload: http://localhost:4321
./run.sh --rebuild   # clean install + production build, served as Cloudflare will: http://localhost:8787
./run.sh --deploy    # build and publish to Cloudflare from this computer (run ./run.sh --login once first)
```

Day to day you do not need `--deploy`: pushing to `main` deploys automatically through Cloudflare's Git integration. See [docs/deploy-cloudflare.md](docs/deploy-cloudflare.md) for the one-time Cloudflare and GoDaddy setup.

## Layout

```
apps/
  web/                    the website
    src/content.ts        every word on the page: edit copy here
    src/components/       one file per page section
    src/styles/global.css brand tokens (colors, type, spacing)
    public/               served as-is: logo, images, icons, security headers
docs/
  deploy-cloudflare.md    step-by-step hosting guide
  brand/                  master logo file from the client (CorelDRAW PDF)
  principles/             engineering principles kept for a future backend
idea/                     local only, not in git: client brief, design concept, reference artwork
run.sh
wrangler.jsonc            Cloudflare config: builds apps/web and serves apps/web/dist
```

New apps (for example a future API) go in `apps/<name>` with their own `package.json`.

## Editing

- **Copy:** change text in `apps/web/src/content.ts`. Keep health claims soft ("designed to", "supports"); never add certifications, statistics, testimonials or product names the client has not supplied.
- **Contact details:** `CONTACT_DETAILS` in the same file. They feed the contact section, the footer and the search-engine data in one go.
- **Colors:** taken from the logo. Use `--pink-ink`, not `--pink`, for normal-size pink text; it is the shade that passes contrast on white.

## Brand assets

Everything in `apps/web/public/brand/` is cut from the client's vector logo (`docs/brand/hads-logo-master.pdf`), not redrawn: the full lockup, the header lockup, and the four letters H, A, D, S, each with its emblem. The framework cards and the hero use those letters, so the site and the logo are the same drawing. The favicon is the D.

| Token | Hex | Where it comes from |
| --- | --- | --- |
| Pink | `#E52189` | H and D |
| Pink (text) | `#CF1A7A` | Darker step for readable text and buttons |
| Blue | `#2253AB` | A and S |
| Navy | `#192B62` | "LIFESCIENCES" |
