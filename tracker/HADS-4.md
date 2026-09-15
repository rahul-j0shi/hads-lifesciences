# HADS-4: Enforce the no-em-dash writing convention

Status: done
Owner: coding agent
Dependencies: [HADS-3](HADS-3.md)
Scope: repository-wide writing rule and existing authored text cleanup
Out of scope: application implementation and modifying original supplied assets
Context: owner request to prohibit em dashes throughout the codebase

## Plan and impact

Add a prominent canonical rule, replace existing em dashes, repair heading links and specify the future CI check.

| Area | Impact |
| --- | --- |
| Product/UI | Proposed placeholder copy punctuation only |
| API | None: wire contract unchanged |
| Database | None: no persistence change |
| Operations | Documentation verification requirement; implementation remains in HADS-2 |

Contract gate: not applicable; editorial/rules change only.
Review: coding agent, 2026-09-15.

## Acceptance criteria

- [x] Prominent rule covers all authored content, including rendered text.
- [x] Existing authored text has no em dashes; heading references remain valid.
- [x] Future CI enforcement recorded without claiming it is implemented.

## Validation and release evidence

Scanned 35 text files: no U+2014 characters remain. Validated 170 local links and heading targets: all passed. Existing heading references were updated with the punctuation changes. Application testing/deployment not applicable; CI implementation remains planned in HADS-2.

## Remaining work or blockers

None within this scope.
