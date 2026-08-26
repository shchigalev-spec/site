# Milestone C — Routes + Conversion Infrastructure

## Gate scope

- Four primary indexable routes: `/modulnye-zdaniya/`, `/vahtovye-poselki/`, `/modulnye-ofisy-abk/`, `/modulnye-obshchezhitiya/`.
- Allowlisted object-type query variants and the three required region variants, canonicalized to the primary route and marked `noindex,follow`.
- Shared mini-brief and a server-confirmed full form with standard, tender, and leasing modes.
- Optional PDF, DOCX, XLSX, DWG, JPG, PNG, and ZIP attachments with client/server limits and no false storage claim.
- Multipart CRM adapter with dev-only mock, configurable webhook, controlled production configuration failure, state preservation, and no PII logging.
- Safe Metrica event layer, UTM/yclid/referrer/route/variant persistence, optional call-tracking loader, and stable fallback contacts.
- Unique title, description, H1, canonical, Open Graph, Breadcrumb/Organization/ProfessionalService/Service/FAQ structured data for every primary route.
- Four-route sitemap, robots, privacy page, and branded 404.
- Codex-generated office/ABK visual anchor; all case imagery remains explicitly labelled as visualization.

## Factual boundaries

No prices, rates, payment schedules, invented reviews, addresses, project specifications, durations, guarantees, or certificates were added. The office/ABK route makes no invented case claim. Kamchatka and dormitory case facts are limited to the locked source-fact register.

## Acceptance rule

Two fresh read-only reviewers inspect the complete milestone and return one consolidated issue list each. Milestone C may proceed on `PASS` or `CONDITIONAL PASS` only when both reports contain zero P0 and zero P1 issues.
