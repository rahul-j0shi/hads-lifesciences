# HADS tracker

Status and readiness gates are owned by [workflow](../rules/workflow.md); file/ID conventions by [repository rules](../rules/repository.md).

| Ticket | Status | Scope | Dependencies |
| --- | --- | --- | --- |
| [HADS-1](HADS-1.md) | done | Repository grounding and architecture documentation | Owner image |
| [HADS-2](HADS-2.md) | planned | Implement and deploy the first connected branded slice | HADS-1, HADS-3; implementation phase; accounts/repository for deployment |
| [HADS-3](HADS-3.md) | done | Contract-first workflow and repository conventions | HADS-1 |
| [HADS-4](HADS-4.md) | done | No-em-dash writing rule and authored text cleanup | HADS-3 |
| [HADS-5](HADS-5.md) | done | Codebase learning guides and maintenance conventions | HADS-1, HADS-3 |
| [HADS-6](HADS-6.md) | done | Client design concept review and final design specification | HADS-1, HADS-5 |
| [HADS-7](HADS-7.md) | planned | Implement and release the public HADS Lifesciences website | HADS-2, HADS-6, HADS-8 for release |
| [HADS-8](HADS-8.md) | blocked | Client evidence, brand assets and design decisions intake | HADS-6; blocked on client input |

Next unallocated ID: HADS-9. Authentication and payments are future requirements, not active implementation tickets.

HADS-7 can be implemented before HADS-8 is answered, because every open design decision carries a recorded default. HADS-8 gates public release, not development.
