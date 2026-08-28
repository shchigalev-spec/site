# A-Modul Direct V2 — launch checklist

This checklist separates verified code from external owner/deployment dependencies. An unchecked external item is a real release blocker and must not be replaced with a placeholder.

## Verified in the release candidate

- [x] Independent `apps/a-modul` application; Silent Lab products unchanged.
- [x] Four primary routes, root redirect, query/region variants, branded 404, privacy route, sitemap, and robots.
- [x] One H1, visible diagnosis CTA, no horizontal overflow, no broken images, and no browser runtime errors at the required viewports.
- [x] Standard, tender, leasing, attachment, client validation, 422, controlled 503, and exact confirmed-success flows.
- [x] UTM/yclid first-touch persistence and root-redirect preservation.
- [x] Analytics allowlist with PII and filename exclusion.
- [x] Responsive AVIF/WebP generated assets with intrinsic dimensions; no video or remote stock media.
- [x] Keyboard navigation, visible focus, skip link, menu trap/Escape/focus return, labels, field error associations, touch targets, and reduced-motion completion.
- [x] Typecheck, lint, focused Vitest suite, production build, browser QA, and final milestone evidence.

## Deployment configuration

- [ ] Set the final HTTPS `ORIGIN`, or trusted proxy headers that are overwritten by the proxy.
- [ ] Set and test `BODY_SIZE_LIMIT=45M` (or equivalent upstream boundary) before multipart materialization.
- [ ] Configure the real HTTPS CRM webhook/token and verify standard, tender, leasing, attachments, non-2xx, timeout, and retry handling.
- [ ] Ensure application/proxy logs never capture request bodies, contact fields, filenames, authorization, UTM identifiers, or file content.
- [ ] Configure the final `PUBLIC_SITE_URL`, phone, email, Yandex Metrica ID, and consent-aware call tracking.
- [ ] Verify cache/compression headers for immutable assets at the production edge.

## Owner approvals

- [ ] Approve the final privacy policy, legal bases, recipients, retention periods, and consent-recording process.
- [ ] Approve final public claims and case labels against `A-MODUL-SOURCE-FACTS.md`.
- [x] Verify the Office/ABK route case against the official ООО «Эр Ликид Кузбасс» project page and retain an explicit generated-visual disclosure.
- [ ] Resolve the public dormitory-case locality conflict before publishing an exact location.
- [ ] Approve any customer-name/logo rail and provide official cleared assets.

## Release procedure

1. Install dependencies from the repository lockfile.
2. Run `check`, `lint`, `test`, and `build` for `apps/a-modul`.
3. Start the adapter-node production build with final origin/body/proxy configuration.
4. Run route, conversion, accessibility, reduced-motion, responsive, console, image, attribution, SEO, and performance verification.
5. Inspect the complete changed-file inventory and confirm no secret or generation master is in `apps/a-modul/static`.
6. Require explicit aggregate PASS from the three Milestone D directors.
7. Commit and push `feature/a-modul-direct-landing-v2`; open a draft PR; do not merge `main`.
