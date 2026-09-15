# Product direction from the image

Sources: [client image and written brief](../idea/README.md), inspected 2026-09-15. The complete design interpretation is maintained in [the design concept](../idea/design_concept.md).

## Observed content

The brand reads **HADS Lifesciences** with the line **Science · Nature · Better Lives**. Four visual pillars connect into an integrated approach:

| Pillar | Image wording | Visual cue |
| --- | --- | --- |
| H | Nature’s purity; source-verified botanicals | Leaf, plant/soil photography |
| A | Optimized formulations; traditional alchemy, modern precision | Mortar and pestle, laboratory inset |
| D | Individual well-being; personalized wellness solutions | Human profile, seated wellness figure |
| S | Science-based solutions; rigorous clinical validation | Capsule and laboratory |

Footer themes: quality assurance, sustainability, innovation and global reach. The image pairs botanical tradition with research and holistic well-being. These are supplied brand statements; clinical validation, sustainability and global reach need owner evidence before being presented as verified facts.

## Proposed visual translation

- Light neutral surfaces, navy headings, magenta accents, subtle rounded cards and generous whitespace.
- **Color tokens are owned by the [design concept](../idea/design_concept.md), section 7.1.** They were measured from the artwork and verified against WCAG contrast requirements there. Earlier estimates in this document were superseded; do not reintroduce a second palette here.
- A clear headline, a short owner-approved introduction, four responsive pillar cards, and a simple footer. One column on small screens, two on medium, four on wide screens.
- Prefer readable HTML text and reusable components. The supplied image is a reference, not a full-page screenshot to embed as the website.
- Use Lucide where suitable; obtain an approved logo/asset license and source artwork. Keep decorative icons hidden from screen readers and label functional icons.
- Keyboard operation, visible focus, reduced motion, semantic headings and WCAG AA contrast are first-slice acceptance requirements. Avoid decorative medical claims or invented testimonials.

The complete page design, including sections, copy proposals, accessibility requirements and asset briefs, is specified in the [design concept](../idea/design_concept.md) and implemented by [HADS-7](../tracker/HADS-7.md). This document keeps the image reading and the open product questions; it does not duplicate that specification.

## First slice

A HADS-branded placeholder page with neutral copy such as “HADS Lifesciences: website coming soon.” It loads a small API welcome response, handles a sleeping/unavailable backend gracefully and has no sign-up, checkout or health-data collection. Database connectivity is checked through a readiness endpoint, not exposed as product UI. See [HADS-2](../tracker/HADS-2.md).

## Pending owner inputs

The written brief and artwork have since arrived and are preserved in [idea](../idea/README.md). The inputs still outstanding are audience and countries; approved claims and supporting material; brand and logo asset masters; legal entity; user roles and any reason to create accounts; payment provider, currency and refund needs; any booking, subscription or shipping requirement; and analytics or privacy needs. The first four are tracked with claim and decision IDs in [HADS-8](../tracker/HADS-8.md). None of them determines the first placeholder slice.

A static React build is sufficient for the first slice. Revisit prerendering/SEO when the public content and search requirements arrive. No CMS, commerce catalog, dashboard or localization system is implied by this image alone.
