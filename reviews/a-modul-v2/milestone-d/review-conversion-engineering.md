BLOCKED

Severity counts: **P0 0 · P1 3 · P2 2 · P3 0**

The Milestone D candidate cannot receive aggregate acceptance while these P1 issues remain.

### P1 — server accepts unusable contacts and invalid taxonomy

Evidence:

- Client validation only requires a non-empty phone or email; it does not validate phone plausibility: `FullLeadForm.svelte`, phone input.
- Server validation likewise accepts any non-empty `phone`, `email`, or `contact`: `lead-adapter.ts`.
- Object type, capacity metric, region, project stage, date, and related enums are not server-allowlisted: `lead-adapter.ts`.

Independent live results on the mock-integrated app:

- A real standard form submission with phone `x`, valid object/region, and consent returned `201`, displayed `Заявка принята`, and left the field with `aria-invalid=false`.
- Direct standard payload containing `objectType=<script>`, `capacityMetric=bogus`, `region=outer-space`, and `phone=x` returned `201 ACCEPTED`.
- Direct tender payload with `deadline=not-a-date`, `region=moon`, and `phone=x` also returned `201 ACCEPTED`.

Unknown allowlisted query keys can therefore carry unvalidated values into attribution and CRM payloads even when the visible SSR experience falls back safely.

Required correction:

- Enforce a shared canonical schema server-side for mode, object type, metric, region, project stage, dates, scopes, and zones.
- When no valid email is present, require a plausible normalized phone, such as 10–15 digits.
- Reject or discard unknown query-variant values before attribution and CRM serialization.
- Add UI and direct API tests proving these payloads return `422`; retain tests for valid standard, tender, leasing, and multipart submissions.

### P1 — poisoned attribution storage bypasses the analytics PII invariant

Evidence in `analytics.ts`:

- `captureAttribution()` parses existing session storage without removing unknown keys.
- `getAttribution()` returns those keys.
- `trackEvent()` filters only its caller payload before merging unfiltered attribution into the browser event and Metrica payload.

Independent live reproduction:

1. Set `a-modul-attribution-v1` to `{"name":"Sensitive Name","phone":"123","utm_source":"safe"}`.
2. Clicked the real footer phone link.
3. The emitted event contained both `name` and `phone`.

This breaks the stated absolute rule that analytics must never receive names, phones, emails, company names, filenames, or comments.

Required correction:

- Apply a strict attribution-key allowlist and value bounds when reading storage.
- Sanitize the final merged event immediately before `dispatchEvent` and `ym`.
- Never return arbitrary stored keys.
- Add a poisoned-storage regression test covering every forbidden field.

### P1 — mandatory Office/ABK realized case is missing despite verified sources existing

The office route remains a generic conceptual presentation in `routes.ts`. It does not contain the mandatory route-specific verified public case.

The launch documents incorrectly state that no verified Office/ABK case is available.

Official A‑Modul case pages are available, including:

- [ABK for Air Liquide Kuzbass](https://a-modul.ru/object/administrativno-bytovoy-kompleks-abk/) — 427 m², 28 modules, two storeys.
- [Single-storey ABK for Impokar](https://a-modul.ru/object/odnoetazhniy-administrativno-bytovoy-kompleks-abk/) — 263 m², 14 modules, Novosibirsk.
- [Modular sales office](https://a-modul.ru/object/modulniy-ofis-prodazh-dlya-zastroyschika/) — 130 m², seven modules, Tyumen.

Required correction:

- Select the strongest appropriate official case and use only its verified facts.
- Keep the Codex-generated visual but disclose it explicitly as a visualization of the realized project, not documentary customer photography.
- Update the source-facts, launch-checklist, and backlog statements.
- Regenerate office-route evidence and relevant assertions.

### P2 — inaccurate Kamchatka facility terminology

`ProofCase.svelte` calls the five-module facility an `изолятор`. The official case uses `обсерватор`.

Required correction: use the exact public term `обсерватор` throughout the public copy and source-facts documentation.

### P2 — promised final changed-file inventory is absent

`DIFF-SUMMARY.md` promises `changed-files.txt`, but that file does not exist. `COMMAND-RESULTS.log` now preserves final command output, so only the exact final inventory remains missing.

Required correction: generate the inventory from the actual final candidate after all fixes and before the fresh gate.

### Inspected and passing

- All four production routes return `200`, with one route-specific H1, visible primary CTA, qualified one-day promise, and correct canonical.
- All allowlisted type and region variants work; variants are `noindex,follow` and canonicalize to the base route.
- Disabled `haski` behavior remains generic and noindexed.
- Mini-brief, configurator, planner, and full-form transfer preserve the intended values.
- Valid standard, tender, and leasing mock submissions succeed.
- Production without a CRM webhook returns a truthful `503`, shows no fake success, and preserves entered data.
- Multipart handling, file restrictions, safe filenames, upstream timeout, HTTPS webhook enforcement, `413`, and `422` response mapping are implemented.
- Redirect attribution preservation, robots, sitemap, privacy route, branded 404, canonical handling, and schema were inspected.
- Public production, capacity, seismic, leasing, and realized-case facts are generally supported by official A‑Modul sources.
- Generated-image disclosure is otherwise clear; no prohibited video, stock customer imagery, or unapproved customer logos were found.
- Recorded typecheck, lint, build, test, and browser-QA outputs are present in `COMMAND-RESULTS.log`.
- Existing Silent Lab applications have no source changes.

External CRM credentials, final legal/privacy approval, production contacts, Metrica/call-tracking identifiers, and domain configuration remain honestly documented launch prerequisites. Their absence is not disguised by the release candidate.

After correction, recreate affected browser/API/analytics/office-route evidence and invoke a fresh Conversion + Engineering/Factual review. Because replacing the Office case materially changes route content and presentation, the Visual + Motion verdict must also be refreshed if it was issued against this candidate.
