# HADS-10: Harden image prompts and generate the first asset candidate

Status: in-progress
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
- [ ] Generate and save one G01 candidate in its designated local asset folder.
- [ ] Record the exact prompt, generation route, date and review status beside the candidate.
- [ ] Inspect the candidate at full size and reduced display size.
- [ ] Validate documentation links, tables and the no-em-dash rule.

## Validation and release evidence

Pending generation and inspection.

## Remaining work or blockers

Generate and inspect G01. Client review remains separate under HADS-8.
