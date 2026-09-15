# Backend boundary

Before implementation, complete the [API/database contract gate](../rules/workflow.md). Update design first when routes, persistence or DTO behavior changes.

Owns Python source, backend dependencies, verification scripts and tests. Current state: documentation only. Implementation ticket: [HADS-2](../tracker/HADS-2.md).

## Planned initial layout

```text
backend/
  app/
    main.py                # create_app(), lifespan, composed app export
    settings.py            # Validated environment settings
    api/health.py
    api/welcome.py
    api/errors.py
    infrastructure/mongo.py
  tests/
    unit/
    integration/
    regression/
  scripts/verify.py
  reports/
  pyproject.toml
  uv.lock
  .env.example
```

Use FastAPI and Pydantic. `app.main:app` exports the ASGI application assembled by `create_app()`. Inject the readiness probe to test driver success/failure without real Mongo in unit tests; use real Mongo for integration checks. Use PyMongo `AsyncMongoClient` owned by application lifespan with a proposed pool maximum of 10, zero minimum, and server selection/connection/socket timeouts of 2/2/3 seconds. Keep the whole readiness request bounded to 5 seconds. Tune from evidence, keeping total pools below Atlas limits.

Configuration is validated on startup. Missing/malformed required settings fail startup with redacted diagnostics. A temporarily unavailable database does not prevent serving liveness/welcome: readiness returns 503. Close a constructed client on partial startup failure as well as normal shutdown. No schema migration, collection creation or persistent write in the first slice.

Source of truth: [HTTP contract](../api-design/README.md), [Mongo metadata](../database-design/README.md), [environment wiring](../infrastructure/README.md). Add feature packages only when implementing concrete use cases; [engineering rules](../rules/engineering.md) define dependency direction and interface usage.

Planned local command from this folder: `uv run uvicorn app.main:app --reload --port 8000`. Planned verification: `uv run python scripts/verify.py`. Neither runs until HADS-2 creates code and dependency manifests.
