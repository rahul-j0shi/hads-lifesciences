# HADS-10: Harden image prompts and generate the first asset candidate

Status: done
Owner: coding agent acting as product designer
Dependencies: [HADS-9](HADS-9.md)
Scope: make every generation prompt self-contained and generate one reviewable G01 candidate using the built-in image-generation tool
Out of scope: logo reconstruction, client asset approval, website implementation, paid image services and public release
Context: [design concept](../idea/design_concept.md), [client artwork](../idea/image.png), [HADS-8](HADS-8.md)

## Plan and impact

Strengthen each prompt with its intended use, exact palette roles, composition, output behavior, exclusions and acceptance conditions. Generate G01 as the first optional design candidate, inspect it and preserve its prompt and provenance beside the file.

| Area | Impact |
| --- | --- |
| Product/UI | Optional visual asset brief becomes reproducible; one leaf-emblem candidate is available for review |
| API | None: no HTTP behavior |
| Database | None: no persistence behavior |
| Operations | Built-in generation only; no deployment, runtime dependency or paid service |

Contract gate: not applicable; design documentation and a local candidate asset only.

## Acceptance criteria

- [x] Every G, I and P generation prompt is self-contained.
- [x] Prompt palette roles agree with the design tokens and distinguish mission typography colors from illustration colors.
- [x] Prompts include use, composition, crop safety, background behavior, constraints and rejection conditions.
- [x] Generate and save one G01 candidate in its designated local asset folder.
- [x] Record the exact prompt, generation route, date and review status beside the candidate.
- [x] Inspect the candidate at full size and reduced display size.
- [x] Validate documentation links, tables and the no-em-dash rule.

## Validation and release evidence

Validated on 2026-09-15:

- Revised [design concept](../idea/design_concept.md) SHA-256: `a335e35c3a3575b063dc9303520da22fd055c64b93f725941a89116ac47fc6ff`.
- Generated `g01-candidate-v1.png`, then made one focused edit for edge color and engraving treatment. V2 is the preferred exploration candidate.
- V1 SHA-256: `c296465b26770a4ada54254350d049bf9991e9f4e643c45fa31f231a4a8a780d`.
- V2 SHA-256: `6774d73e47d8599504f86933812124fb69bbd94b34daf4df391143bfac6daa61`.
- Both candidates are 1254 by 1254 8-bit RGBA PNG files. V2 was inspected at master size and through a 160 by 160 Lanczos preview.
- Exact prompts, source, terms reference, hashes and review findings are recorded in [G01 provenance](../idea/assets/G01-engraved-silver-leaf/provenance.md), SHA-256 `69d98edfb7aae42e949bf0b7a6a6423848ea71270a31a88f923b1806acc96a8e`.
- 53 readable text files, 335 Markdown links and heading targets, and 89 Markdown tables checked with zero failures.
- Zero em dash violations found in authored files. The preserved client source exception remains unchanged.
- No paid service, deployment, API, database or frontend runtime dependency was introduced.

## Remaining work or blockers

None within prompt hardening and initial exploration. V2 still needs neutral-matte edge inspection, optimization and client review before production use. Client approval remains separate under [HADS-8](HADS-8.md).
