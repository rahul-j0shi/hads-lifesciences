# HADS-15: Finalize the development asset set

Status: done
Owner: coding agent acting as product designer
Dependencies: [HADS-10](HADS-10.md), [HADS-11](HADS-11.md), [HADS-12](HADS-12.md), [HADS-13](HADS-13.md), [HADS-14](HADS-14.md)
Scope: reassess every local visual, remove deferred and superseded files, correct material mismatches, and leave stable development-ready masters and provenance
Out of scope: client approval, client-owned logo reconstruction, frontend integration and public release
Context: [design concept](../idea/design_concept.md), [HADS-7](HADS-7.md), [HADS-8](HADS-8.md)

## Plan and impact

Review the full asset set against the page hierarchy, material family, real rendered size, backgrounds, performance plan and representation rules. Keep only assets with a defined default use or required fallback. Rename retained masters for stable consumption and update every affected record.

| Area | Impact |
| --- | --- |
| Product/UI | Asset ambiguity and unnecessary optional media are removed before implementation |
| API | None: no HTTP behavior |
| Database | None: no persistence behavior |
| Operations | Local asset cleanup only; no deployment or runtime dependency |

Contract gate: not applicable; local asset finalization only.

## Acceptance criteria

- [x] Inspect every raster and SVG at its specified render size and relevant background.
- [x] Remove superseded iterations and deferred media not used by the default design.
- [x] Correct any retained asset that visibly fails its brief.
- [x] Give retained masters stable descriptive filenames.
- [x] Update asset inventory, provenance, implementation handoff and blocker counts.
- [x] Validate image dimensions, SVG syntax, hashes, links, tables and the no-em-dash rule.

## Validation and release evidence

Validated on 2026-09-15:

- Final [design concept](../idea/design_concept.md) SHA-256: `9da0898d4c8c40142139bef4f47e284e91dcbf2d7cf8b224d6b5029b17090f54`.
- Final [development asset manifest](../idea/assets/README.md) SHA-256: `9f2a9c1888e68c9ba50af08ddaabf631da4b76da363edbe40533e8c77a7c4ce7`.
- Retained eleven asset-ID folders: G01 to G04, I01 to I04, P05, S01 and F01.
- Removed all P01 to P04 local candidates because the default framework omits them, P05 already carries the sustainability theme, and retaining synthetic people and facility imagery added representation risk without page value.
- Removed superseded G01 and G03 iterations. No filename containing `candidate` remains under `idea/assets/`.
- G01, G02 and G03 were compared together on white at 320 px and checked at 160 px. Their silver engraving, raspberry accents, lighting and shadows form a coherent family, so no further generation was justified.
- Added 160 and 320 px transparent WebP exports for G01 to G03. Sizes range from 2,832 to 11,486 bytes, below the 20 KiB per-file budget.
- P05 is the only retained generated photograph. Its 480 by 320 and 960 by 640 WebP exports are 10,060 and 25,624 bytes, below the 45 KiB per-file budget. The manifest requires the visible `Illustrative image` caption.
- G04 was inspected at 800 by 450 on white. I01 to I04 were inspected at 56 px on white. All remain distinct and satisfy their briefs, so they were not regenerated.
- S01 and F01 passed final visual review. S01 remains below 200 KiB, and F01 remains readable at 32 px.
- The complete local development selection occupies 227,482 bytes before transport compression. Social metadata and alternative favicon sizes are not part of the page's default image transfer.
- Repository validation covered 106 readable source files, 378 Markdown links and heading targets, and 102 Markdown tables with zero failures.
- All eight SVGs parse as XML and contain no embedded raster, script, external reference or filter. No authored em dash violation was found.

## Remaining work or blockers

None within asset finalization. B01 and B02 remain client-owned inputs. R01 remains a conditional human-design task if B02 is unavailable and the client requests reconstruction. These do not block local development because the manifest specifies text-led fallbacks.
