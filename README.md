# HADS Lifesciences

Architecture foundation for a zero-budget prototype. **Planning only: no application, test runner, CI workflow, or deployable build exists yet.** Start implementation with [HADS-2](tracker/HADS-2.md) for the foundation slice, then [HADS-7](tracker/HADS-7.md) for the public website.

## Start here

1. Read [repository rules](rules/README.md).
2. Use [learning guides](documentation/learnings/README.md) for concepts, then read [image analysis and scope](documentation/product-direction.md).
3. For website work, read the [design concept](idea/design_concept.md). It owns the visual system, page copy, accessibility requirements and asset briefs.
4. Follow [architecture](documentation/architecture.md) and the linked component contracts.
5. Use the [hosting guide](documentation/setup-and-hosting.md) when the foundation slice is implemented.
6. Track delivery in [tracker](tracker/README.md).

## Ownership map

| Folder | Owns |
| --- | --- |
| [idea](idea/README.md) | Original client image and brief, plus the [design concept](idea/design_concept.md) that interprets them |
| [documentation](documentation/README.md) | Product interpretation, architecture decisions, operations |
| [rules](rules/README.md) | All engineering rules, agent instructions, future skills and workflow conventions |
| [frontend](frontend/README.md) | React implementation, UI tests, frontend configuration |
| [backend](backend/README.md) | Python implementation, backend tests, reports and configuration |
| [api-design](api-design/README.md) | HTTP contract, OpenAPI and request examples |
| [database-design](database-design/README.md) | Collection metadata, validators, indexes and schema evolution |
| [infrastructure](infrastructure/README.md) | Shared deployment wiring and optional local containers |
| [tracker](tracker/README.md) | HADS-numbered tickets, dependencies and evidence |

## Not in this repository

`idea/` is deliberately excluded from version control. It holds the client's unreleased logo artwork, their content brief, and `design_concept.md`, the authoritative design specification for the public website. Documents here link to it with ordinary relative paths, so those links resolve in a local working copy and return a 404 on the hosted repository. That is expected, not a broken link.

Anyone implementing [HADS-7](tracker/HADS-7.md) needs that folder. Request it from the repository owner and place it at `idea/` in your working copy. Local credentials live in `backend/.env` and `frontend/.env`, also excluded; copy the committed `.env.example` files and fill them in.

Empty `api design`, `database design`, and `docker` directories were renamed to `api-design`, `database-design`, and `infrastructure`. `idea` stays unchanged for incoming write-ups. Application code stays in its respective frontend/backend folder. Root contains navigation and repository tooling only.
