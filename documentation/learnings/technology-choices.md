# Understanding HADS technology choices

Purpose: help contributors find and interpret the reasons behind stack/provider choices. Status: planned prototype; no payment gateway selected. Context: [HADS-5](../../tracker/HADS-5.md).

## Start with constraints

The owner chose Python, React and MongoDB and requires a lightweight prototype that runs at $0. Those constraints narrow the options before framework preferences matter. “Free” is both an account/usage condition and a capacity limit; a technically compatible provider still has to satisfy the [zero-cost rule](../../rules/README.md#zero-cost-constraint).

## Why these parts fit together

| Choice/question | HADS reasoning | Authoritative detail |
| --- | --- | --- |
| React frontend and Python API | Match owner language choices; keep the UI and HTTP service independently deployable | [ADR-001](../decisions.md#adr-001-small-modular-application) |
| FastAPI and typed DTOs | Keep Python boundary validation and the API contract explicit | [API rules](../../rules/api-design.md) |
| MongoDB | Owner-selected storage; the first slice only verifies its connection | [Database design](../../database-design/README.md) |
| One small backend | The current behavior does not need independently operated services | [Architecture](../architecture.md) |
| HTTP caching first | Reuse ordinary response caching before introducing another service to configure and maintain | [Performance rules](../../rules/performance.md#caching-plan-http-first) |
| Netlify and Render, not Vercel | Hosting must satisfy plan eligibility as well as technical fit. Vercel Hobby forbids commercial use, which this project is, so it was rejected despite supporting FastAPI | [Hosting decisions](../decisions.md#adr-002-zero-budget-hosting), [Vercel rejection](../decisions.md#adr-005-vercel-resource-assumptions) |
| External identity later | Login entails more than a form; delegate identity functions rather than invent security primitives | [Identity decision](../decisions.md#adr-004-use-external-identity-and-payment-providers-later) |

Current prices, quotas and configuration commands stay in the linked decision/runbook documents. Copying them into a tutorial would create another place to become outdated.

## Why this payment gateway?

There is no selected gateway yet. The existing plan describes a provider boundary and hosted checkout approach, not an endorsement of a particular company. Keycloak is an identity candidate, not a payment gateway.

When payment requirements arrive, the decision needs evidence about supported business/country/currency, sandbox availability, fees, checkout experience, webhook verification, retries, refunds and reconciliation. Any paid live processing remains outside the current budget. The [integration design](../security-and-integrations.md#payments-planned-provider-boundary) records the existing scope and safety properties.

Once a provider is selected, its ADR will explain the actual alternatives and tradeoffs. A learning guide can then walk through a concrete HADS checkout and explain why redirects, webhooks and order state have different roles. Writing that justification today would invent a decision.

## When a choice should change

A new requirement or measured limitation can justify revisiting a choice. First record the evidence and update the relevant decision/contract through the [workflow](../../rules/workflow.md); then update the explanation here. A tutorial is not a place to introduce an unreviewed architecture change.
