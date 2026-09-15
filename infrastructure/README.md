# Infrastructure boundary

Owns future shared deployment configuration and optional local containers. No resources or deployment files exist yet. [Setup guide](../documentation/setup-and-hosting.md) owns operator steps; [ADR-002](../documentation/decisions.md#adr-002-zero-budget-hosting) owns hosting rationale and limits.

Hosting is one Vercel project serving both halves from one domain; see [ADR-002](../documentation/decisions.md#adr-002-zero-budget-hosting) and the [runbook](../documentation/setup-and-hosting.md). Vercel requires its `vercel.json` at the **repository root**, so that one thin platform file lives at root rather than here. Frontend and backend runtime and dependency configuration remain in their respective folders. Add Docker Compose here for disposable local and test Mongo only when implementing tests.

## Environment contract for HADS-2

| Variable | Scope | Value/validation |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Frontend build input, **local only** | Not set in production: the deployed frontend calls the API with relative paths on the same origin. Local `http://localhost:8000` when the halves run on separate ports |
| `APP_ENV` | Backend | `local`, `test`, `prototype` |
| `MONGODB_URI` | Backend secret | Local test URI or Atlas `mongodb+srv://` URI with TLS |
| `MONGODB_DATABASE` | Backend | `hads_prototype`; tests use unique disposable database names |
| `CORS_ALLOWED_ORIGINS` | Backend, **local only** | Not needed in production: one origin means no cross-origin request. Local JSON array of exact origins, no trailing slash, no wildcard |
| `LOG_LEVEL` | Backend | `INFO` initially; never enable sensitive driver debug logs |
| `PORT` | Local only | Vercel invokes the ASGI app directly and injects no port. Used only by a local `uvicorn` command |

Local `.env` loading must be explicit; Vercel project environment variables supply hosted values, with `MONGODB_URI` marked Sensitive. Safe `.env.example` files are committed for both halves. Backend config validates values on startup.

Vercel preview deployments get their own URLs, and because the frontend uses relative paths they work with no extra configuration. Should the project ever split into two origins, previews would each need an explicit CORS entry; never allow every `*.vercel.app` tenant. Do not add identity or payment secrets until the corresponding feature exists.
