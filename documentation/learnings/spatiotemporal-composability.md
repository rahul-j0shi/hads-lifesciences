# Spatiotemporal composability in plain language

Purpose: explain the research idea and its bounded application in HADS. Status: planned application, no Cordis runtime installed. Decision: [ADR-003](../decisions.md#adr-003-spatiotemporal-composability). Delivery context: [HADS-5](../../tracker/HADS-5.md).

## The problem

Imagine a component that opens a connection and subscribes to events. Adding it is straightforward. Removing it safely is harder: who closes the connection, removes its subscriptions and handles other components that depend on it?

The paper describes two dimensions of composition:

- **Temporal:** track reversible effects so removing a component can undo its changes to the managed context.
- **Spatial:** declare dependencies and react to their availability so dependent components activate or deactivate appropriately.

Cordis combines these mechanisms in a shared context. The paper calls the mechanisms revertible effects and reactive coeffects. It is an actively revised preprint. [Authors’ paper repository](https://github.com/cordiverse/paper), checked 2026-09-15.

## How HADS applies the useful parts

HADS engineering interpretation: make dependencies visible and give each resource an owner with a clear lifetime.

For the planned Mongo readiness check:

1. Application startup constructs a database client.
2. The composition root gives the readiness handler access to a probe backed by that client.
3. Requests reuse the client instead of creating one each time.
4. Shutdown closes it; partial startup failure must also clean up resources already acquired.

FastAPI provides a lifespan mechanism for startup and shutdown resource management. HADS will use that established mechanism. [Official lifespan documentation](https://fastapi.tiangolo.com/advanced/events/), checked 2026-09-15. The planned locations and timeout/pool choices are in the [backend design](../../backend/README.md).

This makes tests concrete: after shutdown, did the owner close its client? If setup fails midway, did already-created resources get cleaned up? The [test matrix](../../backend/tests/README.md) records the planned checks.

## Where the analogy stops

Closing a database client does not undo a committed database write. Similarly, removing a checkout component cannot reverse money already captured; a refund would be a separate business action.

The current design uses static dependency wiring and ordinary lifecycle management. It does not implement reactive plugin loading, hot replacement or the paper’s formal guarantees. Full Cordis adoption would need a new requirement and decision. This distinction keeps the research useful without turning a small website into a custom runtime project.

## What to take into implementation

For every resource, answer: who creates it, who needs it, how long does it live, and who cleans it up on failure? Apply the exact [engineering rules](../../rules/engineering.md#lifecycle-and-side-effects). Do not infer new infrastructure from this explanation.
