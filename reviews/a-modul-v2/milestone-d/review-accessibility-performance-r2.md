Milestone D R2 Accessibility + Performance Director — consolidated independent review.

Severity counts:

- P0: 0
- P1: 0
- P2: 1
- P3: 0

## P2 — File picker accessible name does not contain its visible action label

Location: `apps/a-modul/src/lib/components/FullLeadForm.svelte:290`.

Evidence:

- The visible action says `Выбрать файлы`.
- That span is `aria-hidden="true"`.
- The production accessibility tree exposes the native control as: `Исходные файлы Файлы не выбраны PDF, DOCX…`; it omits `Выбрать файлы`.
- Pointer activation opens the native multiple-file chooser, and keyboard focus produces a visible outline, but speech-input users cannot reliably address the control by the action text they see.

This breaks label-in-name consistency and weakens the required localized native-file accessibility.

Required correction:

- Give the native input an accessible name containing the exact visible phrase `Выбрать файлы`, while keeping `Исходные файлы` as context and status/instructions in `aria-describedby`.
- Retest the accessibility tree, pointer and keyboard chooser activation, visible focus, and selected-file announcement.

Because Milestone D requires an explicit PASS with no material unresolved accessibility issue, this localized defect prevents PASS despite being a small correction.

## Confirmed areas

- Reviewed the complete original specification, fast override, current source, R1 report, final evidence, valid traces, command log, release results, review history, launch prerequisites, and changed-file inventory.
- The inventory has no missing current path; its only extra entries are the three explicitly anticipated R2 reports.
- Independently exercised production routes, mobile rendering, privacy, 404, mobile-menu focus trap/Escape/focus return, risk/factory keyboard tabs, empty standard/tender/leasing forms, normal Hero/BIM motion, and API error paths.
- Empty-form focus now follows DOM order: `objectType` for standard/leasing and `company` for tender, visible after focus scrolling on desktop and mobile. Alerts, `aria-invalid`, descriptions, and retained state are present.
- Active-stage text now uses `#a8e1d4` on `#492d7d`, approximately 7.36:1.
- Hero and BIM sequences cancel offscreen and hold their current stage; replay restarts from stage zero. Reduced-motion evidence exposes stable Hero stage 3 and BIM stage 6 with 0.01 ms maximum duration and no smooth scrolling.
- BIM plates are lazy. The shift-route network check records the first BIM asset absent initially and loaded when the chapter approaches.
- All required route/viewport matrices report exact containment, one H1, visible primary CTA, intrinsic image dimensions, no broken images, duplicate downloads, console errors, warnings, page errors, or failed transports.
- Mobile-4G medians pass: LCP 1248 ms, CLS 0.0010, FCP 960 ms, TTFB 4 ms, TBT 23 ms. CPU×4 diagnostic also passes the current threshold: LCP 1624 ms, TBT 147 ms, maximum long task 196 ms.
- Independent API checks confirmed structured `422` validation and controlled `503` CRM configuration responses with `no-store` and `preserveState`; supplied evidence confirms the 46 MiB `413` boundary.
- No runtime coupling or changes were found in `apps/tech` or `apps/engineering`.
- Production-edge caching, legal approval, real CRM, public contacts, Metrica, call tracking, and owner-approved claims remain accurately disclosed activation prerequisites rather than hidden readiness claims.

Methodology limitation: Chrome DevTools MCP was unavailable. Performance was therefore assessed from the real production Playwright/CDP network and CPU profiles, PerformanceObserver data, trace archives, live DOM/AX inspection, and source review. No field data, real-device INP, or production-edge cache measurement exists yet.

CONDITIONAL PASS
