# A-Modul Direct V2 — review protocol

> **SUPERSEDED BY MILESTONE WORKFLOW**
>
> The slice cadence and five-reviewer orchestration below are retained only as historical evidence. The active authority is `a-modul-fast-execution-override.md`: four milestone folders, deterministic browser QA before each gate, consolidated severity P0–P3 reports, and role-specific rechecks only after material fixes. Milestones A and B are accepted with no P0/P1; Milestone C requires Conversion + Factual and Technical QA; Milestone D requires the three final directors and an explicit aggregate PASS.

## Milestone D current gate record

- Conversion + Engineering/Factual R2 returned `PASS` with no P0/P1/P2. No conversion or factual area changed afterward, so the override preserves that report.
- Visual + Motion R2 blocked on incomplete visual roles and reduced-motion evidence. The complete Codex-generated asset system and fresh motion evidence were added; this area requires a fresh R3 director.
- Accessibility + Performance R2 returned `CONDITIONAL PASS` with one file-picker naming issue. The name, visible focus, keyboard/pointer activation, request boundary, and fresh performance evidence now pass deterministic QA; this area requires a fresh R3 director.
- The final production and integrated browser runs generated at `2026-08-26T00:04:47.307Z` and `2026-08-26T00:09:26.467Z` both pass with zero runtime defects. No Builder verdict is substituted for the pending directors.

R3 history:

- Accessibility + Performance R3 returned `CONDITIONAL PASS` with P0 0 / P1 0 / P2 2 / P3 0. The override accepts this area because no P0/P1 remains.
- Visual + Motion R3 returned `BLOCKED` with one P1: final-state roles were not integrated and three specialist final derivatives reused Hero binaries. Work stopped; four new Codex masters were generated, final states were added to all four live stories, derivatives and social cards were rebuilt, and fresh desktop/mobile final evidence was created.
- The localized correction materially changes only Visual + Motion. A fresh Visual + Motion R4 director is therefore required; Conversion R2 and Accessibility + Performance R3 remain the active reports for their unchanged areas.

## Historical slice protocol

The main agent is the Orchestrator + Builder. It may implement and fix a slice, but it cannot approve its own work. This protocol applies independently to Slices 00 through 09.

## Gate order

1. Implement only the current slice. Future product sections remain untouched except minimal shared infrastructure required to run/test the current slice.
2. Run the actual `apps/a-modul` application.
3. Create a fresh evidence package in `reviews/a-modul-v2/slice-XX/`.
4. Spawn five fresh native Codex review subagents. Each reviewer is read-only for application/source code and may write only its named report in the current slice directory.
5. Collect all five independent verdicts.
6. The Orchestrator writes `PASS-FAIL.md` as `PASS` only if all five reports begin with `PASS`.
7. If any report begins with `FAIL`, write aggregate `FAIL`, stop later-slice work, fix only the current slice, rerun the application, recreate all current evidence, and invoke five fresh reviewers.
8. Never reuse a reviewer report after code changes, never edit a reviewer verdict, never copy final screenshots into an earlier slice, and never automate approval.

If native subagents are unavailable, the slice remains unaccepted and work stops before the next slice.

## Required evidence

Each slice directory contains:

```text
SPEC.md
DIFF-SUMMARY.md
TEST-RESULTS.md
desktop-1440.png
mobile-390.png
start.png
mid.png
end.png
motion.webm
```

When WebM capture is unavailable or prohibited, use `playwright-trace.zip` plus enough current intermediate frames to prove the complete interaction. The project itself must never ship or use video. Add state-specific screenshots whenever one start/mid/end trio cannot prove the slice.

`SPEC.md` reproduces the exact current-slice acceptance requirements. `DIFF-SUMMARY.md` names the actual changed files. `TEST-RESULTS.md` contains only commands that were actually run and their real output. Evidence is regenerated after every code change.

Reviewers inspect the live running site, current evidence, relevant specification, and code only where behaviour/facts require confirmation. Source-only approval is invalid.

## Five required reviewers

### Visual Review Subagent → `visual-review.md`

Inspect desktop and mobile rendering, hierarchy, composition, generated-image consistency, brand fit, industrial credibility, crop quality, density, geometry, and absence of a generic template/equal-card look.

### Motion and Interaction Review Subagent → `motion-review.md`

Inspect real start/middle/end states, explanatory value, stable conclusions, pointer/keyboard/touch equivalents, reduced-motion behaviour, controls, and absence of loops, dead scroll, abrupt swaps, or jank.

### Conversion Review Subagent → `conversion-review.md`

Inspect three-second offer clarity, route-to-query relevance, price objection, region relevance, CTA hierarchy, project brief, tender mode, next-step clarity, and whether every section advances a buying decision.

### Engineering and Factual Review Subagent → `engineering-review.md`

Verify public facts against `A-MODUL-SOURCE-FACTS.md` and official sources; inspect project/logistics language, scope completeness, seismic wording, case accuracy, units, generated-image labeling, and absence of fake precision, prices, or unsupported claims.

### Accessibility and Performance Review Subagent → `accessibility-performance-review.md`

Inspect semantics, keyboard, focus, labels, touch targets, reduced motion, overflow, console, broken assets, responsive image loading, LCP/CLS evidence, and animation cost across relevant viewports.

## Verdict format

Every report begins with exactly `PASS` or `FAIL` on the first line.

A valid PASS states what live route, viewport/evidence, interaction states, tests, and relevant code/facts were inspected. Generic approval is invalid.

A valid FAIL includes:

1. exact defect;
2. location;
3. evidence;
4. violated requirement;
5. required correction;
6. retest instruction.

## Aggregate and review log

`PASS-FAIL.md` records each reviewer’s first-line verdict and the aggregate. No script writes it. `reviews/a-modul-v2/REVIEW-LOG.md` records slice, cycle, working-tree identifier, fresh subagent identities, verdicts, defects, response files, and aggregate result.

## Hard-fail reminders

- unclear first-screen offer or missing route-specific message;
- generic construction template, unrelated/inconsistent generated imagery, dominant equal-card grids;
- only fade-up motion, meaningless/endless loops, missing reduced-motion content;
- unsupported claim, fake precision, universal/fake price, fake logistics quote, fake form success;
- generated customer logo or misleading case imagery;
- mobile overlap/overflow, broken image, console error, keyboard/touch failure;
- Builder-authored or automated PASS.
