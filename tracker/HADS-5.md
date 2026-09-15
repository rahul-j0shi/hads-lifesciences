# HADS-5: Add codebase learning guides

Status: done
Owner: coding agent
Dependencies: [HADS-1](HADS-1.md), [HADS-3](HADS-3.md)
Scope: newcomer explanations and their maintenance conventions
Out of scope: application implementation, new provider decisions and deployment
Context: owner request for a learnings folder explaining concepts and their HADS application

## Plan and impact

Create a learning index and focused guides for composability, design patterns and technology choices. Link canonical rules/decisions; ground guide conventions in repository rules.

| Area | Impact |
| --- | --- |
| Product/UI | None: educational documentation only |
| API | None: no contract changes |
| Database | None: no persistence changes |
| Operations | Documentation navigation/maintenance only |

Contract gate: not applicable; explanation-only change.
Review: coding agent, 2026-09-15; technical references checked against the authors' paper repository and official FastAPI lifespan documentation.

## Acceptance criteria

- [x] Learning folder is discoverable and explains its relationship to rules, decisions and contracts.
- [x] Explain the research paradigm and bounded HADS application without claiming implementation/formal guarantees.
- [x] Explain design patterns and technology choices with concrete examples and canonical links.
- [x] Make unselected payment/identity providers explicit; define when/how guides are maintained.
- [x] Validate links and no-em-dash compliance.

## Validation and release evidence

Validated 211 local links/heading targets and scanned 40 text files for prohibited em dashes; all passed. Reviewed guides against the canonical decisions for planned/implemented status and unselected provider wording. No API/schema changes, application tests or deployments apply.

## Remaining work or blockers

None within this scope.
