<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { initProjectContext, projectContext, setRegion, type RegionId } from '$lib/state/projectContext';
  import { trackEvent } from '$lib/analytics';

  const destinations = [
    { id: 'moskva', label: 'Москва и Московская область', x: 300, y: 214, path: 'M420 246 C380 236 340 224 300 214', modes: ['авто', 'ж/д'], note: 'Проверяем габариты, окна поставки и подъезд к площадке.' },
    { id: 'krasnoyarsk', label: 'Красноярский край', x: 650, y: 250, path: 'M420 246 C500 232 580 236 650 250', modes: ['авто', 'ж/д', 'смешанная'], note: 'Отдельно проверяем плечи перегрузки и ограничения площадки.' },
    { id: 'ural', label: 'Урал', x: 470, y: 258, path: 'M420 246 C438 245 452 251 470 258', modes: ['авто', 'ж/д'], note: 'Синхронизируем производственный график и последовательность отгрузки.' },
    { id: 'siberia', label: 'Сибирь', x: 646, y: 286, path: 'M420 246 C498 250 570 268 646 286', modes: ['авто', 'ж/д', 'смешанная'], note: 'Отдельно проверяем плечи перегрузки и сезонные ограничения.' },
    { id: 'far-east', label: 'Дальний Восток', x: 902, y: 318, path: 'M420 246 C590 240 730 292 902 318', modes: ['ж/д', 'море', 'река', 'зимник', 'смешанная'], note: 'Маршрут может зависеть от навигации, перевалки и готовности зимника.' },
    { id: 'kurgan', label: 'Курганская область', x: 492, y: 290, path: 'M420 246 C448 258 470 276 492 290', modes: ['авто', 'ж/д'], note: 'Уточняем ограничения подъезда и порядок приёмки модульных групп.' },
    { id: 'russia', label: 'Россия', x: 720, y: 270, path: 'M420 246 C520 226 620 242 720 270', modes: ['авто', 'ж/д', 'смешанная'], note: 'Точный регион и маршрут нужно зафиксировать до расчёта.' }
  ] as const;

  const modeVisuals = [
    { id: 'road', title: 'Автомобиль', image: 'a-modul-logistics-road', alt: 'Визуализация перевозки готового модуля по автомобильной дороге' },
    { id: 'rail', title: 'Железная дорога', image: 'a-modul-logistics-rail', alt: 'Визуализация перевозки готовых модулей на железнодорожных платформах' },
    { id: 'sea', title: 'Море', image: 'a-modul-logistics-sea', alt: 'Визуализация перевозки готовых модулей на грузовой барже' },
    { id: 'winter', title: 'Зимник', image: 'a-modul-logistics-winter-road', alt: 'Визуализация перевозки готового модуля по подготовленной зимней дороге' }
  ] as const;
  type LogisticsVisualId = (typeof modeVisuals)[number]['id'];

  $: destination = destinations.find((item) => item.id === $projectContext.region);
  let section: HTMLElement;
  let routeVisible = false;
  let activeMode: LogisticsVisualId = 'road';
  let completionTimer: number | undefined;

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

  function chooseDestination(region: RegionId) {
    trackEvent('logistics_map_start', { region });
    setRegion(region);
    activeMode = region === 'far-east' ? 'sea' : region === 'krasnoyarsk' || region === 'siberia' ? 'rail' : 'road';
    const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450;
    if (completionTimer !== undefined) window.clearTimeout(completionTimer);
    completionTimer = window.setTimeout(() => trackEvent('logistics_route_complete', { region }), delay);
  }

  function chooseMode(mode: LogisticsVisualId) {
    activeMode = mode;
  }
</script>

<section bind:this={section} class="logistics chapter" id="logistics" aria-labelledby="logistics-title">
  <div class="chapter__heading">
    <p class="eyebrow">Региональная логистика / без ложной цены</p>
    <h2 id="logistics-title">Сначала считаем маршрут. Потом обещаем срок и стоимость.</h2>
    <p>Карта показывает возможную схему, а не готовое коммерческое предложение. Вид транспорта и точки перегрузки подтверждаются после исходных данных.</p>
  </div>
  <div class="logistics__workspace">
    <div class="logistics__map">
      <svg viewBox="0 0 1080 540" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">Схема маршрутов по регионам России</title>
        <desc id="map-desc">Упрощённая интерактивная карта без масштаба, километража, сроков и стоимости.</desc>
        <path class="map__land" d="M119 184 183 118 288 105 367 144 451 123 525 154 605 138 691 174 755 154 842 191 962 178 1022 234 985 294 930 310 887 356 791 346 722 389 625 355 558 382 487 348 415 379 342 347 277 367 228 331 158 319 96 264Z" />
        <path class="map__spine" d="M118 264 C268 215 352 245 420 246 S655 252 902 318" />
        {#if destination && routeVisible}{#key $projectContext.region}<path class="map__route" d={destination.path} />{/key}{/if}
        <g class="map__origin"><circle cx="420" cy="246" r="10" /><circle cx="420" cy="246" r="22" /><text x="438" y="230">НОВОСИБИРСК</text><text x="438" y="250">ТОЧКА РАСЧЁТА</text></g>
        {#each destinations as item}
          <g class:active={$projectContext.region === item.id} class="map__destination">
            <circle cx={item.x} cy={item.y} r={$projectContext.region === item.id ? 12 : 7} />
            {#if $projectContext.region === item.id}<text x={item.x + 18} y={item.y - 14}>{item.label}</text>{/if}
          </g>
        {/each}
      </svg>
      <p>Схема не в масштабе. Не является расчётом маршрута, срока или цены доставки.</p>
    </div>
    <aside class="logistics__panel">
      <p class="mono-label">Целевой регион</p>
      <div class="logistics__destinations" role="group" aria-label="Целевой регион доставки">
        {#each destinations as item}<button type="button" class:active={$projectContext.region === item.id} aria-pressed={$projectContext.region === item.id} onclick={() => chooseDestination(item.id as RegionId)}>{item.label}</button>{/each}
      </div>
      <div class="logistics__mode-card" data-active-mode={activeMode}>
        {#key activeMode}
          {@const visual = modeVisuals.find((item) => item.id === activeMode) ?? modeVisuals[0]}
          <picture>
            <source media="(max-width: 720px)" type="image/avif" srcset={`/generated/${visual.image}-mobile.avif`} />
            <source media="(max-width: 720px)" type="image/webp" srcset={`/generated/${visual.image}-mobile.webp`} />
            <source type="image/avif" srcset={`/generated/${visual.image}-desktop.avif`} />
            <img src={`/generated/${visual.image}-desktop.webp`} width="1600" height="900" alt={visual.alt} loading="lazy" />
          </picture>
          <span class="visualization-label">Иллюстративный режим доставки — не расчёт маршрута</span>
        {/key}
      </div>
      <div class="logistics__mode-buttons" role="group" aria-label="Визуальный режим доставки">
        {#each modeVisuals as mode}
          <button type="button" class:active={activeMode === mode.id} aria-pressed={activeMode === mode.id} onclick={() => chooseMode(mode.id)}>{mode.title}</button>
        {/each}
      </div>
      <div class="logistics__result" aria-live="polite"><span>Предварительная связка</span>{#if destination}<h3>Новосибирск → {destination.label}</h3><ul>{#each destination.modes as mode}<li>{mode}</li>{/each}</ul><p>{destination.note}</p>{:else}<h3>Выберите регион проекта</h3><p>Маршрут, вид транспорта и точки перегрузки определяются после выбора региона и получения исходных данных.</p>{/if}</div>
      <a class="button button--primary" href="#project-brief">Рассчитать логистику</a>
    </aside>
  </div>
</section>
