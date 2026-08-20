# Engineering V2 launch checklist

## Required owner configuration

- [ ] Set `PUBLIC_SITE_URL` to the final HTTPS origin.
- [ ] Set and verify `PUBLIC_SITE_PHONE` and `PUBLIC_SITE_EMAIL`.
- [ ] Set `PUBLIC_YANDEX_METRICA_ID` and verify goal payloads in the production counter.
- [ ] Set `BITRIX_WEBHOOK_URL`; confirm source, assignee, and `BITRIX_FILE_FIELD` where attachments are accepted.
- [ ] Approve privacy/legal entity text and case facts.

## Technical gate

- [ ] Run `npm install` from the repository root.
- [ ] Run Engineering check, lint, test, and build.
- [ ] Run `npm run check:all`, `npm run lint:all`, `npm run test:all`, and `npm run build:all`.
- [ ] Verify every route listed in the V2 specification returns the intended document and one H1.
- [ ] Verify desktop, tablet, touch mobile, keyboard menu/tablists, reduced motion, forms, file rejection, development success, production guard, canonical URLs, sitemap, robots, console, images, and horizontal overflow.
- [ ] Confirm mobile 4G LCP is under 2.5 s and CLS is under 0.1 on the release build.
- [ ] Confirm `apps/tech` has no diff and still builds.

## Release

- [ ] Review `docs/ENGINEERING-V2-CONTENT-TODO.md`; do not call the release production-ready while owner variables are absent.
- [ ] Review the draft pull request and its current screenshots.
- [ ] Deploy the release candidate, repeat the browser and form tests on the real HTTPS origin, then approve launch.
