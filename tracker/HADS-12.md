# HADS-12: Author the lightweight SVG asset set

Status: done
Owner: coding agent acting as product designer
Dependencies: [HADS-11](HADS-11.md)
Scope: author and inspect G04 plus I01 to I04 as deterministic, lightweight SVG assets
Out of scope: generated photography, client-owned brand assets, logo work, frontend integration and public release
Context: [design concept](../idea/design_concept.md), [HADS-8](HADS-8.md)

## Plan and impact

Translate the approved revision 4 briefs into accessible, code-native SVG masters. Keep the palette exact, avoid text and scientific claims, verify SVG syntax, inspect rendered previews, and record provenance beside every asset.

| Area | Impact |
| --- | --- |
| Product/UI | Five deterministic decorative assets become available for design review |
| API | None: no HTTP behavior |
| Database | None: no persistence behavior |
| Operations | Static local SVG only; no generator, deployment or runtime dependency |

Contract gate: not applicable; local design assets only.

## Acceptance criteria

- [x] Author G04 as a subtle wide constellation SVG.
- [x] Author four visually distinct delivery-system SVG icons.
- [x] Use only the palette roles specified in the design concept.
- [x] Include no text, embedded raster, script, external reference or filter.
- [x] Keep every delivery icon at or below 4 KiB.
- [x] Render and inspect the assets at intended display sizes.
- [x] Record source and review status beside every asset.
- [x] Validate SVG syntax, links, tables, hashes and the no-em-dash rule.

## Validation and release evidence

Validated on 2026-09-15:

- G04 is 1,777 bytes, SHA-256 `c2c28b52832a0e7cdff47ba0ca77eedd71c8249a02a646a62918163042037063`.
- I01 is 506 bytes, SHA-256 `2366605487be27dc339bb3b9d61263e2269073155aa3051006748a34f8956024`.
- I02 is 495 bytes, SHA-256 `00bef3215f648ed21dd2e4e413769dab6307ba3e6dc7eeffa6e4db6cd82f21cf`.
- I03 is 494 bytes, SHA-256 `db0d78a6afeb619187759ce6d7c03b457a9e01ad3058ba8344a85d4286e33b18`.
- I04 is 711 bytes, SHA-256 `ae2c49d7cb424fe3e309b2055720a22f3d010f10e9c10ee50ebb29abf7f16b2f`.
- All five files parsed as XML and rendered through FFmpeg. G04 was inspected at 800 by 450; I01 to I04 were inspected at 56 by 56 on white.
- The four icon silhouettes remain distinct. The required object counts survive at delivery size, and none adds text, direction, timing, anatomy or measured scientific behavior.
- Individual provenance records sit beside [G04](../idea/assets/G04-constellation-backdrop/provenance.md), [I01](../idea/assets/I01-encapsulation-icon/provenance.md), [I02](../idea/assets/I02-micro-pellet-icon/provenance.md), [I03](../idea/assets/I03-nano-emulsion-icon/provenance.md) and [I04](../idea/assets/I04-beadlet-in-oil-icon/provenance.md).
- No image generation was needed because the deterministic SVGs satisfy their briefs and performance budgets.
- Workspace validation covered 102 readable source files, 371 Markdown links and heading targets, and 100 Markdown tables with zero failures. All five SVGs parsed as XML, no forbidden embedded feature was found, and no authored em dash violation was found.

## Remaining work or blockers

None within SVG authoring. Client visual approval remains separate under [HADS-8](HADS-8.md).
