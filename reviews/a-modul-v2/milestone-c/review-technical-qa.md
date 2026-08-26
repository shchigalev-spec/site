# Milestone C — Technical QA Review

Independent read-only reviewer: fresh native subagent.

## Scope inspected

Both authoritative specifications, repository rules, complete source/evidence, four routes at all target widths, variants, root/SEO utilities, menu keyboard behavior, standard/tender/leasing forms, success/failure/attachment paths, production-safe CRM configuration and trace/evidence integrity.

## Consolidated issues

| Severity | Location | Issue | Required correction |
|---|---|---|---|
| P1 | `routes.ts`, `projectContext.ts` | Four required region parameters and exact selector values are missing; forms can silently default to Far East. | Implement all seven exact regions through SSR, selectors, forms, CRM, analytics and tests. |
| P1 | `FullLeadForm.svelte`, `lead-adapter.ts` | Standard-form tender checkbox normalizes to tender server mode without rendering required tender fields. | Switch UI/store/URL to the complete tender form before submit. |
| P1 | `FullLeadForm.svelte` | Server error keys such as `personnelCount` are not normalized to rendered `capacity` errors/focus. | Map every server key to a visible described field and test the branches. |
| P1 | Analytics and B components | Mandatory interaction events are declared but not emitted. | Instrument real boundaries and assert every required event. |
| P1 | Context initialization | Internal navigation can retain untouched general defaults on a route with another intent. | Distinguish untouched defaults from user edits; apply route/query defaults appropriately. |
| P1 | Shift route | Mandatory shift-specific chapters and seismic proof are absent. | Reuse or implement the relevant interactive chapters with shift content. |
| P2 | Public config | Phone/email and canonical config usage is inconsistent. | Centralize validated public config. |
| P2 | Attribution/scroll analytics | First-touch landing variant can be overwritten; scroll state is not per route. | Preserve first touch and reset depth per navigation. |
| P2 | Automated tests/evidence | Vitest has no focused tests and summary lacks raw outputs. | Add focused tests and retain command outputs. |
| P2 | Performance evidence | LCP/CLS/mobile simulation/long-task evidence is not captured. | Add reproducible measurements before final gate. |
| P2 | Multipart/webhook hardening | Body parsing precedes count/size checks; production HTTP webhook is accepted. | Enforce upstream size limits and HTTPS outside development. |
| P2 | Utility-page navigation | Privacy/404 can incorrectly mark the general route current. | Derive or omit `aria-current` on utility routes. |

## Severity counts

- P0: 0
- P1: 6
- P2: 6
- P3: 0

P0=0. P1 is not zero.

## Verdict: FAIL
