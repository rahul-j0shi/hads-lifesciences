# HADS-7: Implement the public HADS Lifesciences website

Status: planned
Owner: unassigned
Dependencies: [HADS-2](HADS-2.md) for the running foundation and deployment path, [HADS-6](HADS-6.md) and [HADS-9](HADS-9.md) for the design specification, [HADS-8](HADS-8.md) for the client inputs that gate public release
Scope: build, test and release the complete informational page specified in the [design concept](../idea/design_concept.md)
Out of scope: authentication, payments, catalog, admin, CMS, contact API, analytics, cookie storage, paid hosting, paid fonts and paid image services
Context: [design concept](../idea/design_concept.md), [ADR-006](../documentation/decisions.md#adr-006-public-website-content-and-delivery-model), [frontend boundary](../frontend/README.md), [performance rules](../rules/performance.md), [workflow](../rules/workflow.md)

## Plan and impact

Build one static route under `frontend/src/features/site/` from the component inventory in design concept section 12.1, with all editorial content in a single typed `content.ts`. No new HTTP operation and no persistence. The page renders fully without the API. Implement the design token set first, then the shared components, then the sections in page order, then the interaction states.

The seven open decisions in design concept section 3.6 each have an implementable default, so implementation is not blocked on client answers. Where a decision changes, it changes a token or one component variant.

| Area | Canonical link and change, or none with reason |
| --- | --- |
| Product/UI | [Design concept](../idea/design_concept.md). New public page, all sections, states and copy. Interaction and non-happy paths in its sections 10 and 10.1 |
| API | None: all content is bundled locally and contact is a `mailto:` link. The existing foundation contract in [api-design](../api-design/README.md) is unchanged and unconsumed by this page. Recorded in [ADR-006](../documentation/decisions.md#adr-006-public-website-content-and-delivery-model) |
| Database | None: no persisted data, no collection, no query. Editorial content must not be read from MongoDB |
| Operations | Add the full-page transfer budget to [performance rules](../rules/performance.md). Decide and record the pre-rendering posture. Add favicon, share image and a 404 answer. No new provider, runtime or paid service |

Contract gate: not applicable. This change introduces no HTTP or persistence behavior. If a later revision needs either, return to [workflow](../rules/workflow.md) step 2 before writing dependent code.
Review: pending implementation readiness review. Record reviewer, date and the design concept revision hash used.

Source prerequisite: the local `idea/` package is intentionally outside the public repository. Before implementation, obtain it from the repository owner and verify the design hash recorded by HADS-9. Do not implement from broken hosted-repository links or reconstruct the specification from ticket summaries.

## Acceptance criteria

Content and claims

- [ ] Every client section, framework pillar, delivery system, all sixteen portfolio cells, both sustainability statements, the mission phrase, the tagline and the contact address are present, matching the copy tables in design concept section 8.
- [ ] Claims C01 to C20 each carry a recorded publication decision from [HADS-8](HADS-8.md); no item ships without one.
- [ ] No certification, testimonial, statistic, endorsement, price, product name, founder identity or facility photograph appears anywhere.
- [ ] All authored page copy is American English and passes the [no-em-dash check](../rules/README.md#mandatory-writing-rule-no-em-dashes).

Build

- [ ] One typed `content.ts` is the only editorial source; no literal copy or hex value is duplicated in a component.
- [ ] The portfolio exposes exactly one representation at every width.
- [ ] Neither artifact listed in design concept section 2.3 is reproduced: card titles render once and card tops align.
- [ ] Every color used resolves to a token from design concept section 7.1.

Accessibility and responsive

- [ ] Verified at 320, 375, 768, 1024 and 1440 px and at 200 percent text size, with no clipped heading, no horizontal page scroll and no unreadable cell.
- [ ] Contrast measured against the final implemented values; the mission phrase sits on a white ground and the focus ring passes on the magenta control.
- [ ] Landmarks, heading order, labels, skip link and decorative-image treatment verified with a screen reader.
- [ ] Menu, anchors, copy success and failure, and the three mail subjects work with keyboard and touch; no message claims an email was delivered.
- [ ] Reduced-motion rendering is complete and static.

Release

- [ ] Bundle and transfer measured against the budgets already recorded in [performance rules](../rules/performance.md) and design concept section 12.2.
- [ ] Favicon, share image, 404 answer and print stylesheet in place; pre-rendering decision recorded.
- [ ] Frontend verification gate passes and a browser smoke test covers the anchors, the menu and the copy control.
- [ ] Deployed to the zero-cost hosting path with the live URL, revision and smoke evidence recorded here.

## Validation and release evidence

None yet. No implementation exists. Do not mark done until hosted acceptance is verified and the claim decisions from [HADS-8](HADS-8.md) are recorded against the shipped copy.

## Remaining work or blockers

Not started. Blocking for public release, not for implementation: the client evidence, brand assets and market confirmation tracked in [HADS-8](HADS-8.md). If those remain unresolved at release time, keep the neutral foundation page live and record the exact outstanding items here.
