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

Validation evidence: none yet. Live URLs/revisions: none yet. Do not mark done until hosted acceptance is verified; if deployment prerequisites are unavailable, record completed local work and the remaining blocker separately.

## Contract readiness before implementation

Contract gate: draft. The existing OpenAPI is a design baseline; finish its full validation and record the reviewed revision before dependent code, following [workflow](../rules/workflow.md).

| Area | Impact |
| --- | --- |
| Product/UI | Existing neutral placeholder and states in the linked frontend/product documents |
| API | Three operations in the linked OpenAPI; validate schemas, headers and framework errors |
| Database | No collections or persisted data; readiness-only design already recorded |
| Operations | Runtime pins, test gates, environment wiring and provider configuration in linked runbook |

Reviewer/date/revision: pending HADS-2 readiness review. Hosting prerequisites may remain tracked separately from local implementation readiness.
