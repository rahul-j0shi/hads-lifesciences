# Setup and hosting runbook

**Host: Vercel, for both the website and the API.** Researched against Vercel documentation on 2026-09-15. Netlify and Render are no longer part of this plan; see [ADR-002](decisions.md#adr-002-zero-budget-hosting).

The [zero-cost rule](../rules/README.md#zero-cost-constraint) applies. Read section 13 before deploying: there is an eligibility condition on the Vercel Hobby plan that the owner has accepted for a private prototype and that changes when the site goes public.

## 0. How this actually works

If hosting is new to you, this is the whole idea:

1. Your code lives on GitHub.
2. You connect that GitHub repository to Vercel once.
3. Every time you push to `main`, Vercel automatically pulls the code, builds it, and puts it on the internet at a URL like `hads-lifesciences.vercel.app`.

You do not upload files, manage a server, install Linux, or configure a web server. Pushing to GitHub is the deploy.

**One project, two parts, one address.** Vercel builds the React site and the Python API separately, then serves both from the same domain:

```
                    https://<project>.vercel.app
                              |
              +---------------+---------------+
              |                               |
        /api/*  and  /health/*            everything else
              |                               |
      ┌───────────────┐               ┌───────────────┐
      │   backend/    │               │   frontend/   │
      │ FastAPI, run  │               │ React, built  │
      │ as a function │               │ to static     │
      └───────┬───────┘               │ files on CDN  │
              │                       └───────────────┘
      MongoDB Atlas
```

Because both live on one domain, the browser treats them as the same origin. **This removes CORS entirely**, which was the single most error-prone part of the previous two-provider plan.

**Is Netlify different?** For the React part, barely: both Netlify and Vercel take your repo, run a build, and serve the result from a CDN. The difference that matters here is the Python half. Netlify does not run a FastAPI app, so a Netlify plan needed a second provider (Render) for the API, two URLs, and CORS wiring between them. Vercel runs both, so there is one provider, one URL, and no CORS. That is why the stack changed.

## 1. What is possible today

| Step | State | Blocked by |
| --- | --- | --- |
| Source repository | **Done.** `github.com/rahul-j0shi/hads-lifesciences` | none |
| MongoDB Atlas Free | **Done.** Section 3 | none |
| Vercel account and project | Ready to do | none |
| Actual deployment | **Cannot start** | No `frontend/package.json`, no `backend/pyproject.toml`, no `app/main.py`. Vercel would clone the repo, find nothing to build, and fail |

[HADS-2](../tracker/HADS-2.md) creates those files. Sections 4 through 10 are executable the day it produces a passing local build. You can complete sections 2 and 3 now.

## 2. Create the Vercel account

1. Go to `vercel.com/signup` and choose **Continue with GitHub**. Using GitHub login means you do not manage a second password.
2. Choose the **Hobby** plan. Do not start a Pro trial.
3. When Vercel asks for repository access, choose **Only select repositories** and pick `hads-lifesciences` alone. Never grant access to all repositories.
4. Enable two-factor authentication under Account Settings, Authentication.
5. **Attach no payment method.** Without one, Vercel stops at the free ceiling instead of billing.

## 3. MongoDB Atlas Free

### Status: provisioned

A Free-tier cluster and a dedicated database user exist as of 2026-09-15. The connection string lives in `backend/.env`, which is excluded from version control, and in Vercel's environment variables once section 8 is done. **No cluster hostname, username or password appears anywhere in this repository, and none may be added.**

Despite a name containing `prod`, this is an Atlas **Free** cluster: no managed backups, 0.5 GB including indexes, 500 connections, and it may pause after 30 idle days. It is the prototype database in [ADR-002](decisions.md#adr-002-zero-budget-hosting), not production infrastructure.

### Outstanding

| Item | Why |
| --- | --- |
| Confirm the database user holds `readWrite` on `hads_prototype` only | Least privilege. The Atlas account login and the database user are different identities |
| Set Network Access to allow `0.0.0.0/0` | See the warning below |
| Rotate the password if it has ever been pasted into a chat, ticket, screenshot or log | A credential that has left the password manager is compromised. This applies to the password supplied on 2026-09-15 |
| Confirm no payment method is attached to Atlas | Forces suspension instead of billing |

**Network access is the one real downgrade in moving to Vercel.** Render publishes fixed outbound IP ranges you can allowlist. Vercel functions do not have stable outbound IPs on Hobby, so Atlas must accept connections from anywhere. That means **the database password is the only thing protecting the database.** Consequences:

- Use a long generated password and rotate it on any suspicion.
- Keep the user scoped to `readWrite` on one database.
- Never reuse this password anywhere else.
- Do not store anything sensitive in this cluster while it is open to the internet.

If that trade is unacceptable later, the options are Vercel's paid static-IP feature or moving the API back to a host with fixed egress.

## 4. Repository layout Vercel expects

Vercel finds the Python app by looking for a `FastAPI` instance named `app` at a known filename. The layout already planned in [backend/README.md](../backend/README.md) is `backend/app/main.py`, which is one of the supported entrypoints. No restructuring is needed.

Supported entrypoints are `app.py`, `index.py`, `server.py`, `main.py`, `wsgi.py` or `asgi.py`, either at the service root or inside `src/` or `app/`. Anything else requires `tool.vercel.entrypoint` in `pyproject.toml`.

What HADS-2 must produce:

```text
frontend/
  package.json          build script producing dist/
  package-lock.json
backend/
  pyproject.toml        dependencies, requires-python
  uv.lock               uv is supported with zero configuration
  app/main.py           must define a module-level: app = FastAPI(...)
vercel.json             at the repository root, see section 5
```

## 5. vercel.json

Vercel calls the two halves **services**. Put this at the **repository root**:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "services": {
    "web": {
      "root": "frontend/",
      "framework": "vite",
      "buildCommand": "npm ci && npm run build",
      "outputDirectory": "dist"
    },
    "api": {
      "root": "backend/",
      "entrypoint": "app.main:app"
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": { "service": "api" } },
    { "source": "/health/(.*)", "destination": { "service": "api" } },
    { "source": "/(.*)", "destination": { "service": "web" } }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; img-src 'self' data:; connect-src 'self'"
        }
      ]
    }
  ]
}
```

Three things about this file are easy to get wrong:

**The `/health/` rewrite is not optional.** Rewrites are evaluated in order and the last rule is a catch-all. Without an explicit `/health/` rule, `/health/live` and `/health/ready` would fall through to the **frontend** and return the HTML page instead of JSON. Every path the API owns needs a rule above the catch-all.

**A service is private until a rewrite exposes it.** Services are internal by default. The rewrites are what make them reachable.

**Build fields move inside the services.** When `services` is present, `buildCommand`, `installCommand`, `outputDirectory`, `framework` and `functions` are no longer valid at the top level, because Vercel cannot tell which service they belong to. Routing, headers and redirects stay at the top level and apply to the whole deployment.

**Availability check.** Vercel's Services documentation is marked as requiring a Services permission, and this specification has not been validated against a live Hobby account. Confirm at section 9 step 3 that the build recognizes the `services` key. If it does not, use the fallback in section 5.1 and record the outcome in HADS-2.

### 5.1 Fallback if services are unavailable

Create **two** Vercel projects from the same repository, one with Root Directory `frontend` and one with `backend`. They get separate URLs, which means the same origin is lost and CORS returns. In that case:

- Set `CORS_ALLOWED_ORIGINS` on the API project to the exact frontend URL as a JSON array.
- Set `VITE_API_BASE_URL` on the frontend project to the API URL, then rebuild.
- Every rule in section 8 about relative URLs no longer applies.

Prefer the single-project setup. Only fall back if the build rejects it.

## 6. Backend service requirements

| Item | Value |
| --- | --- |
| Entrypoint | `backend/app/main.py` exporting `app` |
| Python version | Set `requires-python` in `pyproject.toml` or add `backend/.python-version`. Supported: **3.12 (default), 3.13, 3.14** |
| Dependencies | `pyproject.toml` with `uv.lock`. uv is supported with zero configuration |
| Bundle ceiling | 500 MB uncompressed |

**Lifespan events are supported**, so the connection-pool design in [architecture](architecture.md) holds: acquire the Mongo client in lifespan, close it on shutdown. Two constraints apply that do not apply to a normal server:

- **Shutdown cleanup is capped at 500 ms after SIGTERM.** Closing the Mongo client must be fast and must not block on network round trips. Logs printed during shutdown do not appear in the dashboard.
- **The app runs as a serverless function, not a permanent process.** Many instances can exist at once, each with its own pool, against an Atlas Free limit of 500 connections. Keep the pool maximum small, 2 to 5 rather than 10, and measure actual connection counts in Atlas during HADS-2.

Keep tests, fixtures and reports out of the bundle with `excludeFiles` under the service's `functions` key if the bundle approaches the limit.

## 7. Frontend service requirements

Standard Vite build producing `dist/`. Pin the Node version in `frontend/package.json` under `engines`.

**The frontend must call the API with relative paths.** Same origin means `/api/v1/welcome` works directly. Do not build an absolute URL from an environment variable. That removes the rebuild-on-URL-change coupling the previous plan carried, and it means preview deployments work with no extra configuration.

Because there is one HTML route, do not add a catch-all SPA rewrite. The `/(.*)` rule already sends unmatched paths to the frontend service, and a real 404 page is required by the design concept.

## 8. Environment variables

In the Vercel dashboard: **Project**, then **Settings**, then **Environment Variables**. Add each to Production, Preview and Development as needed.

| Key | Value | Notes |
| --- | --- | --- |
| `APP_ENV` | `prototype` | |
| `MONGODB_URI` | The Atlas SRV string | **Mark as Sensitive** so it cannot be read back in the UI |
| `MONGODB_DATABASE` | `hads_prototype` | |
| `LOG_LEVEL` | `INFO` | |

`CORS_ALLOWED_ORIGINS` is **not needed in production** with a single project, because there is no cross-origin request to allow. Keep it in `backend/.env` for local development, where the Vite dev server and the API may run on different ports.

`VITE_API_BASE_URL` is **not needed in production** either, for the same reason. Keep it locally only.

Never paste a secret into `vercel.json`, a ticket, a screenshot or a commit. Vercel environment variables are the only correct home for the Atlas URI.

## 9. First deploy, step by step

1. Vercel dashboard, **Add New**, then **Project**.
2. Under **Import Git Repository**, select `rahul-j0shi/hads-lifesciences`. If it is not listed, click **Adjust GitHub App Permissions** and grant access to that repository.
3. Vercel reads `vercel.json`. Confirm the build log shows both services building. **If it does not recognize the `services` key, stop and use section 5.1.**
4. Add the environment variables from section 8 before the first build, or the first deploy will fail on missing configuration.
5. Click **Deploy** and watch the build log. Expect the frontend `npm ci && npm run build` and the backend dependency install to appear as separate steps.
6. Record the resulting `https://<project>.vercel.app` URL.
7. Go to **Settings**, then **Git**, and consider disabling automatic production deploys until CI gates releases per [delivery rules](../rules/delivery.md). Until then, promote deployments manually.

## 10. Verify

```bash
export HADS_URL='https://<project>.vercel.app'

curl --fail-with-body -i "$HADS_URL/health/live"
curl --fail-with-body -i "$HADS_URL/health/ready"
curl --fail-with-body -i "$HADS_URL/api/v1/welcome"
curl -sI "$HADS_URL/" | grep -i 'content-type\|content-security-policy'
```

- `/health/live` must return JSON, not HTML. HTML means the rewrite order in section 5 is wrong.
- `/health/ready` must return 200. A 503 means Atlas is unreachable; see section 12.
- The root path must return `text/html` and the security headers from `vercel.json`.
- Open the site, confirm the page renders before any API response arrives, and check the browser console is clean.
- Confirm in Atlas that the connection count stays small under a few refreshes.
- Record the URL, the deployed commit and the checks in [HADS-2](../tracker/HADS-2.md). **No credentials in the ticket.**

## 11. Local development

Install the Vercel CLI, minimum version 48.1.8:

```bash
npm i -g vercel
vercel login
vercel link
vercel dev
```

`vercel dev` runs both services together on one local port with the same routing as production, which is the closest match to the deployed behavior. Environment variables come from the Vercel project; `vercel env pull` writes them into a local file.

Running the two halves separately still works and is faster for focused work:

```bash
# terminal 1, from backend/
uv sync --locked
uv run uvicorn app.main:app --reload --port 8000

# terminal 2, from frontend/
npm ci
npm run dev
```

In that mode the origins differ, so Vite's dev proxy or `CORS_ALLOWED_ORIGINS` is needed locally even though production needs neither. `uv` is **not currently installed on this machine**; install it first: [uv installation](https://docs.astral.sh/uv/getting-started/installation/).

Always run the full gates before deploying: `uv run python scripts/verify.py` and `npm run verify`.

## 12. Troubleshooting

| Symptom | Cause |
| --- | --- |
| `/health/live` returns the HTML page | Missing `/health/(.*)` rewrite, or it sits below the catch-all. Order matters |
| Build fails with an unknown `services` key | Services unavailable on this account. Use section 5.1 |
| Build fails: no entrypoint found | `backend/app/main.py` missing, or it does not define a module-level `app` |
| Frontend 404s on every path | `outputDirectory` is not `dist`, or the Vite build produced nothing |
| Readiness 503 | Atlas paused, wrong database user role, unencoded password characters, or Network Access does not allow `0.0.0.0/0` |
| Readiness intermittently 503 under load | Too many function instances each opening a pool. Lower the pool maximum and recheck Atlas connection counts |
| Secrets visible in the frontend bundle | A secret was given a `VITE_` prefix. Only public values may carry that prefix |
| Function times out | Raise `maxDuration` under the service's `functions` key, but first find why a request is slow |
| `vercel login` fails with `TypeError: fetch failed` or `Failed to fetch dist-tags from npm`, while websites load fine | Broken IPv6 on the local network. Node 17 and later try IPv6 first, and the connection hangs rather than falling back. Prefix Vercel and npm commands with `NODE_OPTIONS="--dns-result-order=ipv4first"`, or export it in your shell profile. Diagnose with `curl -4` against `curl -6` on the same host |

Rollback is **Deployments**, then the last known-good deployment, then **Promote to Production**. Vercel keeps previous deployments, so rollback is a click rather than a rebuild. A code rollback cannot undo a data change; before any valuable write, follow the [backup and migration requirements](../database-design/README.md).

## 13. Limits, and the eligibility condition

Hobby plan monthly guidelines: 100 GB Fast Data Transfer, 1,000,000 function invocations, 10 GB Fast Origin Transfer, 4 hours Active CPU, 360 GB-hours Provisioned Memory. Functions run on Fluid compute with up to 2 GB memory, which is why this plan was chosen over Render's 512 MB. The standard Python bundle limit is 500 MB.

**The condition.** Vercel restricts Hobby to non-commercial personal use and defines commercial usage to include "receiving payment to create, update, or host the site" and "advertising the sale of a product or service". The owner has accepted this for a **private, unpublicized prototype** that is not being scaled or promoted.

That acceptance is scoped. Revisit before any of the following:

- The site becomes HADS Lifesciences' public website, or is linked, indexed or promoted anywhere.
- A custom domain is attached.
- Anyone is paid for the work on it.

At that point the deployment is commercial by Vercel's own definition and needs a Pro plan or a different host. Recorded in [ADR-005](decisions.md#adr-005-vercel-hosting-and-its-eligibility-condition).

Sources, all checked 2026-09-15: [FastAPI on Vercel](https://vercel.com/docs/frameworks/backend/fastapi), [Python runtime](https://vercel.com/docs/functions/runtimes/python), [Services](https://vercel.com/docs/services), [project configuration](https://vercel.com/docs/project-configuration), [function limitations](https://vercel.com/docs/functions/limitations), [fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines), [Atlas free limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/).
