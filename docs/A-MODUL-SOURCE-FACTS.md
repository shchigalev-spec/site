# A-Modul Direct V2 — source facts and repository audit

Status: Slice 00 source inventory
Checked: 2026-08-25 (Europe/Moscow)
Base SHA: `37004f6e6460203215ed6e57dd396b9421f83eba`
Branch: `feature/a-modul-direct-landing-v2`

This file is the internal factual source of truth for the advertising application. Public copy may use only rows marked **Approved**, and generated case imagery must always be identified as visualization rather than documentary photography.

## Repository audit

- Root is an npm workspace. Existing products are `apps/tech` and `apps/engineering`.
- Both existing products are independent SvelteKit applications. They are not visual, runtime, asset, component, CSS, or token sources for A-Modul.
- The legacy root Next.js/Vinext source is unrelated and is not used by `apps/a-modul`.
- The new application is isolated at `apps/a-modul` and has its own SvelteKit config, source, package metadata, routes, and styling.
- Root changes are limited to adding the workspace and A-Modul-only commands. No file in either existing application is changed.
- Existing root review scripts are Silent Lab-specific. A-Modul evidence will be captured separately under `reviews/a-modul-v2/`.
- The fetched `origin/main` and local `main` both pointed to the recorded base SHA before the feature branch was created.

## Mandatory official source checks and live-source count

1. https://a-modul.ru/
2. https://a-modul.ru/about/
3. https://a-modul.ru/shift_camps/
4. https://a-modul.ru/production_and_technology/
5. https://a-modul.ru/obshchezhitiya/
6. https://a-modul.ru/koncept/
7. https://a-modul.ru/contacts/
8. https://a-modul.ru/leasing/
9. https://a-modul.ru/modulnye-zdaniya-v-lizing/
10. https://a-modul.ru/object/obshhezhitija-dlja-prozhivanija-300-chelovek/
11. https://a-modul.ru/object/vakhtoviy-poselok-na-odnom-iz-krupneyshikh-mestorozhdeniy-zolota/
12. https://a-modul.ru/article/nadezhnye-i-bezopasnye-modulnye-zdaniya-avista-modul-inzhiniring/
13. https://a-modul.ru/object/administrativno-bytovoy-kompleks-abk/

Status check on 2026-08-25 with redirect reporting enabled:

- the supplied mandatory `https://a-modul.ru/leasing/` URL returned `404 Not Found` and no redirect target;
- the active official `https://a-modul.ru/modulnye-zdaniya-v-lizing/` page returned `200 OK` and is the leasing fact source.

Counting rule: **13 attempted inventory URLs, 1 dead supplied URL, 12 live official factual sources**. The historical Slice 00 audit surface labels its original counter `ДЕЙСТВУЮЩИХ URL` and shows the then-verified `11`; the Milestone D Office/ABK source was added after that immutable historical evidence was captured.

## Approved company and capability facts

| Public formulation | Status | Official source and note |
|---|---|---|
| С 2007 года | Approved | Home and `/about/` state that the company has operated since 2007. Prefer this stable formulation over a calculated year count. |
| 58 реализованных вахтовых поселков | Approved | Home and `/shift_camps/` publish 58 operating settlements. |
| 27 000+ произведённых модулей | Approved | Home publishes `27 000+`; official news dated 2026-05-12 reports the 27,000th module. |
| 2 000+ построенных зданий | Approved | Home counter. |
| 305 120 м² построенных объектов | Approved | Home counter. |
| 25 000 м² производственных площадок | Approved with precedence rule | Current home and `/obshchezhitiya/` use 25,000 or more. Older pages still say 19,100; use the owner-locked 25,000 value and retain conflict below. |
| до 750 модулей в месяц | Approved with precedence rule | Current product pages publish up to 750/month. `/about/` contains older `от 600`; use owner-locked current value. |
| до 25 модулей в смену | Approved | Home counter. |
| Собственное проектирование | Approved | Home and `/about/` describe internal project development and working documentation. |
| Собственное производство | Approved | Home, `/about/`, and production pages. |
| Собственная инженерная служба | Approved | Official production/technology material describes project and engineering functions; public copy must remain mechanism-based. |
| Проектирование, производство, комплектация, доставка и монтаж | Approved | Home and `/about/` list the full cycle. |
| Строительно-монтажные и пусконаладочные работы | Approved | `/about/` and verified project pages. Do not imply every contract includes all stages. |
| BIM-проектирование | Approved | Official public product and editorial pages describe BIM use. Do not imply a detailed model is provided before contract. |
| Возможна поставка в лизинг | Approved | Current official leasing page. Rates, payments, approvals, and tax outcomes remain project/lender specific. |
| По России, включая удалённые и труднодоступные регионы | Approved | Home and multiple product pages describe projects from Kaliningrad to Kamchatka and remote sites. Do not convert campaign exclusions into a public refusal policy. |

## Approved contact and legal defaults

| Fact | Status | Source |
|---|---|---|
| `8 (800) 333-61-31` | Approved fallback phone | `/contacts/` and site footer. |
| `zakaz@a-modul.ru` | Approved fallback sales email | `/contacts/`. |
| ООО «Ависта Модуль Инжиниринг» | Approved legal name | Site footer. |
| ИНН 5404491850 | Approved | `/contacts/` and footer. |
| ОГРН 1135476132770 | Approved | `/contacts/` and footer. |
| Новосибирск, ул. Станционная, 60 Г, 4 этаж | Verified but not planned as sales proof | `/contacts/`. Do not add address-heavy catalogue content to the Direct landing. |

## Approved project facts

### Three dormitories for 300 people

Source: https://a-modul.ru/object/obshhezhitija-dlja-prozhivanija-300-chelovek/

- Title: `3 общежития для проживания 300 человек`.
- Customer shown publicly: АО ЮВГК.
- Public implementation dates: June 2018 through July 2019.
- Official area: `3200.4 м²`; public Russian formatting: `3 200,4 м²`.
- `180` modules, delivered as transpacks.
- Three two-storey dormitories, 60 modules each.
- Public scope includes design, production/delivery, engineering systems, assembly, and installation.
- The page contains inconsistent geographic prose (mentions the Nezhdaninskoye project context and separately states Republic of Sakha/Yakutia). Public route copy may use the locked numeric facts but must avoid adding a disputed locality until owner confirmation.

### Kamchatka gold-project shift camp

Source: https://a-modul.ru/object/vakhtoviy-poselok-na-odnom-iz-krupneyshikh-mestorozhdeniy-zolota/

- Location: Kamchatka Krai.
- Public implementation dates: February 2022 through February 2023.
- Official area: `2476.36 м²`; public Russian formatting: `2 476,36 м²`.
- Composition: 105 single modules with porches, 20-module canteen, 12-module ABK, 14-module BPK, 5-module observatory, 4-module sports hall, 3-module bathhouse, and 4-module pedestrian transitions.
- Public scope: design sections, module production, engineering and furniture fit-out, delivery, and construction/installation.
- The page explains that shipping had to follow vessel departures from Petropavlovsk-Kamchatsky.
- Technical values are case-specific and must not be generalized to all projects.

### Two-storey ABK for Air Liquide Kuzbass LLC

Source: https://a-modul.ru/object/administrativno-bytovoy-kompleks-abk/

- Public customer: ООО «Эр Ликид Кузбасс».
- Location: Novokuznetsk.
- Official area: `427 м²`.
- Two-storey administrative and amenity complex assembled from `28` modules.
- Public scope includes production and installation, a common roof, entrance groups, internal engineering networks, furniture, and equipment.
- The shipped route image is a Codex-generated visualization based on the public case facts and is explicitly labelled as a visualization, not documentary customer photography.

### Seismic evidence

Source: https://a-modul.ru/article/nadezhnye-i-bezopasnye-modulnye-zdaniya-avista-modul-inzhiniring/

Locked public phrase:

> Объекты «Ависты» на Камчатке выдержали землетрясение магнитудой 8,8 без разрушений.

Locked support:

> Сейсмическую активность региона учитываем на этапе проектирования.

The official article dates the earthquake to 2025-07-30, states magnitude 8.8, says staff were safe, and says the buildings withstood the seismic load without destruction. Do not publish `до 8,6 баллов`, do not conflate earthquake magnitude with design intensity, and do not expose a document-download CTA in the primary flow.

## Official terminology

- сборно-разборные модули;
- блок-контейнеры;
- транспаки;
- модульные здания высокой заводской готовности;
- административно-бытовой комплекс (АБК);
- банно-прачечный комплекс (БПК);
- проектирование, производство, комплектация, доставка, монтаж, пусконаладочные работы.

## Public customer-name candidates

The official site publicly names Газпром, Полюс/Полюс Золото, Росатом, Северсталь, Транснефть, АЛРОСА, Золото Камчатки, and ТехноНИКОЛЬ in project or trust contexts. Use a restrained text-name rail unless exact logo files and the precise relationship are verified. Never generate customer logos and never imply endorsement beyond the documented project/relationship.

## Conflicts and precedence decisions

| Conflict | Decision for V2 |
|---|---|
| Production area appears as `19 100 м²` on older `/about/`, home process copy, and older shift-camp copy, while current home/product copy says `25 000 м²` or more. | Use owner-approved `25 000 м²`; document the source conflict; do not combine both. |
| Monthly production appears as `от 600` on `/about/` and `до 750` on current product pages. | Use owner-approved `до 750 модулей в месяц`. |
| Official pages calculate 18 or 19 years depending on publication date. | Use `С 2007 года`. |
| The dormitory-300 case combines locked numeric facts with inconsistent locality wording. | Use `3 общежития / 300 человек / 3 200,4 м² / 180 модулей`; avoid naming a locality until confirmed. |
| Current site contains route-specific price and duration claims such as `от 45 000 ₽/м²`, 25 days, or one-hour calculations. | Do not generalize them. The Direct system will use scope-completeness logic and only surface a price after exact context is explicitly verified. |
| Current pages contain broad superlatives and generic claims. | Do not inherit them. Explain operational mechanisms and responsibility boundaries. |
| The supplied `/leasing/` returns 404 with no redirect; `/modulnye-zdaniya-v-lizing/` returns 200. | Record the dead mandatory URL for audit completeness and use only the active page as the leasing fact source. Count: 12 attempted / 1 dead / 11 live. |

## Content safety rules

- No invented prices, reviews, addresses, complexes, specifications, durations, guarantees, or certificates.
- No generated image is documentary project evidence.
- No automatic conversion claims from the historic Yandex Direct report.
- No unsupported final engineering estimate promise. The one-day promise is a preliminary commercial proposal after basic inputs are received.
- Route- or case-specific engineering values remain attached to that exact context.
