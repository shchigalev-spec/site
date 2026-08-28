# Slice 00 — exact acceptance requirements

Implement and review **only** Slice 00: Audit and source facts.

Required deliverables:

- working branch `feature/a-modul-direct-landing-v2`, based on the latest fetched `origin/main`;
- actual base SHA recorded;
- repository/workspace audit that protects `apps/tech`, `apps/engineering`, and the legacy root application from coupling or edits;
- independent application boundary at `apps/a-modul`, with only the minimal runnable infrastructure needed to inspect this slice;
- official-site fact inventory using the supplied minimum official URLs;
- route plan and embedded search-intent mapping;
- source URL list;
- factual/source conflict list with safe precedence decisions;
- visual bible based on the official Avista logo/brand colours and the Controlled Launch direction;
- mandatory native-review protocol;
- the five required documents:
  - `docs/A-MODUL-SOURCE-FACTS.md`;
  - `docs/A-MODUL-CONTENT-TODO.md`;
  - `docs/A-MODUL-SEARCH-INTENT.md`;
  - `docs/A-MODUL-IMAGE-BIBLE.md`;
  - `docs/A-MODUL-REVIEW-PROTOCOL.md`.

Current-slice restrictions:

- do not implement the Slice 01 product hero, generated asset family, mini-brief, assembly animation, or proof rail;
- do not modify or import runtime UI, CSS, components, assets, or tokens from the Silent Lab applications;
- do not invent prices, reviews, addresses, complexes, specifications, durations, guarantees, or certificates;
- generated case imagery is not documentary evidence (no production imagery exists in this slice);
- use Geologica, Onest, and IBM Plex Mono; never Inter;
- all primary CTAs in later slices lead to diagnosis;
- no video in the application.

Gate requirements:

- run the real app on port 5175;
- capture fresh 1440 desktop, 390 mobile, start/mid/end, visual diff, Playwright trace, test output, console/error, overflow, and semantic evidence;
- spawn five fresh native read-only reviewer subagents for visual, motion/interaction, conversion, engineering/factual, and accessibility/performance review;
- aggregate PASS is permitted only if all five first-line verdicts are PASS;
- on any FAIL, stop later-slice work, fix Slice 00, recreate evidence, and use five fresh reviewers.
