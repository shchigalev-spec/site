# Milestone C — Conversion + Factual Review R2

Independent read-only review. No files were modified.

## Consolidated issues

| Severity | Location | Evidence | Required correction |
|---|---|---|---|
| P1 | `projectContext.ts`, `MiniBrief.svelte`, `FullLeadForm.svelte` | Context uses one global `userEdited` flag. After changing only region or capacity on `/modulnye-zdaniya/`, navigating to `/modulnye-ofisy-abk/` leaves both forms set to `shift` instead of `abk`. The query-free general route also silently begins as a 100-person shift camp. | Track user edits per field. Apply each route’s object default unless the object itself was explicitly changed; preserve independently edited region/capacity fields. Use a neutral object selection on the generic route. |
| P1 | `RoutePlanner.svelte`, `ObjectConfigurator.svelte`, `FullLeadForm.svelte`, `lead-adapter.ts` | Diagnostic choices are lost. Selecting 100 office workplaces and removing “Переговорные,” then clicking “Передать сценарий в диагностику,” leaves mini/full forms at 50 workplaces with default zones. General configurator zones appear in the mini summary but no zone/composition field is serialized into the full form or CRM payload. | Store planner scale/functions in shared context and serialize the complete diagnostic composition into the lead contract. Verify the posted payload contains the choices advertised as transferred. |
| P1 | `FullLeadForm.svelte` | The form falsely says entered data is preserved. On client validation failure, entered `321`, `123.45 м²`, and `2027-08` reset to `100`, blank, and blank. The same reset occurs after a controlled 503, although phone, comment and attachment remain. | Bind all dynamic form fields to stable local state and retain every field and attachment after client validation, 422, 503, network failure, and malformed responses. |
| P1 | `RouteHero.svelte`, `navigation.ts`, `MiniBrief.svelte` | “Пригласить в тендер” navigates to `#project-brief`, not the dedicated tender form. The visitor lands on the generic four-field brief whose CTA still says “Получить КП за 1 рабочий день”; actual tender fields were about 14,000 px farther down in the tested general route. | Send tender CTAs directly to `?mode=tender#full-brief`, or provide a genuinely tender-specific first step with tender wording and fields. |
| P1 | `routes/+page.server.ts`, `analytics.ts` | Root redirect discards campaign attribution. Opening `/?utm_source=yandex&utm_campaign=root-test&yclid=abc123` ends at `/modulnye-zdaniya/`; session attribution contains none of those values. | Preserve the complete allowlisted query string through the root redirect and add an automated root-attribution test. |
| P1 | `ProjectFinder.svelte`, stale copy in `routes.ts` | Public copy changes the verified case fact to `105 жилых модулей`; stale route data additionally says `с тамбурами`. The official case states `105 одиночных модулей с крыльцами`. | Use the source-approved wording exactly unless another official source establishes residential use or vestibules. |
| P2 | Office/ABK route | Its “Релевантный контур” is generic planning copy and a conceptual visualization, not the strongest verified office/ABK case required by the master specification. | Add a verified public office/ABK case with sourced task, scope and result, while retaining generated-visualization disclosure. |
| P2 | `routes.ts`, route head/schema code | Primary canonicals, OG URLs and structured-data IDs are hardcoded to `https://a-modul.ru`, while sitemap, robots and privacy use `PUBLIC_SITE_URL`. | Resolve one validated public origin and use it consistently for all absolute URLs. |
| P2 | `privacy-policy/+page.svelte` | The consent link points to a page that publicly states its legal text is not finally approved and omits final legal bases, recipients and retention terms. | Replace it with the owner-approved policy before accepting real production leads; keep production readiness explicitly blocked until then. |

## Severity counts

- P0: 0
- P1: 6
- P2: 3
- P3: 0

## Verdict

**FAIL** — six P1 issues remain. Milestone C must not proceed to Milestone D.
