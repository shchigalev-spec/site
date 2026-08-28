FAIL

# Accessibility and Performance Review — Slice 00, Cycle 6

I reviewed only the Accessibility and Performance remit for Slice 00. I read the complete authoritative specification, repository rules, current-slice specification, review protocol, diff/test records, capture JSON, relevant Svelte/CSS/config/capture source, the Playwright trace package, and the current desktop/mobile/start/mid/end/diff evidence. I independently exercised the live route at `http://127.0.0.1:5175/modulnye-zdaniya/` at 1440×1000, 390×844, 320×568, and the required 305×568 classic-scrollbar client condition with keyboard and reduced-motion contexts. I also measured the built adapter-node output under a cold, throttled mobile profile.

## Blocking defects

### A11Y-01 — the skip link does not actually bypass the header

- **Exact defect:** Activating `К основному содержанию` changes the URL fragment but does not transfer keyboard focus to the main content. The next Tab returns to the skip link, so the user has not bypassed the repeated header controls.
- **Location:** `apps/a-modul/src/routes/modulnye-zdaniya/+page.svelte`, the link `href="#main"` and `<main id="main">`.
- **Live evidence:** At all four tested widths, fresh load → Tab focused `.skip-link` visibly at 233.30×45 px → Enter produced `location.hash === "#main"`, `scrollY === 80`, and `document.activeElement === BODY` → the next Tab focused `.skip-link` again. The same result occurred with the 390px touch/reduced-motion context.
- **Violated requirement:** The authoritative specification §35 explicitly requires a working skip link and keyboard navigation. A fragment change without a usable focus destination does not provide the required keyboard bypass.
- **Required correction:** Make the main landmark a programmatically focusable fragment destination (for example `tabindex="-1"`) and ensure skip-link activation moves focus there without creating an ordinary extra Tab stop. Preserve the visible skip-link treatment.
- **Retest:** From a fresh load at desktop, 390, 320, and 305 client widths, press Tab, activate the skip link with Enter, assert `document.activeElement` is `main#main`, and confirm subsequent keyboard navigation does not restart on the skip link/header.

### A11Y-02 — the persistent home link has no reliably visible focus indicator

- **Exact defect:** The wordmark relies on Chromium's one-pixel automatic outline, whose computed focused colour is nearly indistinguishable from the dark header.
- **Location:** `apps/a-modul/src/app.css`, `.wordmark`; there is no `.wordmark:focus-visible` rule.
- **Live evidence:** Fresh 390px load → Tab twice focused `.wordmark`; its focused computed styles were `outline-style: auto`, `outline-width: 1px`, `outline-color: rgb(16, 16, 16)` against the `rgb(24, 23, 27)` header. The control itself is correctly named `Ависта Модуль, главная` and measures 101.84×44 px, but the keyboard focus location is not reliably perceivable.
- **Violated requirement:** The authoritative specification §35 requires visible focus.
- **Required correction:** Add an explicit high-contrast `:focus-visible` indicator (with sufficient thickness and offset) for the wordmark and any later interactive controls; do not depend on the user-agent outline.
- **Retest:** Keyboard-tab to the wordmark at all required viewport families and inspect both computed focus styles and a focused-state screenshot against the real header background.

### A11Y-03 — multiple small-text colour pairs miss the 4.5:1 contrast threshold

- **Exact defect:** Normal-size labels use colour pairs below the minimum contrast required for readable text.
- **Location:** `apps/a-modul/src/app.css`: `.source-strip span` and `footer` use `#817a85` on `#18171b`; the dark-section `.eyebrow` uses `#e40a46` on `#18171b`; `.route-map li span` uses `#e40a46` on `#d8d0df`.
- **Live evidence:** Computed-pair contrast calculations from the rendered page were 4.295:1 for `#817a85`/`#18171b`, 3.764:1 for `#e40a46`/`#18171b`, and 3.162:1 for `#e40a46`/`#d8d0df`. These labels are normal-size text (including the 0.72rem mono labels), not large text. The pink-on-purple eyebrow (4.948:1) and primary text pairs passed.
- **Violated requirement:** Slice 00 is required to establish an accessible visual foundation; §35 requires accessible presentation and the gate assigns colour/state review to this subagent. These normal-text pairs fail WCAG AA's 4.5:1 baseline.
- **Required correction:** Introduce tested accessible text variants for the official accent and muted text on each background, each at least 4.5:1 at the current sizes. The exact official magenta may remain for non-text accents; do not solve this by hiding or removing required content.
- **Retest:** Recalculate contrast from the final computed colours for every visible text/background pair on desktop and mobile and include the values in the refreshed test evidence.

## Passing coverage observed

- The live 5175 route returned HTTP 200 with zero console errors, page errors, failed requests, or HTTP error assets during independent desktop/mobile runs.
- The accessibility tree exposed one banner, one main landmark, one content-info landmark, one H1 followed by one H2, a real ordered list, and named links. `lang="ru"` is present.
- Document width equalled client width at 1440, 390, 320, and 305 px. No element extended outside the viewport and no descendant had `scrollWidth > clientWidth`; the repaired one-column status strip contains its content at 320/305 px.
- Both current interactive targets meet the 44px minimum: wordmark 101.84×44 px; skip link 233.30×45 px.
- Reduced-motion emulation matched at 390/320/305, the page exposed zero active animations, and the CSS has no video, WebGL, or scrolling animation cost in this bounded slice.
- Fonts resolved locally as Onest, Geologica, and IBM Plex Mono; Inter was not loaded. There are no image assets in Slice 00, hence no broken or duplicate image downloads.
- The evidence images are current and dimensionally consistent: desktop 1440×1836, mobile 390×2052, narrow 320×2321, and classic-client 305×2337. Start/mid/end are three distinct 1440×1000 files; capture JSON records scroll positions 0/418/836 and no captured runtime defects; the trace and pixel diff are present.
- On the production adapter-node build, three cold mobile runs using 150ms latency and 1.6Mbps downstream measured LCP at 608ms, 584ms, and 520ms; CLS was 0.000853 in every run; there were no long tasks, console errors, failed resources, or duplicate resource URLs. Total transferred subresources were approximately 106KB. This comfortably meets the current-slice LCP/CLS targets and is proportionate to a source-status surface with no production imagery yet.
- I inspected the recorded successful `check`, `lint`, `test`, and production `build` outputs in `TEST-RESULTS.md`; the test runner honestly reports that Slice 00 has no unit-test files.

The current slice must remain failed until all three accessibility defects are corrected, all current evidence is regenerated, and five fresh reviewers repeat the gate.
