# HADS-8: Client evidence, brand assets and design decisions intake

Status: blocked
Owner: client, coordinated by the repository owner
Dependencies: [HADS-6](HADS-6.md)
Scope: collect the client inputs that gate public release of the website, and record each answer against its claim ID or decision ID
Out of scope: implementation, hosting, and any legal or medical determination, which only the client's qualified reviewer can make
Context: [design concept](../idea/design_concept.md) sections 3.6, 5.3, 5.5, 11.1 and 12.4; [client details](../idea/details.md); [client artwork](../idea/image.png)

## Plan and impact

This ticket exists so that the publication prerequisites have an owner and a place to land. Nothing here blocks [HADS-7](HADS-7.md) from being implemented, because every open decision has a recorded default. All of it blocks the page going public with client copy.

| Area | Canonical link and change, or none with reason |
| --- | --- |
| Product/UI | Answers update the copy tables and claim register in the [design concept](../idea/design_concept.md); the layout does not change |
| API | None: intake and approvals only, no wire contract |
| Database | None: answers are recorded in documents, not stored by the application |
| Operations | Brand assets land under `idea/assets/` with the provenance note in design concept section 11.9 |

Contract gate: not applicable; no application change.
Review: each answer is recorded with the date received and who supplied it.

## Acceptance criteria

Evidence and approvals

- [ ] Claims C01 to C15, C17 and C19 each have a written client decision: approved as proposed, approved with revised wording, or held.
- [ ] C13: all sixteen portfolio cells reviewed, including the high-attention terms listed in design concept section 8.6.
- [ ] C16: the contact mailbox recorded in design concept section 5.3 confirmed correct and actively monitored. The address itself stays in `idea/`, which is not published; see [README](../README.md#not-in-this-repository).
- [ ] C20: the target market or markets confirmed, and any mandatory disclaimer supplied in the reviewer's own wording.
- [ ] The seven questions in design concept section 5.5 answered by a qualified reviewer for that market.

Assets

- [ ] B01: approved master logo lockup and simplified header mark supplied, or the plain-text fallback explicitly accepted.
- [ ] B02: the four emblem masters supplied, or their omission explicitly accepted.
- [ ] Any supplied or generated asset stored under `idea/assets/<asset-id>-<short-name>/` with a complete provenance note, including license terms and whether commercial use is permitted.

Decisions

- [ ] Open decisions D1 to D7 in design concept section 3.6 each answered, or the recorded default explicitly accepted.

## Validation and release evidence

None yet. No client response has been received or recorded. Record each answer with its date and source as it arrives, and update the corresponding claim or decision row in the [design concept](../idea/design_concept.md) in the same change.

## Remaining work or blockers

Blocked on client input. Next action: send the client the seven open decisions from design concept section 3.6, the held claims from its section 5.3, the seven reviewer questions from its section 5.5, and the asset requests B01 and B02. No item here can be resolved by the development team.
