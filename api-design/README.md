# API contract

Contract readiness, revisions and downstream frontend handoff follow [workflow](../rules/workflow.md); operation document paths follow [repository conventions](../rules/repository.md).

**Design only. No endpoints are running yet.** [openapi.json](openapi.json) is the machine-readable OpenAPI 3.1 draft for HADS-2. It owns request/response schemas; this page owns initial endpoint usage. Requests below become runnable when [HADS-2](../tracker/HADS-2.md) is implemented.

## Surface

| Method/path | Purpose | Result |
| --- | --- | --- |
| `GET /api/v1/welcome` | Minimal frontend/API connection | 200 welcome DTO |
| `GET /health/live` | HTTP process alive, no dependencies | 200 liveness DTO |
| `GET /health/ready` | Mongo ping under deadline | 200 ready or 503 problem |

No request bodies, authentication, query parameters or pagination in these operations. Unknown paths return 404; unsupported methods return 405. All responses include a generated or validated `X-Request-ID`; health/errors use `Cache-Control: no-store`. GETs are side-effect-free: no database writes. Every route may return a generic 500 problem for an unexpected server failure.

API/DTO naming, envelopes, status semantics and evolution are defined in [API rules](../rules/api-design.md). Cache behavior is defined in [performance rules](../rules/performance.md): welcome uses `public, max-age=60`, and CORS responses preserve `Vary: Origin`. The initial contract has no ETag/304 support. Future auth/checkout/list endpoints remain unapproved.

## Curl examples

Run against the local API, or replace the origin with the deployed HTTPS URL:

```bash
export HADS_API_BASE_URL='http://localhost:8000'
curl --fail-with-body -i "$HADS_API_BASE_URL/api/v1/welcome"
curl --fail-with-body -i "$HADS_API_BASE_URL/health/live"
curl --fail-with-body -i "$HADS_API_BASE_URL/health/ready"
curl -i -H 'Origin: http://localhost:5173' "$HADS_API_BASE_URL/api/v1/welcome"
curl -i -H 'Origin: https://untrusted.example' "$HADS_API_BASE_URL/api/v1/welcome"
```

Successful bodies respectively:

```json
{"name":"HADS Lifesciences","message":"Website coming soon."}
```

```json
{"status":"alive"}
```

```json
{"status":"ready"}
```

With Mongo unavailable, readiness returns HTTP 503, `application/problem+json`, and a body such as:

```json
{"type":"about:blank","title":"Service Unavailable","status":503,"detail":"A required dependency is unavailable.","request_id":"example-request-id"}
```

For an allowed local origin, expect `Access-Control-Allow-Origin: http://localhost:5173`; for the unrelated origin, expect no allow-origin header. Curl still receives a response because it does not enforce browser CORS. Configure local origins before testing.

## Contract ownership after implementation

Keep the reviewed OpenAPI file as the public contract. Generate FastAPI’s schema in CI and compare normalized paths, operations, schemas, security and error responses to this contract; disregard only explicitly documented non-semantic differences such as key ordering. Configure global 404/405/500 errors to follow the same problem format. Test real responses against the contract, including framework errors. Contract changes, implementation, examples and generated frontend types (when needed) move together in one ticket. Do not maintain a second handwritten API client schema.
