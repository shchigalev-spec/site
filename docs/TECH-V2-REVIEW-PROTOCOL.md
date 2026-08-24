# Tech V2 review protocol

Tech V2 uses current rendered evidence and independent read-only review. It does not inherit the former 94/100 score.

## Legacy generator

`scripts/build-review-evidence.mjs` is a retrospective legacy generator: it copies final screenshots into slice folders and writes PASS automatically. It is prohibited for Tech V2. The root command is deliberately renamed to `reviews:legacy:build` so it cannot be mistaken for the V2 workflow.

`scripts/tech-v2-capture.mjs` is the V2 evidence capture. It creates screenshots, WebM, route/console/image/overflow results, and factual interaction notes only. It never creates reviewer reports and never writes PASS or FAIL.

## Slice gate

For each slice:

1. Implement the bounded slice.
2. Run the actual Tech application.
3. Capture new desktop, mobile, start/quarter/mid/three-quarter/end, motion, touch, and reduced-motion evidence into that slice's directory.
4. Give the evidence and implementation to independent read-only reviewers.
5. Record visual, motion, conversion, and accessibility/performance findings.
6. Write `PASS` only after reviewer sign-off, clean console, no hard fail, and both desktop/mobile/reduced-motion evidence.
7. On FAIL, fix the root defect, recapture into the same current slice, and repeat review before beginning the next slice.

Reviewers do not edit code. Builder notes and reviewer notes remain separate. Old `reviews/tech/` material is historical context only and cannot satisfy a V2 gate.

## Required slice evidence

Each `reviews/tech-v2/slice-XX/` directory contains:

- `desktop-1440.png`, `mobile-390.png`;
- `start.png`, `quarter.png`, `mid.png`, `three-quarter.png`, `end.png`;
- `motion.webm` (or a trace if WebM fails);
- `interaction-notes.md`;
- `visual-review.md`, `motion-review.md`, `conversion-review.md`, `accessibility-performance-review.md`;
- `PASS-FAIL.md`.

Extra evidence such as `reduced-motion.png`, viewport captures, metrics, traces, or defect recaptures is retained alongside the required files.
