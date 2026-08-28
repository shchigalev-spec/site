FAIL

# Slice 00 visual review — Cycle 5

I reviewed the live route `http://127.0.0.1:5175/modulnye-zdaniya/` in the actual browser at 1440×1000, 390×844, and 320×568 outer viewports with the browser's classic vertical scrollbar. The observed client widths were 1425, 375, and 305 px on fresh page loads. I also inspected the live intermediate/final scroll compositions; `desktop-1440.png`, `mobile-390.png`, `mobile-320.png`, `mobile-320-classic-client.png`, `start.png`, `mid.png`, `end.png`, `diff-start-end.png`; the current Playwright trace contents and `capture-results.json`; `SPEC.md`, `DIFF-SUMMARY.md`, `TEST-RESULTS.md`; the governing specification, Slice 00 source/search/visual/review documents; and the current Svelte/CSS and capture source.

The visual direction otherwise meets the Slice 00 intent. The graphite, warm-white, official `#492D7D` purple, and `#E40A46` magenta basis is restrained and credible; Geologica, Onest, and IBM Plex Mono are rendered live. The large audit statement has clear priority, the four-route list remains secondary, and the status strip does not dominate as an equal-card template. The neutral text name avoids an invented logo. There is no premature product hero, CTA, image family, proof rail, animation, generic construction template, or cross-product visual borrowing.

## Defect 1 — status value crosses its cell boundary at the required 305 px client width

1. **Exact defect:** `зафиксированы` paints 5.225 px past the right edge of its own status cell and into the neighbouring column.
2. **Location:** live 320×568 outer viewport with a 305 px classic-scrollbar client area; `.source-strip` third cell (`КОНФЛИКТЫ`) in `apps/a-modul/src/routes/modulnye-zdaniya/+page.svelte`, styled by `apps/a-modul/src/app.css`.
3. **Evidence:** on a fresh live load, the cell bounds were x=0–152.400 px, while the text range was x=16–157.625 px; the cell reported `clientWidth: 152` and `scrollWidth: 158`. Document-level width still reports `scrollWidth: 305`, so the capture script's page-level overflow assertion does not catch this internal collision. The supplied `mobile-320-classic-client.png` shows the same crowded centre divider.
4. **Why this fails:** the review brief requires no overflow/clipping at classic-scrollbar client widths. A contained document width is insufficient when text visibly crosses its component boundary.
5. **Required correction:** introduce a deliberate narrow-client treatment that keeps each status value inside its own content box—by wrapping, a narrower type/padding rule, or a one-column breakpoint—without hiding overflow or reducing legibility.
6. **Retest:** load the real page fresh at 320×568 with a classic scrollbar, verify every `.source-strip` cell has `scrollWidth <= clientWidth`, verify every rendered text range stays within its cell rectangle, and recapture the 305 px full-page evidence.

## Defect 2 — `mid.png` is not an intermediate state

1. **Exact defect:** `mid.png` is byte-identical to `end.png`; both represent the terminal scroll position.
2. **Location:** `reviews/a-modul-v2/slice-00/mid.png`, `end.png`, `capture-results.json`, and `scripts/capture-a-modul-evidence.mjs`.
3. **Evidence:** both images have SHA-256 `7D4591ED9EF161DC28BC38744988143F8637CE11AC07DCB7D77E3100C49A763F`. `capture-results.json` records `midScrollY: 836` and `endScrollY: 836`. The script requests half the document height (`918`), which already exceeds the maximum scroll position (`1836 - 1000 = 836`) and therefore clamps to the end.
4. **Why this fails:** Slice 00 explicitly requires fresh start, intermediate, and end evidence. A duplicate terminal frame does not prove the intermediate composition and cannot satisfy the mandatory visual gate.
5. **Required correction:** calculate the midpoint from the scrollable range, e.g. `(scrollHeight - innerHeight) / 2`, capture that position as `mid.png`, and retain `end.png` at the maximum scroll position.
6. **Retest:** regenerate the entire current evidence package; confirm distinct `scrollY` values and hashes for start/mid/end; visually inspect the true midpoint; and recreate the trace, diff, and capture JSON from the same run.

## Defect 3 — current slice identity contradicts the required working branch

1. **Exact defect:** the live/evidence package describes branch `feature/a-modul-direct-landing-v2`, but the actual current worktree is on `build/windows-outreach-v1`.
2. **Location:** repository root versus `reviews/a-modul-v2/slice-00/SPEC.md` and `DIFF-SUMMARY.md`.
3. **Evidence:** fresh `git branch --show-current` returned `build/windows-outreach-v1`; both `HEAD` and `origin/main` were `37004f6e6460203215ed6e57dd396b9421f83eba`, while A-Modul files remained untracked. `DIFF-SUMMARY.md` instead asserts `feature/a-modul-direct-landing-v2`.
4. **Why this fails:** the Slice 00 acceptance contract requires the named feature branch and strict slice isolation. Evidence cannot validate a different working-tree identity.
5. **Required correction:** move the A-Modul work onto `feature/a-modul-direct-landing-v2` in a safe isolated branch/worktree while preserving unrelated user work, then make the diff summary reflect the actual branch and change surface.
6. **Retest:** verify `git branch --show-current`, base SHA, status, and actual changed-file inventory; rerun the app and regenerate all current Slice 00 evidence before invoking fresh reviewers.
