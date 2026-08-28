# R2 Conversion + Engineering/Factual review — initial

Verdict: **FAIL**

- P0: 0
- P1: 4
- P2: 2
- P3: 0

## Consolidated issues

- P1 — a sea route could remain active after the shared project region changed to Moscow.
- P1 — generic `Россия` exposed the conditional winter-road mode.
- P1 — the similar-project CTA injected default capacity and every default zone, including fields not published in the source case.
- P1 — `not-published` values were counted as positive similarity evidence.
- P2 — comparison explanations named dimensions but did not show requested versus published values.
- P2 — a region-only project summary rendered an empty capacity value.

The reviewer independently checked the live UI, CRM/context flow, source register and official A-Modul pages. No files were changed by the reviewer.

## Builder response

All six issues were fixed as one batch. Logistics modes now revalidate whenever shared region state changes; generic Russia exposes only road, rail and combined checks. Case transfer now uses one factual-context operation, retains only a published compatible capacity and carries no inferred zones. Unknown values never score as matches, comparison copy shows both requested and published values, and missing fields are stated as needing clarification. Regression scenarios were added to deterministic QA and the project-context unit tests.
