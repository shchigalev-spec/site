<script lang="ts">
  import { trackEvent } from '$lib/analytics';
  type CaseRecord = {
    id: string;
    title: string;
    region: string;
    industry: string;
    type: string;
    capacity: string;
    climate: string;
    delivery: string;
    image: string;
    facts: string[];
    differenceNote: string;
  };

  const cases: CaseRecord[] = [
    {
      id: 'kamchatka',
      title: 'Вахтовый посёлок для золоторудного проекта',
      region: 'far-east', industry: 'mining', type: 'shift', capacity: 'not-published', climate: 'seismic', delivery: 'not-published',
      image: 'a-modul-case-kamchatka',
      facts: ['Камчатский край', '2 476,36 м²', '105 одиночных модулей с крыльцами + функциональные здания', 'доставка с учётом выходов судов из Петропавловска-Камчатского'],
      differenceNote: 'Численность персонала в открытом кейсе не опубликована — её нельзя переносить на ваш объект.'
    },
    {
      id: 'dormitories',
      title: 'Три общежития для 300 человек',
      region: 'not-published', industry: 'mining', type: 'dorm', capacity: '300', climate: 'not-published', delivery: 'transpack',
      image: 'a-modul-case-dormitories-300',
      facts: ['3 общежития', '300 человек', '3 200,4 м²', '180 модулей / поставка транспаками'],
      differenceNote: 'Локальность не показана: официальная страница содержит географическое расхождение, поэтому мы не переносим его в посадочную.'
    }
  ];

  const filters = {
    region: [['all', 'Любой регион'], ['far-east', 'Дальний Восток'], ['siberia', 'Сибирь'], ['ural', 'Урал'], ['central', 'Центр']],
    industry: [['all', 'Любая отрасль'], ['mining', 'Горнодобывающая'], ['energy', 'Энергетика'], ['construction', 'Строительство']],
    type: [['all', 'Любой тип'], ['shift', 'Вахтовый посёлок'], ['dorm', 'Общежитие'], ['abk', 'АБК']],
    capacity: [['all', 'Любая вместимость'], ['300', '300 человек'], ['500', '500 человек'], ['1000', '1 000 человек']],
    climate: [['all', 'Любой климат'], ['seismic', 'Сейсмический регион'], ['cold', 'Холодный регион'], ['temperate', 'Умеренный']],
    delivery: [['all', 'Любая поставка'], ['mixed', 'Смешанная'], ['transpack', 'Транспаки'], ['road', 'Авто']]
  } as const;

  let region = 'all';
  let industry = 'all';
  let type = 'all';
  let capacity = 'all';
  let climate = 'all';
  let delivery = 'all';

  function changeFilter(dimension: string, value: string) {
    if (dimension === 'region') region = value;
    if (dimension === 'industry') industry = value;
    if (dimension === 'type') type = value;
    if (dimension === 'capacity') capacity = value;
    if (dimension === 'climate') climate = value;
    if (dimension === 'delivery') delivery = value;
    trackEvent('case_filter_change', { dimension, value });
  }

  $: exact = cases.find((item) =>
    (region === 'all' || item.region === region) &&
    (industry === 'all' || item.industry === industry) &&
    (type === 'all' || item.type === type) &&
    (capacity === 'all' || item.capacity === capacity) &&
    (climate === 'all' || item.climate === climate) &&
    (delivery === 'all' || item.delivery === delivery)
  );
  $: selectedCase = exact ?? cases.find((item) => item.type === type) ?? cases[0];
  $: selectedFilters = [region, industry, type, capacity, climate, delivery].filter((item) => item !== 'all').length;
  $: mismatches = [
    ...(region !== 'all' && selectedCase.region !== region ? ['регион'] : []),
    ...(industry !== 'all' && selectedCase.industry !== industry ? ['отрасль'] : []),
    ...(type !== 'all' && selectedCase.type !== type ? ['тип объекта'] : []),
    ...(capacity !== 'all' && selectedCase.capacity !== capacity ? ['вместимость'] : []),
    ...(climate !== 'all' && selectedCase.climate !== climate ? ['климатические условия'] : []),
    ...(delivery !== 'all' && selectedCase.delivery !== delivery ? ['тип поставки'] : [])
  ];
</script>

<section class="finder chapter" id="finder" aria-labelledby="finder-title">
  <div class="chapter__heading">
    <p class="eyebrow">Открытая база проектов / 02 проверенных аналога</p>
    <h2 id="finder-title">Найдите проект, похожий на вашу задачу.</h2>
    <p>Фильтры не подменяют инженерное сравнение. Если точного совпадения в открытых данных нет, мы показываем ближайший аналог и называем различия.</p>
  </div>

  <div class="finder__filters" role="group" aria-label="Фильтры проектов">
    <label><span>Регион</span><select value={region} onchange={(event) => changeFilter('region', event.currentTarget.value)}>{#each filters.region as option}<option value={option[0]}>{option[1]}</option>{/each}</select></label>
    <label><span>Отрасль</span><select value={industry} onchange={(event) => changeFilter('industry', event.currentTarget.value)}>{#each filters.industry as option}<option value={option[0]}>{option[1]}</option>{/each}</select></label>
    <label><span>Тип объекта</span><select value={type} onchange={(event) => changeFilter('type', event.currentTarget.value)}>{#each filters.type as option}<option value={option[0]}>{option[1]}</option>{/each}</select></label>
    <label><span>Вместимость</span><select value={capacity} onchange={(event) => changeFilter('capacity', event.currentTarget.value)}>{#each filters.capacity as option}<option value={option[0]}>{option[1]}</option>{/each}</select></label>
    <label><span>Климат</span><select value={climate} onchange={(event) => changeFilter('climate', event.currentTarget.value)}>{#each filters.climate as option}<option value={option[0]}>{option[1]}</option>{/each}</select></label>
    <label><span>Поставка</span><select value={delivery} onchange={(event) => changeFilter('delivery', event.currentTarget.value)}>{#each filters.delivery as option}<option value={option[0]}>{option[1]}</option>{/each}</select></label>
  </div>

  <article class="finder__result" aria-live="polite">
    <div class="finder__visual">
      <picture>
        <source media="(max-width: 760px)" type="image/avif" srcset={`/generated/${selectedCase.image}-mobile.avif`} />
        <source media="(max-width: 760px)" type="image/webp" srcset={`/generated/${selectedCase.image}-mobile.webp`} />
        <source type="image/avif" srcset={`/generated/${selectedCase.image}-desktop.avif`} />
        <img src={`/generated/${selectedCase.image}-desktop.webp`} width="1600" height="900" alt="" loading="lazy" />
      </picture>
      <span class="visualization-label">Визуализация по открытым данным кейса — не фотография объекта</span>
    </div>
    <div class="finder__case-copy">
      <p class="mono-label">{selectedFilters === 0 ? 'Выберите параметры или изучите пример' : exact ? 'Найден близкий аналог' : 'Ближайший опубликованный аналог'}</p>
      <h3>{selectedCase.title}</h3>
      <ul>{#each selectedCase.facts as fact}<li>{fact}</li>{/each}</ul>
      {#if !exact && selectedFilters}
        <p class="finder__difference"><strong>Не совпадают:</strong> {mismatches.join(', ')}. {selectedCase.differenceNote}</p>
      {/if}
      <a class="button button--light" href="#project-brief" onclick={() => trackEvent('case_open', { case_id: selectedCase.id })}>Сопоставить с моим проектом</a>
    </div>
  </article>
</section>
