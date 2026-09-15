# Frontend boundary

Before feature work, follow the [contract readiness and frontend handoff rules](../rules/workflow.md). Consume the API contract only; never infer wire models from persistence schemas.

Owns all React code, assets, browser tests and frontend build configuration. Current state: documentation only. [HADS-2](../tracker/HADS-2.md) creates the implementation under this folder.

## Planned initial layout

```text
frontend/
  src/
    app/App.tsx
    components/ui/           # Only shadcn components actually used
    features/landing/LandingPage.tsx
    lib/apiClient.ts
    styles/globals.css
  public/
  tests/                    # Component tests and browser smoke tests
  package.json
  package-lock.json
  .env.example
```

Use React function components, TypeScript strict mode, Vite, accessible semantic HTML and Lucide icons. Keep brand values in CSS variables rather than repeated literal colors. Add shadcn components only when needed; generated components belong to this codebase and must follow its accessibility/security rules. Native fetch is sufficient for one GET; introduce query/state libraries only when real needs appear.

`VITE_API_BASE_URL` is an HTTPS origin with no trailing slash in hosted environments; append exact [API paths](../api-design/README.md). API client uses `AbortController`, a proposed 10-second browser deadline and no automatic retry loop. Render the branded shell immediately; show a calm temporary-unavailability message with manual retry. Provider cold start may outlast the deadline, so a retry can succeed later. Cancel outstanding requests on unmount.

The visible site must not show database topology, provider credentials or setup/debug details. Keep database readiness in operator checks. Copy and visual direction come from [product direction](../documentation/product-direction.md), with owner assets in [idea](../idea/README.md).

Planned scripts: `npm run dev`, `npm run build`, `npm run verify`. These do not exist yet. The verification contract is owned by [delivery rules](../rules/delivery.md); hosting configuration by [infrastructure](../infrastructure/README.md).
