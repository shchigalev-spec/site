# Milestone C — Technical QA Review R2

Fresh independent read-only review. No files were modified.

## Consolidated issues

| Severity | Location | Evidence | Required correction |
|---|---|---|---|
| P1 | `projectContext.ts`, `MiniBrief.svelte`, `FullLeadForm.svelte` | One global dirty flag makes a region-only edit retain `shift` on the office route instead of applying the untouched `abk` route default. | Track provenance per field. Route defaults replace untouched object type while preserving only explicitly edited fields; query intent retains precedence. |
| P1 | `FullLeadForm.svelte`, server `STRING_LIMITS` | Live 422 responses for a 241-character company, 81-character phone, and 4001-character comment focus a control but render no associated field error; phone remains `aria-invalid=false` while the status says to check highlighted fields. | Render/associate every server-returnable field error, set `aria-invalid`, add appropriate client limits, and focus the relevant field. Capacity focus must distinguish personnel from area. |
| P1 | `.env.example`, `A-MODUL-INTEGRATION.md`, adapter-node deployment | A production build started with the documented variables returns SvelteKit 403 CSRF for same-site multipart POST until adapter-node `ORIGIN` is configured; with `ORIGIN` the request correctly reaches controlled CRM handling. | Document/configure adapter-node `ORIGIN`, or the correct trusted proxy `PROTOCOL_HEADER`/`HOST_HEADER` arrangement, and retest production form POSTs. |
| P1 | `routes.ts`, shift `caseFacts` | Live copy says `105 жилых модулей с тамбурами`; the locked register and official source say `105 одиночных модулей с крыльцами`. | Use the exact verified wording or lower unsupported detail. |
| P2 | `/api/leads/+server.ts` | Multipart limits are checked after `request.formData()` has materialized the body. | Enforce/document upstream deployment body limits. |
| P2 | `apps/a-modul/package.json` | Test passes only through `--passWithNoTests`; there is no focused automated suite. | Add tests for context precedence, lead parsing/error mapping, mode isolation, analytics privacy, metadata and SEO endpoints. |
| P2 | Milestone C evidence | No reproducible LCP, CLS, mobile-4G, long-task or main-thread measurement. | Add performance evidence before final gate. |
| P2 | route metadata/schema | Primary absolute URLs are hardcoded while sitemap/robots/privacy use `PUBLIC_SITE_URL`. | Centralize validated public origin. |
| P2 | Milestone evidence | Diff summary is not an actual changed-file inventory; raw command output is not retained; trace stops after the initial desktop route and omits critical conversion modes. | Add actual diff inventory, raw outputs, and traces/screenshots for critical modes. |
| P2 | docs/app | README, design-system, motion-spec and launch checklist are absent; review protocol still states the superseded slice workflow. | Align documentation with implementation and active override. |
| P3 | `LogisticsMap.svelte` | Delayed completion timeout is not cancelled on replacement/unmount. | Cancel the timer on replacement/unmount. |

## Severity counts

- P0: 0
- P1: 4
- P2: 6
- P3: 1

## Verdict

**FAIL** — four P1 blockers remain.
