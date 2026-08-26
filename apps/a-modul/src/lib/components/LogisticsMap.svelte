<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { initProjectContext, projectContext, setRegion, type RegionId } from '$lib/state/projectContext';
  import { trackEvent } from '$lib/analytics';

  type ModeId = 'road' | 'rail' | 'sea' | 'winter' | 'combined';
  type Destination = {
    id: Exclude<RegionId, ''>;
    label: string;
    point?: { x: number; y: number };
    route?: string;
    highlight: { x: number; y: number; rx: number; ry: number };
    modes: ModeId[];
    note: string;
    caseTitle: string;
    caseNote: string;
  };

  const origin = { x: 730, y: 690 };
  const destinations: Destination[] = [
    { id: 'moskva', label: 'Москва и Московская область', point: { x: 267, y: 655 }, route: 'M730 690 C595 602 425 610 267 655', highlight: { x: 270, y: 655, rx: 62, ry: 62 }, modes: ['road', 'rail', 'combined'], note: 'Проверяем габариты, окна поставки и подъезд к площадке.', caseTitle: 'Ближайший аналог уточняется', caseNote: 'Публичный кейс с совпадающей локацией не выбран автоматически.' },
    { id: 'krasnoyarsk', label: 'Красноярский край', point: { x: 835, y: 640 }, route: 'M730 690 C760 666 794 650 835 640', highlight: { x: 835, y: 620, rx: 105, ry: 150 }, modes: ['road', 'rail', 'combined'], note: 'Проверяем плечи перегрузки и ограничения площадки.', caseTitle: 'Ближайший аналог уточняется', caseNote: 'Публичный кейс с совпадающей локацией не выбран автоматически.' },
    { id: 'ural', label: 'Урал', point: { x: 590, y: 670 }, route: 'M730 690 C686 672 635 664 590 670', highlight: { x: 580, y: 660, rx: 105, ry: 155 }, modes: ['road', 'rail', 'combined'], note: 'Синхронизируем производственный график и последовательность отгрузки.', caseTitle: 'Ближайший аналог уточняется', caseNote: 'Региональный фильтр будет передан в подбор проектов.' },
    { id: 'siberia', label: 'Сибирь', point: { x: 900, y: 710 }, route: 'M730 690 C785 676 848 682 900 710', highlight: { x: 920, y: 690, rx: 210, ry: 190 }, modes: ['road', 'rail', 'winter', 'combined'], note: 'Сезонные ограничения и допустимость зимника проверяются отдельно.', caseTitle: 'АБК в Новокузнецке', caseNote: 'Опубликованный промышленный аналог: 427 м² и 28 модулей.' },
    { id: 'far-east', label: 'Дальний Восток', point: { x: 1370, y: 715 }, route: 'M730 690 C940 580 1160 610 1370 715', highlight: { x: 1320, y: 650, rx: 260, ry: 250 }, modes: ['road', 'rail', 'sea', 'winter', 'combined'], note: 'Навигация, перевалка и сезонная доступность подтверждаются расчётом.', caseTitle: 'Вахтовый посёлок на Камчатке', caseNote: 'В опубликованном кейсе поставку связывали с выходами судов из Петропавловска-Камчатского.' },
    { id: 'kurgan', label: 'Курганская область', point: { x: 620, y: 705 }, route: 'M730 690 C688 682 650 688 620 705', highlight: { x: 620, y: 705, rx: 45, ry: 52 }, modes: ['road', 'rail', 'combined'], note: 'Уточняем ограничения подъезда и порядок приёмки модульных групп.', caseTitle: 'Ближайший аналог уточняется', caseNote: 'Логистическая схема не переносится из чужого проекта.' },
    { id: 'russia', label: 'Россия', highlight: { x: 825, y: 590, rx: 710, ry: 350 }, modes: ['road', 'rail', 'combined'], note: 'Сначала зафиксируйте точный регион: страна не является точкой назначения. Морской маршрут и зимник рассматриваются только после выбора конкретной территории.', caseTitle: 'Поиск по всей базе', caseNote: 'Подбор начнётся с типа объекта, отрасли и условий площадки.' }
  ];

  const modes: { id: ModeId; title: string; support: string; sourceUrl: string; sourceLabel: string }[] = [
    { id: 'road', title: 'Авто', support: 'Режим для проверки габаритов, подъезда и последовательности партий.', sourceUrl: 'https://a-modul.ru/dostavka/', sourceLabel: 'Официальная страница доставки' },
    { id: 'rail', title: 'Ж/д', support: 'Допустимость зависит от габаритов, упаковки и схемы перегрузки.', sourceUrl: 'https://a-modul.ru/dostavka/', sourceLabel: 'Официальная страница доставки' },
    { id: 'sea', title: 'Море / вода', support: 'Режим для восточных и смешанных маршрутов; не назначается внутренним регионам автоматически.', sourceUrl: 'https://a-modul.ru/shift_camps/', sourceLabel: 'Официальная страница вахтовых посёлков' },
    { id: 'winter', title: 'Зимник', support: 'Только сезонный сценарий для удалённых площадок после проверки доступности.', sourceUrl: 'https://a-modul.ru/shift_camps/', sourceLabel: 'Официальная страница вахтовых посёлков' },
    { id: 'combined', title: 'Комбинированная', support: 'Последовательность плеч и точки перегрузки определяются в отдельном расчёте.', sourceUrl: 'https://a-modul.ru/dostavka/', sourceLabel: 'Официальная страница доставки' }
  ];

  let section: HTMLElement;
  let routeVisible = false;
  let activeMode: ModeId = 'road';
  let completionTimer: number | undefined;
  $: destination = destinations.find((item) => item.id === $projectContext.region);
  $: allowedModes = destination ? modes.filter((mode) => destination?.modes.includes(mode.id)) : [];
  $: if (destination && !destination.modes.includes(activeMode)) activeMode = destination.modes[0] ?? 'road';
  $: activeModeData = modes.find((mode) => mode.id === activeMode) ?? modes[0];

  onMount(() => {
    initProjectContext();
    if (!('IntersectionObserver' in window)) {
      routeVisible = true;
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      routeVisible = true;
      observer.disconnect();
    }, { rootMargin: '120px 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  });

  onDestroy(() => {
    if (completionTimer !== undefined) window.clearTimeout(completionTimer);
  });

  function chooseDestination(region: Exclude<RegionId, ''>) {
    const next = destinations.find((item) => item.id === region);
    trackEvent('logistics_map_start', { region });
    setRegion(region);
    activeMode = next?.modes.includes('sea') ? 'sea' : next?.modes[0] ?? 'road';
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420;
    if (completionTimer !== undefined) window.clearTimeout(completionTimer);
    completionTimer = window.setTimeout(() => trackEvent('logistics_route_complete', { region }), delay);
  }

  function chooseMode(mode: ModeId) {
    activeMode = mode;
    trackEvent('logistics_mode_change', { mode, region: $projectContext.region });
  }
</script>

<section bind:this={section} class="logistics chapter" id="logistics" aria-labelledby="logistics-title">
  <div class="chapter__heading chapter__heading--split">
    <div>
      <p class="eyebrow">Логистика / источник подтверждён</p>
      <h2 id="logistics-title">Реальный контур России. Предварительная связка маршрута.</h2>
    </div>
    <p>Карта не обещает срок или цену. Она показывает, какие режимы доставки допустимо вынести в расчёт после выбора региона.</p>
  </div>

  <div class="logistics__workspace">
    <div class="logistics__map" class:map--russia={$projectContext.region === 'russia'}>
      <svg viewBox="0 0 1650 1000" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">Карта России с границами субъектов и выбранным регионом</title>
        <desc id="map-desc">Узнаваемая карта страны с границами субъектов, точкой предварительного расчёта и выбранным направлением. Не в масштабе маршрута.</desc>
        <image class="map__base" href="/data/russia-federal-subjects.svg" x="0" y="0" width="1650" height="1000" />
        {#if destination}
          <ellipse class="map__highlight" cx={destination.highlight.x} cy={destination.highlight.y} rx={destination.highlight.rx} ry={destination.highlight.ry} />
        {/if}
        {#if destination?.route && routeVisible}
          {#key destination.id}<path class="map__route" d={destination.route} />{/key}
        {/if}
        <g class="map__origin">
          <circle cx={origin.x} cy={origin.y} r="11" />
          <circle cx={origin.x} cy={origin.y} r="24" />
          <text x={origin.x + 25} y={origin.y - 18}>ТОЧКА ПРЕДВАРИТЕЛЬНОГО</text>
          <text x={origin.x + 25} y={origin.y + 4}>РАСЧЁТА</text>
        </g>
        {#if destination?.point}
          <g class="map__destination active">
            <circle cx={destination.point.x} cy={destination.point.y} r="13" />
            <text x={destination.point.x + 22} y={destination.point.y - 17}>{destination.label}</text>
          </g>
        {/if}
      </svg>
      <div class="logistics__map-meta">
        <span>Границы субъектов сохранены</span>
        <span>Линия — предварительная связка, не маршрут</span>
        <a href="https://commons.wikimedia.org/wiki/File:Map_of_federal_subjects_of_Russian_Federation.svg" target="_blank" rel="noreferrer">Карта: CC BY-SA 3.0</a>
      </div>
    </div>

    <aside class="logistics__panel">
      <p class="mono-label">01 / Целевой регион</p>
      <div class="logistics__destinations" role="group" aria-label="Целевой регион доставки">
        {#each destinations as item}
          <button type="button" class:active={$projectContext.region === item.id} aria-pressed={$projectContext.region === item.id} onclick={() => chooseDestination(item.id)}>{item.label}</button>
        {/each}
      </div>

      {#if destination}
        <div class="logistics__result" aria-live="polite">
          <span>Предварительная связка</span>
          <h3>{destination.id === 'russia' ? 'Уточнить регион в России' : `Точка расчёта → ${destination.label}`}</h3>
          <p>{destination.note}</p>
        </div>

        <div class="logistics__mode-section">
          <p class="mono-label">02 / Допустимые режимы для проверки</p>
          <div class="logistics__mode-buttons" role="group" aria-label="Режим доставки">
            {#each allowedModes as mode}
              <button type="button" class:active={activeMode === mode.id} aria-pressed={activeMode === mode.id} onclick={() => chooseMode(mode.id)}>{mode.title}</button>
            {/each}
          </div>
          <div class="logistics__mode-source">
            <strong>{activeModeData.title}</strong>
            <p>{activeModeData.support}</p>
            <a href={activeModeData.sourceUrl} target="_blank" rel="noreferrer">{activeModeData.sourceLabel} ↗</a>
          </div>
        </div>

        <div class="logistics__case">
          <span class="mono-label">03 / Релевантный опубликованный кейс</span>
          <strong>{destination.caseTitle}</strong>
          <p>{destination.caseNote}</p>
        </div>
      {:else}
        <div class="logistics__empty"><p>Выберите регион, чтобы увидеть доступные для проверки режимы и релевантный опубликованный кейс.</p></div>
      {/if}

      <a class="button button--primary" href="#project-brief">Рассчитать логистику</a>
    </aside>
  </div>
</section>
