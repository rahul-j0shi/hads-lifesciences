# Start-to-ship workflow

This is the mandatory entry procedure for frontend, backend, documentation and infrastructure changes. Use [placement conventions](repository.md) for files and [delivery rules](delivery.md) for verification commands. The steps below define evidence gates, not extra meetings or mandatory owner approvals.

## 1. Start from a ticket

Read the rules index, the active ticket and its linked context. Check the worktree for existing changes; preserve unrelated work. Create a ticket from the [template](templates/ticket.md) if none covers the request. Read the most recent relevant test report and note whether it matches the current revision. Missing reports in an unimplemented repository mean “no baseline”, not “passed”.

Write the user-visible outcome, in/out of scope, observable acceptance criteria and dependencies. Inspect current contracts and source before proposing new structures. Research only uncertain dependencies/requirements; record a short critique and the simplest selected approach. Resolve routine implementation choices within authorized scope; record genuine blockers precisely.

## 2. Finalise contracts before dependent code

Record the following impact table in the ticket. Each row is either a canonical link plus change summary or `none` plus a concrete reason. “TBD” in a dependency blocks the implementation that needs it.

| Impact | Required design evidence |
| --- | --- |
| Product/UI | Source content; required success/loading/empty/error/denied states as applicable |
| API | Operations, input/output schemas, examples, errors, security, caching and compatibility |
| Database | Collections, access patterns, invariants, indexes, privacy and migration/retention impact |
| Operations | Configuration, dependency/budget, deployment and rollback impact |

**For an API or persistence feature:** design the API and database together → update their canonical documents → review consistency → mark the ticket’s contract gate `ready`. When there is no persistence, explicitly record that decision in the impact table; do not invent collections or edit the DB design merely to generate a diff. A DB-only change likewise records why the HTTP contract is unaffected.

Contract review can be performed by the implementing developer/agent. Record reviewer identity, date, exact contract revision (Git commit or file hashes when uncommitted) and any remaining non-blocking assumptions. `ready` requires all behavior needed by downstream code to be settled, examples/schema references checked, and the data flow from input to storage to response accounted for. No automatic extra user-approval gate is implied.

## 3. Implement against that contract

**Backend:** implement the contract using the smallest necessary modules. Keep validation, authorization, persistence mapping and error handling explicit. Add relevant tests. Update contract documents first if implementation reveals a needed API/database change; rerun the affected review and validations. Never silently change wire behavior in code and leave documentation for a later task.

**Frontend:** begin dependent feature implementation only after the contract gate is ready. Use operation IDs, DTOs and documented states from API design, never database documents, private backend models, guessed responses or convenient mock shapes. Database design informs backend persistence; it is not a second frontend data interface.

A ready contract permits UI development before the API is running using contract-valid fixtures. Such fixtures are development/test-only, labeled as mocks, and replaced by real calls before integration acceptance. No fake-success fallback in shipped code. A missing field/status/behavior goes back to step 2 before dependent frontend code proceeds.

For an entirely presentational change, document `API: none: ...` and `Database: none: ...`, plus the UI/content acceptance criteria, then proceed. Existing API-consuming UI work identifies the exact existing contract revision even if no contract change is required. Backend completion is not required for initial frontend coding; real backend conformance is required for integration and release.

## 4. Test and validate the final change

Run the applicable [verification gates](delivery.md). Validate API documents and real responses, database behavior with a disposable Mongo instance when affected, and frontend behavior against the real API before release. Read the freshly generated reports; inspect failures, skipped checks and revision identifiers. Fix failures within scope; record unrelated/preexisting failures with evidence instead of reporting success.

Update examples, design indexes, component setup docs, operations instructions and affected learning explanations only where impacted. A shared-contract change requires both backend and affected frontend checks. A database-only change requires persistence/migration tests even if API output is unchanged. A docs-only change checks links and affected schemas/examples; it does not require an unrelated application suite.

## 5. Ship and close with evidence

Before deployment: verify required gates passed for the exact release revision, compatibility with the currently deployed counterpart, secrets/configuration, compliance with the [zero-cost constraint](README.md#zero-cost-constraint) and rollback steps. Execute migrations only through their documented rollout. Deploy within the authorized scope and run hosted smoke checks.

Record revision, commands/report locations, result, remaining issues and deployed URLs where relevant. Update ticket and index together. `done` means every scoped acceptance criterion is evidenced: local green tests alone do not complete a ticket promising a live URL. A documentation-only ticket can finish without deployment. If an external prerequisite blocks release, keep the ticket blocked with completed work and the precise next action recorded.

## Status transitions

`planned` → `ready` (scope and contract gate complete) → `in-progress` → `done` (scoped validation/release complete). Use `blocked` when a required dependency prevents remaining work, recording its owner/action; return to the appropriate prior state when resolved. If a contract changes during development, reset its gate to `draft`, pause dependent implementation, and repeat step 2. Ticket status and contract status are separate: a ticket can be in progress while a contract revision is being resolved.
