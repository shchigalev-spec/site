# Milestone D deterministic test results

Final production release evidence: `2026-08-26T01:03:18.973Z`. Final integrated browser evidence: `2026-08-26T01:15:45.960Z`. Both were regenerated after the final-state visual correction; the eight route-final screenshots were then recaptured with the same current application state after hiding only the test harness skip-link overlay.

| Check | Result |
|---|---|
| Svelte typecheck | PASS — 0 errors, 0 warnings |
| Lint | PASS — 0 errors, 0 warnings |
| Focused Vitest | PASS — 5 files, 20 tests |
| Production build | PASS — adapter-node output created in a strictly serial build |
| QA script syntax | PASS — all four verification scripts and the asset preparation script parse |
| Integrated live QA | PASS — 0 assertions, 0 console errors/warnings, 0 page errors, 0 failed requests |
| Primary route matrix | PASS — four routes at 320, 390, 768, and 1440 px |
| Supplemental production matrix | PASS — four routes at 360, 375, 430, 1024, and 1920 px |
| Route/hero health | PASS — 200 response, one visible H1, initially visible primary CTA, complete body |
| Horizontal overflow | PASS — exact `scrollWidth === clientWidth` throughout the matrix |
| Images | PASS — no broken images, missing intrinsic dimensions, or duplicate image downloads |
| Generated visual system | PASS — 27 Codex-generated masters in the repository and 165 responsive/static derivatives; distinct route, factory-stage, case, logistics, and social roles |
| Route final states | PASS — general 4/4, shift 5/5, office 3/3, dormitory 3/3; distinct Hero/final hashes and fresh desktop/mobile final-state captures |
| Accessibility DOM checks | PASS — no duplicate IDs, unlabeled controls, undersized targets, or missing image alternatives |
| File picker | PASS — exact visible phrase in accessible name, visible 3 px focus, pointer and Enter activation, live filename announcement |
| Empty-form focus order | PASS — standard/leasing focus `objectType`; tender focuses `company`; verified desktop and mobile |
| Mobile menu keyboard | PASS — Escape closes the menu and returns focus |
| Normal motion | PASS — Hero 0→2→3, BIM 0→3→6, and user-controlled Factory 0→3→6; fresh frames/diffs/trace |
| Reduced motion | PASS — smooth scroll disabled, duration 0.01 ms, Hero stage 3 and BIM stage 6 exposed as stable conclusions |
| Standard/tender/leasing forms | PASS — validation, attachments, state preservation, confirmed success, dedicated tender, leasing, controlled failures |
| Server schema | PASS — malformed standard/tender requests return 422 |
| Request boundary | PASS — 46 MiB multipart request returns 413 before form parsing |
| Analytics privacy | PASS — poisoned attribution cannot emit personal fields or filenames |
| Production CRM configuration | PASS — missing webhook returns visible 503 without fake success; entered contact remains |
| Lazy loading | PASS — far-below-fold BIM imagery loads only on approach |
| SEO/routes | PASS — variants, canonicals, noindex rules, sitemap, robots, privacy, redirect attribution, and 404 verified |

## Mobile-4G performance

The built application was driven in Chromium at 390×844 @2× using 150 ms latency, 1.6 Mbps download, and 0.75 Mbps upload. Three acceptance runs were collected; a separate CPU×4 diagnostic was retained.

- Median LCP: **1204 ms**; target <2500 ms.
- Median CLS: **0.0010**; target <0.1.
- Median FCP: **1048 ms**; median TTFB: **7.7 ms**.
- Median total blocking time: **36 ms**.
- Representative transfer: **421,441 bytes**, 29 resources, no duplicate image requests.
- CPU×4 diagnostic LCP: see `release-results.json` for the current disclosed stress run.

Chrome DevTools MCP was unavailable, so the documented fallback used a real production Playwright browser with CDP network controls and `PerformanceObserver`. Machine-readable details are in `qa-results.json` and `release-results.json`.
