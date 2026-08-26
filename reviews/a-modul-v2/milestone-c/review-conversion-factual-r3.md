BLOCKED

# Milestone C R3 — Conversion + Factual Review

Independent read-only review. No files, evidence, Git state, or reports were modified.

## Consolidated issues

### P1 — Explicit diagnostic transfer fails after the full form has been touched

Location:

- `FullLeadForm.svelte:30,60,87`
- `RoutePlanner.svelte:73`
- equivalent configurator handoff

Live evidence at `/modulnye-ofisy-abk/`:

1. Focused and filled the full-form phone field; the form then contained the route default of 50 workplaces.
2. Selected 300 workplaces in the planner, removed `Переговорные`, and activated `Передать сценарий в диагностику`.
3. The mini-brief and shared store changed to 300, and hidden zones changed correctly.
4. The full form remained at 50 workplaces because `formInteracted` permanently disables `syncFromContext`.
5. The intercepted multipart submission contained `personnelCount=50`, `capacityMetric=workplaces`, and the newly selected zones; it did not contain 300.

Why this blocks Milestone C:

The CTA explicitly promises to transfer the selected scenario, but the submitted lead combines the old scale with the new composition. This violates the required complete planner/configurator transfer and serialization contract.

Required correction:

Make explicit transfer a transactional action that updates the full-form object/metric/capacity/zones/region even after prior form interaction, while preserving unrelated contact, comment, scope, consent, and file state.

Retest:

Run planner and general configurator handoffs both before and after full-form interaction and inspect the actual multipart body.

### P1 — Changing object type in the full form submits incompatible hidden functional zones

Location:

- `FullLeadForm.svelte:93`
- `FullLeadForm.svelte:244`

Live evidence at `/modulnye-ofisy-abk/`:

1. The route initialized as `Офис / АБК` with office zones.
2. Changed only the full-form object to `Общежитие`.
3. Visible fields changed to `dorm`, `people`, and 100.
4. Hidden `functionalZones[]` remained office values.
5. The intercepted multipart request contained:

   - `objectType=dorm`
   - `capacityMetric=people`
   - `personnelCount=100`
   - `Рабочие места`
   - `Переговорные`
   - `Серверная / электрощитовая`

Why this blocks Milestone C:

The CRM receives a factually contradictory project diagnosis. The form’s local object state and the shared composition state are not reconciled.

Required correction:

When object type changes in the full form, atomically replace or clear incompatible zones and synchronize the corresponding metric/capacity context. Do not submit stale zones from another object type.

Retest:

Change every route default to each other object type and inspect the visible form, hidden fields, shared context, and multipart payload.

### P1 — The live Kamchatka case still implies an unsupported residential classification

Location:

- `ProofCase.svelte:22`
- live on `/vahtovye-poselki/` and the general route

Live copy:

`Жилая часть — 105 модулей с крыльцами`

Locked factual register:

`105 одиночных модулей с крыльцами`

The source register does not classify all 105 as residential. Although `routes.ts` and `ProjectFinder.svelte` now contain the corrected phrase, those values are not used by the live shift-route dominant case.

Why this blocks Milestone C:

This is the same unsupported residential implication raised in R2 and appears beside real project facts. Unsupported public claims are a hard factual failure.

Required correction:

Use `105 одиночных модулей с крыльцами` in every rendered occurrence and replace the unsupported `Жилая часть` label with source-neutral wording.

Retest:

Search source and rendered bodies for every `105` occurrence; confirm the exact approved wording and absence of residential/vestibule substitutions.

### P2 — Clearing the mini-brief object leaves a stale object in the full form

Location:

- `MiniBrief.svelte:64–66`

Live evidence:

Selecting `Вахтовый посёлок` and then returning the mini-brief selector to `Выберите задачу` leaves the mini-brief empty while the full form and session store remain `shift`.

Required correction:

Add a real clear operation for shared object context or remove the selectable empty option after a valid choice.

### P2 — Office/ABK route still has no verified case

Location:

- `routes.ts:79–81`
- `/modulnye-ofisy-abk/`

The route presents generic planning copy as `Релевантный контур`, not the strongest verified public office/ABK case required by the master specification.

Required correction:

Add a sourced public office/ABK case when one is verified. Continue using clearly labelled generated visualization and do not invent project facts meanwhile.

### P2 — Privacy policy remains explicitly unapproved

Location:

- `/privacy-policy/`
- `privacy-policy/+page.svelte:106–111`

The consent target itself states that legal bases, recipients, retention terms, and consent-recording rules still require owner approval.

Required correction:

Keep production lead acceptance blocked until the responsible owner approves the final policy and consent wording.

### P2 — Query intent and user-edited provenance are not distinguishable

Location:

- `projectContext.ts:250–271`

Live sequence:

1. User explicitly selects `shift`.
2. `?type=kpp` correctly forces `service`.
3. Navigating to query-free `/modulnye-ofisy-abk/` retains `service` because the old `edited.objectType=true` flag survives, although the stored value was replaced by transient query intent.

Required correction:

Track provenance as route default, query intent, or user edit, or otherwise define and enforce transient-query exit behavior. A query override should not silently inherit unrelated user-edit status.

## Severity counts

- P0: 0
- P1: 3
- P2: 4
- P3: 0

## Confirmed passing areas

- Generic route starts with neutral object, region, and capacity.
- Region-only and capacity-only edits preserve independent field provenance across ordinary route changes.
- Explicit object selection is preserved across ordinary routes.
- Current-route query type and region variants take precedence.
- Planner transfer before form interaction correctly reaches visible fields, hidden zones, `capacityMetric`, and multipart payload.
- All entered dynamic fields and the attached file survive client validation, 422, controlled 503, and malformed-response handling.
- Company, phone, and comment 422 errors are visible, associated through `aria-describedby`, and marked `aria-invalid=true`.
- Hero tender CTA reaches `?mode=tender#full-brief`, renders dedicated tender fields, and scrolls to the form.
- Leasing CTA reaches the dedicated leasing state with the interest flag selected.
- Root 307 redirect preserves type, region, all UTM fields, and `yclid`; fresh-session attribution records `landing_variant=type:office`.
- The Project Finder uses `105 одиночных модулей с крыльцами`.
- All four route H1s, primary CTAs, and one-day qualifiers fit inside 320×568.
- Browser verification found meaningful content, one H1, no error overlay, and no console/page errors in the inspected flows.

## Inspection coverage

Live routes and variants:

- `/modulnye-zdaniya/`
- `/vahtovye-poselki/`
- `/modulnye-ofisy-abk/`
- `/modulnye-obshchezhitiya/`
- root attribution redirect
- `?type=kpp`
- `?type=office&region=sibir`
- tender and leasing modes

Viewports:

- 1440×1000
- 320×568
- supplied 1440, 390, and 320 evidence

Interactions:

- neutral start
- region-, capacity-, and object-provenance flows
- query precedence
- planner scale and zone transfer
- full-form object switching
- client validation
- 422, 503, and malformed responses
- file retention
- tender and leasing navigation
- actual multipart interception

Evidence inspected:

- `SPEC.md`
- `TEST-RESULTS.md`
- `DIFF-SUMMARY.md`
- `VERDICT.md`
- `qa-results.json`
- desktop/mobile, tender, leasing-error, server-validation, and form-state images
- both trace-package manifests
- historical initial and R2 reviewer reports

Specifications and factual sources inspected:

- complete master specification
- complete fast-execution override
- repository `AGENTS.md`
- source-facts register
- search-intent map
- content TODO
- integration and analytics contracts

## Independent verdict

**BLOCKED.** Milestone C has three P1 issues and must not proceed to Milestone D. After correcting them, rerun deterministic QA and invoke a fresh Conversion + Factual reviewer.
