FAIL

# Motion and interaction review — Slice 00, Cycle 6

## What was inspected

- Live route `http://127.0.0.1:5175/modulnye-zdaniya/` at desktop `1440×1000` with normal motion and mobile `390×844` with touch plus `prefers-reduced-motion: reduce`.
- Current `desktop-1440.png`, `mobile-390.png`, `mobile-320.png`, `mobile-320-classic-client.png`, `start.png`, `mid.png`, `end.png`, `diff-start-end.png`, `capture-results.json`, and `playwright-trace.zip`.
- Current route markup/CSS in `apps/a-modul/src/routes/modulnye-zdaniya/+page.svelte` and `apps/a-modul/src/app.css`, plus `scripts/capture-a-modul-evidence.mjs`.
- Real pointer/touch activation of the home link, keyboard focus order and skip-link activation, normal/reduced-motion media state, document scroll start/middle/end, browser console, page errors, and failed requests.

The static scope is appropriate for Slice 00: no Slice 01 assembly interaction is present, `document.getAnimations({ subtree: true })` remains `0` in both motion preferences, touch and keyboard can activate the home link, and scroll reaches distinct stable positions (`0`, `418`, `836`) without a loop, abrupt scripted swap, scroll hijack, console error, page error, or failed request. The touch/reduced-motion check likewise reached the mobile scroll conclusion (`1208/1208`).

## Blocking defect

1. **Exact defect:** activating the visible skip link does not transfer keyboard focus to the main content target.
2. **Location:** the skip link and target in `apps/a-modul/src/routes/modulnye-zdaniya/+page.svelte` (`href="#main"` and `<main id="main">`). The target is not programmatically focusable.
3. **Evidence:** on the live desktop route, the first `Tab` correctly exposes and focuses `.skip-link` at `top: 12px` / `bottom: 57px`. After `Enter`, the URL changes to `#main` and the page scrolls to `80px`, but `document.activeElement` is `BODY`, not `MAIN#main`. A following `Tab` returns to the same skip link instead of establishing focus at the bypass target. This is real-browser behavior, not a source-only inference.
4. **Violated requirement:** the Slice 00 gate requires actual keyboard interaction evidence, and the review protocol requires working pointer/keyboard behavior. The governing accessibility requirements explicitly require a skip link; a viewport-only jump without moving the keyboard focus point does not provide a dependable bypass interaction.
5. **Required correction:** make `#main` programmatically focusable (the minimal native correction is `<main id="main" tabindex="-1">`) and ensure skip-link activation leaves `document.activeElement` on `MAIN#main`. Preserve the static Slice 00 scope and do not add Slice 01 motion.
6. **Retest:** in fresh normal-motion desktop and reduced-motion touch/mobile contexts, focus the skip link with `Tab`, activate it with `Enter`, and assert `location.hash === '#main'` and `document.activeElement === document.querySelector('#main')`. Recreate the complete current evidence package and invoke five fresh reviewers.
