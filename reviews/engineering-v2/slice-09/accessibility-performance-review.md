# Slice 09 — Accessibility & Performance review

## Verdict

**PASS**

This is a fresh read-only re-review after the mobile-menu touch-target correction. It is limited to the Slice 09 accessibility/performance gate and is based on the latest rebuilt production preview at `http://127.0.0.1:5174/`, current source, recaptured Slice 09 evidence, all three preserved Lighthouse reports, and new independent browser checks. The post-fix Lighthouse, overflow, touch, keyboard, motion, console, image, and route gates pass.

## Prior FAIL and correction — explicitly preserved

The previous independent re-review was **FAIL** because the primary `Разобрать мой шум` link at the bottom of the open mobile menu had a hit area only 26.34 CSS px high at 320, 390, and 430 px widths, below the required 44 px minimum. That failure remains recorded rather than being overwritten.

The rebuilt link now computes to `display:flex`, `min-height:52px`, `padding:12px 16px`, and centered alignment. Fresh real-touch Chromium measurements are:

- 320×568: **280×52 px**;
- 390×844: **350×52 px**;
- 430×932: **390×52 px**.

At all three widths the target is fully inside the viewport, the document has no horizontal overflow, and the context reports `maxTouchPoints=1` plus `pointer:coarse`. Its href is `/diagnostika-shuma/?source=mobile_menu&source_page=homepage`. Keyboard focus on the corrected link draws the same visible 2 px outline with 3 px offset used elsewhere. The original blocker is therefore resolved.

## Evidence and method

- Read the authoritative Engineering V2 prompt and `docs/ENGINEERING-V2-REVIEW-PROTOCOL.md` completely before reviewing.
- Inspected all six current Slice 09 PNG captures (`desktop-1440.png`, `mobile-390.png`, `start.png`, `mid.png`, `end.png`, and `reduced-motion.png`) and `interaction-notes.md`. The six evidence files are distinct rather than duplicated final captures.
- Inspected all three complete Lighthouse 13.4.1 JSON reports, including the final `lighthouse-mobile-4g-devtools-after-rhythm.json`. None has a Lighthouse `runtimeError`.
- The Chrome DevTools performance MCP was unavailable in this reviewer environment. Therefore I validated the supplied full DevTools-method Lighthouse JSON directly and supplemented it with fresh isolated Chromium checks for viewport geometry, real touch emulation, keyboard/focus, reduced motion, network failures, image decoding, animation completion, and scroll responsiveness.
- Re-ran the non-mutating checks: `svelte-check` reports **0 errors and 0 warnings**; Vitest reports **4 files / 19 tests passed**.

## Lighthouse hard gates and preserved failure history

### Preserved wrong-profile diagnostic — FAIL, correctly retained

`lighthouse-mobile-4g.json` remains a genuine failed run and must not be described as passing:

- method: `simulate`;
- emulation: 412×823 at DPR 1.75, not the mandated 390×844 profile;
- performance: 27;
- FCP: 11.875 s;
- LCP: **12.435 s — FAIL**;
- CLS: 0;
- TBT: 2,049.5 ms;
- transfer: 451,463 bytes;
- its trace attributes 27.49 s to Style & Layout on the host.

The failed JSON is preserved rather than overwritten or retrospectively converted to PASS.

### Final post-fix DevTools 390×844 run — PASS

`lighthouse-mobile-4g-devtools.json` remains the valid pre-rhythm history. The current gate evidence is `lighthouse-mobile-4g-devtools-after-rhythm.json`, which is valid and uses the required test geometry and method:

- method: `devtools`;
- emulation: exactly 390×844 at DPR 1;
- network/CPU settings: 150 ms RTT, 1,638.4 Kbps throughput, 4× CPU slowdown;
- performance: 86;
- accessibility: 100;
- FCP: 1.550 s;
- LCP: **1.550 s — PASS (<2.5 s)**;
- CLS: **0 — PASS (<0.1)**;
- TBT: 516.47 ms;
- Speed Index: 2.910 s;
- 32 network requests and 451,526 bytes (about 441 KiB) transferred;
- no third-party request payload is present in the resource summary.

Only the two required mobile hero WebP plates are initial image requests. The report records no simultaneous PNG fallback downloads. Eight WOFF2 font requests account for 89,940 bytes. TBT 516.47 ms is in the needs-improvement band but remains below the 600 ms poor threshold and does not violate the specification's hard LCP/CLS gates. The Windows Chrome Launcher `EPERM` cleanup error happened after a complete parseable JSON report was written; because the report has no runtime/page error, this is a host cleanup issue, not a page failure.

## Responsive layout, overflow, and images — PASS

Fresh live checks used every mandatory viewport:

- 320×568;
- 360×800;
- 375×812;
- 390×844;
- 430×932;
- 768×1024;
- 1024×1366;
- 1440×1000;
- 1920×1080.

At every size, `documentElement.scrollWidth <= clientWidth`; no horizontal overflow was found. A separate 390×844 sweep of all homepage/service/case/diagnosis/privacy pages also found one H1, no overflow, no decoded broken image, and a non-empty title on each rendered route. In particular, the previously failing impact-case and privacy pages now pass at 320 and 390 px without forced word splitting.

A real mobile Chromium context reported `maxTouchPoints=1` and `pointer: coarse`. Tapping the 44×44 menu button opened the menu, moved focus to its first link, and applied scroll locking. The corrected menu primary CTA is 52 px high at 320, 390, and 430 px. The 24×24 consent checkbox is backed by its associated 354.8×64.8 clickable label. No remaining obvious touch target below the 44 px requirement was found.

After a complete homepage scroll, browser request monitoring recorded:

- zero console errors;
- zero page errors;
- zero failed requests;
- zero responses with status >=400;
- eight unique image requests across the responsive/full-scroll run, all WebP;
- no PNG+WebP duplicate transfer for the same image stem;
- zero decoded broken images and no missing `alt` attribute.

The normal mobile renovation controls were exercised through all three stages; all three 1672 px-wide WebP plates decoded successfully. Case-image alternatives explicitly identify the imagery as illustrative. Hero/diagram layers that convey no additional content use empty alternatives or hidden semantics.

## Semantics, keyboard, focus, and forms — PASS

- The homepage has one `main#main`, one H1, navigation and footer landmarks, a working `К содержанию` skip link, and no duplicate IDs.
- Keyboard focus is visibly drawn with a 2 px outline and 3 px offset. The first Tab reveals the skip link at 151.7×50.3 px; the next focused brand link is 154×44 px.
- The mobile menu traps focus in both directions, `Escape` closes it, and focus returns to the menu button. The document scroll lock is removed on close.
- Symptom tabs use selected state, roving `tabindex`, `aria-controls`, and an `aria-labelledby` panel. `End`, all four Arrow keys, `Home`, and wrap-around were re-exercised with the finite transition allowed to commit; each focused tab became selected with `tabindex=0`, the panel label followed it, and `aria-busy` returned to false.
- Construction tabs likewise use selected state, roving focus, controlled/labelled panel semantics, and support `End`/Arrow navigation. The active Floor control measured about 118×60 px.
- FAQ disclosure buttons expose `aria-expanded` and `aria-controls`; Enter opened the controlled answer.
- An empty short-form submission focused `p#short-form-error[role=alert]`; five invalid fields exposed `aria-invalid` and referenced that summary with `aria-describedby`.
- An incomplete full diagnosis step focused `p#diagnosis-step-error[role=alert]`; four invalid controls exposed `aria-invalid` and referenced the summary. Forward, Back, and edit transitions restore focus to the newly current group heading/legend.
- The current API/form behavior gives visible asynchronous success or honest delivery failure feedback and retains entered data on failure; it does not manufacture a CRM success.
- The final post-fix Lighthouse accessibility category scores **100**; its color-contrast, heading-order, bypass, naming, and ARIA audits pass. Fresh DOM/accessibility checks found one `main#main`, one H1, no duplicate IDs, named controls, and no unreadable technical-caption hard fail. The former touch-size defect was verified manually rather than inferred from the automated score, and now passes at 52 px.
- Meaningful engineering SVGs have an accessible role and title/description or explicit label. The one untitled method-map SVG is inside an `aria-hidden=true` ancestor and is correctly excluded from the accessibility tree.

## Reduced motion and runtime behavior — PASS

With real browser emulation of `prefers-reduced-motion: reduce` at 390×844:

- the media query matched;
- `scrollWidth === clientWidth`;
- no decoded image was broken;
- the hero cutaway computed to opacity 1;
- the sticky renovation scene computed to `display:none` and `position:relative`;
- the complete normal-flow reduced renovation sequence computed to `display:grid`;
- running animation count was **0**.

In normal motion, the interactive transitions are finite: after a complete homepage scroll and the completion window, the running animation count returned to 0. Scroll-driven layout reads in the hero, header, and renovation chapter remain requestAnimationFrame-throttled; no infinite animation or persistent scroll stall was found.

## Routes, metadata, fonts, and product isolation — PASS

- The root, seven service routes, diagnosis, cases index, three case details, and privacy policy return 200. `/privacy/` intentionally returns 308 to `/privacy-policy/`.
- `sitemap.xml` returns 200 with 14 canonical locations. `robots.txt` returns 200, allows `/`, disallows `/api/`, and publishes the sitemap URL. A GET to `/api/diagnosis` correctly returns 405.
- The current built server output serves the reviewed post-rhythm browser state. A fresh 390×844 Chromium sweep of all 15 HTML route entries found one H1, no horizontal overflow, no initially decoded broken image, and a non-empty title on every final page; `/privacy/` followed its intentional redirect.
- Font source contains only Geologica, Onest, and IBM Plex Mono WOFF2 faces with `font-display: optional`. A targeted source/static scan found no `Inter` font reference.
- `git diff -- apps/tech` is empty. Engineering source/static contain no `apps/tech` or `/tech/` runtime import/reference, so the frozen Tech concept remains isolated.

## Non-blocking observations

- The passing post-fix DevTools report's 516 ms TBT and the 89.9 KiB font transfer are non-blocking performance optimization targets; current LCP and CLS pass with margin.
- Production publication still depends on owner-supplied domain, contact/legal details, analytics ID, and Bitrix mapping. Those are launch prerequisites outside this accessibility/performance verdict.
- This PASS does not override any separate Slice 09 Visual, Conversion, or other independent role verdict.

No current accessibility or performance hard blocker was found in the reviewed build.
