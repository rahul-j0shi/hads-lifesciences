# Setup and hosting runbook

Researched and verified 2026-09-15 against current provider documentation. Every provider limit and command below is sourced at the end of its section. Recheck before provisioning, because free tiers change without notice.

The [zero-cost rule](../rules/README.md#zero-cost-constraint) applies until the owner explicitly changes it. Paid domains, larger machines and paid identity or email services remain out of scope.

## 0. What is possible today

| Step | State | Blocked by |
| --- | --- | --- |
| Source repository | **Done.** `github.com/rahul-j0shi/hads-lifesciences`, public, branch `main` | none |
| MongoDB Atlas Free | **Done.** See section 2 | none |
| Local implementation and verification | Not started | [HADS-2](../tracker/HADS-2.md) creates the app, manifests and commands |
| Render API deployment | **Cannot start** | No `backend/pyproject.toml`, no `backend/uv.lock`, no `app/main.py`. Render has nothing to build |
| Netlify frontend deployment | **Cannot start** | No `frontend/package.json`, no build script. Netlify has nothing to build |
| Vercel | **Not eligible.** See section 8 | Plan terms, not a technical gap |

Sections 4 and 5 are executable the day HADS-2 produces a passing local build. Doing them earlier produces a failed deploy, not a head start.

## 1. Prepare accounts and source access

Create owner-controlled Netlify and Render accounts. Enable MFA and recovery methods on each, and on the GitHub account.

When each provider asks for repository access, install its GitHub App against **only** `rahul-j0shi/hads-lifesciences`, using "Only select repositories". Do not grant access to all repositories.

Two account settings matter more than any build setting:

- **Render: attach no payment method** to this workspace. Without one, Render suspends services at the applicable limit instead of billing overages.
- **Netlify: confirm the account is on the Free plan** with its credit limit, not a trial of a paid tier.

Check quotas across every project in those accounts, not just this one. Limits are per workspace or per team, so an unrelated project can exhaust them. If signup terms cannot preserve zero spend, stop and revisit hosting.

## 2. MongoDB Atlas Free

### Status: provisioned

A Free-tier cluster and a dedicated database user exist as of 2026-09-15. The connection string is in `backend/.env`, which is excluded from version control. **No cluster hostname, database username or password appears anywhere in this repository, and none may be added.**

Despite a name containing `prod`, this is an Atlas **Free** cluster: no managed backups, 0.5 GB including indexes, 500 connections, and it may pause after 30 idle days. Treat it as the prototype database in [ADR-002](decisions.md#adr-002-zero-budget-hosting), not production infrastructure.

### Outstanding before the wiring is verified in HADS-2

| Item | Why |
| --- | --- |
| Confirm the database user holds `readWrite` on `hads_prototype` only, not an administrator role | Least privilege. The account login and the database user are different identities |
| Add your development public IP under Network Access now, and the Render outbound ranges in step 4.5 | Without an entry, readiness fails with a timeout that looks like a code fault |
| Rotate the password if it has ever been pasted into a chat, ticket, screenshot or log, then update `backend/.env` and the provider dashboard | A credential that has left the password manager is compromised. This applies to the password supplied on 2026-09-15 |
| Confirm no payment method is attached to the Atlas account | Forces suspension instead of billing |

The readiness slice creates no collections, so the database may not appear in Data Explorer until the first write. See [database design](../database-design/README.md). Source: [Atlas free cluster limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/).

## 3. Implement and verify locally (HADS-2)

`uv` is **not installed** on this machine. Install it before backend work: [uv installation](https://docs.astral.sh/uv/getting-started/installation/). Node 24.19.0 and Python 3.11.9 are present; HADS-2 pins the supported versions and commits lockfiles.

From `backend/`:

```bash
uv sync --locked
uv run python scripts/verify.py
uv run uvicorn app.main:app --reload --port 8000
```

Backend environment comes from `backend/.env`; copy `backend/.env.example` if it is missing. Tests obtain their own disposable MongoDB and must never use the Atlas URI.

From `frontend/`, in a second terminal:

```bash
npm ci
npm run verify
npm run dev
```

Frontend environment comes from `frontend/.env`, which sets `VITE_API_BASE_URL=http://localhost:8000`.

Read the generated backend report and the frontend verification output. Exercise API failure and retry, then run the [curl examples](../api-design/README.md). Do not proceed to deployment until both verification commands pass.

## 4. Deploy the Python API on Render Free

### 4.1 Create the service

1. Render Dashboard, **New**, then **Web Service**.
2. Connect `rahul-j0shi/hads-lifesciences`, authorizing only that repository.
3. Render detects the language. Confirm **Python 3**.

### 4.2 Settings

| Setting | Value |
| --- | --- |
| Name | `hads-api` |
| Region | The region nearest the Atlas cluster |
| Branch | `main` |
| Root Directory | `backend` |
| Language | `Python 3` |
| Build Command | `uv sync --locked --no-dev` |
| Start Command | `uv run --no-sync uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Instance Type | **Free** |
| Health Check Path | `/health/live` |
| Auto-Deploy | **Off** until the CI gate exists |

Health checks point at liveness, never readiness. Readiness fails when Mongo is unreachable, and pointing a platform health check at it would cause a restart loop during a database outage.

`$PORT` is injected by Render and the process must bind `0.0.0.0`. Auto-deploy stays off so the provider cannot race an unfinished CI run; release manually until [delivery rules](../rules/delivery.md) gate it.

### 4.3 Pin Python and uv

Render's default is Python **3.14.3** for services created on or after 2026-02-11. Pin it explicitly rather than inheriting a default that moves.

Two supported methods, in precedence order:

1. `PYTHON_VERSION` environment variable, which requires a **fully qualified** version such as `3.13.5`.
2. A `.python-version` file in the repository root, where the patch number may be omitted.

uv **is** supported: set a `UV_VERSION` environment variable, and a `uv.lock` file must exist in the service's root directory, which here is `backend/`. HADS-2 must commit `backend/uv.lock` or the build command above will fail.

### 4.4 Environment variables

Add under **Environment**. Never commit these values.

| Key | Value |
| --- | --- |
| `APP_ENV` | `prototype` |
| `MONGODB_URI` | The Atlas SRV string, marked secret |
| `MONGODB_DATABASE` | `hads_prototype` |
| `CORS_ALLOWED_ORIGINS` | `[]` initially, then the Netlify origin in step 6 |
| `LOG_LEVEL` | `INFO` |
| `PYTHON_VERSION` | The pinned full version |
| `UV_VERSION` | The pinned uv version |

Do not set `PORT`. Render injects it.

### 4.5 Allow Render to reach Atlas

1. Open the service page, click the **Connect** dropdown at the upper right, and select the **Outbound** tab.
2. Copy every listed IP range.
3. In Atlas, **Network Access**, add those ranges.

**These ranges are shared across all services in the same region**, including other Render customers. An allowlist entry is therefore not an authentication control, which is why the database user and password remain essential. Never use `0.0.0.0/0` as a shortcut.

### 4.6 Verify

Record the generated `https://<name>.onrender.com` origin, then:

```bash
export HADS_API_BASE_URL='https://<name>.onrender.com'
curl --fail-with-body -i "$HADS_API_BASE_URL/health/live"
curl --fail-with-body -i "$HADS_API_BASE_URL/health/ready"
curl --fail-with-body -i "$HADS_API_BASE_URL/api/v1/welcome"
```

Readiness must return 200 before the wiring counts as successful. A 503 means Atlas is unreachable; work through the table in section 9.

### 4.7 Optional blueprint

Render can read a `render.yaml` blueprint instead of dashboard entry. It must sit at the **repository root**, not in `infrastructure/`, unless the blueprint path is set explicitly in the dashboard.

```yaml
services:
  - name: hads-api
    type: web
    runtime: python
    plan: free
    rootDir: backend
    branch: main
    healthCheckPath: /health/live
    buildCommand: uv sync --locked --no-dev
    startCommand: uv run --no-sync uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: APP_ENV
        value: prototype
      - key: MONGODB_DATABASE
        value: hads_prototype
      - key: LOG_LEVEL
        value: INFO
      - key: MONGODB_URI
        sync: false
      - key: CORS_ALLOWED_ORIGINS
        sync: false
```

`sync: false` means Render prompts for the value **only during initial blueprint creation** and keeps it out of the repository. Every secret must use it.

Sources: [Render free tier](https://render.com/docs/free), [deploy FastAPI](https://render.com/docs/deploy-fastapi), [Python version](https://render.com/docs/python-version), [outbound IPs](https://render.com/docs/outbound-ip-addresses), [blueprint spec](https://render.com/docs/blueprint-spec).

## 5. Deploy the React frontend on Netlify Free

### 5.1 Connect the repository

1. Netlify, **Add new site**, then **Import an existing project**.
2. Choose GitHub, authorize, and scope the Netlify GitHub App to `hads-lifesciences` only.
3. Select the repository and branch `main`.

### 5.2 Build settings

| Setting | Value |
| --- | --- |
| Base directory | `frontend` |
| Build command | `npm ci && npm run build` |
| Publish directory | `dist` |

The publish directory is resolved **relative to the base directory**, so `dist` means `frontend/dist`. Do not write `frontend/dist`.

### 5.3 Environment variables

**The Netlify build system does not read `.env` files.** `frontend/.env` works locally and is invisible to the build. `VITE_API_BASE_URL` must be set in Netlify, or the built bundle will point at `localhost` and every API call will fail in production.

Set it under **Site configuration**, **Environment variables**, with a scope that includes **Builds**:

| Key | Value |
| --- | --- |
| `VITE_API_BASE_URL` | `https://<name>.onrender.com`, no trailing slash |

`VITE_*` values are compiled into the public bundle. Only a public API origin belongs there, never a database URI or key. Changing this value requires a rebuild, not just a restart.

### 5.4 netlify.toml

Settings in `netlify.toml` override the UI. The file must sit at the **repository root**. Secrets stay in the UI.

```toml
[build]
  base = "frontend"
  command = "npm ci && npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "24.19.0"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; img-src 'self' data:; connect-src 'self' https://<name>.onrender.com"
```

Pin `NODE_VERSION` to the version HADS-2 selects. Verify the Content-Security-Policy against the real built output before release, including any shadcn-generated styling; a policy that blocks your own stylesheet is worse than none.

**Add no SPA fallback redirect.** The site has one route. A blanket `/* -> /index.html 200` rule would turn every wrong URL into a 200, which breaks the 404 behavior required by the design concept. Add the fallback only when client-side routes exist, and keep specific rules above it.

### 5.5 Verify

Record the `https://<name>.netlify.app` origin. Open it, confirm the page renders before any API response arrives, and check the browser console for errors.

Sources: [Vite on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/), [file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/), [build environment variables](https://docs.netlify.com/build/configure-builds/environment-variables/), [Netlify pricing](https://www.netlify.com/pricing/).

## 6. Wire the two origins together

This step is the one most often missed, and it fails only in a browser.

1. Copy the Netlify origin into the Render `CORS_ALLOWED_ORIGINS` variable as a JSON array with double quotes and no trailing slash: `["https://<name>.netlify.app"]`.
2. Redeploy or restart the Render service so the new value is read.
3. Confirm `VITE_API_BASE_URL` on Netlify holds the Render origin, then trigger a rebuild.

Either URL changing breaks the pair. A frontend URL change needs the Render allowlist updated; an API URL change needs the frontend rebuilt, because the value is compiled in. Deploy-preview URLs are distinct origins and are not covered by the production entry, so either add them explicitly or leave previews disconnected. Never allow every `*.netlify.app` tenant.

## 7. Verify and record the live slice

- Open the site on desktop and mobile. Check focus visibility, legibility and a clean console.
- Confirm all three endpoints match their documented schemas and statuses.
- Confirm the Netlify origin receives CORS permission and an unrelated origin does not.
- Let the backend sleep for 15 minutes, then confirm the page stays useful and manual retry recovers after wake-up.
- Confirm no secret appears in client bundles, error responses or logs.
- Record both URLs, the deployed revisions and the report links in [HADS-2](../tracker/HADS-2.md). **No credentials in the ticket.**

## 8. Vercel: not eligible

Earlier planning treated Vercel Hobby as a conditional alternative to Render. Current terms resolve that conditional: **it is not available to this project.**

Vercel defines commercial usage as any deployment used for the financial gain of anyone involved in any part of the project's production, and states explicitly that this includes **"a paid employee or consultant writing the code"** and **"advertising the sale of a product or service"**. Hobby teams are restricted to non-commercial personal use, and all commercial usage requires Pro or Enterprise.

HADS Lifesciences is a commercial business and the site advertises its products. That is disqualifying on its own, and paid development work would be independently disqualifying. Buying Pro is excluded by the zero-cost rule.

Render remains the backend host. Do not reopen this without a written entitlement from Vercel. Source: [Vercel fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines), checked 2026-09-15. Recorded in [ADR-005](decisions.md#adr-005-vercel-resource-assumptions).

## 9. Operate, troubleshoot and roll back

| Symptom | Check |
| --- | --- |
| Netlify build fails immediately | Base directory is `frontend`; publish is `dist` relative to it; `NODE_VERSION` pinned; lockfile committed |
| Page loads, API calls fail only in the browser | `CORS_ALLOWED_ORIGINS` exact match, no trailing slash; frontend rebuilt after any API URL change |
| Frontend calls `localhost` in production | `VITE_API_BASE_URL` was never set in the Netlify UI. The build does not read `.env` |
| Render build fails on `uv sync` | `backend/uv.lock` missing, or `UV_VERSION` not set |
| Liveness 200, readiness 503 | Atlas paused; database user role; unencoded password characters; Render outbound ranges missing from Network Access; DNS or TLS |
| First request takes about a minute | Normal Free spin-up after 15 idle minutes. Let it finish, then retry |
| Service suspended mid-month | 750 instance hours or bandwidth exhausted. Accept the outage; do not attach a payment method |

Do not run synthetic uptime traffic to defeat sleeping. It converts a free service into an hours-exhausted one and changes nothing for real visitors.

For rollback, redeploy the previous known-good Git revision and repeat the smoke checks. Keep independently deployed frontend and API versions compatible, which the additive API rule in [API rules](../rules/api-design.md) exists to guarantee. A code rollback cannot undo a data change; before any valuable write, follow the [backup and migration requirements](../database-design/README.md).

Rotate leaked credentials immediately and replace the affected deployment secrets. Remove unused services, database users and network entries when the prototype is retired.

## 10. Free-tier limits, at a glance

| Provider | Limit | Consequence |
| --- | --- | --- |
| Render Free | 750 instance hours per workspace per month | All Free web services suspended until the next month |
| Render Free | Spins down after 15 idle minutes, roughly 1 minute to wake | First visitor after idle waits; the UI must stay useful meanwhile |
| Render Free | Ephemeral filesystem, no persistent disk | Nothing written to disk survives a restart |
| Render Free | Bandwidth and build minutes count toward workspace totals | Suspension when no payment method is attached, otherwise charges |
| Netlify Free | 300 credit limit, consumed at 20 credits per GB of bandwidth | Site paused at the limit |
| Netlify Free | Old deploys retained 30 days | The published deploy and latest successful deploys are never auto-deleted |
| Atlas Free | 0.5 GB including indexes, 500 connections, no managed backups | Manual export only; may pause after 30 idle days |

Availability is best effort. Suspension is the intended failure mode under the zero-cost rule, not something to engineer around.
