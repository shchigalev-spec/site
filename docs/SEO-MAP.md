# SEO map

| Route | Primary intent | Secondary terms | Title direction | Internal links | Status | Cannibalization note |
|---|---|---|---|---|---|---|
| `/` | шумоизоляция квартиры москва | под ключ, монтаж, звукоизоляция | Шумоизоляция квартир в Москве под ключ | All P0 services, diagnosis, cases | Ready | Owns broad commercial cluster |
| `/shumoizolyatsiya-sten/` | шумоизоляция стен в квартире | звукоизоляция стен, голоса | Шумоизоляция стен начинается с обходных путей | Diagnosis, neighbours, voices case | Ready | No separate “звукоизоляция стен” page |
| `/shumoizolyatsiya-potolka/` | шумоизоляция потолка в квартире | топот сверху, ударный шум | Потолок помогает при найденном пути | Stretch ceiling, neighbours, impact case | Ready | Parent owns generic ceiling intent |
| `/shumoizolyatsiya-potolka/pod-natyazhnoy-potolok/` | шумоизоляция под натяжной потолок | порядок работ, светильники | Шумоизоляция и полотно как один узел | Ceiling, diagnosis | Ready | Restricted to stretch-ceiling intent |
| `/shumoizolyatsiya-pola/` | шумоизоляция пола в квартире | плавающий пол, стяжка | Пол снижает удар у источника | New building, diagnosis | Ready | No recipe pages by material |
| `/shumoizolyatsiya-ot-sosedey/` | шумоизоляция от соседей | сверху, сбоку, снизу | Найти путь шума от соседей | Walls, ceiling, floor | Ready | Problem-led hub, not surface duplicate |
| `/shumoizolyatsiya-v-novostroyke/` | шумоизоляция квартиры в новостройке | до ремонта, проект | Заложить до отделки | Floor, walls, diagnosis | Ready | Segment page for renovation stage |
| `/shumoizolyatsiya-v-gotovoy-kvartire/` | шумоизоляция после ремонта | готовая квартира, демонтаж | Рассчитать вмешательство | Walls, diagnosis | Ready | Segment page for paid traffic |
| `/diagnostika-shuma/` | диагностика шума в квартире | замер, источник шума | Где проходит шум и что строить | All services, cases | Ready | Owns diagnostic intent, not broad service |
| `/cases/` | кейсы шумоизоляции | замеры до после | Кейсы с контекстом и замерами | Three case details | Ready | Proof hub only |
| `/cases/[slug]/` | measured case context | specific symptom and room | Record-specific | Relevant service and diagnosis | Prototype | Requires source verification |
| `/privacy/` | политика конфиденциальности | обработка данных | Privacy | Form consent links | Scaffold | Replace after legal review |
| `/design-lab/` | internal visual comparison | — | Design Lab | None | Noindex | Never include in sitemap |

Canonical host is controlled by `NEXT_PUBLIC_SITE_URL`. Door and house-service
pages stay disabled until scope and keyword research are confirmed.

