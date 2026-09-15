# API and DTO rules

Concrete schemas and examples belong in [API design](../api-design/README.md). Persistence metadata belongs in [database design](../database-design/README.md). A DTO (data transfer object) contains only fields crossing an API boundary.

## Contracts

- Define separate input and output models when fields differ. Name by purpose: `CreateOrderRequest`, `OrderResponse`, `WelcomeResponse`; avoid universal `BaseDto` classes.
- Return a direct typed object for single resources. For future lists use `{"items": [], "next_cursor": null}` with explicit bounded page size and deterministic ordering; add counts only when required. Do not add pagination to singleton endpoints.
- Use `snake_case` JSON fields, string identifiers and RFC 3339 UTC timestamps. Money uses integer minor units plus explicit currency. Distinguish omitted fields from explicit null, particularly for partial updates.
- Make required fields, nullability, lengths, bounds, enumerations and examples explicit. Reject unknown write fields. Map internal records into allowlisted output fields; never serialize a Mongo document or provider response wholesale.
- Use HTTP status semantics: 200 read/update, 201 creation with resource location, 204 no response body, 400 malformed request, 401 unauthenticated, 403 forbidden, 404 absent, 409 conflict, 422 validated input failure, 429 throttled, 503 temporary dependency failure. Define only statuses applicable to each endpoint; normalize framework errors.
- Error body: `application/problem+json` with `type`, `title`, `status`, safe `detail`, `request_id`. Validation errors may add a documented bounded field-error list; never echo secrets or raw request values. For `about:blank`, use the HTTP status description as the title.
- Correlation lives in `X-Request-ID` for every response and in error bodies, without success-envelope duplication. Preserve `Allow` on 405; specify retry/auth headers when those statuses are introduced.
- Version domain paths under `/api/v1`; keep health endpoints unversioned. Add fields compatibly, deprecate deliberately, and change the API version only for actual breaking contracts. Consumers must tolerate additive response fields even when server output validation is strict.

## Implementation patterns

Keep routes thin, validate with Pydantic, and compose dependencies explicitly. Add a use-case class or repository interface when business behavior or an I/O boundary justifies it, per [engineering](engineering.md). No generic CRUD framework, success boolean on every response or nested `data.data` envelopes.

Queries use projections for required fields and bounded result sets. Avoid N+1 lookups, synchronous I/O inside async routes, retries without limits and loading entire collections into memory. Authorization belongs before data access/return; caching must follow [performance rules](performance.md).

Every contract change updates OpenAPI, affected examples and meaningful response/error tests together. DTO rules are mandatory; planned example names do not authorize those features.
