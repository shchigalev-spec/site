# Лаборатория тишины — SIGNAL / TECH

Независимое SvelteKit-приложение технологического концепта. Оно не импортирует компоненты, CSS, токены или изображения Engineering-сайта.

## Локальный запуск

```bash
npm install
npm run dev
```

Адрес разработки: `http://localhost:5173`.

Проверки:

```bash
npm run check
npm run test
npm run build
```

## Переменные окружения

Скопируйте `.env.example` в `.env` и заполните нужные значения.

- `BITRIX_WEBHOOK_URL` — полный webhook или его базовый REST URL. Если метод не указан, адаптер добавит `crm.lead.add.json`.
- `BITRIX_ASSIGNED_BY_ID` и `BITRIX_SOURCE_ID` — необязательные поля лида.
- `BITRIX_FILE_FIELD` — код множественного пользовательского file-поля Bitrix. Если посетитель прикладывает файл, production-отправка без этого значения завершается ошибкой, а не ложным success.
- `BODY_SIZE_LIMIT=41943040` — лимит request body для adapter-node с учётом вложений.
- `PUBLIC_YANDEX_METRICA_ID` — реальный номер счётчика; без него аналитика не загружается.
- `PUBLIC_SITE_PHONE`, `PUBLIC_SITE_EMAIL` — контакты. Пустые значения не выводятся как фиктивные placeholders.

Без Bitrix webhook в development заявка обрабатывается mock-адаптером только в server log. Visitor UI не содержит технической пометки. Production никогда не показывает success без ответа CRM.

## Подготовленные слоты изображений

Noise deck использует единый style anchor с разными crop/treatment и готов принять отдельные профильные кадры. Подключённый production-набор:

- `tech-style-anchor.png`
- `tech-hero-cutaway.png`
- `tech-apartment-xray.png`
- `tech-stage-newbuild.png`
- `tech-stage-renovation.png`
- `tech-stage-finished.png`
- `tech-case-58-39.png`
- `tech-case-impact-16.png`
- `tech-case-64-43.png`
- `tech-diagnosis.png`
- `tech-final-quiet.png`
- `tech-og.png`

Изображения кейсов всегда сопровождаются подписью, что это визуализация, а не фотография реального объекта.

## Маршруты

- `/`
- `/shumoizolyatsiya-kvartiry/`
- `/shumoizolyatsiya-sten/`
- `/shumoizolyatsiya-potolka/`
- `/shumoizolyatsiya-pola/`
- `/shumoizolyatsiya-ot-sosedey/`
- `/shumoizolyatsiya-v-novostroyke/`
- `/shumoizolyatsiya-v-gotovoy-kvartire/`
- `/diagnostika-shuma/`
- `/cases/`
- `/cases/58-39-db/`
- `/cases/impact-noise-minus-16-db/`
- `/cases/64-43-db/`
- `/privacy/`
- `/sitemap.xml`
- `/robots.txt`

## Основные механики

- scroll-driven hero из четырёх диагностических состояний;
- шестисценарный noise deck с keyboard/touch управлением;
- x-ray квартиры с шестью путями;
- интерактивная сборка конструкции;
- три стадии одной комнаты;
- три измерительных истории;
- предварительный scenario lab без цены;
- контроль скрытых узлов и честный FAQ;
- полноценная серверная форма с необязательными файлами;
- reduced-motion, Canvas/WebGL-free fallback и локальные шрифты.
