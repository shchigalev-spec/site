CONDITIONAL PASS

# Milestone C — Technical QA Review R4

Independent read-only review. No source, evidence, Git state, or reports were modified.

## Severity counts

- P0: 0
- P1: 0
- P2: 8
- P3: 0

## R3 blocker retest

All R3 P1 defects are corrected:

- Zone-only navigation from shift camp to Office/ABK produced `objectType=abk`, `zonesObjectType=abk`, office-only hidden zones, and a matching 201 multipart submission without stale shift-camp zones.
- Planner transfers before and after full-form interaction kept planner, store, visible form, hidden fields, and multipart body identical. Post-interaction transfer preserved contact and comment.
- Full-form `dorm → service` switching atomically changed metric, capacity, functional zones, store state, and multipart payload without stale dormitory or office values.
- Mini-brief object clearing now clears the full form and store.
- A transient `?type=kpp` override no longer inherits stale user-edit provenance after returning to a query-free route.
- Both relevant live routes render `Модульный состав — 105 одиночных модулей с крыльцами`; no residential classification or shortened unsupported wording remains.

## Consolidated non-blocking issues

1. **P2 — Public-origin validation remains duplicated and inconsistent.**
   `facts.ts` rejects non-local HTTP origins, while robots, sitemap, and privacy implement separate validators that accept arbitrary HTTP origins. `DIFF-SUMMARY.md` incorrectly describes this as centralized. Export and reuse one validated-origin implementation everywhere, then test a deliberately invalid/non-HTTPS production value.

2. **P2 — Office/ABK still lacks a verified realized case.**
   The route presents a clearly conceptual planning contour, not the strongest verified public Office/ABK case requested by the master specification. Keep the current non-invented treatment until a sourced case is available.

3. **P2 — Privacy policy remains explicitly unapproved.**
   The page states that legal bases, recipients, retention rules, and consent recording still require owner approval. Production lead acceptance must remain blocked until the final policy is approved.

4. **P2 — Multipart limits occur after full body materialization.**
   `/api/leads` calls `request.formData()` before application-level file limits. Configure and test an upstream proxy/platform body limit that rejects oversized requests before materialization.

5. **P2 — No focused automated tests.**
   `npm test` passes through `vitest run --passWithNoTests`. Add tests for context/type-aware zones, transfers, lead parsing, modes, attribution, analytics privacy, and SEO endpoints.

6. **P2 — No retained production performance report.**
   Evidence contains no reproducible mobile-4G LCP/CLS, long-task, or main-thread measurements. Capture these from the production build before the final gate.

7. **P2 — Required documentation remains absent.**
   Missing: `apps/a-modul/README.md`, `docs/A-MODUL-DESIGN-SYSTEM.md`, `docs/A-MODUL-MOTION-SPEC.md`, and `docs/A-MODUL-LAUNCH-CHECKLIST.md`.

8. **P2 — Evidence lacks raw command output and exact changed-file inventory.**
   `TEST-RESULTS.md` summarizes outcomes, while `DIFF-SUMMARY.md` lists correction groups rather than a complete milestone inventory. Retain raw outputs and an exact inventory for the final package.

## Additional live verification

- 16/16 combinations passed across four primary routes at 320, 390, 768, and 1440 px: status 200, one H1, visible initial CTA, no overflow, no loaded broken images, no missing intrinsic dimensions, no unlabeled controls, and no runtime warnings/errors.
- Tested query variants returned 200 with `noindex,follow` and base-route canonicals.
- Tender mode rendered dedicated company, tender name, deadline, and region fields without the generic project-stage field.
- Client errors remained visible and associated.
- A forced 503 preserved object, capacity, area, date, stage, region, scope, leasing choice, comment, contacts, attachment, and zones.
- Root redirect preserved UTM campaign data and `yclid`.
- Sitemap, robots, privacy, branded 404, structured metadata, and reduced-motion static content passed live inspection.
- Current `qa-results.json` records PASS with zero assertions and zero runtime defects; current evidence records passing typecheck, lint, test command, and production build.

## Inspected material

Complete master specification, fast override, repository rules, R3 reports, Milestone C specification/results/diff/verdict, responsive and form-state screenshots, both trace archive manifests, source-facts and integration contracts, project-context store, planners/configurator, mini/full forms, lead endpoint/adapter, analytics, routing, metadata, sitemap, robots, privacy, and 404 implementation.

## Verdict

**CONDITIONAL PASS.** No P0 or P1 remains, so Milestone C may proceed under the fast milestone gate. The eight P2 items should remain in the polish backlog and be resolved or explicitly carried into the final release gate.
