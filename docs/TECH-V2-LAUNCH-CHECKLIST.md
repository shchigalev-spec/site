# Tech V2 launch checklist

Checked items are backed by the final Slice 09 run. Unchecked owner-data items must remain visible.

## Application and routes

- [x] Final Slice 09 browser capture is current to the final build.
- [x] All 17 required routes return HTTP 200 in the final production run.
- [x] Tech check, lint, test and build pass.
- [x] Root check:all, lint:all, test:all and build:all pass.
- [x] `apps/engineering` has no source diff and no Tech runtime import.
- [x] Every major CTA leads to `/diagnostika-shuma/`.
- [x] Case imagery is labelled illustrative.

## Browser and performance

- [x] Desktop 1440, tablet 768, mobile 390 and mobile 320 have no document overflow or hard collision.
- [x] Touch menu, hero state control, scenario controls, forms and sticky CTA behavior pass.
- [x] Keyboard tablists and state controls pass.
- [x] Reduced motion preserves conclusions with zero running animations.
- [x] Median throttled mobile LCP is 2647 ms; final Lighthouse CLS values are below 0.01.
- [x] Normal interaction tasks above 200 ms are absent; final observed maximum is 101 ms.
- [x] No console errors, broken images, duplicate raster formats or off-screen running animations remain.

## Conversion and integration

- [x] Scenario context reaches both short and full forms.
- [x] File validation, server-error handling, development success and production guard are covered by tests/browser evidence.
- [x] Analytics payloads exclude entered PII and preserve the Tech concept/context fields.
- [ ] Production Bitrix credentials and field mapping are supplied and tested against the real CRM.
- [ ] Production Metrica ID and consent policy are approved.

## Owner/legal values

- [ ] Production domain is confirmed.
- [ ] Public phone and email are approved.
- [ ] Privacy and consent text are legally approved.
- [ ] Attachment retention/deletion ownership is documented.

Tech V2 must not be described as production-ready while the unchecked owner, legal, domain, analytics or CRM values remain unresolved.
