# Milestone C — Conversion + Factual Review

Independent read-only reviewer: fresh native subagent.

## Scope inspected

Both authoritative specifications, repository rules, Milestone C evidence and live application; all routes and required variants; forms, modes, files, SEO endpoints, privacy, 404, CRM, analytics, attribution, structured data, source facts and generated-image disclosures.

## Consolidated issues

| Severity | Location | Evidence | Required correction |
|---|---|---|---|
| P1 | `routes.ts`, `projectContext.ts`, `MiniBrief.svelte`, `FullLeadForm.svelte` | Only three of seven required region parameters are mapped; absent/generic URLs can silently enter forms as Far East, exact region labels collapse to macroregions, session state can override query context, and exact object intent such as КПП becomes generic `service`. | Implement all seven exact public regions; keep campaign region and macroregion distinct; start without an invented region; let URL override stored defaults; preserve exact region/type visibly, in CRM and analytics. |
| P1 | `analytics.ts` and interactive components | Eleven required events are declared but not emitted by configurator, finder, logistics, BIM, factory or price-scope interactions. | Instrument every required boundary with safe properties and assert all required events. |
| P1 | `RouteLanding.svelte` and secondary routes | Route-specific buying narratives are incomplete; shift lacks its mandatory chapters and seismic proof; office/dorm lack their required decision content; general lacks the five-step post-application process. | Complete verified route-specific narratives and the one-day proposal process. |
| P2 | Direct `?mode=tender` hydration | Server response initially renders the standard form before client tender state settles. | Resolve mode in server data and SSR the correct form. |
| P2 | Contacts/configuration | Public phone/email env values are ignored and fallback formatting differs from the specification. | Centralize validated public contacts with exact approved fallbacks. |

## Severity counts

- P0: 0
- P1: 3
- P2: 2
- P3: 0

P0=0. P1 is not zero.

## Verdict: FAIL
