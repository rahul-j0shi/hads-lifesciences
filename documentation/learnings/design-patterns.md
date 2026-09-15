# Following a request through HADS

Purpose: connect design vocabulary to a concrete HADS request. Status: educational explanation of the planned slice. Decisions: [architecture](../architecture.md), [ADR-001](../decisions.md#adr-001-small-modular-application). Context: [HADS-5](../../tracker/HADS-5.md).

## Begin with behavior

The readiness endpoint answers one question: can the application reach its required database within a deadline? A useful design exposes that answer without exposing credentials or driver details. This requirement is enough to identify the parts below.

| Concept | Plain meaning | Planned HADS example |
| --- | --- | --- |
| Route/controller | Translate HTTP into a call and its result into a response | Readiness route selects the documented success/error response |
| Interface/port | State the small capability a caller requires | A probe that checks readiness without exposing Mongo internals |
| Adapter | Connect that capability to a particular technology | Mongo implementation of the probe |
| Dependency injection | Supply the dependency instead of constructing it inside the caller | App setup gives the route its probe |
| Composition root | One place that assembles the working parts | Application creation and lifespan wiring |
| DTO | The data intentionally sent across an API boundary | Public readiness status without connection details |

These are responsibilities, not a requirement to create six files or classes. A stateless welcome response needs much less structure. A future use case with pricing or ownership rules can justify a separate behavior module; the placeholder does not.

## Why an interface can help

The readiness handler needs a check, not every method offered by a database driver. A narrow interface lets a unit test supply a probe that succeeds, times out or fails. A real-Mongo integration test then checks the adapter and its wiring. Neither kind of test replaces the other.

This is dependency inversion in practical terms: the caller describes what it needs, while the provider-specific implementation satisfies it. Composition avoids forcing unrelated behavior into a large inheritance tree. The [engineering rules](../../rules/engineering.md) decide when an interface/class is justified.

## Why API and database designs are separate

A stored record serves persistence and internal queries. A DTO serves the person or program calling the API. They may have different fields, identifiers and privacy requirements. Returning the entire stored object ties the frontend to internal storage choices and risks leaking fields added later.

In HADS, frontend code reads the public [API contract](../../api-design/README.md). The backend maps any stored data into that contract. Today, the welcome/readiness slice has no stored business records, so it needs no collection design invented for symmetry.

## Why contract-first work saves iteration

If frontend code guesses a response field and backend code chooses a different one, integration becomes a negotiation after both are built. A ready contract settles those details first. Both sides can then work from the same examples; release tests check the real connection.

The exact readiness and handoff steps are in [workflow](../../rules/workflow.md). This guide explains their purpose rather than adding a second checklist.
