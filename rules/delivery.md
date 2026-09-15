# Delivery and verification rules

Ticket creation, contract readiness and status transitions are defined in [workflow](workflow.md); naming and placement in [repository conventions](repository.md). This document owns verification mechanics only.

## Mandatory development gate (to be implemented in HADS-2)

A single backend command, `uv run python scripts/verify.py`, will run lint, type checks, unit, integration and regression suites, full OpenAPI document validation, drift checks and contract tests. It must execute all applicable suites, collect failures, write fresh reports even on failure and exit nonzero if a required step fails, crashes or is unexpectedly skipped. Keep this script in `backend/scripts`.

- Run automatically for pull requests and pushes through CI, and after local development before marking a task complete. CI is mandatory because local hooks can be bypassed.
- Integrations use a real disposable MongoDB container, never the shared Atlas prototype. Pin its supported major version to the recorded Atlas version. Use unique test databases and cleanup even on failure. Fakes belong in unit tests; do not substitute them for database integration coverage.
- Defect fixes add a focused regression test that fails on the original defect; record the HADS ID.
- Frontend gate: `npm run verify`, covering lint, types, unit/component tests and build; smoke the built UI against a real test API with Playwright.
- Required backend report files: `backend/reports/latest/summary.md`, `results.json`, `junit.xml`, `coverage.xml`. Include UTC time, revision plus dirty-state fingerprint, tool versions, step commands/exit codes, duration, counts and skip reasons. A partial runner failure must still produce a summary.
- Replace the latest report atomically; never leave an old green report representing a failed run. Agents read the summary and failure details after every run and record evidence in the ticket. Reports are generated artifacts, ignored by Git, retained in CI for 7 days initially. Do not fabricate a passing baseline when no tests exist.
- Coverage is diagnostic; test requirements and risky branches. No arbitrary 100% target or tests that merely restate implementation.

CI workflow wrappers may live in `.github/workflows`; they only invoke frontend/backend-owned commands. Rules remain here. Use ephemeral CI MongoDB and no production secrets in untrusted pull requests. Configure deploys to release only a revision whose required gates passed; do not let provider auto-deploy race unfinished checks.

Documentation-only changes require link/contract consistency checks, not application tests. See [current evidence](../tracker/HADS-1.md).

## Writing check

Every change, including documentation-only work, must pass the [no-em-dash rule](README.md#mandatory-writing-rule-no-em-dashes). Scan authored text for U+2014 and inspect rendered text for encoded equivalents. Report file/line locations on failure. HADS-2 must include this lightweight check in CI for documentation as well as application changes, excluding only original reference assets, third-party dependencies and binary/build artifacts. Do not exclude authored UI strings, comments, templates or design documents.
