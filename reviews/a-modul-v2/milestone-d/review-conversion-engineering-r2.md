## Milestone D R2 — Conversion + Engineering/Factual Director

Severity counts: **P0 0 · P1 0 · P2 0 · P3 2**

### P3 — stale source-register metadata

`docs/A-MODUL-SOURCE-FACTS.md` correctly states near the top that the final register has 13 attempted URLs, 1 dead URL, and 12 live sources, but the final conflicts-table row still says 12 / 1 / 11. The header date also predates the final Moscow-local evidence run. This is internal documentation polish; public facts and source links remain correct.

Retest: reconcile the historical count/date without changing public content.

### P3 — referrer sanitizer should reject non-HTTP protocols immediately

`analytics.ts` validates referrer structure but does not explicitly require HTTP(S). When poisoned session storage is injected after initial attribution capture, `javascript:alert(1)` becomes the inert string `nullalert(1)` and can enter an analytics detail as `referrer`. It cannot execute, exposes none of the forbidden personal-data keys, and does not affect normal browser referrers, but protocol validation should match the stricter server sanitizer.

Retest: require `http:` or `https:` in `safeReferrer()` and add a direct sanitizer regression.

### Independently verified

- Read both authoritative specifications completely and reviewed the whole final milestone, not only R1 changes.
- Real UI at `:4175` and `:5175`: all four routes have distinct intent-matched H1/support content, primary/tender diagnosis CTAs, and visible one-day qualification.
- Real mock submissions for standard, leasing, and tender returned confirmed `201` success with correct modes; invalid phone was blocked client-side, received `aria-invalid=true`, focused the phone field, and made no API request.
- Same-origin production submission returned controlled `503 CRM_CONFIGURATION_ERROR`, `preserveState: true`, and no false success.
- Independent multipart API probes confirmed:
  - valid standard request → `201`;
  - implausible phone → `422`;
  - invalid object/metric/region/stage/scope/zone → `422`;
  - incoherent metric/object pair → `422`;
  - malformed commissioning month → `422`;
  - malformed tender contact/date → `422`.
- Shared server validation covers canonical mode, object, capacity metric, region, project stage, dates, scopes, functional zones, contact plausibility, file count/type/size, and coherent object/metric/zone relationships.
- Unknown route/type/region/landing variants are discarded before forwarding; `pageUrl` retains only allowed route/query context.
- Poisoned attribution containing name, phone, email, company, filename, comment, contact, and arbitrary fields was independently exercised through a real phone-click event; none reached emitted analytics or retained storage.
- No request-body, contact, filename, token, or attachment logging was found. No committed secret patterns were found.
- Office/ABK public copy matches the official [ООО «Эр Ликид Кузбасс» case](https://a-modul.ru/object/administrativno-bytovoy-kompleks-abk/): 427 m², 28 modules, two storeys, Novokuznetsk, and the published work scope. Its generated visual is explicitly disclosed as non-documentary.
- Kamchatka copy correctly uses `обсерватор`; area, composition, scope, logistics, and dates match the official [shift-camp case](https://a-modul.ru/object/vakhtoviy-poselok-na-odnom-iz-krupneyshikh-mestorozhdeniy-zolota/).
- Dormitory figures match the official case while correctly withholding the conflicting locality.
- The locked magnitude 8.8 statement and supporting seismic wording match the official source and remain case-bound.
- No invented price, delivery quote, duration, review, certificate, customer logo, or universal engineering precision was found.
- Canonicals, query `noindex,follow`, root 307 attribution preservation, unique metadata/H1s, structured data, sitemap, robots, privacy, and 404 evidence are coherent.
- `changed-files.txt` exactly matches all 288 current modified/untracked files plus the three anticipated R2 report paths. No A-Modul source change exists under `apps/tech` or `apps/engineering`.
- Recorded final checks are internally consistent: 5 test files / 18 tests, clean typecheck/lint/build, integrated browser QA with zero unexpected runtime defects, production 422/413/503 coverage, and truthful external launch prerequisites.
- Final CRM credentials, legal approval, production domain/contacts, Metrica, call tracking, and owner claim approval remain explicitly documented activation prerequisites.

PASS
