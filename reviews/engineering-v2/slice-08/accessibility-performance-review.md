# Slice 08 — Accessibility and Performance Review

## Verdict

**PASS**

Independent read-only review of the rebuilt production application at `http://127.0.0.1:5174/`. No accessibility or performance hard fail remains.

## Performance hard gates

The current report `lighthouse-mobile-4g-after-attribution.json` is a valid, fully parseable Lighthouse 13.4.1 result for the homepage. It has no `runtimeError` and records mobile emulation at 390 × 844, DevTools throttling, 150 ms RTT, 1,638.4 Kbps throughput, and 4× CPU slowdown.

| Metric | Result | Gate | Status |
| --- | ---: | ---: | --- |
| LCP | 1,548.935 ms | < 2,500 ms | PASS |
| CLS | 0 | < 0.1 | PASS |
| FCP | 1,548.935 ms | — | evidence |
| TBT | 538.433 ms | — | non-blocking watch item |
| Speed Index | 2,868 ms | — | evidence |
| Lighthouse performance | 0.85 | — | evidence |
| Lighthouse accessibility | 1.00 | — | PASS |

The throttled report contains five load-time long tasks, with a maximum duration of 501.83 ms. This does not reproduce as a hero-scroll stall: a live normal-motion scroll sample recorded 85 animation frames, a maximum frame gap of 17.3 ms, no frame gap above 50 ms, and no `longtask` entry. Initial image transfer contains only the two selected mobile WebP hero states; no duplicate PNG download is present.

The Lighthouse JSON is 495,908 bytes, parses successfully, and contains the completed metrics above. A Windows cleanup `EPERM` emitted only after this valid report write is therefore non-gating; such a cleanup message would not be accepted as evidence without the valid report.

## Mandatory responsive viewports

The rebuilt homepage was reloaded and measured at every required viewport: 320 × 568, 360 × 800, 375 × 812, 390 × 844, 430 × 932, 768 × 1024, 1024 × 1366, 1440 × 1000, and 1920 × 1080. Every viewport returned exact requested dimensions, zero horizontal overflow, and zero decoded images with `naturalWidth === 0`.

At 390 px, every visible link, button, summary, select, text input, and textarea met the 44 × 44 px target rule. The only intrinsically smaller control was the 24 × 24 px consent checkbox; its associated clickable label measured 354.8 × 64.8 px.

## Keyboard and focus

- The skip link and one-H1 landmark structure are present.
- The mobile menu moves focus into the menu when opened, traps keyboard focus, closes with Escape, restores focus to the menu trigger, and locks document scrolling while open.
- Both tab systems use tablist/tab/tabpanel semantics, roving `tabindex`, associated panels, and Arrow/Home/End handling. A live End-key test selected and focused `06 Вентиляция`; construction tabs behaved equivalently.
- Scenario forward, Back, and edit transitions restore focus to the active question legend; the next Tab reaches the first answer.
- The short form moves focus to `#short-form-error` on invalid submission. Five invalid controls expose `aria-invalid="true"` and reference that alert through `aria-describedby`.
- The full diagnosis form moves focus to `#diagnosis-step-error`; all four invalid first-step controls reference the focused alert through `aria-describedby`. Progressive next/back navigation restores focus to the newly revealed group heading.

## Reduced motion, errors, and images

Real browser emulation reported `prefers-reduced-motion: reduce === true`, zero running animations, zero horizontal overflow, and a complete static explanatory state. Normal-motion hero scrolling completed without an unbounded animation loop.

The rebuilt homepage and diagnosis route produced no page errors or console errors. Automated accessibility evidence remains clean: the live scoped axe pass recorded zero violations, and the current Lighthouse report records accessibility 1.00. Responsive and eager hero images decoded successfully; below-fold images remain lazy rather than being unnecessarily fetched at startup.

## Final gate

Desktop, mobile, keyboard, focus/error handling, reduced motion, image loading, clean console, LCP, and CLS all pass. No revision is required for Slice 08 accessibility/performance.
