import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://hads.life',
  // One HTML response carries all CSS: no render-blocking stylesheet request.
  build: { inlineStylesheets: 'always' },
  // Keep scripts as files so the Content-Security-Policy can stay at
  // script-src 'self' with no inline exceptions (see public/_headers).
  vite: { build: { assetsInlineLimit: 0 } },
  devToolbar: { enabled: false },
})
