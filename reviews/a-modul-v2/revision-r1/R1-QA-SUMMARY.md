# Revision Milestone R1 — deterministic QA

Status: **PASS**

- Svelte typecheck: 0 errors, 0 warnings.
- Production build: PASS.
- Unit tests: 5 files, 20 tests, all passed.
- Route status: all four landing routes, privacy policy, robots and sitemap returned HTTP 200.
- Console errors: 0.
- Page errors: 0.
- Failed requests: 0.
- Broken decoded images: 0.
- Horizontal overflow: none at 320, 390, 768, 1440 and 1920 CSS pixels.
- H1 and primary CTA: rendered at every tested width. The general H1 is 3 lines at 1440/1920 and 5 lines at 390; copy/caption overlap at 768 is 0 px².
- Hero motion trace: stages `0 → 1 → 2 → 3` at scroll progress `0 → 32 → 62 → 96`.
- Mobile hero: exactly three direct stages; Next advances from site to assembly.
- Reduced motion: final operational stage and labelled planning legend rendered, assembly position is non-sticky, no dead scroll space.
- Commissioning UX: no native month input; five segmented options; exact-date mode exposes month and year selects. Browser serialization verifies both `3–6 месяцев` and `2027-12` in the mini-brief and the carried full-form field, before and after reload, including both submitted `FormData` payloads.
- Proof block: six verified facts; 708px tall at 1440×1000.

Machine-readable details are in `r1-qa-results.json` and `motion-trace.json`. The user explicitly prohibited video, so motion evidence is represented by start/mid/end frames, a difference image, and a deterministic trace.
