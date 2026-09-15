# Database design rules

Concrete collection and migration specifications belong in [database design](../database-design/README.md). The [workflow](workflow.md) governs when they must be ready; [repository conventions](repository.md) define paths.

## Before persistence implementation

A collection specification must include: purpose and owning feature/ticket; required/optional fields with BSON types, nullability and defaults; synthetic example; Mongo validator; indexes with uniqueness and query rationale; access patterns and authorization ownership; invariants and atomicity requirements; sensitive fields and retention; schema version/evolution; API operation links and explicit DTO mapping. If a field is derived, record its authority and update behavior.

A new query/index/validator or changed retention/ownership rule is a design change even without new fields. Revise the existing spec before code. Define concrete schema examples only for approved features; candidate model inventories are not implementation contracts.

## Model and query conventions

- Internal `_id` uses BSON ObjectId; expose only an explicit string `id` through DTO mapping. Store UTC BSON dates and serialize according to [API rules](api-design.md).
- Use descriptive `snake_case` collection/field names. A specification filename uses the collection name converted to `kebab-case`; record the exact database collection name inside it.
- Declare schema versions when persisted structures need evolution. Validate input in the application and persisted documents with Mongo validators; these serve different boundaries.
- Build allowlisted queries server-side; reject client Mongo operators, enforce ownership and project only needed fields. Bound result sets and choose indexes from actual access patterns.
- Document uniqueness and concurrency behavior. Use database constraints/atomic operations where required; a read-then-write check alone does not enforce uniqueness.
- Store no binary assets, credentials, raw payment payloads or unnecessary identity/health data. State retention explicitly; do not add TTL deletion to records needed for payment/audit invariants without resolving that requirement.

## Evolution and recovery

Each change affecting existing data/indexes/validators records old/new shape, compatibility with deployed code, numbered repeatable migration, preconditions, rollout order, verification and recovery. Migration implementation lives under backend scripts; design metadata stays here. Do not run migrations during HTTP requests or routine app startup.

Prefer additive changes and explicit expand/backfill/contract steps when compatibility requires them. Record whether reversal is possible; do not promise a reverse migration for destructive transformations. Before valuable data is changed, obtain a suitable backup and verify restoration outside the application repository. Tests cover old/new fixtures, repeat execution, required indexes and failure recovery. No migration is necessary for the current readiness-only slice.
