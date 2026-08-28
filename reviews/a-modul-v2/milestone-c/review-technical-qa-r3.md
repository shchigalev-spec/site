BLOCKED

# Milestone C — Technical QA Review R3

Fresh independent read-only review. No files, evidence, code, or Git state were modified.

## Consolidated issues

| Severity | Location | Evidence | Required correction and retest |
|---|---|---|---|
| P1 | `projectContext.ts` → `applyLandingDefaults`, `RoutePlanner.svelte`, `FullLeadForm.svelte` | Functional-zone provenance is not tied to the originating object type. Live reproduction: on `/vahtovye-poselki/`, remove `Столовая`, then navigate to `/modulnye-ofisy-abk/`. Both forms correctly switch to `abk`, but hidden `functionalZones[]` still contain `Общежития`, `БПК`, `Медпункт`, `КПП`, `Переходы`, etc. Meanwhile the visible office planner shows a different office-zone set. Submitting without retransferring the planner can therefore send `objectType=abk` with a shift-camp composition. | Bind edited zones to their object type. When a route default changes an untouched object type, replace incompatible zones with that type’s composition; preserve edited zones only while their originating object remains active. Keep planner, shared context, visible summary, hidden fields, and multipart body identical. Retest a zone-only edit across routes and inspect the posted body. |
| P1 | `ProofCase.svelte:22`, live `/modulnye-zdaniya/` and `/vahtovye-poselki/` | The R2 factual blocker is only partially fixed. `routes.ts` and `ProjectFinder.svelte` now use `105 одиночных модулей с крыльцами`, but the dominant case still renders `Жилая часть — 105 модулей с крыльцами`. This retains the unsupported residential interpretation explicitly rejected in R2. | Use the exact verified wording `105 одиночных модулей с крыльцами` everywhere, and remove or source the `Жилая часть` classification. Search all public case copy, then retest both live routes. |
| P2 | `facts.ts`, `robots.txt/+server.ts`, `sitemap.xml/+server.ts`, `privacy-policy/+page.svelte` | Absolute-origin handling is still duplicated. `publicSiteOrigin` rejects non-local HTTP, while robots, sitemap, and privacy accept any HTTP URL. A misconfigured `PUBLIC_SITE_URL=http://example…` can produce HTTPS canonicals but HTTP sitemap/privacy URLs. | Use one exported validated origin implementation for canonical, OG, JSON-LD, robots, sitemap, and privacy. |
| P2 | Office/ABK route content | The route still presents a generic planning contour and conceptual visualization rather than the strongest verified public office/ABK case required by the master specification. | Add a sourced office/ABK case, or explicitly record the unresolved factual dependency without implying a realized case. |
| P2 | `/privacy-policy/` | The public consent target itself says the final legal text, legal bases, recipients, retention terms, and consent-recording process remain unapproved. | Keep production lead acceptance blocked until the owner-approved policy is installed and reviewed. |
| P2 | `/api/leads/+server.ts` | File/count/size validation occurs only after `request.formData()` has materialized the complete multipart body. Documentation requests upstream controls, but no deployment limit is configured or evidenced. | Enforce a body limit at the trusted proxy/platform boundary and test rejection before application materialization. |
| P2 | `apps/a-modul/package.json` | `npm test` passes solely through `vitest run --passWithNoTests`; there are no focused automated tests. | Add tests for context precedence/type-aware zones, lead parsing/error normalization, modes, analytics privacy, attribution, and SEO endpoints. |
| P2 | Milestone C evidence | No retained reproducible LCP, CLS, mobile-4G, long-task, or main-thread report exists. My local throttled smoke produced LCP 648 ms, CLS 0.001, and no long tasks, but localhost/dev-server results do not replace release evidence. | Capture reproducible production-build performance evidence before the final gate. |
| P2 | Required documentation | `apps/a-modul/README.md`, `docs/A-MODUL-DESIGN-SYSTEM.md`, `docs/A-MODUL-MOTION-SPEC.md`, and `docs/A-MODUL-LAUNCH-CHECKLIST.md` remain absent. | Create the required documents and ensure they describe the actual implementation. |
| P2 | `TEST-RESULTS.md`, `DIFF-SUMMARY.md` | The summary records outcomes but not raw command output; the diff inventory lists correction groups rather than a complete changed-file inventory. | Retain command output and an exact milestone changed-file inventory for the final evidence package. |

## Severity counts

- P0: 0
- P1: 2
- P2: 8
- P3: 0

## Confirmed passing areas

- All four primary routes returned 200 at 320×568, 390×844, 768×1024, and 1440×1000, with one visible H1, initially visible primary CTA, zero horizontal overflow, and no console warnings/errors.
- Required query variants remained `noindex,follow` and canonicalized to their base routes.
- Neutral general-route state and independent object/region/capacity provenance passed the tested scenarios.
- Office planner scale and selected zones reached the forms and actual multipart body.
- Client/503 state retention preserved object, capacity, area, date, stage, scope, leasing, comment, contacts, zones, and attachment.
- Individual 422 paths for company, phone, comment, personnel, and area rendered associated errors, set `aria-invalid=true`, and focused the correct control.
- Hero tender CTA landed directly at `?mode=tender#full-brief`; tender SSR and dedicated fields were present.
- Root attribution preserved UTM campaign data and `yclid`.
- Adapter-node production smoke with `ORIGIN=http://127.0.0.1:4177` reached application handling, returned controlled `503 CRM_CONFIGURATION_ERROR`, and preserved form state.
- Sitemap, robots, privacy, branded 404, structured metadata, reduced-motion state, loaded images, and analytics privacy paths were inspected without runtime defects.

## Evidence and implementation inspected

Reviewed the full Milestone C evidence folder, including responsive route captures, start/mid/end and form-state evidence, tender/leasing/server-validation captures, `qa-results.json`, and both Playwright trace archives. Inspected the project-context store, all four route loaders/pages, route content/facts, mini/full forms, planners/configurator, lead endpoint and adapter, analytics, navigation, SEO endpoints, privacy/404, environment example, integration documentation, current R2 reports, review log, and polish backlog.

## Independent verdict

**BLOCKED.** Milestone C cannot proceed while the type-incompatible functional-zone payload and remaining unsupported 105-module case classification are present.
