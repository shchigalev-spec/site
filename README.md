# Лаборатория тишины — два независимых сайта

Clean-room монорепозиторий двух самостоятельных SvelteKit-приложений для одной инженерной услуги:

- `apps/tech` — SIGNAL / TECH, кинематографичная интерактивная лаборатория;
- `apps/engineering` — QUIET / ENGINEERING, спокойное архитектурное бюро.

Компоненты, стили, дизайн-токены и изображения приложений не разделяются. Общими остаются только подтверждённые факты, назначение маршрутов, SEO-приоритеты, цель конверсии и названия аналитических событий.

## Запуск

```bash
npm run install:all
npm run dev:tech
npm run dev:engineering
```

Одновременный запуск: `npm run dev:both`.

Локальные адреса: Tech — `http://127.0.0.1:5173`, Engineering — `http://127.0.0.1:5174`.

## Проверка

```bash
npm run check:all
npm run lint:all
npm run test:all
npm run build:all
npm run funnel:verify
npm run capture:all
npm run reviews:build
npm run comparison:build
```

Факты и контентные ограничения находятся в `docs/`. Арт-направления — в `art-direction/`. Снимки и протоколы браузерной проверки — в `reviews/`. Визуальное сравнение двух концепций генерируется в `comparison/index.html`.
