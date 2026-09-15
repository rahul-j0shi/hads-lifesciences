# Setup and hosting runbook

**Current state:** this repository contains plans and a draft API contract, not a build. MongoDB Atlas is now provisioned; see the status note in step 2. Netlify and Render are not. Account preparation can happen now. Deployment steps below require [HADS-2](../tracker/HADS-2.md), which creates the files and commands named here. No account or external resource was created during HADS-1. The [zero-cost rule](../rules/README.md#zero-cost-constraint) applies until the owner explicitly changes it; domain purchase/mapping and larger paid machines are future scope.

Executable deployment plan for the implementation phase: **Netlify + Render + MongoDB Atlas**. The owner prefers Vercel Free for the backend; its equivalent route is documented below and remains conditional on eligibility and restricted Mongo connectivity. Render supplies the fallback; see [hosting decision and free limits](decisions.md#adr-002-zero-budget-hosting). Recheck account terms/pricing at setup, select explicit Free tiers, avoid trials/add-ons and use provider subdomains. Availability may stop at free limits.

## 1. Prepare accounts and source access

Create owner-controlled source-host, Netlify, Render and MongoDB Atlas accounts; enable MFA and recovery methods. Grant each hosting integration access only to the HADS repository. This workspace currently does not expose usable Git metadata (`git status` reports “not a git repository”); establish a real repository in the normal development environment before connecting hosts. Do not overwrite workspace-managed `.git` metadata.

Keep the Render prototype workspace without a payment method so usage exhaustion suspends instead of billing applicable overages. Confirm the Netlify account is on the intended hard-capped Free credit plan, and Atlas is Free/M0 rather than Flex/Dedicated. Check quotas across all projects in those accounts. Stop and revisit hosting if signup terms or available entitlements cannot preserve the zero-spend constraint.

## 2. Create MongoDB Atlas Free

1. Create a HADS prototype project and choose a **Free** cluster (formerly M0) in an available region near the API region. Skip paid backup/upgrade features.
2. Create a dedicated database user with `readWrite` restricted to `hads_prototype`, not administrator privileges. Use a unique generated password; the account login and database user are different identities.
3. Under Network Access, temporarily allow your development public IP for local verification. Later add the API’s outbound ranges, not the frontend visitor IPs.
4. Copy the Python driver connection string and put it in the backend secret setting `MONGODB_URI`; URL-encode reserved characters in credentials. Set `MONGODB_DATABASE=hads_prototype`. Preserve TLS certificate verification. Never paste the URI into a ticket or screenshot.

The readiness-only slice creates no collections, so the database might not yet appear in Data Explorer. See [database design](../database-design/README.md). Official [Atlas cluster setup](https://www.mongodb.com/docs/atlas/cli/current/atlas-cli-quickstart/).

### Status: provisioned

A Free-tier Atlas cluster and a dedicated database user exist as of 2026-09-15. The connection string is recorded in `backend/.env`, which is excluded from version control. Hosted values belong in the Render or Vercel dashboard. **No cluster hostname, database username or password appears anywhere in this repository, and none may be added.**

Despite its name containing `prod`, this is an Atlas **Free** cluster: no managed backups, a 0.5 GB ceiling including indexes, and it may pause after 30 idle days. Treat it as the prototype database described in [ADR-002](decisions.md#adr-002-zero-budget-hosting), not as production infrastructure.

Outstanding before the wiring is considered verified in [HADS-2](../tracker/HADS-2.md):

| Item | Why |
| --- | --- |
| Confirm the database user holds `readWrite` on `hads_prototype` only, not an administrator role | Least privilege. Step 2 above |
| Add your development public IP under Network Access, and later the API's outbound CIDR ranges | Without an entry, readiness fails with a timeout that looks like a code fault |
| Rotate the password if it has ever been pasted into a chat, ticket, screenshot or log, then update `backend/.env` and the provider dashboard | A credential that has left the password manager is compromised. This applies to the password supplied on 2026-09-15 |
| Confirm no payment method is attached to the Atlas account | Preserves the [zero-cost rule](../rules/README.md#zero-cost-constraint) by forcing suspension instead of billing |

## 3. Implement and verify locally (HADS-2 prerequisite)

Once dependency manifests, app and verification commands exist, run from `backend/`:

```bash
uv sync --locked
uv run python scripts/verify.py
uv run uvicorn app.main:app --reload --port 8000
```

Supply backend environment variables per the [environment contract](../infrastructure/README.md), with local CORS `['http://localhost:5173']` represented as valid JSON using double quotes. Tests obtain their own disposable MongoDB and do not use your Atlas URI. In a separate terminal from `frontend/`:

```bash
npm ci
npm run verify
npm run dev
```

Set frontend `VITE_API_BASE_URL=http://localhost:8000`. Read the new backend report and frontend verification output. Open the page, exercise API failure/retry and run [curl examples](../api-design/README.md). HADS-2 must pin supported Python/Node/uv versions and implement these exact commands before this runbook is considered executable.

## 4. Deploy Python on Render Free

Create a Python Web Service from the HADS repository. Select:

| Setting | Planned value |
| --- | --- |
| Root directory | `backend` |
| Instance | Free |
| Build | `uv sync --locked --no-dev` |
| Start | `uv run --no-sync uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Health-check path | `/health/live` |

Pin runtime/tool versions in HADS-2 and verify the selected Render environment provides that uv version; if needed bootstrap the pinned tool during build. Use one Python worker initially. The start command adapts the [official FastAPI deployment](https://render.com/docs/deploy-fastapi) to this package layout.

Set `APP_ENV=prototype`, Mongo settings, `LOG_LEVEL=INFO`, and an initially empty `CORS_ALLOWED_ORIGINS=[]` until the Netlify origin is known. Under the service **Connect → Outbound** panel, copy all listed CIDR ranges into Atlas Network Access. These ranges are shared with other Render services, so credentials remain essential. [Official outbound IP instructions](https://render.com/docs/outbound-ip-addresses). Do not use `0.0.0.0/0` as the default workaround.

Record the generated HTTPS API origin. Confirm liveness and readiness with the curl commands; readiness must be 200 before declaring the wiring successful. Keep auto-deployment disabled until the CI-gated release path is established; initially manually deploy only a passing revision.

## 5. Deploy React on Netlify Free

Import the same repository as a static Vite site:

| Setting | Planned value |
| --- | --- |
| Base directory | `frontend` |
| Build command | `npm ci && npm run build` |
| Publish directory | `dist` relative to the base directory |
| Build variable | `VITE_API_BASE_URL=https://<your-api>.onrender.com` |

Use the Node version pinned by HADS-2. Official [Vite on Netlify guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/). Provider configuration must include the planned security headers. A root-only placeholder needs no SPA fallback; add the standard rewrite to `index.html` when client-side routes exist, preserving any specific rules above the fallback.

Copy the resulting Netlify HTTPS origin into Render `CORS_ALLOWED_ORIGINS`, for example `["https://your-hads-site.netlify.app"]`, then restart/redeploy backend configuration. Frontend URL changes require updating the allowlist; API URL changes require rebuilding the frontend. Release only tested revisions, using a CI-triggered deploy or a manual release after verification.

## 6. Verify and record the live slice

- Open the HTTPS site on desktop and mobile; check focus, legibility and no console errors.
- Confirm the page fetches the welcome response and all three documented endpoints match their schemas/statuses.
- Verify the frontend origin receives CORS permission and an unrelated origin does not.
- Let the backend sleep naturally; confirm the page stays useful and manual retry recovers after wake-up.
- Check that client bundles, error responses and logs contain no secrets.
- Record frontend URL, backend URL, deployed revisions and report links in HADS-2. No credentials.

## Optional: Vercel instead of Render

Only use this route if the project is eligible under [Vercel’s commercial-use rules](https://vercel.com/docs/limits/fair-use-guidelines) or has an applicable no-cost commercial entitlement. The HADS organization prototype is not assumed eligible for Hobby.

Vercel [supports FastAPI](https://vercel.com/docs/frameworks/backend/fastapi). Set project root to `backend`; HADS-2 would need to validate a provider-recognized entry point exporting `app` (for example a thin `backend/index.py` importing `app.main.app`), locked dependency installation and supported Python version. Configure backend secrets and the same CORS origins. Test lifespan, cold starts and connection reuse under the function runtime. No persistent filesystem or background-work guarantee.

Atlas must allow the provider’s supported egress path. Do not assume free static outbound IPs; if a suitably restricted free path cannot be established, retain Render. This optional route is a conditional design, not a tested deployment recipe. Vercel is not required to bring the selected stack live.

## Operate, troubleshoot and roll back

| Symptom | Check |
| --- | --- |
| Netlify build fails | Base/publish path, locked Node/npm dependencies and public API variable |
| API call fails only in browser | Exact CORS origin, HTTPS mismatch, rebuilt API URL |
| Liveness 200, readiness 503 | Atlas paused, database user, encoded password, outbound allowlist, DNS/TLS |
| First request is slow | Normal Render wake-up; allow it to finish, then retry |
| Service/site unavailable | Provider quota/account status; accept suspension instead of paid upgrade |

Review usage after deployment and during active testing. Avoid synthetic uptime traffic that defeats free sleeping behavior. Use provider logs for request IDs and timing, keeping sensitive fields redacted. Redeploy the previous known-good Git revision for rollback and repeat smoke checks; preserve compatibility between independently deployed frontend/API versions. Before future valuable writes, follow the [database backup and migration requirements](../database-design/README.md). Rotate leaked credentials immediately and replace affected deployment secrets. Remove unused services/users/network entries when the prototype is retired.
