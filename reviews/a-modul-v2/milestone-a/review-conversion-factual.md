BLOCKED

# Conversion + Factual Review — Milestone A

## Gate summary

- P0: 0
- P1: 1
- P2: 1
- P3: 1

Milestone A is blocked because the first-screen one-working-day promise is presented without its mandatory qualification. The remainder of the public numeric/contact claims inspected in this milestone match live official sources, and no invented price, project duration, logistics price, customer result, legal guarantee, certificate, case fact, or fake form success was found.

## Consolidated issue list

### P1 — The hero's one-working-day promise is unqualified

- Location: `/modulnye-zdaniya/`, initial hero, primary CTA `Получить КП за 1 рабочий день`.
- Evidence: live desktop and mobile hero text contains the CTA but not `После получения основных исходных данных.` Playwright returned `QUALIFIER_IN_HERO false`; the exact qualification appears only much later beside the mini-brief submit control.
- Why this blocks the milestone: the master specification makes this qualification mandatory, and Milestone A's own `SPEC.md` requires the primary CTA and its qualification. On the 320 px and 390 px initial viewports the standalone promise can reasonably be read as an unconditional one-day commercial proposal.
- Required correction: place the exact qualification `После получения основных исходных данных.` in the hero action/context block, visually associated with the primary CTA, without weakening the tender CTA or pushing the primary CTA out of the required initial viewport.
- Retest: inspect 1440×1000, 768×1024, 390×844, and 320×568; assert the CTA and its qualification are both visible/legible in the initial hero and that the mini-brief retains the same truthful qualification.

### P2 — Tender intent is visible but is not carried in the saved diagnostic payload

- Location: `/modulnye-zdaniya/?mode=tender#project-brief`, `MiniBrief.svelte`.
- Evidence: the live page correctly displays `Режим / Приглашение в тендер`, but a valid tender-mode brief stores only `{"objectType":"АБК","metric":"area","area":"1000","region":"Сибирь","commissioning":"2027-09"}` in `sessionStorage`; there is no `mode` or tender flag.
- Impact: the current screen is honest and no downstream form exists yet, so this does not create a false submission in Milestone A. It does, however, make the promised local carry-forward incomplete and risks losing the separate tender context when Milestone C adds the full handoff.
- Required correction: persist an allowlisted `mode: "tender"` alongside the mini-brief data (or an equivalent explicit hidden/context field) and ensure later form/analytics code reads the same value. Do not add tender success behavior before a real server response.
- Retest: submit the live tender variant, inspect the stored payload, reload/navigate to the eventual next step, and confirm tender mode plus all four brief values remain available.

### P3 — The validated status exposes an internal publication note

- Location: mini-brief success/status text after local validation.
- Evidence: live copy ends with `контактный шаг будет подключён перед публикацией`.
- Impact: the message is truthful and therefore not fake success, but it speaks about implementation state rather than the buyer's next action. On a public-facing milestone it weakens authority and makes the diagnostic feel unfinished.
- Required correction: keep the explicit no-submission truth, but rewrite the status in buyer-facing language; when the contact step exists, direct the user to it. Until then, a neutral formulation such as `Параметры сохранены только в этой вкладке. Заявка не отправлена.` is clearer.
- Retest: validate a complete brief and confirm the resulting status states what happened, what did not happen, and the next available action without promising contact or a proposal.

## What passed inspection

### Offer, route, and CTA hierarchy

- The live route uses the exact general-route H1: `Спроектируем, произведём и запустим модульный объект в вашем регионе.`
- The eyebrow and support copy match high-ticket general modular-building intent and explain the operational scope rather than generic `own production` marketing.
- The main hero CTA, header CTA, and final CTA lead to `#project-brief`; the secondary hero CTA switches to `?mode=tender#project-brief` instead of pretending to submit a generic form.
- Default regional/logistics wording is appropriately cautious: `Россия / маршрут уточняем до расчёта`. No fake route, price, or delivery date is shown.
- Price-completeness content is not yet present, but it belongs to Milestone B and no price claim is made in Milestone A; this is not a Milestone A defect.

### Mini-brief behavior and truthfulness

- Empty submission is blocked by native validation.
- Object type, exactly one scale input (area or personnel), region, and desired commissioning month are collected; switching scale changes the submitted field name between `area` and `people`.
- A valid non-tender brief is saved locally as the declared four-input payload.
- The status explicitly says the request was not sent; no lead request, network success, manager-contact claim, or fake confirmation is emitted.
- The form values are not repopulated after reload, but the raw values remain in session storage for later full-form consumption; restoration into a future full form is a Milestone C integration concern.

### Metadata, canonical, and route behavior

- `/` returns HTTP 307 to `/modulnye-zdaniya/`.
- `/modulnye-zdaniya/` returns HTTP 200 with one H1.
- Title: `Модульные здания под ключ по России — Ависта Модуль`.
- Description accurately lists project, production, engineering, delivery, installation, and configuration scope.
- Canonical is exactly `https://a-modul.ru/modulnye-zdaniya/` on both the base and `?mode=tender` variant; the query variant does not create an alternate canonical.

### Public facts and contacts

Mechanically re-fetched official sources returned HTTP 200 and contained the retained claims:

- `https://a-modul.ru/`: `С 2007 года`, `58`, `27 000+`, `2 000+`, and `305 120`.
- `https://a-modul.ru/obshchezhitiya/`: current production values `25 000` and `до 750` (only `до 750` is public in this milestone).
- `https://a-modul.ru/contacts/`: `8 (800) 333-61-31` and `zakaz@a-modul.ru`.
- `https://a-modul.ru/news/27000-modul-dlya-abk-vahtovogo-poselka/`: the 27,000th-module milestone and current capacity of up to 750 modules per month.

The live evidence rail and `facts.ts` use the approved precedence values and stable `С 2007 года` wording. No older `19 100 м²`, `от 600`, calculated year count, disputed dormitory locality, seismic statement, customer logo, or unsupported case number appears in Milestone A.

### Generated-visual framing

- The hero is presented as a controlled four-scene project assembly with `Площадка / Проект / Монтаж / Запуск` controls, not as a named customer case or documentary proof.
- The current milestone does not attach real case facts to the generated hero, so the case-visualization disclaimer is not required here.
- No customer logo, embedded raster copy, generated testimonial, or generated project-performance claim was observed.

## Inspection record

- Working tree: `C:\Users\Admin\Desktop\lab-silence-a-modul-direct-v2`
- Branch/HEAD: `feature/a-modul-direct-landing-v2` at `37004f6e6460203215ed6e57dd396b9421f83eba`; the intended A-Modul files are uncommitted and the unrelated Silent Lab applications are not modified in the reported status.
- Live target: `http://127.0.0.1:5175/modulnye-zdaniya/`.
- Live browser checks: desktop 1440×1000 and mobile 390×844 interactions; current 320×568, 768×1024, desktop, mobile, tender, validated-brief, motion, reduced-motion, and diff evidence reviewed from `reviews/a-modul-v2/milestone-a/`.
- Source inspected: `+page.svelte`, `MiniBrief.svelte`, `HeroAssembly.svelte`, `facts.ts`, layout/redirect files, all `docs/A-MODUL-*.md`, `SPEC.md`, `DIFF-SUMMARY.md`, `TEST-RESULTS.md`, and `qa-results.json`.
- Runtime observations: zero console/page errors during the conversion interaction; root redirect, base route, and tender variant loaded successfully.

## Gate decision

`BLOCKED` until the P1 hero qualification issue is corrected and this Conversion + Factual Reviewer role is reinvoked. The P2/P3 findings are complete non-blocking backlog items under the fast milestone policy.
