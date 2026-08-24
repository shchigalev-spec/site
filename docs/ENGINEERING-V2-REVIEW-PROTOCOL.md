# Engineering V2 review protocol

## Why legacy evidence is excluded

`scripts/build-review-evidence.mjs` copied final screenshots into historical slice folders and wrote PASS automatically. It is now exposed only as `reviews:legacy:build` and refuses to run once `reviews/engineering-v2/` exists. Its screenshots, generated PASS files, and inherited numeric scores are not valid V2 evidence.

## Slice gate

For every slice, the builder must:

1. implement the scoped behaviour;
2. run the real Engineering app;
3. capture current desktop, mobile, and start/mid/end evidence;
4. run the same slice in a browser with `prefers-reduced-motion: reduce` and capture or record the complete static explanatory state;
5. verify the mobile layout, reduced-motion state, and browser console before review;
6. stop editing while independent read-only reviewers inspect that evidence;
7. record their concrete findings;
8. write PASS only when every role reports no hard fail and desktop, mobile, reduced motion, and a clean console have all passed;
9. revise, recapture, and repeat on FAIL.

The four review roles are Visual Director, Motion and Interaction Reviewer, Conversion Reviewer, and Accessibility and Performance Reviewer. Reviewers do not edit source.

## Hard-fail handling

Text overlap, abrupt motion state swaps, empty scroll, infinite primary motion, mismatched image continuity, broken images, console errors, horizontal overflow, hidden content, lost mobile interaction, inaccessible controls, missing or incomplete reduced-motion browser verification, fake claims, fake success, dominant equal-card repetition, reused screenshots, or generated PASS output force FAIL.

`PASS-FAIL.md` is a human-authored transcription of the independent verdict and evidence. Numeric scores are not used.
