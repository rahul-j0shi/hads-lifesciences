# Architecture decisions

Reviewed 2026-09-15. The mandatory [zero-cost constraint](../rules/README.md#zero-cost-constraint) governs every option below. Recheck provider terms and version support before provisioning. Status “accepted baseline” describes this plan, not a deployed system.

New to these concepts? Start with the [learning guides](learnings/README.md); this register remains the source for decisions.

## ADR-001: Small modular application

**Accepted baseline:** React + TypeScript + Vite; shadcn/ui components as needed, Lucide icons; Python + FastAPI + Pydantic; MongoDB Atlas through PyMongo Async. Use an application composition root and narrow feature boundaries. Avoid premature generic layers. Lock exact stable versions during HADS-2 after checking provider compatibility.

React supports the requested component ecosystem; FastAPI keeps a typed HTTP contract close to Python code. Prefer PyMongo Async for new async Mongo work; MongoDB documents the migration away from Motor. [Official driver guidance](https://www.mongodb.com/docs/languages/python/pymongo-driver/current/reference/migration/).

## ADR-002: Zero-budget hosting

**Accepted baseline:** Netlify Free frontend + Render Free Python web service + Atlas Free. Use provider subdomains and synthetic data. Cost target is $0 within limits, with suspension acceptable. This is not a promise of perpetual availability or unchanged provider pricing.

| Service | Verified constraint | Design consequence |
| --- | --- | --- |
| Netlify Free | Credit plan has 300 credits/month and a hard limit; exhausted credits pause sites | Avoid needless production deploys; inspect team-wide usage and confirm actual account plan |
| Render Free | Sleeps after 15 idle minutes; wake-up can take about a minute; 750 instance-hours/workspace/month; ephemeral disk | Graceful UI fallback, one API service, no file persistence or always-on jobs |
| Atlas Free (formerly M0) | 0.5 GB including indexes; 500 connections; no managed backups; may pause after 30 idle days | Small connection pool, no binary assets, synthetic data and manual export when needed |
| Vercel Hobby | Personal, non-commercial use only | HADS business prototype must not assume eligibility; no checkout required for this restriction to matter |

Sources: [Netlify credits](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/), [Netlify plans](https://www.netlify.com/pricing/), [Render free constraints](https://render.com/docs/free), [Atlas constraints](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/), [Vercel fair use](https://vercel.com/docs/limits/fair-use-guidelines).

Render can bill bandwidth/build overages when a payment method is attached; without one it suspends services/builds at the applicable limit. Keep no payment method on this prototype workspace, inspect spend controls, and do not enable paid instances. External database traffic can also cause suspension at unusually high volumes. No keep-alive jobs to defeat sleeping. [Render limits](https://render.com/docs/free).

Vercel supports FastAPI technically, but this does not override its usage terms. Consider it only with confirmed eligibility or an explicitly available commercial entitlement; do not purchase Pro under the $0 constraint. Netlify remains the selected static host; account terms should still be checked at signup. Real payment processing, identity hosting/email, domains and future usage are separate budget decisions, not included free guarantees.

## ADR-003: Spatiotemporal composability

**Accepted with bounded application:** the referenced work is *A Programming Paradigm for Spatiotemporal Composability*, Yifan Shi, Wei Zhang and Tianyi Cui, arXiv:2608.25512 (2026), an actively revised preprint. Temporal composition addresses reverting component effects; spatial composition addresses reactive dependency satisfaction. Cordis implements these ideas. Sources: [paper and version history](https://arxiv.org/abs/2608.25512), [authors’ repository](https://github.com/cordiverse/paper), [Cordis implementation](https://github.com/cordiverse/cordis). DeepSeek’s [Harness repository](https://github.com/deepseek-ai/deepseek-harness) supplies the project connection.

HADS interpretation (engineering judgment): declare dependencies explicitly, centralize resource ownership and guarantee cleanup. Use FastAPI [lifespan](https://fastapi.tiangolo.com/advanced/events/) and context managers, React effect cleanup and request cancellation. Test partial startup failure and shutdown as well as normal execution.

This static Python composition does **not** implement reactive component activation, a shared effect/coeffect calculus, hot module replacement or the paper’s formal guarantees. Cordis is not selected as a Python web backend kernel. If live plugin replacement becomes an actual requirement, open a new ADR, pin the paper revision, evaluate maintained compatible implementations and specify unload/dependency-loss tests. External durable effects need explicit compensation; cleanup does not reverse a payment or database commit.

## ADR-004: Use external identity and payment providers later

**Deferred provider choice:** OIDC identity, hosted payment checkout and signed webhooks. Keycloak is a candidate, not an included free hosted service. Its supported storage uses relational databases such as PostgreSQL, not the application MongoDB. Persistent hosting, a supported database and email delivery must be budgeted before choosing it. [Keycloak database support](https://www.keycloak.org/server/db). Detailed boundaries: [security and integrations](security-and-integrations.md).

## ADR-005: Vercel resource assumptions

User preference: Vercel Free, subject to ADR-002 eligibility and secure Mongo connectivity. Keep the backend portable to it; Render is the documented fallback when those prerequisites fail. Do not provision a paid plan.

As checked 2026-09-15, Vercel documents **2 GB maximum memory for Hobby with Fluid compute** and a **500 MB standard uncompressed Python function bundle**. These are different from storage, transfer and monthly usage quotas; “1 GB free” is not a complete capacity model. Account/runtime settings can differ, so verify the actual dashboard. [Official function limits](https://vercel.com/docs/functions/limitations).

HADS deliberately targets much less memory through [performance budgets](../rules/performance.md). This remains a design target until HADS-2 measures the actual process/bundle. Runtime fit does not resolve Hobby commercial-use eligibility.

## ADR-006: Public website content and delivery model

**Accepted baseline:** the public marketing page ships as static frontend content. All editorial copy lives in one typed module inside the frontend bundle. Contact is a `mailto:` link, not an API. No CMS, no content collection, no contact endpoint, no analytics service and no cookie storage. Context and full specification: [design concept](../idea/design_concept.md); implementation: [HADS-7](../tracker/HADS-7.md).

The page has one route, 508 words of proposed copy that change only when the client revises them, and one conversion that is an email. A database-backed content model, an editing workflow and a form endpoint would each add a contract, a storage decision, a spam surface and a privacy position, and none of them makes the page work better today. Under the [zero-cost constraint](../rules/README.md#zero-cost-constraint) they also add services to keep free. Bundled content keeps the page renderable with the API asleep, which matters on a free host that sleeps after idle.

| Consequence | Detail |
| --- | --- |
| Copy changes need a rebuild and a deploy | Acceptable at the expected rate of change. Revisit if the client needs to edit copy without a developer |
| Inquiry volume cannot be measured | `mailto:` produces no server-side signal, and measuring it needs analytics, which needs a privacy decision. Recorded as an accepted tradeoff, not an oversight |
| Search and sharing depend on a pre-rendering decision | A client-rendered page is not automatically indexable. HADS-7 decides whether build-time pre-rendering is needed, without introducing a server-rendering host |
| Self-hosted display font | One SIL OFL licensed subset shipped from the frontend, under 30 KiB, with a system fallback and no text depending on it. No external font host, no cost, and no request to a third party |
| A future CMS or editor is a separate decision | It would need its own API and database contracts, an approval workflow and a new ADR. It cannot inherit approval from this one |

Publishing marketing claims is a separate concern from delivery. The claim register and publication prerequisites in the [design concept](../idea/design_concept.md) govern what may appear on the page, and [HADS-8](../tracker/HADS-8.md) owns collecting those answers. This ADR decides how content is delivered, not whether any statement in it is substantiated.
