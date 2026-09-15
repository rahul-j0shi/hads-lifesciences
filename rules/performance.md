# Performance and caching rules

Goal: responsive pages, small deploys, low memory and few requests. Prefer removing work over adding infrastructure. These are initial engineering budgets, not measured results or provider guarantees.

## First-slice budgets

| Measure | Initial target | Verification in HADS-2 |
| --- | --- | --- |
| Initial JavaScript | At most 100 KiB gzip | Production build asset report |
| Initial page transfer | At most 300 KiB compressed, excluding API | Browser network trace on clean cache |
| Welcome/health JSON | At most 1 KiB each | Serialized response byte check |
| Warm welcome handler | p95 under 100 ms over 100 local requests | Record machine and concurrency; exclude network/cold start |
| Backend resident memory | Under 256 MiB at idle and with 5 concurrent readiness requests | Measure process RSS after warm-up; record peak |
| Mobile layout | No horizontal overflow at 320 px; stable reserved image space | Browser smoke/manual inspection |

## Public website budgets (HADS-7)

The full marketing page keeps the first-slice budgets above and adds these. They are engineering targets to be measured, not results. Design rationale: [design concept](../idea/design_concept.md) section 12.2.

| Measure | Initial target | Verification in HADS-7 |
| --- | --- | --- |
| Display font subset | At most 30 KiB `woff2`, self-hosted, no external font host | Built asset size; drop the face entirely before relaxing this |
| Above-the-fold imagery | At most 80 KiB total | Network trace on clean cache, above-fold requests only |
| Total transfer after all default imagery | At most 600 KiB compressed on a fresh visit | Full-page network trace, all default assets loaded |

Reduce optional imagery before adding tooling or raising a budget. No text may depend on the display face, so a blocked or dropped font is a style change and never a content failure.

Investigate over-budget changes and record justified adjustments in the ticket. Hosted cold starts are measured separately; do not promise local latency on a free host. Include a throttled mobile page-load check; use it to identify blocking work, not to claim a production percentile from one run.

## Keep runtime and code small

- Static React build, native fetch, local state and system fonts initially. No SSR server, global state library, service worker, animation library or frontend cache package without a demonstrated need.
- Import only used Lucide icons and shadcn components; do not load complete icon/component registries. Split genuinely optional future routes; avoid many tiny chunks for one page.
- Compress/resize future imagery, provide dimensions and lazy-load below-fold images. Do not ship the full reference image merely to reproduce its text.
- Render the shell before fetching. Avoid request waterfalls, automatic polling and infinite retry loops. Reuse a small backend Mongo pool, not a new client per request.
- Keep test/dev tools, reports, original idea assets and frontend files out of the Python runtime bundle. No data-science or plugin runtime dependencies for this website. Measure installed/bundled size rather than estimating it from source lines.
- Use one worker initially, bounded timeouts and bounded memory structures. Do not select a larger instance as the first response to inefficient code.

## Caching plan: HTTP first

No dedicated cache service, Redis, Mongo cache collection or frontend query-cache library in the first slice. Browser/CDN HTTP caching adds no application runtime dependency. [HTTP cache behavior](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching), checked 2026-09-15.

| Data | Policy | Invalidation |
| --- | --- | --- |
| Content-hashed JS/CSS | `public, max-age=31536000, immutable` | New filename per build |
| HTML entry | `no-cache` (store but revalidate) | Revalidate on navigation/deploy |
| Public welcome response | `public, max-age=60` | TTL; up to 60 seconds of old copy is acceptable |
| Health/errors | `no-store` | Always check current state |
| Future identity/order/payment data | `private, no-store` baseline | No shared cache |

CORS-dependent cacheable responses must include `Vary: Origin`; preserve middleware variation rather than overwriting it. Do not place per-user content, cookies or authorization-dependent responses in shared caches. A cache hit can repeat a cached request ID; it identifies the origin response and must not be treated as a unique browser visit.

For a future public catalog/content endpoint, consider ETag + `If-None-Match`/304 after specifying freshness and invalidation in its contract. Do not add ETag computation to a constant tiny response just for pattern completeness. Shared CDN caching across the two hosting origins requires explicit provider support/configuration; HTTP headers alone do not promise it.

Only after profiling repeated expensive reads, consider a bounded process-local TTL cache: fixed entry/byte cap, monotonic expiry, explicit key (version + normalized query + locale), invalidation on relevant writes and eviction metrics. It is per process, ephemeral and absent after cold starts; it cannot own sessions, authorization, payment deduplication or cross-instance correctness. Approve a shared cache only if a measured requirement exceeds this design and the budget is revisited.
