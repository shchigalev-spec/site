BLOCKED

Milestone D Accessibility + Performance Director — consolidated independent review.

Severity counts:

- P0: 0
- P1: 1
- P2: 3
- P3: 2

## P1 — Full-form validation sends keyboard focus to the last field

Location: `apps/a-modul/src/lib/components/FullLeadForm.svelte`.

Evidence:

- Empty `standard` submission focused `consent` while earlier invalid fields were `objectType`, capacity, region, and contact.
- Empty `tender` submission likewise focused `consent` while company, tender name, deadline, region, and contact appeared earlier.
- Empty `leasing` submission behaved identically.
- On mobile this scrolled directly to approximately `scrollY=23,600`, leaving the first visible errors far above the viewport.

Root cause: error insertion order begins with consent/contact, and `focusFirstError()` trusts `Object.keys(errors)[0]` instead of form DOM order.

Required correction:

- Determine the first invalid field in actual DOM order, mapping aggregate errors such as `capacity` and `contact` to their first relevant visible control.
- Preserve the alert announcement and all existing state.
- Retest empty standard, tender, and leasing submissions at desktop and mobile widths; focus must land on the first invalid control in visual/DOM order.

## P2 — Active stage indices fail normal-text contrast

Locations: active hero assembly, risk, BIM, and factory stage indices in `apps/a-modul/src/app.css`.

Evidence: active `01` index computes as `#ff4d7e` on `#492d7d`, approximately `3.38:1`, at 10.4–11.52px.

Required correction: give active-stage indices an AA-compliant colour such as the warm or technical token, or hide truly redundant numbering from accessibility semantics. Recheck every active state, including focused-active states.

## P2 — A deeply offscreen BIM image is eagerly loaded

Location: `apps/a-modul/src/lib/components/BimSequence.svelte`.

Evidence: on the shift-camp route, the first BIM plate was `loading="eager"` roughly 13,000px below the mobile viewport and added a separate 70,057-byte AVIF request during initial load.

Required correction: make the initial BIM plate lazy or load it when the BIM chapter approaches the viewport. Retest all routes for initial image requests, duplicate downloads, and stage readiness when the chapter becomes visible.

## P2 — User-started finite sequences continue updating while offscreen

Locations: `HeroAssembly.svelte`, `BimSequence.svelte`.

Evidence: after starting BIM and immediately scrolling to the top, the section was approximately 11,575px offscreen but advanced from stage `0` to stage `2`.

Required correction: pause/cancel sequence timers when the scene leaves the viewport and define a stable resume/restart policy. Reduced-motion final-state behavior must remain unchanged.

## P3 — CPU×4 stress remains above the “good” TBT band

Supplied stress evidence recorded TBT 230ms and maximum long task 249ms. Independent rerun recorded TBT/max long task of 256ms. This is “needs improvement,” not poor, and does not invalidate the specified native-CPU mobile-4G acceptance profile.

Recommended improvement: profile initial hydration and defer noncritical below-fold initialization where practical.

## P3 — Static asset caching remains a deployment dependency

The local adapter returned `ETag` and `Last-Modified` for generated AVIF assets but no explicit `Cache-Control`. The launch checklist already records production-edge cache/compression verification as unresolved.

Required before public activation: configure and verify immutable/static cache policy at the real edge.

## Confirmed areas

- Independently checked 36 production combinations: four routes at 320, 360, 375, 390, 430, 768, 1024, 1440, and 1920px.
- All returned 200 with one H1, one main landmark, exact horizontal containment, intrinsic image dimensions, no broken loaded images, and no console/page/request defects.
- At 320×568, every route retained the H1 and primary CTA in the initial viewport.
- Accessibility tree contained no unnamed interactive nodes.
- Skip link focus/activation passed.
- Mobile dialog first-focus, bidirectional focus trap, Escape, and focus return passed.
- Risk and factory tab arrow/Home/End behavior, selection, roving tabindex, and panel association passed.
- Labels, `aria-invalid`, `aria-describedby`, persistent field messages, and alert status were present.
- Reduced motion passed on all four routes: smooth scroll disabled, maximum duration 0.01ms, and hero/BIM exposed stable final conclusions.
- Initial logistics motion is visibility-gated; reduced motion resolves it immediately.
- No video, WebGL loop, GIF animation, or endless CSS animation is shipped.
- Mobile-4G independent results passed exact targets on every route.
- General-route native-CPU rerun: TBT 9ms, max long task 59ms, approximately 390KB across 28 resources.
- No duplicate image requests were observed.
- Mock integration returned confirmed 201 success.
- Production without CRM returned the controlled 503 without fake success.
- Independent 46MiB multipart request returned structured JSON 413 with `no-store` and file-specific feedback.
- Evidence traces are valid archives with screenshots, network data, snapshots, and source entries.
- No changes were detected in `apps/tech` or `apps/engineering`.

Methodology limitation: the Chrome DevTools MCP required by the local web-performance skill was unavailable. Performance was independently rechecked with production Chromium, Playwright, CDP network/CPU emulation, PerformanceObserver, live DOM/AX inspection, and supplied trace evidence. No real-device INP or field data was available.
