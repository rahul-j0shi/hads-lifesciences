# Infrastructure boundary

Owns future shared deployment configuration and optional local containers. No resources or deployment files exist yet. [Setup guide](../documentation/setup-and-hosting.md) owns operator steps; [ADR-002](../documentation/decisions.md#adr-002-zero-budget-hosting) owns hosting rationale and limits.

HADS-2 may add `netlify.toml` and a Render blueprint here, explicitly selecting their paths in provider configuration; if a platform requires a root entry file, keep only that thin platform configuration at root. Frontend/backend runtime and dependency configuration remain in their respective folders. Add Docker Compose here for disposable local/test Mongo only when implementing tests; production Python can use Render’s native runtime.

## Environment contract for HADS-2

| Variable | Scope | Value/validation |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Frontend public build input | API origin; local `http://localhost:8000`; hosted HTTPS; no trailing slash |
| `APP_ENV` | Backend | `local`, `test`, `prototype` |
| `MONGODB_URI` | Backend secret | Local test URI or Atlas `mongodb+srv://` URI with TLS |
| `MONGODB_DATABASE` | Backend | `hads_prototype`; tests use unique disposable database names |
| `CORS_ALLOWED_ORIGINS` | Backend | JSON array of exact origins, no trailing slash; no wildcard |
| `LOG_LEVEL` | Backend | `INFO` initially; never enable sensitive driver debug logs |
| `PORT` | Backend platform runtime | Render injects; start command binds `0.0.0.0` |

Local `.env` loading must be explicit; provider settings supply hosted variables. Commit safe `.env.example` files when code is created. Backend config validates values; a frontend environment change requires rebuilding the static assets.

Preview domains require explicit origin entries; never allow every `*.netlify.app` or `*.vercel.app` tenant. Use a stable test URL or keep preview integrations off until configured. Do not add identity/payment secrets until the corresponding feature exists.
