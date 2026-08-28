# Slice 00 — commands actually run and real results

Date: 2026-08-25 (Europe/Moscow)
Live target: `http://127.0.0.1:5175/modulnye-zdaniya/`

## Git and source verification

- `git fetch origin main` — PASS; fetched `origin/main`.
- `git rev-parse origin/main` — `37004f6e6460203215ed6e57dd396b9421f83eba`.
- `git switch -c feature/a-modul-direct-landing-v2 origin/main` — PASS.
- Official source pages listed in `A-MODUL-SOURCE-FACTS.md` were queried and inspected on 2026-08-25.
- `curl.exe` status check without following a redirect: `/leasing/` returned `404` with an empty redirect target; `/modulnye-zdaniya-v-lizing/` returned `200` with an empty redirect target. The inventory records 12 attempted URLs, 1 dead supplied URL, and 11 live official factual sources.

## Dependency install

Command: `npm install`

Result in the isolated feature worktree: PASS. Added 151 packages and audited 155 packages. npm reported 3 low-severity audit findings; no forced/breaking audit mutation was run.

## Repository hygiene

- `git ls-files --others --exclude-standard -- apps/a-modul` — current output contains only the 13 intended app source/config files, including the app-local `.gitignore`; zero `node_modules/`, `.svelte-kit/`, or `build/` paths.
- `git check-ignore -v apps/a-modul/node_modules/.package-lock.json apps/a-modul/.svelte-kit/tsconfig.json apps/a-modul/build/index.js` — each representative generated path is ignored by `apps/a-modul/.gitignore`.
- `git status --short --untracked-files=all -- apps/a-modul` — no generated dependency/cache/build artifact is stageable.

## Svelte checks

Initial command: `npm --prefix apps/a-modul run check`

Initial result: FAIL. SvelteKit rejected `kit.trailingSlash` in `svelte.config.js`. The route option was moved to `src/routes/+layout.ts`.

Retest result: PASS.

```text
svelte-check found 0 errors and 0 warnings
```

Latest command after current CSS/evidence changes: `npm --prefix apps/a-modul run check`

Latest result: PASS, 0 errors and 0 warnings.

## Lint

Command: `npm --prefix apps/a-modul run lint`

Result: PASS.

```text
svelte-check found 0 errors and 0 warnings
```

## Unit test runner

Command: `npm --prefix apps/a-modul run test`

Result: PASS (exit code 0).

```text
RUN v4.1.11
No test files found, exiting with code 0
```

Slice 00 is documentation and infrastructure; interaction-specific automated tests begin with product interactions in later slices.

## Production build

Initial command: `npm --prefix apps/a-modul run build`

Initial result: FAIL. Vite inherited the unrelated legacy root PostCSS config, whose Tailwind plugin is not part of the independent app. A local empty `apps/a-modul/postcss.config.mjs` was added to isolate the app.

Latest retest: PASS.

```text
vite v8.2.1
client and SSR bundles built
Using @sveltejs/adapter-node
done
```

## Live app

- `npm run dev:a-modul` — running on `http://127.0.0.1:5175/`.
- `Invoke-WebRequest http://127.0.0.1:5175/modulnye-zdaniya/` — HTTP 200.
- Root route is implemented as a server redirect to `/modulnye-zdaniya/`.

## Browser evidence

Command:

```text
node scripts/capture-a-modul-evidence.mjs slice-00 http://127.0.0.1:5175/modulnye-zdaniya/
```

Latest Cycle 7 preparation result after the Cycle 6 corrections: PASS (exit code 0).

- Desktop viewport: 1440×1000; full-page evidence is 1440×1836.
- Mobile viewport: 390×844; full-page evidence is 390×2052.
- Additional narrow mobile viewport: 320×568; full-page evidence is `mobile-320.png`.
- Classic-scrollbar client-area simulation: 305×568 (the layout width remaining inside a 320px browser with a 15px scrollbar); full-page evidence is `mobile-320-classic-client.png`.
- Exactly one H1.
- One header, one main, one footer.
- Desktop scroll width equals viewport width: 1440.
- Mobile scroll width equals viewport width: 390.
- 390px H1 client width equals H1 scroll width: 335px (no clipped glyph overflow).
- 320px document scroll width equals client width: 320px; H1 client/scroll width is 275px.
- 305px classic-scrollbar client simulation: document scroll/client width is 305px; H1 client/scroll width is 262px.
- Every source-status cell has `scrollWidth <= clientWidth` at 390px, 320px, and the 305px classic-scrollbar client simulation. At 320px and below the strip deliberately uses one column.
- Keyboard bypass: first `Tab` focuses the visible skip link; `Enter` produces `#main` and transfers focus to `main#main` at 80px scroll. `main` is programmatically focusable but not an ordinary Tab stop.
- Persistent wordmark focus: second `Tab` focuses `.wordmark` with a computed solid 3px `rgb(255, 77, 126)` outline and 4px offset; focused-state screenshots are current.
- Measured small-text contrast ratios are 5.619:1 for the dark-section pink label, 7.166:1 for purple route numbers on the light panel, 6.767:1 for muted labels/footer on graphite, and 4.948:1 for the pink principle label on purple. All asserted pairs meet or exceed 4.5:1.
- Smallest measured interactive target: 101.84375×44 px (the neutral text home link).
- Console errors: 0.
- Page errors: 0.
- Failed requests: 0.
- `start.png`, `mid.png`, and `end.png` are distinct current scroll states: 0px, 418px, and 836px respectively; all three SHA-256 hashes differ.
- `diff-start-end.png` is a current pixel-difference image.
- `playwright-trace.zip` contains screenshots, snapshots, and sources. No WebM/video is used.
- `skip-link-focus.png`, `skip-link-target.png`, and `wordmark-focus.png` prove current keyboard/focus states without video.

The machine-readable results are in `capture-results.json`. The current package was captured at `2026-08-25T12:13:40.305Z`.

## Cycle 1 reviewer-fix retest

The Cycle 1 visual reviewer failed the 390px heading in a classic-scrollbar browser and rejected an invented interim square `А` mark. The Builder removed the mark in favour of a neutral text-only label, reduced the bounded mobile heading scale, and verified the full H1 at both 390×844 and 320×568. All check/lint/test/build commands above were rerun successfully before the current evidence was captured at `2026-08-25T10:46:27.312Z`.

## Cycle 2 reviewer-fix retest

The Cycle 2 visual reviewer found that `body { min-width: 320px; }` exceeded a classic-scrollbar browser's 305px client area at an outer 320px viewport. The fixed minimum was removed, mobile grid columns were changed to true shrinkable `minmax(0, 1fr)` tracks, and the capture now includes an explicit 305px client-area condition. The current check, lint, test, build, browser capture, H1-width, console/error, and overflow assertions all pass.

## Cycle 3 reviewer-fix retest

The Cycle 3 engineering reviewer found a stale minimum-target width in this file and an unresolved `/leasing/` status/count. The current record now matches `capture-results.json` at `101.84375×44 px`. A fresh direct status check records `/leasing/` as 404 with no redirect and `/modulnye-zdaniya-v-lizing/` as 200; the source inventory and live audit label now define 12 attempted URLs, 1 dead supplied URL, and 11 live (`ДЕЙСТВУЮЩИХ`) factual sources. Check, lint, test, build, live capture, screenshots, trace, and diff were rerun after the change.

## Cycle 4 reviewer-fix retest

The Cycle 4 engineering reviewer found 404 workspace-local generated/cache/build paths exposed as stageable files. `apps/a-modul/.gitignore` now excludes `node_modules/`, `.svelte-kit/`, adapter `build/`, and local environment files while preserving `.env.example`. The actual untracked app surface is 13 intended source/config files, all named in `DIFF-SUMMARY.md`; representative generated paths are confirmed ignored. Check, lint, test, build, live capture, screenshots, trace, and diff were rerun after the correction.

## Cycle 5 reviewer-fix retest

The Cycle 5 visual reviewer found an internal status-cell overflow at the required 305px client width, a terminal frame mislabeled as the midpoint, and a branch mismatch caused by unrelated parallel work switching the shared checkout. The A-Modul scope now lives in an isolated worktree on the required `feature/a-modul-direct-landing-v2` branch; `HEAD` and `origin/main` both resolve to the audited base SHA. The status strip deliberately becomes a single column at widths up to 340px, and the evidence runner now asserts every status cell's containment. It derives the midpoint from the actual scrollable range and asserts `0 < midScrollY < endScrollY`. Check, lint, test, build, the complete screenshot set, trace, diff, machine-readable capture, hashes, branch identity, and intended-file inventory were rerun after these corrections.

## Cycle 6 reviewer-fix retest

The Cycle 6 motion and accessibility reviewers independently found that fragment activation left focus on `BODY`; the accessibility reviewer also found an indistinct user-agent wordmark outline and three small-text colour pairs below 4.5:1. `main#main` now has `tabindex="-1"`, real-browser skip activation leaves it focused, and `.wordmark:focus-visible` has an explicit 3px/4px-offset accessible pink ring. Text accents now use tested accessible variants while official `#e40a46` remains available for non-text brand accents. The evidence runner asserts skip focus/activation, wordmark computed outline, all reported contrast pairs, status-cell containment, scroll-state separation, errors, semantics, and overflow. Check, lint, test, build, complete evidence, trace, diff, and three new keyboard-state screenshots were regenerated after only those corrections.
