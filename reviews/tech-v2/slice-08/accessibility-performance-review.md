# Slice 08 accessibility and performance review

Verdict: **PASS after one FAIL and recapture**

The first independent review failed because three case routes used `$page.url.href` for Open Graph and Article structured-data URLs, retaining UTM parameters. The implementation now uses the same origin-plus-pathname URL as canonical. The capture explicitly navigates all three cases with UTM and records equal clean canonical, `og:url`, and `Article.url` values.

Fresh evidence:

- browser capture: `2026-08-20T10:55:08.616Z`, `failures: []`;
- performance capture: `2026-08-20T10:59:35.187Z`, `failures: []`;
- median throttled mobile Lighthouse LCP: `2647 ms`;
- Lighthouse CLS: `0.0072`, `0.0072`, `0.0080`; traversal CLS: `0.00369` desktop and `0.00138` mobile;
- interaction tasks above 200 ms: zero;
- Lighthouse accessibility: `1.00` in all three final runs;
- keyboard/touch, reduced motion, target size, responsive image, console, broken-resource, overflow, canonical, Open Graph, and JSON-LD checks: no blocker.

One Lighthouse run contained a synthetic 10-second runner task. The other two runs and the dedicated interaction trace did not reproduce it; the median performance score is 91 and the dedicated maximum interaction task is 74 ms.
