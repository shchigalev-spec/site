<script lang="ts">
  import { onMount } from 'svelte';
  import { diagnosticContext } from '$lib/stores/diagnostic';
  import { track } from '$lib/analytics';
  import type { NoiseKey, PathKey } from '$lib/types';

  type Route = { d: string; label: string };
  type Symptom = {
    key: NoiseKey;
    label: string;
    short: string;
    signal: string;
    surface: string;
    direction: string;
    source: { x: number; y: number; label: string };
    routes: Route[];
    selected: number;
    checkpoints: { x: number; y: number; label: string }[];
    inspect: string[];
    conclusion: string;
    cta: string;
    path: PathKey;
  };

  const symptoms: Symptom[] = [
    {
      key: 'impact',
      label: 'Топот и удары сверху',
      short: 'Топот сверху',
      signal: 'Редкие резкие импульсы',
      surface: 'Ощущается в потолке',
      direction: 'above',
      source: { x: 650, y: 45, label: 'УДАР СВЕРХУ' },
      routes: [
        { d: 'M650 45 L650 102 L650 178 L650 360', label: 'через перекрытие' },
        { d: 'M650 45 L650 102 L430 102 L430 360 L650 360', label: 'верхнее примыкание' },
        { d: 'M650 45 L825 102 L825 420 L650 360', label: 'фланговая стена' }
      ],
      selected: 1,
      checkpoints: [{ x: 650, y: 102, label: 'плита' }, { x: 430, y: 102, label: 'верхний узел' }, { x: 650, y: 360, label: 'приём' }],
      inspect: ['тип перекрытия', 'верхние примыкания', 'отклик связанных стен'],
      conclusion: 'Удар слышен сверху, но доминирующий путь может входить через узел плиты и стены.',
      cta: 'Проверить шум сверху',
      path: 'ceiling'
    },
    {
      key: 'voices',
      label: 'Голоса через стену',
      short: 'Голоса',
      signal: 'Плотная речевая огибающая',
      surface: 'Кажется, что звучит стена',
      direction: 'side',
      source: { x: 285, y: 315, label: 'СОСЕДНЯЯ КОМНАТА' },
      routes: [
        { d: 'M285 315 L430 315 L650 360', label: 'через перегородку' },
        { d: 'M285 315 L405 315 L455 315 L650 360', label: 'через розетки' },
        { d: 'M285 315 L285 102 L430 102 L430 360 L650 360', label: 'по примыканиям' }
      ],
      selected: 1,
      checkpoints: [{ x: 405, y: 315, label: 'коробка' }, { x: 455, y: 315, label: 'полость' }, { x: 430, y: 455, label: 'нижний узел' }],
      inspect: ['состав перегородки', 'розетки и полости', 'стыки с полом и потолком'],
      conclusion: 'Розетки и связанная полость могут оказаться короче прямого пути через массив стены.',
      cta: 'Проверить боковой путь',
      path: 'socket'
    },
    {
      key: 'bass',
      label: 'Бас и музыка',
      short: 'Бас и музыка',
      signal: 'Длинная низкая волна',
      surface: 'Ощущается всем контуром',
      direction: 'unknown',
      source: { x: 265, y: 405, label: 'НИЗКАЯ ЧАСТОТА' },
      routes: [
        { d: 'M265 405 C350 480 510 490 650 360', label: 'через плиту пола' },
        { d: 'M265 405 C280 210 520 82 825 160 L825 420 L650 360', label: 'по конструкционному контуру' },
        { d: 'M265 405 L430 455 L650 455 L650 360', label: 'нижнее примыкание' }
      ],
      selected: 1,
      checkpoints: [{ x: 430, y: 455, label: 'периметр' }, { x: 650, y: 102, label: 'плита' }, { x: 825, y: 420, label: 'фланг' }],
      inspect: ['жёсткие связи', 'контур перекрытий', 'примыкания и проходки'],
      conclusion: 'Низкая частота возбуждает не одну поверхность, а связанный конструкционный контур.',
      cta: 'Разобрать низкую частоту',
      path: 'junction'
    },
    {
      key: 'lift',
      label: 'Лифт и вибрация',
      short: 'Лифт',
      signal: 'Механические импульсы',
      surface: 'Вибрация приходит из структуры',
      direction: 'unknown',
      source: { x: 135, y: 330, label: 'ШАХТА / ЯДРО' },
      routes: [
        { d: 'M135 330 L135 455 L430 455 L650 360', label: 'через нижнюю плиту' },
        { d: 'M135 330 L135 102 L430 102 L430 360 L650 360', label: 'через верхнюю плиту' },
        { d: 'M135 330 L205 330 L430 360 L650 360', label: 'через жёсткую связь' }
      ],
      selected: 2,
      checkpoints: [{ x: 135, y: 330, label: 'ядро' }, { x: 205, y: 330, label: 'связь' }, { x: 430, y: 360, label: 'узел стены' }],
      inspect: ['контакт с ядром', 'плиты и жёсткие связи', 'вибрационный отклик'],
      conclusion: 'Механический источник проверяют по связям с ядром здания, а не только по слышимой стене.',
      cta: 'Проверить вибрационный путь',
      path: 'junction'
    },
    {
      key: 'road',
      label: 'Улица и дорога',
      short: 'Улица',
      signal: 'Широкое непрерывное поле',
      surface: 'Сильнее у фасада',
      direction: 'facade',
      source: { x: 955, y: 320, label: 'УЛИЧНОЕ ПОЛЕ' },
      routes: [
        { d: 'M955 320 L870 320 L650 360', label: 'через заполнение окна' },
        { d: 'M955 320 L870 230 L825 230 L650 360', label: 'через откос и стык' },
        { d: 'M955 320 L870 420 L825 420 L650 360', label: 'через фасадное примыкание' }
      ],
      selected: 1,
      checkpoints: [{ x: 870, y: 320, label: 'окно' }, { x: 825, y: 230, label: 'верхний откос' }, { x: 825, y: 420, label: 'нижний стык' }],
      inspect: ['стеклопакет и притвор', 'откосы', 'фасадные примыкания'],
      conclusion: 'Уличное поле разделяют на заполнение окна и обходные пути по откосам и фасадным стыкам.',
      cta: 'Проверить фасадный путь',
      path: 'wall'
    },
    {
      key: 'ventilation',
      label: 'Вентиляция',
      short: 'Вентиляция',
      signal: 'Узкополосный поток',
      surface: 'Локализуется у решётки',
      direction: 'ventilation',
      source: { x: 170, y: 118, label: 'СМЕЖНЫЙ КАНАЛ' },
      routes: [
        { d: 'M170 118 L500 118 L500 220 L650 360', label: 'по воздушному каналу' },
        { d: 'M170 118 L430 102 L430 360 L650 360', label: 'через шахту и стену' },
        { d: 'M170 118 L620 118 L825 230 L650 360', label: 'через ответвление' }
      ],
      selected: 0,
      checkpoints: [{ x: 170, y: 118, label: 'шахта' }, { x: 500, y: 118, label: 'поворот' }, { x: 500, y: 220, label: 'решётка' }],
      inspect: ['связанные ответвления', 'решётка и канал', 'шахта вентиляции'],
      conclusion: 'Для вентиляции сначала подтверждают воздушную связь канала и только затем выбирают узел.',
      cta: 'Проверить канал',
      path: 'ventilation'
    }
  ];

  let activeIndex = 0;
  let tabs: HTMLButtonElement[] = [];
  let changing = false;
  let transitionTimer: number | undefined;
  let completionTimer: number | undefined;
  let sequence = 0;
  $: active = symptoms[activeIndex];

  function persistSelection(item: Symptom, emit = true) {
    diagnosticContext.update((context) => ({
      ...context,
      noise: item.key,
      direction: item.direction,
      path: item.path
    }));
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('tech:v2:noise', item.key);
    sessionStorage.setItem('tech:v2:path', item.path);
    sessionStorage.setItem('tech:v2:direction', item.direction);
    const url = new URL(window.location.href);
    url.searchParams.set('noise', item.key);
    history.replaceState(history.state, '', `${url.pathname}${url.search}${url.hash}`);
    if (emit) {
      track('noise_selected', { noise: item.key, surface: item.surface });
      track('path_selected', { noise: item.key, path: item.path });
    }
  }

  function choose(index: number, focus = false) {
    const next = (index + symptoms.length) % symptoms.length;
    if (next === activeIndex || changing) {
      if (focus) tabs[next]?.focus();
      return;
    }
    changing = true;
    window.clearTimeout(transitionTimer);
    window.clearTimeout(completionTimer);
    transitionTimer = window.setTimeout(() => {
      activeIndex = next;
      sequence += 1;
      changing = false;
      persistSelection(symptoms[next]);
      if (focus) tabs[next]?.focus();
      completionTimer = window.setTimeout(() => track('route_animation_complete', { noise: symptoms[next].key }), 640);
    }, 170);
  }

  function onKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); choose(index + 1, true); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); choose(index - 1, true); }
    if (event.key === 'Home') { event.preventDefault(); choose(0, true); }
    if (event.key === 'End') { event.preventDefault(); choose(symptoms.length - 1, true); }
  }

  function onDirectSelect(event: Event) {
    choose(Number((event.currentTarget as HTMLSelectElement).value));
  }

  onMount(() => {
    const urlKey = new URL(window.location.href).searchParams.get('noise');
    const storedKey = sessionStorage.getItem('tech:v2:noise');
    const initialKey = urlKey || storedKey;
    const initial = symptoms.findIndex((item) => item.key === initialKey);
    if (initial >= 0) activeIndex = initial;
    persistSelection(symptoms[initial >= 0 ? initial : 0], false);
    return () => {
      window.clearTimeout(transitionTimer);
      window.clearTimeout(completionTimer);
    };
  });
</script>

<section class="path-lab" id="noise-deck" aria-labelledby="path-lab-title" data-noise={active.key}>
  <div class="shell chapter-head">
    <p class="mono">СИМПТОМ И ПУТЬ / 02</p>
    <h2 class="display" id="path-lab-title">Что именно вы слышите?</h2>
    <p>Симптом указывает направление проверки, но ещё не называет конструкцию.</p>
  </div>

  <div class="lab shell">
    <div class="symptom-rail" role="tablist" aria-label="Выберите симптом шума">
      {#each symptoms as item, index}
        <button
          id={`symptom-${item.key}`}
          bind:this={tabs[index]}
          type="button"
          role="tab"
          aria-selected={activeIndex === index}
          aria-controls="path-lab-panel"
          tabindex={activeIndex === index ? 0 : -1}
          class:active={activeIndex === index}
          on:click={() => choose(index)}
          on:keydown={(event) => onKeydown(event, index)}
        >
          <span class="mono">0{index + 1}</span>
          <strong>{item.short}</strong>
        </button>
      {/each}
    </div>

    <div class="mobile-stepper" aria-label="Навигация по симптомам">
      <button type="button" on:click={() => choose(activeIndex - 1)} aria-label="Предыдущий симптом">←</button>
      <span class="mono">{activeIndex + 1} / {symptoms.length}</span>
      <button type="button" on:click={() => choose(activeIndex + 1)} aria-label="Следующий симптом">→</button>
      <label>
        <span class="visually-hidden">Выбрать симптом напрямую</span>
        <select value={activeIndex} on:change={onDirectSelect}>
          {#each symptoms as item, index}<option value={index}>{item.short}</option>{/each}
        </select>
      </label>
    </div>

    <div
      class:changing
      class="model-panel"
      id="path-lab-panel"
      role="tabpanel"
      tabindex="0"
      aria-labelledby={`symptom-${active.key}`}
    >
      <picture class="model-plate" aria-hidden="true">
        <source media="(max-width: 767px)" srcset="/generated/tech-v2-apartment-xray-base-960.webp" type="image/webp" />
        <source srcset="/generated/tech-v2-apartment-xray-base.avif" type="image/avif" />
        <source srcset="/generated/tech-v2-apartment-xray-base.webp" type="image/webp" />
        <img src="/generated/tech-v2-apartment-xray-base.png" alt="" width="1536" height="1024" loading="lazy" />
      </picture>

      {#key `${active.key}-${sequence}`}
        <svg class="architecture" viewBox="0 0 1000 620" role="img" aria-label={`Схема путей для симптома: ${active.label}`}>
          <defs>
            <linearGradient id="receiver-fill" x1="0" x2="1">
              <stop offset="0" stop-color="#7aa89f" stop-opacity=".02" />
              <stop offset="1" stop-color="#7aa89f" stop-opacity=".12" />
            </linearGradient>
            <filter id="path-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <g class="architectural-model">
            <path class="ceiling-slab" d="M70 80 L870 80 L925 112 L126 112 Z" />
            <path class="floor-slab" d="M70 470 L870 470 L925 510 L126 510 Z" />
            <path class="wall wall-back" d="M126 112 L870 112 L870 470 L126 470 Z" />
            <path class="receiving-room" d="M430 112 L825 112 L825 455 L430 455 Z" fill="url(#receiver-fill)" />
            <path class="source-room" d="M205 112 L430 112 L430 455 L205 455 Z" />
            <path class="structural-core" d="M92 135 L205 112 L205 455 L92 432 Z" />
            <path class="wall partition" d="M420 112 L442 112 L442 455 L420 455 Z" />
            <path class="junction upper-junction" d="M420 112 L442 112" />
            <path class="junction lower-junction" d="M420 455 L442 455" />
            <g class="socket">
              <rect x="399" y="294" width="24" height="42" rx="3" />
              <rect x="442" y="294" width="24" height="42" rx="3" />
            </g>
            <path class="ventilation-duct" d="M130 118 H500 V220 H560" />
            <path class="facade-opening" d="M825 205 L870 190 L870 420 L825 430 Z" />
            <path class="window-line" d="M836 226 L858 218 L858 398 L836 405 Z" />
            <text x="560" y="432">ПРИЁМНАЯ КОМНАТА</text>
            <text x="250" y="432">СМЕЖНАЯ ЗОНА</text>
            <text x="102" y="420">ЯДРО</text>
          </g>

          <g class={`signal signal-${active.key}`}>
            <circle class="source-marker" cx={active.source.x} cy={active.source.y} r="10" />
            {#if active.key === 'impact'}
              <path class="signal-mark" d="M625 20 V55 M650 8 V55 M675 26 V55" pathLength="1" />
            {:else if active.key === 'voices'}
              <path class="signal-mark" d="M220 315 C238 270 250 360 268 315 S300 270 320 315 S350 360 370 315" pathLength="1" />
            {:else if active.key === 'bass'}
              <path class="signal-mark" d="M105 405 C155 330 205 480 255 405 S355 330 405 405" pathLength="1" />
            {:else if active.key === 'lift'}
              <path class="signal-mark" d="M105 390 V345 H126 V270 H146 V365 H168 V305 H188 V390" pathLength="1" />
            {:else if active.key === 'road'}
              <path class="signal-field" d="M985 218 C930 240 925 280 875 300 M992 290 C940 302 925 338 875 350 M985 365 C935 360 920 398 875 410" pathLength="1" />
            {:else}
              <path class="signal-mark airflow" d="M112 100 C155 82 190 135 235 112 S318 92 360 115" pathLength="1" />
            {/if}
          </g>

          <g class="candidate-paths">
            {#each active.routes as route, index}
              <path class:dominant={index === active.selected} d={route.d} pathLength="1" style={`--route-order:${index}`} />
            {/each}
          </g>
          <path class="selected-path" d={active.routes[active.selected].d} pathLength="1" />

          <g class="inspection-checkpoints">
            {#each active.checkpoints as point, index}
              <g style={`--checkpoint-order:${index}`}>
                <circle cx={point.x} cy={point.y} r="7" />
                <text x={point.x + 13} y={point.y - 11}>{point.label}</text>
              </g>
            {/each}
          </g>
        </svg>
      {/key}

      <div class="signal-caption">
        <span class="mono">СИГНАЛ</span>
        <strong>{active.signal}</strong>
        <span>{active.surface}</span>
      </div>
    </div>

    <aside class="diagnostic-output" aria-live="polite" aria-atomic="true">
      <p class="mono">ВЫБРАННЫЙ ПУТЬ / {active.routes[active.selected].label}</p>
      <h3>{active.label}</h3>
      <p class="conclusion">{active.conclusion}</p>
      <div class="route-list">
        {#each active.routes as route, index}
          <p class:dominant={index === active.selected}><span class="route-line"></span>{route.label}</p>
        {/each}
      </div>
      <div class="inspection-list">
        <span class="mono">ПРОВЕРЯЕМ НА ОБЪЕКТЕ</span>
        <ul>{#each active.inspect as item}<li>{item}</li>{/each}</ul>
      </div>
      <a class="button" href={`/diagnostika-shuma/?noise=${active.key}`} on:click={() => track('path_selected', { source: 'noise_path_lab_cta', noise: active.key, path: active.path })}>{active.cta}</a>
      <small>Это рабочая гипотеза для проверки, а не диагноз вашей квартиры.</small>
    </aside>
  </div>
</section>

<style>
  .path-lab {
    position: relative;
    padding: clamp(112px, 12vw, 210px) 0 clamp(128px, 14vw, 240px);
    overflow: hidden;
    color: var(--tech-v2-white);
    background:
      radial-gradient(circle at 62% 42%, rgba(122,168,159,.08), transparent 34%),
      var(--tech-v2-ink);
  }
  .chapter-head { display: grid; grid-template-columns: 3fr 7fr 4fr; gap: var(--tech-v2-grid-gap); align-items: end; }
  .chapter-head > .mono { grid-column: 1; align-self: start; color: var(--tech-v2-teal); }
  .chapter-head h2 { grid-column: 2; margin: 0; max-width: 760px; font-size: clamp(3rem, 5.8vw, 6.8rem); line-height: .92; }
  .chapter-head > p:last-child { grid-column: 3; max-width: 320px; margin: 0 0 8px; color: var(--tech-v2-copy-muted); }

  .lab {
    margin-top: clamp(62px, 7vw, 118px);
    display: grid;
    grid-template-columns: 2.2fr 8.2fr 3.6fr;
    gap: clamp(22px, 2.4vw, 42px);
    align-items: center;
  }
  .symptom-rail { display: flex; flex-direction: column; align-self: stretch; justify-content: center; }
  .symptom-rail button {
    min-height: 66px;
    display: grid;
    grid-template-columns: 34px 1fr;
    gap: 10px;
    align-items: center;
    padding: 10px 0;
    border: 0;
    border-bottom: 1px solid var(--tech-v2-hairline);
    background: transparent;
    color: var(--tech-v2-copy-quiet);
    text-align: left;
    cursor: pointer;
    transition: color var(--tech-v2-control) var(--tech-v2-ease), border-color var(--tech-v2-control) var(--tech-v2-ease);
  }
  .symptom-rail button strong { font-size: .82rem; font-weight: 500; }
  .symptom-rail button.active { color: var(--tech-v2-white); border-color: var(--tech-v2-coral); }
  .symptom-rail button.active .mono { color: var(--tech-v2-coral); }
  .symptom-rail button:focus-visible,
  .mobile-stepper button:focus-visible,
  .mobile-stepper select:focus-visible { outline: 2px solid var(--tech-v2-coral); outline-offset: 4px; }

  .mobile-stepper { display: none; }
  .model-panel {
    position: relative;
    min-width: 0;
    aspect-ratio: 1.58 / 1;
    overflow: hidden;
    isolation: isolate;
    outline: none;
    border-top: 1px solid var(--tech-v2-hairline);
    border-bottom: 1px solid var(--tech-v2-hairline);
    transition: opacity 180ms linear, filter 180ms linear;
  }
  .model-panel.changing { opacity: .42; filter: saturate(.55); }
  .model-plate,
  .model-plate img,
  .architecture { position: absolute; inset: 0; width: 100%; height: 100%; }
  .model-plate { z-index: -2; }
  .model-plate img { object-fit: cover; opacity: .22; filter: brightness(.44) saturate(.42) contrast(1.12); }
  .model-panel::after { content: ''; position: absolute; z-index: -1; inset: 0; background: linear-gradient(90deg, rgba(8,11,10,.76), rgba(8,11,10,.12) 55%, rgba(8,11,10,.5)); pointer-events: none; }
  .architecture { overflow: visible; }
  .architectural-model path,
  .architectural-model rect { vector-effect: non-scaling-stroke; fill: rgba(8,11,10,.28); stroke: rgba(255,253,248,.22); stroke-width: 1.2; }
  .architectural-model .ceiling-slab,
  .architectural-model .floor-slab { fill: rgba(255,253,248,.04); stroke: rgba(255,253,248,.34); }
  .architectural-model .receiving-room { stroke: rgba(122,168,159,.66); }
  .architectural-model .structural-core { fill: rgba(215,170,109,.08); stroke: rgba(215,170,109,.48); }
  .architectural-model .junction { fill: none; stroke: var(--tech-v2-coral); stroke-width: 2; }
  .architectural-model .ventilation-duct { fill: none; stroke: rgba(122,168,159,.58); stroke-width: 8; stroke-linejoin: round; }
  .architectural-model .facade-opening,
  .architectural-model .window-line { fill: rgba(122,168,159,.06); stroke: rgba(122,168,159,.64); }
  .architectural-model text,
  .inspection-checkpoints text { fill: rgba(255,253,248,.48); font: 500 9px/1 'IBM Plex Mono', monospace; letter-spacing: .08em; }
  .signal { color: var(--tech-v2-coral); }
  .source-marker { fill: var(--tech-v2-coral); stroke: rgba(255,253,248,.82); stroke-width: 2; filter: url(#path-glow); animation: source-arrive 260ms var(--tech-v2-ease-out) both; }
  .signal-mark,
  .signal-field { fill: none; stroke: currentColor; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; stroke-dashoffset: 1; animation: signal-arrive 320ms 50ms var(--tech-v2-ease-out) forwards; }
  .signal-bass .signal-mark { stroke-width: 6; opacity: .74; }
  .signal-road .signal-field { stroke-width: 12; opacity: .18; }
  .signal-ventilation .signal-mark { stroke: var(--tech-v2-teal); stroke-width: 4; stroke-dasharray: .05 .035; }
  .candidate-paths path,
  .selected-path { fill: none; vector-effect: non-scaling-stroke; stroke-linecap: round; stroke-linejoin: round; }
  .candidate-paths path { stroke: rgba(122,168,159,.5); stroke-width: 1.6; stroke-dasharray: .035 .028; stroke-dashoffset: 1; animation: route-draw 260ms calc(90ms + var(--route-order) * 35ms) var(--tech-v2-ease-out) forwards; }
  .candidate-paths path.dominant { stroke: rgba(255,253,248,.34); stroke-dasharray: .06 .018; }
  .selected-path { stroke: var(--tech-v2-coral); stroke-width: 3; stroke-dasharray: 1; stroke-dashoffset: 1; filter: url(#path-glow); animation: route-draw 340ms 220ms var(--tech-v2-ease-out) forwards; }
  .inspection-checkpoints g { opacity: 0; animation: checkpoint-arrive 130ms calc(370ms + var(--checkpoint-order) * 35ms) var(--tech-v2-ease-out) forwards; }
  .inspection-checkpoints circle { fill: var(--tech-v2-ink); stroke: var(--tech-v2-teal); stroke-width: 2; vector-effect: non-scaling-stroke; }
  @keyframes source-arrive { from { opacity: 0; transform: scale(.6); transform-origin: center; } }
  @keyframes signal-arrive { to { stroke-dashoffset: 0; } }
  @keyframes route-draw { to { stroke-dashoffset: 0; } }
  @keyframes checkpoint-arrive { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

  .signal-caption { position: absolute; left: 22px; bottom: 18px; display: grid; gap: 3px; padding-left: 12px; border-left: 1px solid var(--tech-v2-coral); }
  .signal-caption .mono { color: var(--tech-v2-coral); font-size: .58rem; }
  .signal-caption strong { font-size: .78rem; font-weight: 500; }
  .signal-caption > span:last-child { color: var(--tech-v2-copy-quiet); font-size: .68rem; }

  .diagnostic-output { align-self: stretch; display: flex; flex-direction: column; justify-content: center; padding-left: clamp(18px, 2vw, 34px); border-left: 1px solid var(--tech-v2-hairline); }
  .diagnostic-output > .mono { margin: 0; color: var(--tech-v2-teal); font-size: .62rem; }
  .diagnostic-output h3 { margin: 18px 0 14px; font-family: 'Geologica', sans-serif; font-size: clamp(1.55rem, 2.4vw, 3.1rem); line-height: 1; letter-spacing: -.045em; }
  .conclusion { margin: 0; color: var(--tech-v2-copy-muted); font-size: .9rem; }
  .route-list { margin: 26px 0 22px; }
  .route-list p { margin: 0; display: flex; align-items: center; gap: 10px; padding: 7px 0; color: var(--tech-v2-copy-quiet); font-size: .72rem; border-bottom: 1px solid var(--tech-v2-hairline); }
  .route-list p.dominant { color: var(--tech-v2-white); }
  .route-line { width: 24px; border-top: 1px dashed var(--tech-v2-teal); }
  .route-list p.dominant .route-line { border-top: 2px solid var(--tech-v2-coral); }
  .inspection-list { margin-bottom: 22px; }
  .inspection-list > .mono { color: var(--tech-v2-copy-quiet); font-size: .58rem; }
  .inspection-list ul { margin: 9px 0 0; padding: 0; list-style: none; }
  .inspection-list li { padding: 4px 0; color: var(--tech-v2-copy-muted); font-size: .72rem; }
  .inspection-list li::before { content: '↳'; margin-right: 8px; color: var(--tech-v2-teal); }
  .diagnostic-output .button { width: 100%; min-height: 48px; font-size: .76rem; }
  .diagnostic-output small { margin-top: 12px; color: var(--tech-v2-copy-quiet); font-size: .62rem; line-height: 1.45; }

  @media (max-width: 1100px) {
    .chapter-head { grid-template-columns: 2fr 6fr; }
    .chapter-head h2 { grid-column: 1 / -1; }
    .chapter-head > p:last-child { grid-column: 2; }
    .lab { grid-template-columns: 1.7fr 6.3fr; }
    .diagnostic-output { grid-column: 2; margin-top: 14px; padding: 24px 0 0; border-left: 0; border-top: 1px solid var(--tech-v2-hairline); }
    .route-list { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .inspection-list ul { display: flex; gap: 18px; flex-wrap: wrap; }
    .diagnostic-output .button { width: min(310px, 100%); }
  }

  @media (max-width: 767px) {
    .path-lab { padding: 92px 0 112px; }
    .chapter-head { display: block; }
    .chapter-head h2 { margin-top: 16px; font-size: clamp(2.55rem, 13vw, 4rem); }
    .chapter-head > p:last-child { margin-top: 18px; font-size: .88rem; }
    .lab { display: flex; flex-direction: column; align-items: stretch; margin-top: 46px; }
    .symptom-rail { display: none; }
    .mobile-stepper { display: grid; grid-template-columns: 48px 1fr 48px; gap: 8px; align-items: center; }
    .mobile-stepper button { min-height: 48px; border: 1px solid var(--tech-v2-hairline); background: transparent; color: var(--tech-v2-white); font-size: 1.1rem; }
    .mobile-stepper > span { text-align: center; color: var(--tech-v2-coral); }
    .mobile-stepper label { grid-column: 1 / -1; }
    .mobile-stepper select { width: 100%; min-height: 48px; padding: 0 14px; border: 1px solid var(--tech-v2-hairline); border-radius: 0; background: var(--tech-v2-ink); color: var(--tech-v2-white); font: 500 .82rem/1 'Onest', sans-serif; }
    .model-panel { margin-top: 16px; aspect-ratio: 1.08 / 1; }
    .model-plate img { opacity: .16; object-position: center; }
    .architecture { transform: scale(1.16) translateX(-5%); transform-origin: center; }
    .architectural-model text,
    .inspection-checkpoints text { font-size: 11px; }
    .signal-caption { left: 14px; bottom: 12px; max-width: 65%; }
    .diagnostic-output { margin-top: 0; padding-top: 26px; }
    .diagnostic-output h3 { font-size: 2rem; }
    .route-list { display: block; margin: 20px 0; }
    .inspection-list ul { display: block; }
  }

  @media (prefers-reduced-motion: reduce) {
    .model-panel { transition: none; }
    .source-marker,
    .signal-mark,
    .signal-field,
    .candidate-paths path,
    .selected-path,
    .inspection-checkpoints g { animation: none; opacity: 1; stroke-dashoffset: 0; transform: none; }
  }
</style>
