# Engineering V2 owner-data todo

The implementation intentionally does not invent owner or production data. Before launch, the owner must supply and approve:

- canonical production domain (`PUBLIC_SITE_URL`);
- public phone and email (`PUBLIC_SITE_PHONE`, `PUBLIC_SITE_EMAIL`);
- Yandex Metrica counter ID (`PUBLIC_YANDEX_METRICA_ID`);
- Bitrix webhook and, where applicable, source, assignee, and file field (`BITRIX_WEBHOOK_URL`, `BITRIX_SOURCE_ID`, `BITRIX_ASSIGNED_BY_ID`, `BITRIX_FILE_FIELD`);
- final legal entity details and controller contact for privacy copy;
- factual approval of every case measurement and its comparison conditions;
- final confirmation of service geography and any commercial wording.

Until those values are present, the site must not be described as production-ready. The application displays neither invented contact details nor fake form success. In production mode a missing Bitrix webhook returns an error; only the development server may return a validated mock success.
