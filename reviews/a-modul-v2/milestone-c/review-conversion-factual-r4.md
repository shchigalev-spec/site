CONDITIONAL PASS

# Milestone C R4 — Conversion + Factual Review

Independent read-only review. No files, evidence, Git state, or reports were modified.

## Severity counts

- P0: 0
- P1: 0
- P2: 3
- P3: 1

## Consolidated issues

### P2 — Office/ABK route still lacks a verified realized case

Location:

- `routes.ts`
- `/modulnye-ofisy-abk/`

The route presents a clearly conceptual planning contour and generated visualization, not the strongest verified public office/ABK case required by the master specification.

Required correction:

Add a sourced case when one is verified. Do not invent project parameters meanwhile.

### P2 — Privacy policy remains awaiting owner approval

Location:

- `/privacy-policy/`
- `privacy-policy/+page.svelte:104–110`

The page explicitly states that legal bases, recipients, retention periods, and consent-recording rules require final owner approval.

Required correction:

Keep production lead acceptance blocked until the final policy and consent wording are approved.

### P2 — Explicit transfer CTAs return to the compact mini-brief

Location:

- `RoutePlanner.svelte:75`
- `ObjectConfigurator.svelte:123`

Live evidence:

Both transactional transfers correctly refresh the full form, but navigation ends at `#project-brief`, above the configurator/planner, rather than at the updated `#full-brief`. This asks the user to revisit overlapping inputs after completing a more detailed scenario.

Required correction:

Consider sending these explicit transfer CTAs directly to `#full-brief`, while retaining the current transactional context update.

### P3 — Dormant shift-case copy retains a residential grouping

Location:

- `routes.ts:59`

The unused shift `caseIntro` says the case contains “жилых” modules. It is not rendered by the current shift route, and every live `105` occurrence is correct, but this dormant copy could reintroduce the unsupported classification if reused.

Required correction:

Replace it with source-neutral composition wording.

## Critical R3 blocker retests

### Planner transfer after full-form interaction — PASS

Live `/modulnye-ofisy-abk/?region=sibir` scenario:

- Full form was populated with company, name, phone, email, comment, scope, consent, and an attached PDF.
- Local form capacity and region were changed.
- Planner changed to 300 workplaces and removed `Переговорные`.
- Explicit transfer refreshed the full form to:
  - `objectType=abk`
  - `capacityMetric=workplaces`
  - `personnelCount=300`
  - `region=siberia`
  - office zones without `Переговорные`
- All unrelated entered fields and the file remained intact.
- Intercepted multipart body exactly matched the visible form and hidden zones.

### General configurator transfer after full-form interaction — PASS

Live `/modulnye-zdaniya/?region=krasnoyarsk` scenario:

- An already-touched form was transferred to:
  - `objectType=shift`
  - `capacityMetric=people`
  - `personnelCount=500`
  - `region=far-east`
  - shift composition without `Столовая`
- Company, name, phone, email, comment, scope, consent, and PDF remained intact.
- Actual multipart fields matched the transferred scenario.

### Full-form object switching — PASS

Each object type was selected and submitted independently:

- `shift` → people metric and shift zones
- `dorm` → people metric and dormitory zones
- `abk` → workplaces metric and office zones
- `service` → area metric, blank personnel, and service zones

No incompatible zone survived in any visible state, hidden input, or multipart payload.

### Cross-route zone isolation — PASS

After an office-only zone edit, navigation to `/modulnye-obshchezhitiya/?region=sibir` produced:

- `objectType=dorm`
- `capacityMetric=people`
- complete dormitory composition
- no `Переговорные` or other office-only zone

The submitted multipart body remained coherent.

### Kamchatka wording — PASS

Every rendered `105` context on the general and shift routes used:

`105 одиночных модулей с крыльцами`

No live occurrence of `Жилая часть — 105`, `105 жилых`, or `105 модулей с тамбурами` was found.

## Adjacent regression coverage

Confirmed passing:

- Query `type=kpp` forces the service context, and leaving it for the query-free office route restores the office default.
- Clearing the mini-brief object clears the full-form object and hidden composition.
- All four primary routes return 200, contain one H1, the primary CTA, and the one-day qualifier.
- Tender CTA resolves to `?mode=tender#full-brief` with dedicated tender fields.
- Leasing CTA resolves to `?mode=leasing#full-brief` with leasing selected.
- Controlled 503 preserves object, capacity, region, stage, scope, comment, phone, consent, and attachment.
- Root 307 redirect preserves type, region, UTM source/campaign, and `yclid`.
- No unexpected console warnings, console errors, or page errors occurred in the inspected flows.

## Sources and evidence inspected

- Complete master specification
- Complete fast-execution override
- Repository `AGENTS.md`
- `docs/A-MODUL-SOURCE-FACTS.md`
- Historical Conversion + Factual R3 and Technical QA R3 reports
- Milestone C `SPEC.md`, `TEST-RESULTS.md`, `DIFF-SUMMARY.md`, `VERDICT.md`, and `qa-results.json`
- Current form, tender, leasing, validation, route, and trace evidence
- Project-context store, planner, configurator, mini/full forms, route composition, case copy, facts, navigation, attribution, and lead submission source

## Independent verdict

**CONDITIONAL PASS.** All R3 P1 defects are corrected, and no P0 or P1 issue remains. Milestone C may proceed under the fast milestone gate; the listed P2/P3 items should remain in the polish backlog.
