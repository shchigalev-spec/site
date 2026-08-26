<script lang="ts">
  import { trackEvent } from '$lib/analytics';
  import { applyPublishedCaseContext, type ObjectTypeId, type RegionId } from '$lib/state/projectContext';

  type FilterKey = 'region' | 'industry' | 'type' | 'capacity' | 'climate' | 'remote';
  type CaseRecord = {
    id: string;
    title: string;
    region: string;
    regionContext: RegionId;
    industry: string;
    type: ObjectTypeId;
    capacity: string;
    climate: string;
    remote: string;
    image: string;
    alt: string;
    facts: string[];
    sourceUrl: string;
    sourceLabel: string;
    differenceNote: string;
  };

  const cases: CaseRecord[] = [
    {
      id: 'kamchatka',
      title: 'Вахтовый посёлок для золоторудного проекта',
      region: 'far-east', regionContext: 'far-east', industry: 'mining', type: 'shift', capacity: 'not-published', climate: 'seismic', remote: 'remote',
      image: 'a-modul-case-kamchatka-v2',
      alt: 'Концептуальная визуализация зимнего модульного посёлка в удалённом северном регионе',
      facts: ['Камчатский край', '2 476,36 м²', '105 одиночных модулей с крыльцами + функциональные здания', 'поставка с учётом выходов судов из Петропавловска-Камчатского'],
      sourceUrl: 'https://a-modul.ru/object/vakhtoviy-poselok-na-odnom-iz-krupneyshikh-mestorozhdeniy-zolota/',
      sourceLabel: 'Официальный кейс: Камчатка',
      differenceNote: 'Численность персонала в открытом кейсе не опубликована — её нельзя переносить на новый объект.'
    },
    {
      id: 'dormitories',
      title: 'Три общежития для 300 человек',
      region: 'not-published', regionContext: 'russia', industry: 'mining', type: 'dorm', capacity: '300', climate: 'not-published', remote: 'not-published',
      image: 'a-modul-case-dormitories-300',
      alt: 'Концептуальная визуализация трёх двухэтажных модульных общежитий',
      facts: ['3 общежития', '300 человек', '3 200,4 м²', '180 модулей / поставка транспаками'],
      sourceUrl: 'https://a-modul.ru/object/obshhezhitija-dlja-prozhivanija-300-chelovek/',
      sourceLabel: 'Официальный кейс: общежития',
      differenceNote: 'Локальность не переносится: официальная страница содержит географическое расхождение.'
    },
    {
      id: 'abk',
      title: 'Двухэтажный административно-бытовой комплекс',
      region: 'siberia', regionContext: 'siberia', industry: 'industrial', type: 'abk', capacity: '28-modules', climate: 'not-published', remote: 'not-published',
      image: 'a-modul-abk-case',
      alt: 'Концептуальная визуализация двухэтажного административно-бытового комплекса',
      facts: ['Новокузнецк', '427 м²', '28 модулей', 'общая кровля, входные группы, инженерные сети, мебель и оборудование'],
      sourceUrl: 'https://a-modul.ru/object/administrativno-bytovoy-kompleks-abk/',
      sourceLabel: 'Официальный кейс: АБК',
      differenceNote: 'Число рабочих мест и климатические параметры в открытом кейсе не опубликованы.'
    }
  ];

  const filters: Record<FilterKey, readonly (readonly [string, string])[]> = {
    region: [['all', 'Любой регион'], ['far-east', 'Дальний Восток'], ['siberia', 'Сибирь'], ['ural', 'Урал'], ['central', 'Центр']],
    industry: [['all', 'Любая отрасль'], ['mining', 'Горнодобывающая'], ['industrial', 'Промышленное производство'], ['energy', 'Энергетика'], ['construction', 'Строительство']],
    type: [['all', 'Любой тип'], ['shift', 'Вахтовый посёлок'], ['dorm', 'Общежитие'], ['abk', 'Офис / АБК']],
    capacity: [['all', 'Любой масштаб'], ['300', '300 человек'], ['28-modules', '28 модулей']],
    climate: [['all', 'Любой климат'], ['seismic', 'Сейсмический регион'], ['cold', 'Холодный регион']],
    remote: [['all', 'Любая доступность'], ['remote', 'Удалённая площадка'], ['standard', 'Обычный подъезд']]
  };

  const filterNames: Record<FilterKey, string> = {
    region: 'регион', industry: 'отрасль', type: 'тип объекта', capacity: 'масштаб объекта', climate: 'климат', remote: 'удалённость'
  };

  let region = 'all';
  let industry = 'all';
  let type = 'all';
  let capacity = 'all';
  let climate = 'all';
  let remote = 'all';

  let selectedValues: Record<FilterKey, string>;

  function selectedValue(key: FilterKey) {
    return selectedValues[key];
  }

  function caseValue(item: CaseRecord, key: FilterKey) {
    return item[key];
  }

  function changeFilter(dimension: FilterKey, value: string) {
    if (dimension === 'region') region = value;
    if (dimension === 'industry') industry = value;
    if (dimension === 'type') type = value;
    if (dimension === 'capacity') capacity = value;
    if (dimension === 'climate') climate = value;
    if (dimension === 'remote') remote = value;
    trackEvent('case_filter_change', { dimension, value });
  }

  function score(item: CaseRecord, values: Record<FilterKey, string>) {
    return (Object.keys(filters) as FilterKey[]).reduce((total, key) => {
      const selected = values[key];
      return total + (isKnownMatch(item, key, selected) ? 1 : 0);
    }, 0);
  }

  function isKnownMatch(item: CaseRecord, key: FilterKey, selected: string) {
    const published = caseValue(item, key);
    return selected !== 'all' && selected !== 'not-published' && published !== 'not-published' && published === selected;
  }

  function valueLabel(key: FilterKey, value: string) {
    if (value === 'not-published') return 'не опубликовано';
    return filters[key].find((option) => option[0] === value)?.[1] ?? value;
  }

  function matchDetail(key: FilterKey) {
    return `${filterNames[key]} — ${valueLabel(key, selectedValues[key])}`;
  }

  function mismatchDetail(key: FilterKey) {
    return `${filterNames[key]}: запрос «${valueLabel(key, selectedValues[key])}», кейс «${valueLabel(key, caseValue(selectedCase, key))}»`;
  }

  $: selectedValues = { region, industry, type, capacity, climate, remote };
  $: filterKeys = Object.keys(filters) as FilterKey[];
  $: selectedFilters = filterKeys.filter((key) => selectedValues[key] !== 'all');
  $: ranked = [...cases].sort((a, b) => score(b, selectedValues) - score(a, selectedValues));
  $: selectedCase = ranked[0];
  $: matched = selectedFilters.filter((key) => isKnownMatch(selectedCase, key, selectedValues[key]));
  $: mismatches = selectedFilters.filter((key) => !isKnownMatch(selectedCase, key, selectedValues[key]));

  function carryCaseContext() {
    applyPublishedCaseContext({
      objectType: selectedCase.type,
      region: selectedCase.regionContext,
      capacity: selectedCase.type === 'dorm' && selectedCase.capacity === '300' ? '300' : undefined
    });
    trackEvent('case_open', { case_id: selectedCase.id, matched: matched.length, compared: selectedFilters.length });
  }
</script>

<section class="finder chapter" id="finder" aria-labelledby="finder-title">
  <div class="chapter__heading chapter__heading--split">
    <div>
      <p class="eyebrow">Открытая база / 03 проверенных проекта</p>
      <h2 id="finder-title">Найдите ближайший опубликованный аналог.</h2>
    </div>
    <p>Совпадение фильтров не заменяет инженерное сравнение. Поэтому рядом с результатом всегда показаны совпадения, различия и ссылка на первоисточник.</p>
  </div>

  <div class="finder__filters" role="group" aria-label="Фильтры проектов">
    {#each filterKeys as key}
      <label>
        <span>{filterNames[key]}</span>
        <select value={selectedValue(key)} onchange={(event) => changeFilter(key, event.currentTarget.value)}>
          {#each filters[key] as option}<option value={option[0]}>{option[1]}</option>{/each}
        </select>
      </label>
    {/each}
  </div>

  <article class="finder__result" aria-live="polite">
    <div class="finder__visual">
      <picture>
        <source media="(max-width: 760px)" type="image/avif" srcset={`/generated/${selectedCase.image}-mobile.avif`} />
        <source media="(max-width: 760px)" type="image/webp" srcset={`/generated/${selectedCase.image}-mobile.webp`} />
        <source type="image/avif" srcset={`/generated/${selectedCase.image}-desktop.avif`} />
        <img src={`/generated/${selectedCase.image}-desktop.webp`} width="1600" height="900" alt={selectedCase.alt} loading="lazy" />
      </picture>
      <span class="visualization-label">Визуализация объекта. Факты приведены по реализованному проекту.</span>
    </div>
    <div class="finder__case-copy">
      <p class="mono-label">{selectedFilters.length === 0 ? 'Базовый опубликованный пример' : `Ближайший аналог · совпало ${matched.length} из ${selectedFilters.length}`}</p>
      <h3>{selectedCase.title}</h3>
      <ul class="finder__facts">{#each selectedCase.facts as fact}<li>{fact}</li>{/each}</ul>

      {#if selectedFilters.length}
        <div class="finder__comparison">
          <div>
            <strong>Почему похож</strong>
            <p>{matched.length ? matched.map(matchDetail).join('; ') : 'Точного подтверждённого совпадения по выбранным параметрам в открытой базе нет.'}</p>
          </div>
          <div>
            <strong>Проверенные различия</strong>
            <p>{mismatches.length ? mismatches.map(mismatchDetail).join('; ') : 'По выбранным опубликованным параметрам различий не выявлено.'} {selectedCase.differenceNote}</p>
          </div>
        </div>
      {:else}
        <p class="finder__difference">{selectedCase.differenceNote}</p>
      {/if}

      <a class="finder__source" href={selectedCase.sourceUrl} target="_blank" rel="noreferrer">{selectedCase.sourceLabel} ↗</a>
      <a class="button button--light" href="#project-brief" onclick={carryCaseContext}>Сопоставить с моим проектом</a>
    </div>
  </article>
</section>
