# HADS-13: Generate the deferred framework photograph candidates

Status: done
Owner: coding agent acting as product designer
Dependencies: [HADS-11](HADS-11.md)
Scope: generate and inspect P01 to P04 as optional synthetic editorial candidates following the owner's request to continue image generation
Out of scope: treating synthetic scenes as evidence, enabling these images in the default page, client approval, frontend integration and public release
Context: [design concept](../idea/design_concept.md), [HADS-8](HADS-8.md)

## Plan and impact

Generate the four deferred concepts separately, preserve their exact prompts and provenance, inspect intended crops and retain their deferred status unless the client explicitly selects them.

| Area | Impact |
| --- | --- |
| Product/UI | Optional framework photograph candidates become available for comparison |
| API | None: no HTTP behavior |
| Database | None: no persistence behavior |
| Operations | Local synthetic source assets only; no deployment or runtime dependency |

Contract gate: not applicable; local design exploration only.

## Acceptance criteria

- [x] Generate and save P01 to P04.
- [x] Preserve the exact prompt and provenance for each candidate.
- [x] Inspect anatomy, equipment, implied representation and intended crop.
- [x] Keep every candidate labeled synthetic, illustrative, deferred and unapproved.
- [x] Validate hashes, links, tables and the no-em-dash rule.

## Validation and release evidence

Historical note: HADS-15 later removed all P01 to P04 files after deciding that deferred framework photography duplicated content and added representation risk. The generation hashes below remain historical evidence; the design concept still owns the reusable prompts.

Validated on 2026-09-15:

- P01 v1 SHA-256: `27fdee3a49a47ea4376ae6e50ca0c1d741a29513a7cd7330d5a4ec2958286fe8`.
- P02 v1 SHA-256: `9fe693fe0f9498a3f383e946a504c6526b4b1bf5584b36ceb707581380d498e7`.
- P03 v1 exposed too much facial detail. A focused edit produced preferred P03 v2, SHA-256 `aa4ded24025569050dcf198b25e7bb765c411a3802ef4f42911d7f9a6afdecbc`.
- P04 v1 SHA-256: `3a75f2c872639c2167b6a69daccd9c6e3fe9a1712c5c5fb0a86d27ba903f4850`.
- Every preferred candidate is 1448 by 1086 RGB PNG and passed a 96 by 96 center-crop review.
- Anatomy, object count, laboratory representation and implied-claim constraints were checked. The preferred candidates contain no text, logo, named organization, product or evidence claim.
- Exact prompts remain in design concept section 11.7. The deleted local provenance files are superseded by the HADS-15 removal record.
- These candidates remain deferred from the default page and require `Illustrative image` disclosure if selected.
- Workspace validation covered 102 readable source files, 371 Markdown links and heading targets, and 100 Markdown tables with zero failures. No authored em dash violation was found.

## Remaining work or blockers

None within exploratory generation. Client selection remains separate under [HADS-8](HADS-8.md).
