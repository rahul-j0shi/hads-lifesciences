# HADS-11: Generate the remaining safe raster asset candidates

Status: done
Owner: coding agent acting as product designer
Dependencies: [HADS-10](HADS-10.md)
Scope: generate, inspect and document G02, G03 and P05 exploration candidates from the revision 4 prompts
Out of scope: logos, client-owned emblems, deferred framework photography, code-native SVG assets, optimization, client approval, website implementation and public release
Context: [design concept](../idea/design_concept.md), [client artwork](../idea/image.png), [HADS-8](HADS-8.md)

## Plan and impact

Generate each safe raster asset separately with the built-in image-generation tool. Preserve the exact prompt and source file, inspect the output at master and intended display size, and record any issue that blocks production use.

| Area | Impact |
| --- | --- |
| Product/UI | Three optional raster asset candidates become available for visual review |
| API | None: no HTTP behavior |
| Database | None: no persistence behavior |
| Operations | Built-in generation only; no deployment, runtime dependency or paid project service |

Contract gate: not applicable; local design assets only.

## Acceptance criteria

- [x] Generate and save G02 in its designated local asset folder.
- [x] Generate and save G03 in its designated local asset folder.
- [x] Generate and save P05 in its designated local asset folder.
- [x] Preserve the exact prompt and provenance for each asset.
- [x] Inspect G02 and G03 at 160 px and P05 at its intended 480 px treatment.
- [x] Record acceptance issues without describing candidates as approved assets.
- [x] Validate links, tables, hashes and the no-em-dash rule.

## Validation and release evidence

Validated on 2026-09-15:

- Design concept revision 4 SHA-256: `3d97a4949cecb924fb8a4fab04a3263f730bca5751ca7dbd2b1c29b2ee6e6e6f`.
- G02 v1 is a 1254 by 1254 RGBA PNG, SHA-256 `316327e9693bff501e28caf55f8e84843c50c1cdc59b33fd5c0afc789059e623`. It passed the 160 px composition and object-count review.
- G03 v1 was visually clear but too glossy. A focused surface-treatment edit produced preferred G03 v2, a 1254 by 1254 RGBA PNG with SHA-256 `12c6bbb62f3eade6bc6d6a052e8b85556e9302a9c41f6b18e52973a171c7bd85`. It passed the 160 px review.
- P05 v1 is a 1448 by 1086 RGB PNG, SHA-256 `5b3ba0f2b458a665ef41afa09f9bad03324794a8823b894a7283d4ba95e37c7d`. The subject and anatomy remained credible in a 480 by 320 center crop.
- Exact prompts, tool path, terms reference, hashes and inspection notes are stored in the [G02](../idea/assets/G02-engraved-mortar-and-pestle/provenance.md), [G03](../idea/assets/G03-two-tone-capsule/provenance.md) and [P05](../idea/assets/P05-sustainability-botanical/provenance.md) records.
- 85 readable source files excluding generated build output, 347 Markdown links and heading targets, and 93 Markdown tables checked with zero failures.
- Zero em dash violations found in authored files. The preserved client-source exception remains unchanged.
- No API, database, deployment, paid project service or runtime image dependency was added.

## Remaining work or blockers

None within the safe raster generation scope. All candidates still require alpha or crop verification during optimization and client review before production use. Client approval remains separate under [HADS-8](HADS-8.md).
