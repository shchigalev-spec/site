# Milestone C evidence summary

The evidence is newly captured from the Milestone C implementation and is not copied from an earlier milestone.

- `desktop-1440.png`, `mobile-390.png`, and `mobile-320.png` show the complete general route at the required widths.
- `route-vahtovye-poselki-desktop.png`, `route-modulnye-ofisy-abk-desktop.png`, and `route-modulnye-obshchezhitiya-desktop.png` show each distinct route, its unique hero, route case context, FAQ, and full form.
- `start.png` shows the untouched full form.
- `mid.png` shows the deterministic validation state before a request is accepted.
- `end.png` shows the server-confirmed success state with the exact required copy and generated request reference.
- `form-states.webp` places those three states side by side; `diff-start-end.png` is an amplified pixel delta between normalized start and end frames.
- `tender.png` proves the direct hero-to-tender full-form destination and dedicated fields.
- `leasing-error.png` proves the leasing mode and stable entered state after controlled CRM failure.
- `server-validation.png` proves visible, associated 422 field errors.
- `reduced-motion.png` records the initial mobile hero under `prefers-reduced-motion: reduce`.
- Video is intentionally not used. `playwright-trace.zip` supplies the route/responsive chronology; `conversion-trace.zip` covers diagnostic transfer, validation, tender, leasing, and submission flows.

## R2 correction inventory

- `src/lib/state/projectContext.ts`, `MiniBrief.svelte`, `ObjectConfigurator.svelte`, `RoutePlanner.svelte`, `RouteLanding.svelte`: neutral generic-route state, per-field/type-aware zone provenance, explicit transfer revision, real clear operation, and complete transactional planner/configurator transfer.
- `FullLeadForm.svelte`, `src/lib/server/lead-adapter.ts`: stable form state, complete server-error mapping, `capacityMetric`, repeated `functionalZones[]`, and preservation after client/422/503/network failures.
- `RouteHero.svelte` via `src/lib/navigation.ts`, plus `src/routes/+page.server.ts`: direct tender destination and allowlisted attribution through the root redirect.
- `ProjectFinder.svelte`, `src/lib/content/routes.ts`: exact verified 105-module case wording.
- `ProofCase.svelte`: source-neutral `Модульный состав` label and exact `105 одиночных модулей с крыльцами` wording.
- `src/lib/content/facts.ts`, route metadata/schema endpoints: one validated public origin for canonical, OG, structured-data, sitemap, robots, and privacy URLs.
- `.env.example`, `docs/A-MODUL-INTEGRATION.md`: adapter-node `ORIGIN` and trusted-proxy production contract.
- `LogisticsMap.svelte`: delayed transition cancellation on replacement/unmount.
- `scripts/verify-a-modul-milestone-c.mjs`: neutral-context, field and zone provenance, pre/post-interaction planner/configurator transfer, type-safe multipart composition, state-retention, 422, redirect-attribution, tender destination, warning capture, screenshots, and conversion trace assertions.
