# Engineering rules

Related: [architecture](../documentation/architecture.md), [security](../documentation/security-and-integrations.md), [delivery](delivery.md).

## First-principles design check

Start with the required observable behavior and constraints. Identify the authoritative data, trust boundary, invariants, failure modes and resource lifetime. Choose the smallest data flow that satisfies them. State why an added abstraction/dependency is necessary, what owns it and how its behavior is tested. A familiar pattern or research paper alone is not a requirement.

For each API, account for input → validation/authorization → behavior → optional persistence → DTO → failure response. Do not add storage to a computation-only endpoint, an interface without a meaningful boundary, or a cache without a freshness rule. Prefer designs that are easy to inspect and change; measure performance before complicating the architecture.

## KISS, SOLID and composition

- Build one frontend and one modular Python service. Start with the smallest working vertical slice.
- Give each module/class one reason to change. Keep HTTP parsing, business decisions and external I/O separate when those responsibilities exist.
- Use ordinary functions for stateless transformations. Use classes for owned state, lifecycle or meaningful behavior; do not wrap every route in a class.
- Define small Python `Protocol` interfaces at genuine external boundaries (database, identity, payments) when implementing the consuming use case. Do not create speculative base repositories, generic service factories or interfaces for every class.
- Inject dependencies at the application composition root. Business logic must not import concrete provider SDKs or read environment variables.
- Prefer composition over inheritance. Implementations must preserve interface results, errors and side effects; prove substitutability with contract tests when multiple implementations exist.
- Extract reuse from demonstrated common behavior. Avoid catch-all `utils`, `manager`, `BaseService` and global mutable service locators.

## Names, types and comments

Python: descriptive `snake_case` files/functions, `PascalCase` classes, typed public boundaries. Examples: `MongoReadinessProbe`, `check_database_readiness`, `PaymentGateway`. React: `PascalCase` component files and names, `camelCase` functions, `use` prefix for hooks. Names should express the domain and action, without unexplained abbreviations.

Use Pydantic for API/settings validation, explicit persistence mapping, TypeScript strict mode for the UI. Reject untrusted fields rather than passing user dictionaries to MongoDB. Never return database documents directly as API responses.

Docstrings describe non-obvious public contracts, exceptions and lifecycle ownership. Comments explain why, units, invariants or external constraints; avoid restating code. Link subtle architectural decisions. Keep files focused; split by responsibility rather than arbitrary line counts.

## Lifecycle and side effects

Apply the bounded [Cordis interpretation](../documentation/decisions.md#adr-003-spatiotemporal-composability). Acquire connections in application lifespan; close them on shutdown, including partial startup failure. Cancel request work and clean up frontend subscriptions. Importing a module must not open connections or start tasks.

Classify external effects explicitly: resource cleanup is reversible; a committed database write, sent email or captured payment is not undone by component disposal. Use provider idempotency and explicit compensation where required. Do not claim runtime hot-swap or mathematical Cordis conformance.

## Tooling and dependencies

At implementation, select mutually supported stable Python/Node/package versions, record them, and commit lockfiles. Use `uv` for Python dependency locking and npm for frontend locking unless an updated decision justifies a change. Use Ruff, mypy, pytest; ESLint, TypeScript, Vitest and Playwright. Add dependencies only for a used capability. Prefer maintained provider SDKs and established identity protocols over custom security code.
