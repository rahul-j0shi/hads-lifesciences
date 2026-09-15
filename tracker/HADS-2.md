# HADS-2: Implement the first connected HADS page

Status: planned. Depends on: [HADS-1](HADS-1.md), [HADS-3](HADS-3.md). Scope: smallest deployable slice, after the documentation-only phase. Owner account setup and a usable source repository are deployment prerequisites; final website copy is not required for a neutral placeholder.

Context: [architecture](../documentation/architecture.md), [frontend](../frontend/README.md), [backend](../backend/README.md), [API](../api-design/README.md), [database](../database-design/README.md), [hosting](../documentation/setup-and-hosting.md), [rules](../rules/README.md).

## Work

Finalize compatible stable versions and lockfiles; build branded responsive React placeholder; implement three documented FastAPI endpoints, request/error handling, Mongo lifespan and environment validation; add deployment configuration and safe environment examples; implement the automatic test/report gates and CI; validate locally and deploy the tested revision through owner-configured accounts.

## Acceptance criteria

- [ ] Branded accessible page renders immediately, reads real welcome API, and recovers gracefully from timeout/unavailability.
- [ ] Liveness is independent of Mongo; readiness returns 200/503 accurately without persistent writes or secret leakage.
- [ ] Exact-origin CORS, safe errors, security headers and validated backend-only secrets.
- [ ] Measure bundle size, response bytes, warm latency and backend memory against [performance budgets](../rules/performance.md); verify cache headers and origin variation.
- [ ] Locked frontend/backend dependencies and documented supported runtimes; runbook commands work as written.
- [ ] Real-Mongo integration tests plus unit/appropriate regression coverage; frontend checks and browser smoke pass.
- [ ] Repository writing check rejects em dashes in authored text, including documentation-only changes.
- [ ] CI automatically verifies PRs/pushes and always publishes fresh reports, including failure cases. Agent reads and records the report. Deploys release only passing revisions.
- [ ] OpenAPI drift/response checks pass and published contract matches the API.
- [ ] Free account tiers, limits and permitted use rechecked; live frontend/API URLs recorded, Mongo readiness verified and rollback rehearsed.

Excludes: authentication/signup UI, payment integration, catalog, admin panel, private user data, full Cordis kernel, CMS and paid infrastructure.

Validation evidence, 2026-09-15, revision `bc224ac`:

Implemented against the published contract and verified by running it locally, not by inspection.

| Check | Result |
| --- | --- |
| `GET /health/live` | 200, `cache-control: no-store`, `x-request-id` present |
| `GET /api/v1/welcome` | 200, `public, max-age=60`, `Vary: Origin`, body exactly `{"name":"HADS Lifesciences","message":"Website coming soon."}` |
| `GET /health/ready` | 200 `{"status":"ready"}` against the **real Atlas cluster** |
| `GET /nope` | 404 `application/problem+json`, contract shape |
| `POST /health/live` | 405 problem body |
| Request id handling | Safe supplied id echoed; `bad id!!<script>` replaced with a generated one |
| Frontend `npm run verify` | TypeScript strict passes, build succeeds |
| Initial JS | 70.69 KiB gzip, inside the 100 KiB budget |
| Initial page transfer | about 72 KiB gzip, inside the 300 KiB budget |

Defect found and fixed during implementation: `Settings.mongodb_uri` typed as Pydantic `MongoDsn` normalized the URI and appended the default port, which PyMongo rejects for `mongodb+srv://` with "SRV URIs must not include a port number". It is now a plain string with a scheme-only validator. A regression test for this belongs in the test suite when it is added.

Not yet done: no test suite, no `scripts/verify.py`, no CI workflow, no `uv.lock` (uv is not installed on the development machine), no lint or type-check run for the backend, and no measurement of warm latency or resident memory.

Hosting state: Vercel project `hads-lifesciences` created on the Hobby plan with no payment method attached. Production environment variables `APP_ENV`, `MONGODB_DATABASE`, `LOG_LEVEL` and `MONGODB_URI` are set. Vercel reports `framework: services`, confirming it accepted the two-service `vercel.json`.

Live URLs/revisions: none yet. Do not mark done until hosted acceptance is verified; if deployment prerequisites are unavailable, record completed local work and the remaining blocker separately.

## Contract readiness before implementation

Contract gate: draft. The existing OpenAPI is a design baseline; finish its full validation and record the reviewed revision before dependent code, following [workflow](../rules/workflow.md).

| Area | Impact |
| --- | --- |
| Product/UI | Existing neutral placeholder and states in the linked frontend/product documents |
| API | Three operations in the linked OpenAPI; validate schemas, headers and framework errors |
| Database | No collections or persisted data; readiness-only design already recorded |
| Operations | Runtime pins, test gates, environment wiring and provider configuration in linked runbook |

Reviewer/date/revision: pending HADS-2 readiness review. Hosting prerequisites may remain tracked separately from local implementation readiness.

## Remaining work or blockers

**Blocked on two owner actions in a browser, both one-time.**

1. **Install the Vercel GitHub integration.** The REST API refuses to link the repository without it: `To link a GitHub repository, you need to install the GitHub integration first.` Until then Vercel cannot build from GitHub. Direct CLI upload from the development machine fails with `fetch failed` on every attempt, including single-tarball mode, while plain authenticated API calls to the same host return 200. That makes it an upload-path problem on this network, not an authentication problem. Connecting GitHub moves the build server-side and makes the local network irrelevant.
2. **Set Atlas Network Access to allow `0.0.0.0/0`.** Vercel Hobby publishes no stable outbound IP ranges. Until this is set, the deployed `/health/ready` correctly returns 503 while liveness and welcome still return 200. The database password then becomes the only access control, as recorded in [ADR-002](../documentation/decisions.md#adr-002-zero-budget-hosting).

Engineering work still outstanding, none of it blocked: test suite, `scripts/verify.py`, CI workflow, `uv.lock`, backend lint and type checks, and measurement of warm latency and resident memory.
