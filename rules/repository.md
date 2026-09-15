# Repository and document conventions

Use the [workflow](workflow.md) to decide when a change is ready. This document decides where its artifacts belong. Paths below are conventions, not instructions to create empty folders.

## Placement and creation triggers

| Location | Create or update when | Convention |
| --- | --- | --- |
| `idea/` | Owner supplies content/assets | Preserve originals; descriptive `kebab-case` filenames, optional `YYYY-MM-DD` revision suffix |
| `documentation/` | Product interpretation, architecture or operations changes | Update the existing focused document first; add `<topic>.md` only for a distinct concern |
| `documentation/learnings/<topic>.md` | A concept or decision needs a newcomer-friendly explanation tied to HADS | Follow [learning guide conventions](#learning-guides); index the guide in `documentation/learnings/README.md` |
| `documentation/features/<feature>.md` | A feature needs user flows, states or acceptance detail beyond its ticket | Link input sources, API operations and collection specs; do not duplicate schemas |
| `documentation/decisions.md` | A choice changes boundaries, dependencies, hosting, security or compatibility | Append `ADR-NNN`, title, status, context, decision, consequences, sources and ticket; keep IDs stable |
| `api-design/openapi.json` | Any HTTP path, field, status, header, security or cache contract changes | One canonical OpenAPI document; stable unique `operationId`; follow [API rules](api-design.md) |
| `api-design/operations/<feature>.md` | A new feature adds operations needing usage examples | Group related operations; include operation IDs, purpose, runnable curl examples, expected outcomes, links to ticket and persistence impact |
| `database-design/collections/<collection-name>.md` | A collection or its behavior is introduced/changed | One specification per collection; follow [database rules](database-design.md) |
| `database-design/migrations/<NNNN>-<change>.md` | Existing stored data/indexes/validators need a rollout plan | Monotonic four-digit ID; link collection specs, compatibility/restore plan and backend script |
| `frontend/src/features/<feature>/` | A UI feature is implemented | Keep feature components/hooks together; move demonstrably shared UI into `components/` |
| `backend/app/features/<feature>/` | A domain feature outgrows the initial health/welcome handlers | Add routes, schemas, behavior and adapters only as needed; no mandatory empty layer hierarchy |
| `backend/scripts/migrations/` | A database migration is implemented | `<NNNN>_<change>.py`; match the design migration ID; do not execute on request/startup |
| `infrastructure/` | Shared deployment/local-container wiring changes | Provider-specific files; runtime settings stay in frontend/backend |
| `tracker/HADS-N.md` | A separately deliverable change begins | Use [ticket template](templates/ticket.md); update tracker index in the same change |
| `rules/` | A reusable mandatory convention or workflow changes | One authoritative rule; link it in the rules index |

Initial health/welcome examples remain in the API README. Extract them into an operations document only when navigation benefits; update links instead of leaving duplicate examples. Keep one OpenAPI file until measured maintenance needs justify a separate bundling decision.

## Names, navigation and growth

- Documentation and general directories use lowercase `kebab-case`; `README.md`, `HADS-N.md`, Python package/file `snake_case`, and React component `PascalCase` are explicit exceptions. Python feature packages use `snake_case`.
- Keep documentation and tracker flat initially. Add a subfolder for an actual coherent group of artifacts, not a speculative future module. New navigable document groups get a short index describing ownership and linking their entries.
- Tracker files stay at `tracker/HADS-N.md` regardless of status. Do not move tickets among status folders or reset numbering. Split work into linked tickets only when it can be independently accepted; a cross-stack vertical slice can be one ticket.
- Check both the index and existing filenames before allocating an ID; resolve collisions before publishing. Git branches use `hads-N-short-description`; commits and PR titles include `HADS-N` when Git is available. No mandatory branch/commit operation in a non-Git workspace.
- Every new document states its purpose and relevant status, links its owner ticket/context, and is reachable from the nearest index or owner document. Label future layouts/commands as planned until verified.
- Relative links identify canonical facts. Do not copy response schemas into architecture, collection metadata into frontend docs, or rules into tickets. Examples illustrate contracts; they do not override them.
- Rename only to clarify responsibility; fix inbound links and affected config/import paths in the same change. Preserve owner inputs and prior ticket evidence.

## Rules, skills and instruction discovery

Root `AGENTS.md` is only a pointer to the rules index, allowing coding agents to discover the same instructions. Do not put independent policies in nested `AGENTS.md` files. Agent-specific settings may point here without copying these rules.

Add a reusable skill only for a repeatable task that needs a dedicated procedure beyond the shared workflow. Store it as `rules/skills/<skill-name>/SKILL.md`, with purpose, activation conditions, required inputs, procedure, validation, outputs and links to canonical rules. Supporting templates/scripts belong beside that skill. Index it in `rules/README.md`; do not create empty skill wrappers around existing rule documents. Ordinary changes follow the shared workflow without requiring a new skill.

All templates live in `rules/templates/`. Copy only the template needed for an actual artifact; remove irrelevant sections or mark them `not applicable` with a reason. Do not add placeholder documents solely to fill the directory map.

## Learning guides

Learning guides teach the concept, show a small HADS example and link the decision that establishes its use. Create one when a contributor question reveals a reusable knowledge gap or a non-obvious adopted approach needs explanation. Update an existing guide when it already owns that topic; no guide is required for every ticket or dependency.

Use `documentation/learnings/<topic>.md` with: purpose/question; current status (planned, implemented or historical); plain-language explanation; concrete HADS application; reasoning/tradeoff links; limitations/common misconceptions; authoritative references and owner ticket. Use primary sources for external technical claims, with a verification date when changeable. Label illustrative examples; link actual source once implemented.

Keep mandatory instructions in rules, choices/status/alternatives in ADRs, exact schemas in design documents, commands in runbooks and task evidence in tracker. Explain these sources without copying their tables, checklists or mutable values. Never describe a proposed provider as selected or a planned pattern as implemented. Update affected guides in the same change when their explanation becomes inaccurate; preserve historical context only when useful and explicitly labeled. All authored guide text follows the repository writing rule.
