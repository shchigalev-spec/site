FAIL

# Slice 00 visual review — cycle 1

## Inspection performed

- Live route `http://127.0.0.1:5175/modulnye-zdaniya/` in an actual browser at 1440×1000 and 390×844.
- Official `https://a-modul.ru/` header in the same browser to compare the public Avista logo with the local status surface.
- Current evidence: `desktop-1440.png`, `mobile-390.png`, `start.png`, `mid.png`, `end.png`, `diff-start-end.png`, and `capture-results.json`.
- Review inputs: `SPEC.md`, `DIFF-SUMMARY.md`, `TEST-RESULTS.md`, the complete attached master specification, `docs/A-MODUL-IMAGE-BIBLE.md`, `docs/A-MODUL-SOURCE-FACTS.md`, `docs/A-MODUL-REVIEW-PROTOCOL.md`, `apps/a-modul/src/routes/modulnye-zdaniya/+page.svelte`, `apps/a-modul/src/app.css`, and the font imports in `+layout.svelte`.

The desktop composition otherwise reads as a deliberately bounded audit/status surface: the asymmetric route panel, evidence strip, and single principle chapter avoid an equal-card template and do not prebuild Slice 01 imagery, mini-brief, proof rail, or product motion. The official purple/magenta basis and required type families are present. The following defects prevent PASS.

## Defect 1 — horizontal overflow and clipped first-screen heading in the real 390 px mobile render

**Location:** the first-screen H1 in `.audit-copy` (`apps/a-modul/src/routes/modulnye-zdaniya/+page.svelte`), governed by the mobile `h1` rule in `apps/a-modul/src/app.css`.

**Evidence:** with the actual browser viewport set to 390×844, `window.innerWidth` was 390 but the classic vertical scrollbar left a 375 px document client width. `document.documentElement.scrollWidth` and `body.scrollWidth` were 383 px, producing a visible horizontal scrollbar. The H1 had `clientWidth: 321` and `scrollWidth: 356`; the long word `подтверждаем` extended past its box and was visibly clipped at the right edge. The supplied `mobile-390.png` and `capture-results.json` report a 390 px scroll width because that capture surface uses different scrollbar behavior, so they do not disprove the defect seen in the required real-browser pass.

**Violated requirement:** Slice 00 requires an actual mobile render and overflow evidence; master sections 35–36 require no horizontal overflow and core mobile text in normal flow, and section 39 names mobile overflow as a hard fail.

**Required correction:** make the H1 wrap inside the available content box when a non-overlay scrollbar reduces layout width. Adjust the mobile type sizing/wrapping or measure so the full heading remains legible without clipping; do not conceal the defect with `overflow-x: hidden`.

**Retest:** in a real browser at 390×844 and 320×568, reload the live route, confirm the full H1 is visible, confirm no horizontal scrollbar appears, and assert `document.documentElement.scrollWidth === document.documentElement.clientWidth`. Recreate the mobile and state evidence after the fix.

## Defect 2 — invented logo-like mark conflicts with the official brand basis

**Location:** the top-left `.wordmark` in `apps/a-modul/src/routes/modulnye-zdaniya/+page.svelte`, specifically the magenta square containing a white `А`.

**Evidence:** the local live route and every supplied status screenshot present the square `А` as the site mark. The official homepage header instead uses Avista's established geometric/diamond logo with the `АВИСТА МОДУЛЬ ИНЖИНИРИНГ` wordmark. The local square is neither that official asset nor a neutral text-only label; the source itself calls it `wordmark` and exposes it as `Ависта Модуль, главная`, so it reads as invented branding.

**Violated requirement:** master section 16.1 says to use the actual logo and not generate a new one. The Slice 00 content boundary reserves downloading the official logo for Slice 01; a fabricated interim mark is not an honest substitute and weakens the required official brand basis.

**Required correction:** for Slice 00, remove the square `А` and use a restrained text-only project/status label. Do not pull the official logo deliverable forward into this slice; integrate the verified official asset in Slice 01 as specified.

**Retest:** compare the refreshed header with the official homepage again, verify that no invented symbol is presented as the Avista logo, and recreate desktop/mobile/start evidence before invoking a fresh visual reviewer.
