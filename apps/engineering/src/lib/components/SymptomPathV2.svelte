<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { replaceState } from '$app/navigation';
  import { noises } from '$lib/content';
  import { track } from '$lib/analytics';
  import { buildDiagnosisHref } from '$lib/diagnosis-link';

  let activeIndex = 0;
  let phase: 'hold' | 'retracting' | 'entering' = 'hold';
  let timers: ReturnType<typeof setTimeout>[] = [];
  let reduced = false;

  $: noise = noises[activeIndex];
  $: progress = `${activeIndex + 1} / ${noises.length}`;
  $: diagnosisHref = buildDiagnosisHref($page.url, 'symptom_path', {
    noise: noise.title,
    noiseId: noise.id,
    context: noise.ctaContext
  });

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function persist(index: number) {
    const item = noises[index];
    sessionStorage.setItem('engineering:selectedNoise', item.id);
    window.dispatchEvent(new CustomEvent('engineering:noise-selected', { detail: { noiseId: item.id } }));
    const url = new URL(window.location.href);
    url.searchParams.set('noiseId', item.id);
    replaceState(`${url.pathname}${url.search}${url.hash}`, history.state);
  }

  function selectNoise(index: number, source: 'index' | 'keyboard' | 'stepper' = 'index') {
    if (index === activeIndex && phase === 'hold') return;
    clearTimers();
    const commit = () => {
      activeIndex = index;
      persist(index);
      track('noise_selected', { noise: noises[index].id, source });
      track('path_selected', { noise: noises[index].id, source: 'symptom_path_v2' });
    };
    if (reduced) {
      commit();
      phase = 'hold';
      return;
    }
    phase = 'retracting';
    timers.push(setTimeout(() => {
      commit();
      phase = 'entering';
    }, 210));
    timers.push(setTimeout(() => {
      phase = 'hold';
    }, 950));
  }

  function step(delta: number) {
    selectNoise((activeIndex + delta + noises.length) % noises.length, 'stepper');
  }

  function onTabKey(event: KeyboardEvent, index: number) {
    const keys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = noises.length - 1;
    else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % noises.length;
    else next = (index - 1 + noises.length) % noises.length;
    selectNoise(next, 'keyboard');
    const list = (event.currentTarget as HTMLElement).closest('[role="tablist"]');
    (list?.querySelector(`[data-v2-noise-index="${next}"]`) as HTMLButtonElement | null)?.focus();
  }

  onMount(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const setReduced = () => reduced = media.matches;
    setReduced();
    media.addEventListener('change', setReduced);
    const params = new URLSearchParams(window.location.search);
    const stored = sessionStorage.getItem('engineering:selectedNoise');
    const requested = params.get('noiseId') || stored;
    const index = noises.findIndex((item) => item.id === requested);
    if (index >= 0) activeIndex = index;
    return () => {
      clearTimers();
      media.removeEventListener('change', setReduced);
    };
  });
</script>

<section class:retracting={phase === 'retracting'} class:entering={phase === 'entering'} class="symptom-path-v2" id="symptoms" data-chapter="02 · Маршрут шума" aria-labelledby="symptom-path-v2-title">
  <header class="symptom-path-v2-heading">
    <div class="section-label">02 / Симптом и путь</div>
    <h2 id="symptom-path-v2-title">Что слышим — не всегда то, откуда приходит шум.</h2>
    <p>Выберите симптом. Схема покажет, какие маршруты сравниваем и где ищем подтверждение гипотезы.</p>
  </header>

  <div class="symptom-path-v2-grid">
    <div class="symptom-path-v2-index" role="tablist" aria-label="Что слышно чаще всего" aria-orientation="vertical">
      {#each noises as item, index}
        <button
          id={`symptom-v2-tab-${item.id}`}
          type="button"
          role="tab"
          data-v2-noise-index={index}
          aria-controls="symptom-v2-panel"
          aria-selected={activeIndex === index}
          tabindex={activeIndex === index ? 0 : -1}
          on:click={() => selectNoise(index)}
          on:keydown={(event) => onTabKey(event, index)}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{item.short}</strong>
          <em>{item.share}</em>
        </button>
      {/each}
    </div>

    <div
      class="symptom-path-v2-panel"
      id="symptom-v2-panel"
      role="tabpanel"
      aria-labelledby={`symptom-v2-tab-${noise.id}`}
      aria-busy={phase !== 'hold'}
      tabindex="0"
    >
      <div class="symptom-path-v2-mobile-nav" role="group" aria-label="Переключить симптом">
        <button type="button" on:click={() => step(-1)}>← Назад</button>
        <strong>{progress}</strong>
        <button type="button" on:click={() => step(1)}>Далее →</button>
      </div>

      <figure class="symptom-path-v2-scene">
        <svg viewBox="0 0 900 600" role="img" aria-labelledby="symptom-v2-svg-title symptom-v2-svg-desc">
          <title id="symptom-v2-svg-title">Архитектурная схема: {noise.title}</title>
          <desc id="symptom-v2-svg-desc">Слышится {noise.perceivedSource}. Сравниваем {noise.candidateRoutes.map((route) => route.label).join(', ')}. Вероятный маршрут выделен сплошной линией. Точки проверки: {noise.likelyZones.join(', ')}.</desc>

          <g class="architecture" aria-hidden="true">
            <g id="architecture-ceiling-slab" data-architecture-class="ceiling-slab"><path d="M115 76 H790 L760 112 H115 Z" /></g>
            <g id="architecture-floor-slab" data-architecture-class="floor-slab"><path d="M115 515 H760 L790 552 H115 Z" /></g>
            <g id="architecture-wall" data-architecture-class="wall"><path d="M115 112 V515 M490 112 V515 M760 112 V515" /></g>
            <g id="architecture-junction" data-architecture-class="junction"><path d="M472 112 H508 M472 515 H508 M742 112 H778 M742 515 H778" /></g>
            <g id="architecture-socket" data-architecture-class="socket"><rect x="474" y="326" width="32" height="28" rx="2" /><circle cx="484" cy="340" r="3" /><circle cx="496" cy="340" r="3" /></g>
            <g id="architecture-ventilation" data-architecture-class="ventilation"><path d="M612 112 V150 H704 V112 M630 126 H686 M630 137 H686" /></g>
            <g id="architecture-facade-opening" data-architecture-class="facade-opening"><rect x="115" y="156" width="108" height="150" /><path d="M169 156 V306 M115 231 H223" /></g>
            <g id="architecture-structural-core" data-architecture-class="structural-core"><path d="M760 112 H818 V515 H760 M776 142 H801 M776 172 H801 M776 202 H801" /></g>
            <path class="room-axis" d="M115 360 H760" />
          </g>

          {#key noise.id}
            <g class="source-marker route-animated" aria-hidden="true">
              <path d={`M${noise.sourcePoint[0]} ${noise.sourcePoint[1] - 9} l8 15 h-16 z`} />
              <text x={noise.sourcePoint[0] > 700 ? noise.sourcePoint[0] - 15 : noise.sourcePoint[0] + 15} y={noise.sourcePoint[1] - 12} text-anchor={noise.sourcePoint[0] > 700 ? 'end' : 'start'}>источник?</text>
            </g>
            <g class="candidate-routes" aria-hidden="true">
              {#each noise.candidateRoutes as route, routeIndex}
                <path class="candidate-route route-animated" d={route.path} pathLength="1" style={`--route-delay:${120 + routeIndex * 70}ms`} />
              {/each}
            </g>
            <path class="selected-route route-animated" d={noise.candidateRoutes[0].path} pathLength="1" aria-hidden="true" />
            <g class="inspection-points route-animated" aria-hidden="true">
              {#each noise.checkpoints as point, pointIndex}
                <rect x={point[0] - 6} y={point[1] - 6} width="12" height="12" transform={`rotate(45 ${point[0]} ${point[1]})`} style={`--point-delay:${560 + pointIndex * 60}ms`} />
              {/each}
            </g>
            <g class="heard-marker route-animated" aria-hidden="true">
              <circle cx={noise.heardPoint[0]} cy={noise.heardPoint[1]} r="13" />
              <path d={`M${noise.heardPoint[0] - 19} ${noise.heardPoint[1]} H${noise.heardPoint[0] + 19} M${noise.heardPoint[0]} ${noise.heardPoint[1] - 19} V${noise.heardPoint[1] + 19}`} />
              <text x={noise.heardPoint[0] + 22} y={noise.heardPoint[1] + 5}>слышно</text>
            </g>
          {/key}
        </svg>

        <figcaption class="symptom-path-v2-legend">
          <span><i class="heard"></i> где слышно</span>
          <span><i class="candidate"></i> возможный путь</span>
          <span><i class="selected"></i> вероятный путь</span>
          <span><i class="checkpoint"></i> точка проверки</span>
        </figcaption>
      </figure>
    </div>

    {#key noise.id}
      <aside class="symptom-path-v2-conclusion" aria-live="polite">
        <span class="symptom-path-v2-kicker">Инженерная гипотеза · {progress}</span>
        <h3>{noise.title}</h3>
        <dl>
          <div><dt>Слышится</dt><dd>{noise.perceivedSource}</dd></div>
          <div><dt>Тип</dt><dd>{noise.noiseType}</dd></div>
        </dl>
        <p>{noise.conclusion}</p>
        <div class="symptom-path-v2-zones">
          <span>Проверить на объекте</span>
          <ul>{#each noise.likelyZones as zone}<li>{zone}</li>{/each}</ul>
        </div>
        <a class="primary-button" href={diagnosisHref} on:click={() => track('diagnostic_start', { source: 'symptom_path', noise: noise.id })}>Проверить маршрут в квартире</a>
        <small>Схема показывает порядок проверки, а не дистанционный диагноз.</small>
      </aside>
    {/key}
  </div>
</section>
