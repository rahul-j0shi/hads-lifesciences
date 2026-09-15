# Security and future integrations

Status: baseline requirements; no authentication or payments implemented. Provider choices stay deferred until owner requirements arrive. [Architecture](architecture.md) defines current scope.

## First slice trust boundaries

| Boundary | Required control |
| --- | --- |
| Browser → API | TLS, exact CORS origins, input validation, finite deadlines and safe errors |
| API → Mongo | TLS verification, restricted database user, network allowlist, small pool |
| Source/build → hosting | Locked dependencies, least-privilege account access, owner MFA, secrets in provider settings |
| Logs/reports → agent/operator | Request IDs and status/timing only; redact secrets and payloads |

No passwords, payment forms, uploads or personal/health information in the first slice. Set frontend CSP for its own assets and the chosen API origin, `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff` and a restrictive referrer policy; verify shadcn-generated styling against the final CSP. Set appropriate API headers and `Cache-Control: no-store` on health/error responses. Rate limits/body limits must be specified for any public write endpoint when introduced. Do not treat an in-memory limiter as a distributed security guarantee.

Mongo credentials are backend-only. `VITE_*` variables are public build inputs; only a public API URL belongs there. Validate supplied request IDs for bounded safe characters or replace them. Do not return exceptions, stack traces, driver errors, hostnames or database names to anonymous users. Frontend renders API text safely; avoid unsanitized HTML.

## Identity: planned OIDC flow

Use an established provider login/registration experience and SDK. Candidate SPA flow: Authorization Code with PKCE S256; exact redirect/logout URI allowlists and state/nonce validation through the SDK. No client secret in the browser. Keep tokens in memory and never persist them to localStorage. A later cookie/BFF design needs a separate decision covering same-site domains and CSRF; default provider subdomains make cross-site cookies a poor implicit assumption. [Keycloak JavaScript adapter guidance](https://www.keycloak.org/securing-apps/javascript-adapter).

Flow: user chooses login/signup → provider authenticates/registers/verifies email → application receives authorization result → API validates access-token signature using trusted issuer keys, algorithm allowlist, issuer, audience and expiry → authorization checks ownership and assigned permissions for each operation. Never use an ID token as an API access token. Validate key rotation with bounded caching; fail closed on unverifiable tokens.

Identity provider owns passwords, reset, email verification, MFA and sessions. HADS may own a minimal profile keyed by `(issuer, subject)`; email is not the immutable identity key. Server decides permissions; registration must not grant admin privileges. Logout clears local tokens and invokes provider logout. Define revocation latency and account deletion before shipping identity. Keycloak needs separate hosting and relational storage per [ADR-004](decisions.md#adr-004-use-external-identity-and-payment-providers-later).

Required future tests: missing/expired/wrong-audience tokens, key rotation, denied roles, cross-user resource access, callback mismatch, logout and duplicate profile creation. Roles, session lifetime and provider hosting remain open requirements.

## Payments: planned provider boundary

1. API creates a server-priced order in the selected currency using integer minor units.
2. A narrow gateway adapter creates a provider checkout with an idempotency key; browser receives only the public redirect/session information.
3. Browser redirect shows pending/confirmed state from the API; it is never proof of payment.
4. API verifies webhook signature against the exact raw request body, checks provider-defined replay protections and processes each event idempotently.
5. Persist deduplication and state changes atomically enough to survive crashes; acknowledge only after durable acceptance. Define retry and reconciliation before implementation. Duplicate or out-of-order events must not double-fulfil an order.

No card data enters HADS storage/logs. Provider owns card collection. Bind orders to authorized users or an explicitly designed guest flow. Define refunds, cancellation, rounding, event retention and permitted state transitions once the provider and sales model are known. Never hold a database transaction open across a provider network call. A future refund is compensation, not automatic rollback.

Only provider sandbox flows fit the current no-spend scope. Live processing fees and availability are unselected; sleeping hosting and absent durable jobs must be reevaluated before real transactions. No checkout routes or payment collections are approved today.
