# HADS-3: Make contract-first development and repository conventions explicit

Status: done
Owner: coding agent
Dependencies: [HADS-1](HADS-1.md)
Scope: documentation and instruction discovery
Out of scope: application implementation, CI execution and deployment
Context: owner request to make API/database design prerequisites and contributor conventions unambiguous

## Plan and impact

Review existing instructions; define one workflow and placement reference; relocate duplicated database conventions into rules; connect frontend/backend entry points and the next implementation ticket.

| Area | Canonical link and impact |
| --- | --- |
| Product/UI | None: no product behavior changes |
| API | None: wire contract unchanged; [workflow](../rules/workflow.md) defines readiness/handoff |
| Database | None: no persistence changes; conventions centralized in [database rules](../rules/database-design.md) |
| Operations | Documentation/discovery only: root agent pointer, [repository conventions](../rules/repository.md), [ticket template](../rules/templates/ticket.md) |

Contract gate: not applicable: no application/API/persistence change.
Review: coding agent, 2026-09-15; documentation consistency and scenario walkthrough below.

## Acceptance criteria

- [x] Define when/where to create folders, docs, tickets, ADRs and skills without speculative scaffolding.
- [x] Require API/database impact resolution and recorded contract readiness before dependent code.
- [x] Define frontend fixture use, real API validation and handling of contract changes.
- [x] Supply a concise start-to-ship procedure and ticket template with completion evidence.
- [x] Make the ongoing $0-only requirement mandatory; defer paid domains/resources and prevent automatic upgrade assumptions.
- [x] Preserve canonical ownership, working navigation and unchanged API behavior.

## Validation and release evidence

Passed one-off Python checks on 2026-09-15: 166 local links/anchors, 10 OpenAPI references, and 7 response examples against JSON Schema. Full OpenAPI document validation remains a HADS-2 prerequisite; this change did not alter its wire contract. Contract SHA-256: `babb706f58dd30b9a6d2ee096b10b523550031cbf18d58bed1628d81870a1b60`.

Manual workflow review covered: new API with persistence (both designs required); API without persistence (documented no-DB impact); DB-only change (migration/persistence checks); existing-contract UI (record revision); presentation-only UI (explicit no-impact reasoning); changed DTO during UI work (reset contract readiness); release blocked by free-provider eligibility (free fallback or defer, never pay).

No application tests or deployment were required or performed. Git metadata remains unavailable; no commit was created.

## Remaining work or blockers

None within this documentation scope. HADS-2 remains planned with its implementation/readiness prerequisites.
