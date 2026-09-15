# Database design

Persistence changes follow the [contract gate](../rules/workflow.md); frontend consumers use the API contract, not these storage models.

Authoritative persistence metadata. Application adapters live in [backend](../backend/README.md); wire models live in [API design](../api-design/README.md).

## First slice

Provider: MongoDB Atlas Free. Logical hosted database: `hads_prototype`. The API uses a Mongo `ping` for readiness and **creates no collections**. A successful ping proves authenticated server connectivity, not collection-level read/write permissions. Verify those permissions with a temporary fixture only when the first persistence feature is implemented.

The logical database may not appear in Atlas until the first write; this is expected. No schema/seed/migration execution is needed for the placeholder. `MONGODB_URI` is secret; `MONGODB_DATABASE` names the application database. See [setup](../documentation/setup-and-hosting.md).

## Specification ownership

Collection creation, schema/query conventions and migration requirements are defined in [database rules](../rules/database-design.md). Use the [placement conventions](../rules/repository.md) for new specs. There are no collection or migration specifications yet because the first slice performs no persistent writes.

## Deferred model inventory (not approved schemas)

| Candidate | Trigger | Key invariant to resolve |
| --- | --- | --- |
| user_profiles | Accounts required | Unique `(identity_issuer, identity_subject)`; minimal attributes |
| orders | Sales flow approved | Server-computed minor-unit totals, currency, ownership, allowed transitions |
| payment_events | Payment provider selected | Unique `(provider, event_id)`, crash-safe deduplication and retention |
| content/products | Write-up needs editable data | Publication model, stable slugs, evidence and owner workflow |

Free-tier capacity and backup limitations are recorded once in [ADR-002](../documentation/decisions.md#adr-002-zero-budget-hosting). Before storing valuable data, create a redacted operational backup plan, secure exports outside the repository and demonstrate restoration. An export is not useful until restoration has been checked.
