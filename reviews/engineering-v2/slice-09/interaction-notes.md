# Slice 09 — final implementation and browser evidence

## Current build and route contract

- Source baseline remains `37004f6e6460203215ed6e57dd396b9421f83eba` on `revamp/engineering-production-v2`.
- Final browser target is the rebuilt Vite production preview at `http://127.0.0.1:5174/`.
- The complete 15-route HTML sweep returned the intended final page with HTTP 200 after redirects, one H1, meaningful content, no framework overlay, no console/page error, no initially broken image, and no horizontal overflow at 390×844.
- `/privacy/` retains its intentional redirect to `/privacy-policy/`; `sitemap.xml` and `robots.txt` both return 200.
- The Engineering homepage exposes exactly seven numbered chapters. The final full-page evidence is 15,078 px tall at 1440×1000 and 15,656 px at 390×844, versus the Slice 00 captures at 23,427 px and 24,330 px respectively. That is a measured reduction of 35.64% on desktop and 35.65% on mobile without removing any chapter.

## Evidence captures

- `desktop-1440.png`: full current homepage at 1440×1000.
- `mobile-390.png`: full current homepage at 390×844.
- `start.png`: final 1440×1000 hero at the clean-room opening state.
- `mid.png`: the same hero and camera midway through the finite cutaway/hypothesis sequence.
- `end.png`: the same hero and camera after the transmission path is isolated and its checkpoints are visible.
- `reduced-motion.png`: complete current homepage with `prefers-reduced-motion: reduce`.

Full-page homepage captures temporarily force deferred chapters to paint in the browser and request lazy images before capture. This browser-only evidence treatment does not alter source, geometry, content, or runtime behavior. All six PNG files have distinct SHA-256 hashes; the final full-page capture dimensions are 1440×15,078, 390×15,656, and 390×16,106 for reduced motion.

## Interaction and conversion verification

- Six symptom tabs were selected in the live mobile browser; each produced a uniquely labelled active panel and completed its finite transition with `aria-busy=false`.
- All three renovation stages and all three construction contexts were selected. Each active control exposed its state; five construction-layer controls also changed their pressed state.
- A complete five-answer scenario preserved the chosen noise, direction, room, renovation stage, source context, and all five standard UTM fields in the diagnosis handoff.
- All inspected homepage diagnosis links preserve `source`, `source_page`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, and `utm_content` through the shared URL builder.
- The short form displayed its real development success state. On a production preview without Bitrix configuration it returned an honest visible delivery error and retained entered data rather than simulating success.
- The full diagnosis form focuses a visible error summary for incomplete steps, rejects unsupported uploads, validates phone/email and consent on the server, and keeps campaign/source context.
- Browser analytics emitted `page_view`, `noise_selected`, `path_selected`, `faq_open`, and the relevant conversion events with `concept=engineering` and route/page-type context.

## Accessibility, motion, and performance

- Normal desktop, normal mobile, and reduced-motion homepage passes contain one H1, visible primary and secondary actions, no horizontal overflow, no error overlay, and no console/page errors.
- Reduced motion resolves the hero into normal document flow with the cutaway, route, and conclusion visible; the 390×844 document remains 390 px wide.
- Keyboard verification covers the mobile menu focus loop and Escape restoration, symptom and construction tabs, FAQ state, and both form error summaries.
- `lighthouse-mobile-4g.json` is a preserved failed diagnostic run. It accidentally used Lighthouse `simulate` and the default 412×823 emulation rather than the mandated 390×844 DevTools profile; it returned performance 27 and LCP 12.435 s, driven by 27.5 s of host-side Style & Layout work.
- The profile was corrected rather than the failed report being overwritten. `lighthouse-mobile-4g-devtools.json` records the first valid profile before the final rhythm pass. Current post-touch-target evidence is `lighthouse-mobile-4g-devtools-after-rhythm.json`: DevTools throttling at 390×844, performance 86, accessibility 100, FCP/LCP 1.550 s, CLS 0, TBT 516 ms, 32 requests, and 441 KiB transferred. Only the two required mobile hero plates load as initial images.
- The Windows Lighthouse process writes a complete parseable report, then returns exit code 1 because Chrome Launcher cannot remove its temporary directory (`EPERM`). This host cleanup defect is recorded and is not treated as a page failure.

## FAIL history and corrections

1. The first final mobile sweep failed on horizontal overflow in `/cases/impact-noise-minus-16-db/`, `/privacy-policy/`, and `/privacy/`.
2. The shared header width was bounded to the viewport, case-grid children were allowed to shrink, and the two long mobile titles received route-specific responsive typography.
3. The first case correction stopped overflow but split the Russian word `снижение`; the title was reduced and changed to word-boundary wrapping.
4. Fresh production captures and the complete route sweep then passed with `scrollWidth === clientWidth` on every route.
5. The first independent final visual review still failed because the homepage reduction was only 25% on desktop and 17.5% on mobile, below the requested approximately 35–45% reduction.
6. Method spacing, construction controls, case hierarchy, FAQ defaults, and the first-contact form were compressed without removing required facts, graphs, diagrams, inputs, or routes. Fresh evidence now measures 35.64% desktop and 35.65% mobile reduction; the initial FAIL remains recorded for the independent re-review.
7. The first independent accessibility/performance re-review then found the mobile-menu primary CTA at only 26.34 px high. The shared critical and full CSS now render it as a 52 px flex target at 320, 390, and 430 widths; fresh browser checks show focus, correct diagnosis URL, clean console, and zero overflow. The FAIL remains in the review history for re-verification.

## Repository and delivery readiness

- `apps/tech` has no diff and no Engineering runtime import points into Tech.
- The legacy retrospective generator exits non-zero before any write and leaves the review tree unchanged.
- Two accidental root files (`UsersAdminAppDataLocalTempslice01-320-final.png` and `document.documentElement.clientWidth`) were verified inside the repository and deleted non-recoverably.
- Production still requires owner-supplied public domain, phone, email, legal/privacy details, Yandex Metrica ID, and Bitrix webhook/field mapping. No placeholder is presented as production contact data or a successful CRM delivery.
