# HADS-6: Critique and finalise the client website design concept

Status: done
Owner: coding agent acting as product designer
Dependencies: [HADS-1](HADS-1.md), [HADS-5](HADS-5.md)
Scope: improve [the design concept](../idea/design_concept.md) in place; preserve client sources; reconcile linked documentation and record downstream work
Out of scope: application development, generating images, provider selection and deployment
Context: [client details](../idea/details.md), [client artwork](../idea/image.png), the owner's original concept

## Plan and impact

Four sequential design reviews: source fidelity and brand system; editorial voice and claim exposure; structure, layout and conversion; tokens, states and handoff. The resultant specification stays in its current file at the owner's request.

| Area | Impact |
| --- | --- |
| Product/UI | Complete editorial concept, measured visual system, wireframes, copy tables, responsive and interaction behavior, and asset prompts in the [design concept](../idea/design_concept.md) |
| API | None: static page and email links; the existing foundation contract is unchanged. Recorded in [ADR-006](../documentation/decisions.md#adr-006-public-website-content-and-delivery-model) |
| Database | None: no persistent feature |
| Operations | Preserves the zero-cost constraint. Adds public-website budgets to [performance rules](../rules/performance.md) and opens [HADS-7](HADS-7.md) and [HADS-8](HADS-8.md) |

Contract gate: not applicable to this design-only change. Implementation carries its own no-impact review in [HADS-7](HADS-7.md).
Review: four-pass product design critique by the author. This is designer review, not user testing, and not medical or legal verification.

## Acceptance criteria

- [x] Inspect all three inputs and preserve the original client details and image unchanged.
- [x] Account for every client section, framework pillar, delivery system, portfolio cell, mission line and contact detail.
- [x] Correct contradictory or incomplete layout, copy, interaction and accessibility instructions.
- [x] Supply context-specific image prompts, provenance, formats, crop and fallback guidance, and priorities.
- [x] Record four review passes, release prerequisites and concrete handoff acceptance criteria.
- [x] Update navigation and stale scope references, and validate authored text and links.

## Validation and release evidence

Revision 1 hashes, before this change:

- Client details: `1afb54b1ab25fb8d10b2cc55d63085fd446b7689cba4b187faca3b4aebef3277`
- Client image: `4e06ec802391b7ab528aacb8ba5294079820bfb079f8797a8a28f4a6a7e25191`
- Concept as received by this pass: `0a525f890cd8e31b7dc463712db6ca7a427c0bee440fe51b0adbfcd37e8060f5`

After this change:

- Client details: `1afb54b1ab25fb8d10b2cc55d63085fd446b7689cba4b187faca3b4aebef3277` **unchanged**
- Client image: `4e06ec802391b7ab528aacb8ba5294079820bfb079f8797a8a28f4a6a7e25191` **unchanged**
- Design concept, revision 2: `44c3f742153b6df9cd1b08e3fc8accfda42b1440f8c030344f30a8ce765c5d98`

Artwork measurement: `image.png` decoded to raw RGB24 with `ffmpeg` and sampled per region in Python, using hue-filtered per-channel medians and 4-level quantized modes, across 24 element regions and 8 surface regions. Method and results are published in design concept section 2.4 and are reproducible from the preserved image. The measurement found that the two mission hex values supplied in the brief are Material Design 2 presets that do not appear in the logo, which is recorded as open decision D1.

Contrast: every foreground and background pair used by the design was computed with the WCAG 2.x relative-luminance formula and published as a matrix in design concept section 7.2. Three pairs changed the specification: the supplied mission magenta measures 4.48:1 on the canvas ground and fails AA there; a navy focus ring on the magenta control measures 2.2:1 and fails the non-text minimum without its white inner ring; and no brand color may sit on the navy contact band at 2.2:1.

Documentation checks, run after the change: 292 local links and heading anchors across 43 files validated, 0 failures. 84 markdown table blocks checked for column consistency, 0 mismatches. Em dash scan of all markdown: the only occurrence is in `idea/details.md`, the preserved client original, which the [writing rule](../rules/README.md#mandatory-writing-rule-no-em-dashes) exempts as a supplied asset.

No application test runner exists, so no application suite applies. No image was generated. No deployment, account provisioning or credential handling occurred. Git metadata is unavailable in this workspace, so no commit was created.

## Remaining work or blockers

None within this scope. Implementation continues in [HADS-7](HADS-7.md). The client answers that gate public release, including the seven open decisions in design concept section 3.6, are tracked in [HADS-8](HADS-8.md) and do not block development.
