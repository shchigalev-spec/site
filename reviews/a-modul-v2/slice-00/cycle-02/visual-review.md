FAIL

# Visual Review — Slice 00, Cycle 2

## Scope actually inspected

- Live route `http://127.0.0.1:5175/modulnye-zdaniya/` in the Codex in-app browser at 1440×1000, 390×844, and 320×568.
- Current Cycle 2 evidence only from `reviews/a-modul-v2/slice-00/`: `desktop-1440.png`, `mobile-390.png`, `mobile-320.png`, `start.png`, `mid.png`, `end.png`, `diff-start-end.png`, `capture-results.json`, `playwright-trace.zip`, `SPEC.md`, `DIFF-SUMMARY.md`, and `TEST-RESULTS.md`.
- Relevant requirements in the complete master specification, plus `docs/A-MODUL-SOURCE-FACTS.md`, `docs/A-MODUL-CONTENT-TODO.md`, `docs/A-MODUL-SEARCH-INTENT.md`, `docs/A-MODUL-IMAGE-BIBLE.md`, and `docs/A-MODUL-REVIEW-PROTOCOL.md`.
- Source inspected only to localize the rendered defect: `apps/a-modul/src/app.css` and `apps/a-modul/src/routes/modulnye-zdaniya/+page.svelte`.

## Blocking defect

**Exact defect:** the live page has horizontal overflow and a persistent horizontal scrollbar at the required 320×568 viewport when rendered in an actual browser with classic scrollbars.

**Location:** global page sizing in `apps/a-modul/src/app.css`, specifically `body { min-width: 320px; }` at line 18. Once the vertical scrollbar consumes 15 px, the document client width is 305 px while the body remains 320 px wide.

**Evidence:** at the live 320×568 viewport, browser measurement returned `innerWidth = 320`, `document.documentElement.clientWidth = 305`, and `document.documentElement.scrollWidth = 320`; the live screenshot visibly showed the horizontal scrollbar across the bottom of the viewport. At 390×844 the client width was 375 px and the defect did not surface, which explains why the supplied headless `mobile-320.png` and `capture-results.json` did not reveal it. The 1440×1000 and 390×844 live compositions otherwise rendered without clipping.

**Violated requirement:** Slice 00 `SPEC.md` requires current overflow evidence at 320 px, and the master specification’s Mobile section makes “no horizontal overflow” a hard rule. Horizontal overflow is also an explicit hard fail in the quality gate. This is a real-browser failure at a mandatory viewport, regardless of the headless capture result.

**Required correction:** remove or replace the fixed 320 px body minimum so the complete layout fits `document.documentElement.clientWidth` even when a classic vertical scrollbar is present. Do not conceal the defect with `overflow-x: hidden`, negative margins, or clipping; the root and all full-width sections must genuinely size to the available client width.

**Retest instruction:** after the Builder fixes only Slice 00, rerun the live application and inspect 320×568 in an actual browser with classic scrollbars. Require `document.documentElement.scrollWidth === document.documentElement.clientWidth`, no horizontal scrollbar at every vertical scroll position, and fully visible H1, route list, status strip, principle section, and footer. Then recreate the entire current Slice 00 evidence package and submit it to five fresh reviewers; also recheck 390×844 and 1440×1000 for regressions.

## Non-blocking visual observations

The 1440 desktop hierarchy is deliberately asymmetric and reads as a controlled audit/status composition rather than a generic construction template. The 390 and supplied 320 evidence maintain clear section hierarchy without an equal-card grid dominating. The neutral text-only `АВИСТА МОДУЛЬ` label avoids inventing a logo, and the purple/magenta/graphite basis is consistent with the documented official-brand extraction. The surface does not prebuild the Slice 01 product hero, asset family, mini-brief, proof rail, or assembly interaction. These strengths do not override the mandatory 320 px overflow failure.
