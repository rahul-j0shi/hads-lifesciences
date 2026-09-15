# Architecture decisions

Reviewed 2026-09-15. The mandatory [zero-cost constraint](../rules/README.md#zero-cost-constraint) governs every option below. Recheck provider terms and version support before provisioning. Status “accepted baseline” describes this plan, not a deployed system.

New to these concepts? Start with the [learning guides](learnings/README.md); this register remains the source for decisions.

## ADR-001: Small modular application

**Accepted baseline:** React + TypeScript + Vite; shadcn/ui components as needed, Lucide icons; Python + FastAPI + Pydantic; MongoDB Atlas through PyMongo Async. Use an application composition root and narrow feature boundaries. Avoid premature generic layers. Lock exact stable versions during HADS-2 after checking provider compatibility.

React supports the requested component ecosystem; FastAPI keeps a typed HTTP contract close to Python code. Prefer PyMongo Async for new async Mongo work; MongoDB documents the migration away from Motor. [Official driver guidance](https://www.mongodb.com/docs/languages/python/pymongo-driver/current/reference/migration/).

## ADR-002: Zero-budget hosting

**Revised 2026-09-15. Accepted baseline: Vercel Hobby for both the website and the API, plus MongoDB Atlas Free.** Use provider subdomains and synthetic data. Cost target is $0 within limits, with suspension acceptable. This is not a promise of perpetual availability or unchanged provider pricing.

The earlier baseline was Netlify Free for static assets plus Render Free for the Python service. It was replaced because Render's free instance provides 512 MB and 0.1 CPU, and because two providers meant two origins, CORS configuration between them, and a rebuild of the frontend whenever the API URL changed. One provider serving both halves from one domain removes all three problems.

| Service | Verified constraint | Design consequence |
| --- | --- | --- |
| Vercel Hobby | Monthly guidelines: 100 GB Fast Data Transfer, 1,000,000 function invocations, 10 GB Fast Origin Transfer, 4 hours Active CPU, 360 GB-hours Provisioned Memory. Up to 2 GB function memory on Fluid compute. 500 MB standard Python bundle | One project with two services on one domain. No CORS. Relative API paths, so no rebuild when a URL changes. Eligibility condition in [ADR-005](#adr-005-vercel-hosting-and-its-eligibility-condition) |
| Vercel functions | Serverless, many short-lived instances; shutdown cleanup capped at 500 ms after SIGTERM | Small Mongo pool per instance, 2 to 5 rather than 10; fast, non-blocking client close in lifespan; measure Atlas connection counts |
| Vercel egress | No stable outbound IP addresses on Hobby | Atlas Network Access must allow `0.0.0.0/0`. The database password becomes the only access control, so it must be long, unique and rotated on suspicion |
| Atlas Free (formerly M0) | 0.5 GB including indexes; 500 connections; no managed backups; may pause after 30 idle days | Small connection pool, no binary assets, synthetic data and manual export when needed |

Sources: [Vercel fair use](https://vercel.com/docs/limits/fair-use-guidelines), [Vercel function limits](https://vercel.com/docs/functions/limitations), [Vercel Services](https://vercel.com/docs/services), [FastAPI on Vercel](https://vercel.com/docs/frameworks/backend/fastapi), [Atlas constraints](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/).

Keep no payment method on the Vercel account so usage stops rather than bills. Real payment processing, identity hosting and email, domains and future usage remain separate budget decisions, not included free guarantees.

**Rejected alternatives.** Netlify Free cannot run a FastAPI application, so it always required a second provider. Render Free remains viable and is the natural fallback if the Vercel eligibility condition stops holding, at the cost of 512 MB, 0.1 CPU, a 15-minute idle spin-down and the return of CORS. Koyeb no longer publishes a free compute tier. Fly.io and Railway are trial-based and require a card. Google Cloud Run's free quota is generous but requires a billing account, and budget alerts notify rather than stop spend, which conflicts with the zero-cost rule. Oracle Always Free offers far more memory but requires a card, was silently halved from 4 OCPU and 24 GB to 2 OCPU and 12 GB on 15 June 2026, and is a raw VM whose operating system, TLS and patching would become this project's problem.

## ADR-003: Spatiotemporal composability

**Accepted with bounded application:** the referenced work is *A Programming Paradigm for Spatiotemporal Composability*, Yifan Shi, Wei Zhang and Tianyi Cui, arXiv:2608.25512 (2026), an actively revised preprint. Temporal composition addresses reverting component effects; spatial composition addresses reactive dependency satisfaction. Cordis implements these ideas. Sources: [paper and version history](https://arxiv.org/abs/2608.25512), [authors’ repository](https://github.com/cordiverse/paper), [Cordis implementation](https://github.com/cordiverse/cordis). DeepSeek’s [Harness repository](https://github.com/deepseek-ai/deepseek-harness) supplies the project connection.

HADS interpretation (engineering judgment): declare dependencies explicitly, centralize resource ownership and guarantee cleanup. Use FastAPI [lifespan](https://fastapi.tiangolo.com/advanced/events/) and context managers, React effect cleanup and request cancellation. Test partial startup failure and shutdown as well as normal execution.

This static Python composition does **not** implement reactive component activation, a shared effect/coeffect calculus, hot module replacement or the paper’s formal guarantees. Cordis is not selected as a Python web backend kernel. If live plugin replacement becomes an actual requirement, open a new ADR, pin the paper revision, evaluate maintained compatible implementations and specify unload/dependency-loss tests. External durable effects need explicit compensation; cleanup does not reverse a payment or database commit.

## ADR-004: Use external identity and payment providers later

**Deferred provider choice:** OIDC identity, hosted payment checkout and signed webhooks. Keycloak is a candidate, not an included free hosted service. Its supported storage uses relational databases such as PostgreSQL, not the application MongoDB. Persistent hosting, a supported database and email delivery must be budgeted before choosing it. [Keycloak database support](https://www.keycloak.org/server/db). Detailed boundaries: [security and integrations](security-and-integrations.md).

## ADR-005: Vercel hosting and its eligibility condition

**Accepted 2026-09-15, conditionally, by explicit owner decision.** Vercel Hobby hosts both the website and the API. This entry has changed twice: it began as an owner preference with eligibility unresolved, was briefly recorded as a rejection on eligibility grounds, and is now an acceptance with the condition stated and scoped.

**The condition.** Vercel restricts Hobby teams to non-commercial personal use and requires Pro or Enterprise for commercial usage. It defines commercial usage as any deployment used for the financial gain of anyone involved in any part of the project's production, listing "receiving payment to create, update, or host the site" and "advertising the sale of a product or service" among its examples. [Vercel fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines), checked 2026-09-15.

**The owner's decision and its reasoning.** The deployment is a private prototype that is not being scaled, linked, indexed or promoted. On that reading it is closer to development and internal review than to a commercial deployment. The owner has weighed this and accepted it. The terms turn on purpose rather than traffic, so low usage does not by itself resolve the question, and that caveat was raised before the decision was taken.

**Scope of the acceptance.** It covers a private, unpublicized prototype only. Reopen this ADR before any of the following, each of which makes the deployment commercial by Vercel's own definition:

- The site becomes the public HADS Lifesciences website, or is linked, indexed or promoted anywhere.
- A custom domain is attached.
- Anyone is paid for work on it.

**Consequence if the condition stops holding:** move to Vercel Pro, or back to the previous Netlify and Render split, which remains documented in this register's rejected alternatives. Keep the application portable by depending on the [environment contract](../infrastructure/README.md) rather than provider APIs, so the move stays a configuration change. Relative API paths and lifespan-managed resources both help here.

Technical notes that informed the choice and are independent of eligibility: Hobby functions run on Fluid compute with up to 2 GB memory against Render Free's 512 MB and 0.1 CPU, FastAPI lifespan events are supported, and uv works with zero configuration. [Function limits](https://vercel.com/docs/functions/limitations).

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
