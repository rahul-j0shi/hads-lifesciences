# Repository rules

This folder owns all mandatory engineering conventions, agent instructions, templates and reusable workflows. Root `AGENTS.md` only points here. Explicit user scope governs the task; these rules define its execution.

## Mandatory writing rule: no em dashes

**Do not use em dashes (Unicode U+2014) anywhere in authored repository content.** This covers documentation, rules, skills, tickets, code comments/docstrings, UI text, API messages/examples, write-ups, designs and generated copy. Use a full stop, comma, colon, parentheses or a rewritten sentence instead. Do not hide the character behind an HTML entity or Unicode escape in rendered content.

Apply this rule when creating or editing any file and check changed content before completion. Preserve original supplied/reference assets; any adapted copy or newly generated asset must follow this rule. The automated verification gate must check authored text as specified in [delivery rules](delivery.md).

## Begin here

1. Read [repository conventions](repository.md) and the [start-to-ship workflow](workflow.md).
2. Open the active [ticket](../tracker/README.md) and its linked requirements/designs. Read the relevant latest test report.
3. Apply [engineering rules](engineering.md) and the concern-specific rules below. Resolve contract prerequisites before dependent implementation.

| Rules | Owns |
| --- | --- |
| [Repository](repository.md) | Naming, folder creation, document ownership, tickets, ADRs, skills and templates |
| [Workflow](workflow.md) | Intake, contract readiness, frontend/backend handoff, status and completion gates |
| [Engineering](engineering.md) | First principles, KISS/SOLID, classes/interfaces, naming and lifecycle |
| [API/DTO](api-design.md) | HTTP and DTO conventions, compatibility and contract changes |
| [Database](database-design.md) | Persistence specs, queries, invariants, migration and recovery |
| [Performance](performance.md) | Payload/runtime budgets, responsive rendering and caching |
| [Delivery](delivery.md) | Automatic verification, reports, CI and release checks |
| [Ticket template](templates/ticket.md) | Minimal reusable change record |

## Universal constraints

Keep one authoritative description per concern and link consumers to it. Update affected contracts before code and keep documents consistent with the delivered revision. Label planned work honestly. Keep secrets and private data out of source, fixtures, logs and reports. Add no speculative features, layers, dependencies or paid services. Future rules/skills belong under this folder and are indexed here.

## Zero-cost constraint

Until the owner explicitly changes this requirement, all deployed HADS hosting, infrastructure and enabled external services must cost **$0**. Use genuinely available free tiers within their terms and quotas; do not rely on paid trials, expiring credits, automatic overages or a future upgrade. Paid domains, larger machines, paid identity/email services and live payment processing with fees remain deferred. Use provider subdomains now; later domain mapping must not require application business-logic changes.

Quota exhaustion may reduce availability or suspend the prototype; it must not trigger spending. Verify account-level plans/limits and applicable usage eligibility before enabling a provider. If no eligible free configuration satisfies a feature, choose a free alternative or record the feature as blocked/deferred; never silently relax the budget. Prefer a portable application and explicit configuration so future hosting changes remain straightforward.
