# Cross-Concept / Conversion Delta Review

Дата: 19 августа 2026 года.

## Вердикт

**PROTOTYPE ACCEPTANCE: PASS — обе концепции.**

**PRODUCTION LAUNCH WITH REAL DATA: BLOCKED — нужны данные и решения владельца.**

**CROSS-CONCEPT DISTINCTION: PASS.**

Текущая блокировка production не является визуальным или концептуальным FAIL. Clean-room реализация больше не содержит прежних критических разрывов формы и funnel, но не может сама утвердить юридическую политику, реальные контакты, домены, consent mode, счётчик Метрики и production Bitrix.

## Текущие оценки и evidence

| Концепция | Supervisor | Browser review | Funnel review |
|---|---|---|---|
| Tech | PASS, 94/100, hard blockers отсутствуют | PASS: 17 URL, desktop/mobile overflow `0`, console errors `[]`, reduced motion PASS | PASS, 7 полей |
| Engineering | PASS, 94/100, hard blockers отсутствуют | PASS: 17 URL, desktop/mobile overflow `0`, console errors `[]`, reduced motion PASS | PASS, 8 полей |

Проверены актуальные исходники, `reviews/browser-review.json`, `reviews/funnel-review.json`, финальные screenshots и supervisor evidence обеих концепций. Engineering теперь имеет start/mid/end hero frames и reduced-motion capture. Tech имеет hero states, reduced-motion, `SCORECARD.md`, `PASS-FAIL.txt` и `interaction-notes.md`.

Evidence подтверждает локальный прототип. Реальный Bitrix, Метрика, юридическая допустимость и production-домены этим review не проверены.

## Закрытые findings первого review

### R1. Публичные internal labels — CLOSED

`SIGNAL / TECH` и `QUIET / 01` удалены из пользовательского UI. Публичный бренд — «Лаборатория тишины»; внутренний `concept` сохранён только для аналитики и технического различения.

### R2. Legal route и prototype disclosure — CLOSED FOR PROTOTYPE

В обеих версиях реализован `/privacy-policy/`; `/privacy/` перенаправляет `308`. Страница честно сообщает, что сайт является локальным прототипом, и запрещает передавать реальные персональные данные и файлы до утверждения политики.

Это корректная граница прототипа. Страница намеренно не считается production-политикой и не закрывает юридический blocker реального запуска.

### R3. Файловая политика — CLOSED FOR PROTOTYPE

Публичный upload-hint больше не рекламирует неподтверждённые числовые лимиты. Клиентская и серверная политика выровнена в обеих версиях: 6 файлов, 10 МБ каждый, 40 МБ суммарно. Значения остаются технической prototype-конфигурацией до подтверждения владельцем CRM и инфраструктуры.

### R4. Engineering file delivery — CLOSED IN IMPLEMENTATION

Engineering передаёт байты файлов в настраиваемое `BITRIX_FILE_FIELD`. Если к production-заявке приложены файлы, но field mapping отсутствует, функция выбрасывает ошибку и не подтверждает success. Tech использует ту же безопасную модель.

Фактическая доставка в реальный Bitrix остаётся непроверенной до выдачи production credentials и file-field code.

### R5. Scenario → form funnel — CLOSED

Tech нормализует noise key, переносит direction, stage, room, comment, path и space loss. Engineering нормализует stage, переносит scenario fields и показывает source context для service/case entry.

`reviews/funnel-review.json` подтверждает PASS без failures: Tech — 7 полей, Engineering — 8.

### R6. PII в development logs — CLOSED

Development mocks журналируют только concept, число файлов и факт валидации. Имя, телефон, email, комментарий и имя файла в проверенных логах отсутствуют.

### R7. Базовый analytics envelope — CLOSED

Обе версии централизованно добавляют `concept`, `path` и точный `page_type`, включая `cases`, `case`, `legal` и `not_found`. Каждая передаёт по одному событию на принятый файл с категорией, расширением и bucket размера вместо точного размера и имени. Tech сбрасывает scroll goals на каждом SPA route view. Фиктивный ID не используется.

Production-аналитика всё ещё требует owner ID и consent decision.

### R8. Canonical query safety Tech — CLOSED

Tech использует origin + pathname на service, case и diagnosis страницах; персональные query-параметры сценария больше не попадают в canonical.

Финальные абсолютные canonical обеих концепций зависят от утверждённых production-доменов.

### R9. Browser/motion evidence — CLOSED FOR PROTOTYPE

Обе версии имеют актуальный browser PASS без console errors и horizontal overflow. Reduced motion проверен. Engineering motion frames добавлены. Tech supervisor report присутствует и фиксирует 94/100.

## Фактическая и контентная безопасность

**PASS для прототипа.**

- Использованы только три разрешённых результата без вычисления новых значений.
- Не добавлены адреса, имена клиентов, реальные объекты, системы, бюджеты, сроки, отзывы, рейтинги или гарантии результата.
- Case assets раскрыты как иллюстративные.
- Доли шумовых сценариев не выданы за рыночную статистику.
- Сценарий прямо ограничен гипотезой и не подменяет обследование, проект или смету.
- Бесплатный первичный этап отделён от выездной диагностики.
- Ранее отмеченные абсолютные формулировки «Лучший момент» и «все критические узлы» устранены.
- В публичном интерфейсе больше нет внутренних concept names и случайных file-limit promises.

Prototype legal page допустима только для локальной демонстрации или закрытого теста с вымышленными данными. Она не разрешает публичный сбор реальных данных.

## Conversion review

| Узел | Tech | Engineering | Итог |
|---|---|---|---|
| Diagnosis-first promise | Да | Да | PASS |
| CTA ведут к диагностике | Да | Да | PASS |
| Сценарий меняет результат | Да | Да | PASS |
| Нет fake price/system/dB | Да | Да | PASS |
| Context переносится и виден | 7 полей | 8 полей | PASS |
| Service/case entry сохраняется отдельным полем | Нет | Да | NOTE: scenario context Tech проходит полностью |
| Файлы optional и removable | Да | Да | PASS |
| Production success без CRM | Нет | Нет | PASS по реализации |
| Production success с файлами без file-field | Нет | Нет | PASS по реализации |
| Реальная CRM-приёмка | Не проверена | Не проверена | EXTERNAL BLOCKER |
| Утверждённое legal consent | Нет | Нет | EXTERNAL BLOCKER |

Conversion architecture прототипа принята. Доказанная business conversion начнётся только после реального end-to-end и аналитики.

## Остаточное техническое замечание

### T1. Accessibility polish

Supervisor reports отмечают неполный WAI-ARIA tab pattern у нескольких групп контролов. При этом основные действия доступны с клавиатуры, Tech menu имеет focus trap/Escape/return focus/scroll lock, Engineering menu — focus trap/Escape/return focus. Browser review не обнаружил недоступного критического действия.

**Статус:** неблокирующая доработка, желательно закрыть перед публичным запуском.

## Production blockers: owner data required

### P1. Юридическая политика и согласие

Нужны утверждённые реквизиты оператора, правовые основания, цели, получатели, сроки хранения, правила вложений, способ фиксации согласия, канал отзыва и финальный текст `/privacy-policy/`.

### P2. Production domains и SEO-роль

Нужны домены, абсолютные canonical/OG URL и решение, какой сайт индексируется как основной. Разные дизайны не устраняют риск дублирования фактического ядра.

### P3. Публичные контакты

Нужны подтверждённые телефон и email. Заглушки не публикуются, пустые env безопасны для прототипа.

### P4. Метрика и consent mode

Нужны реальный `PUBLIC_YANDEX_METRICA_ID`, владелец счётчика и юридическое решение: когда допустима загрузка и отправка событий. После настройки требуется отдельная проверка всех целей и дублей.

### P5. Реальный Bitrix end-to-end

Нужны webhook, assigned/source IDs, file-field code, согласованный field mapping и тестовые заявки с каждым типом вложения. Только ответ тестовой CRM закрывает delivery, timeout и error-handling gate.

### P6. Утверждение файловой политики

Нужно подтвердить, что prototype-пределы `6 / 10 МБ / 40 МБ` соответствуют Bitrix, reverse proxy, хостингу и юридическим правилам хранения. До этого числа не заявляются как коммерческое обещание.

## Cross-concept distinction

**PASS без оговорок.**

Tech остаётся тёмной кинематографической лабораторией с scan/X-ray/signal языком. Engineering остаётся тёплой архитектурной публикацией с чертёжной дисциплиной и асимметричными разворотами. Герои, section rhythm, forms, cases, navigation, generated assets, mobile composition и motion grammar различаются по сути; общего runtime UI и cross-app imports не найдено.

## Рекомендация

Engineering — предпочтительный основной сайт для холодного поискового и контекстного трафика после production-настройки. Он быстрее создаёт инженерное доверие и имеет меньший риск отвлечь пользователя от заявки.

Tech — сильный самостоятельный campaign/brand вариант. Его 94/100 подтверждают визуальную готовность, но победителя между концепциями следует выбирать по данным воронки и качеству лидов после настройки consent, Метрики и CRM.

## Gate для production PASS

1. Владелец предоставляет и утверждает P1–P6.
2. Закрыт или принят как неблокирующий accessibility polish T1.
3. Обе production-среды проходят browser review на утверждённых доменах.
4. Реальный лид без файла и с каждым поддержанным типом файла принят Bitrix.
5. Ошибка/таймаут Bitrix не создаёт success.
6. Метрика отправляет один корректный набор событий только по принятому consent-режиму.
7. Canonical, OG, sitemap и robots проверены на фактических доменах.
8. Только после этого prototype disclosure заменяется утверждённой legal policy и открывается сбор реальных обращений.

До выполнения gate итог остаётся: **prototype PASS, production BLOCKED by owner data**.
