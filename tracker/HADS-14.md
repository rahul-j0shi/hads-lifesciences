# HADS-14: Build temporary launch-image fallbacks

Status: done
Owner: coding agent acting as product designer
Dependencies: [HADS-12](HADS-12.md)
Scope: create the documented plain-text S01 social share image and temporary F01 favicon set without fabricating a client logo
Out of scope: approved logo production, final brand approval, frontend integration and public release
Context: [design concept](../idea/design_concept.md), [HADS-8](HADS-8.md)

## Plan and impact

Author deterministic SVG masters, render the required PNG outputs, verify text and dimensions, and label every file as a temporary fallback awaiting the B01 decision.

| Area | Impact |
| --- | --- |
| Product/UI | Reviewable fallback sharing and browser-icon assets become available |
| API | None: no HTTP behavior |
| Database | None: no persistence behavior |
| Operations | Static local assets only; no deployment or runtime dependency |

Contract gate: not applicable; local launch-asset fallbacks only.

## Acceptance criteria

- [x] Create S01 at 1200 by 630 with the exact specified review copy and no fabricated emblem.
- [x] Keep S01 under the 200 KiB delivery budget.
- [x] Create the temporary F01 SVG, 32 px, 180 px and 512 px outputs.
- [x] Keep all content inside the documented safe areas.
- [x] Record provenance, hashes and temporary status.
- [x] Inspect the rendered outputs and validate repository documentation.

## Validation and release evidence

Validated on 2026-09-15:

- S01 has editable SVG and 1200 by 630 PNG outputs. The final PNG is 113,496 bytes, below the 200 KiB budget, with SHA-256 `08d3fe18cee26f4b23a40b555a8fd36dc3504d118aeb4edbfc84eab70046029b`.
- S01 uses exact mission colors only for the mission phrase, stays inside the 60 px safe area and contains no emblem, photograph or fabricated logo.
- F01 includes scalable, 32 px, 180 px and 512 px maskable outputs. The 32 px fallback remains readable; the maskable letter stays inside its central safe region.
- Provenance, file sizes and hashes are recorded beside [S01](../idea/assets/S01-social-share-fallback/provenance.md) and [F01](../idea/assets/F01-favicon-fallback/provenance.md).
- Both assets remain temporary and require replacement or explicit client acceptance after the B01 decision.
- Final design concept SHA-256: `0c01f4e25ee75772fc8d6a9ecdd08f932b71c839c9a82b46b044a736a4c21bdd`.
- Repository validation covered 108 readable source files, 377 Markdown links and heading targets, 103 Markdown tables, and eight SVG files. No link, table, XML or authored em dash failure was found.

## Remaining work or blockers

None within fallback creation. The B01 client decision still controls final replacement.
