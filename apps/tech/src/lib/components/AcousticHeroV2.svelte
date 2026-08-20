<script lang="ts">
  import { onMount } from 'svelte';
  import { track } from '$lib/analytics';

  let root: HTMLElement;
  let progress = 0;
  let phase = 0;
  let mobilePhase = 0;
  let controls: HTMLButtonElement[] = [];
  let mobileControls: HTMLButtonElement[] = [];

  const boundaries = [0, 0.22, 0.48, 0.76];
  const phases = [
    { code: '01', label: 'Симптом', conclusion: 'СИМПТОМ ≠ ИСТОЧНИК' },
    { code: '02', label: 'Измерение', conclusion: 'СРАВНИВАЕМ КОНСТРУКЦИОННЫЕ ПУТИ' },
    { code: '03', label: 'Маршрут', conclusion: 'НЕ ПОВЕРХНОСТЬ. ПУТЬ ПЕРЕДАЧИ.' },
    { code: '04', label: 'Ответ', conclusion: 'Конструкция появляется только после диагноза.' }
  ];
  const mobileBoundaries = [0, 0.48, 0.88];
  const mobilePhases = [
    { code: '01', label: 'Вторжение', conclusion: 'Симптом и путь ещё не одно и то же.' },
    { code: '02', label: 'Маршруты', conclusion: 'Сравниваем кандидатов по измерениям.' },
    { code: '03', label: 'Решение', conclusion: 'Конструкция появляется только после диагноза.' }
  ];

  const clamp = (value: number) => Math.max(0, Math.min(1, value));

  $: intrusion = clamp(progress / 0.18);
  $: scan = clamp((progress - 0.18) / 0.24);
  $: route = clamp((progress - 0.42) / 0.26);
  $: construction = clamp((progress - 0.68) / 0.2);
  $: quiet = clamp((progress - 0.88) / 0.12);
  $: phase = progress < 0.18 ? 0 : progress < 0.42 ? 1 : progress < 0.68 ? 2 : 3;
  $: mobilePhase = progress < 0.36 ? 0 : progress < 0.76 ? 1 : 2;

  function jumpTo(index: number, focus = false) {
    if (!root) return;
    const top = root.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(1, root.offsetHeight - window.innerHeight);
    window.scrollTo({ top: top + distance * boundaries[index], behavior: 'smooth' });
    if (focus) controls[index]?.focus();
  }

  function onControlKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      jumpTo((index + 1) % phases.length, true);
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      jumpTo((index - 1 + phases.length) % phases.length, true);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      jumpTo(0, true);
    }
    if (event.key === 'End') {
      event.preventDefault();
      jumpTo(phases.length - 1, true);
    }
  }

  function jumpToMobile(index: number, focus = false) {
    if (!root) return;
    const top = root.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(1, root.offsetHeight - window.innerHeight);
    window.scrollTo({ top: top + distance * mobileBoundaries[index], behavior: 'smooth' });
    if (focus) mobileControls[index]?.focus();
  }

  function onMobileControlKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      jumpToMobile((index + 1) % mobilePhases.length, true);
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      jumpToMobile((index - 1 + mobilePhases.length) % mobilePhases.length, true);
    }
    if (event.key === 'Home') {
      event.preventDefault();
      jumpToMobile(0, true);
    }
    if (event.key === 'End') {
      event.preventDefault();
      jumpToMobile(mobilePhases.length - 1, true);
    }
  }

  onMount(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) {
      progress = 1;
      return;
    }

    let frame = 0;
    let started = false;
    let completed = false;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const distance = Math.max(1, root.offsetHeight - window.innerHeight);
      progress = clamp(-rect.top / distance);
      if (!started && progress > 0.01) {
        started = true;
        track('hero_motion_start');
      }
      if (!completed && progress > 0.985) {
        completed = true;
        track('hero_motion_complete');
      }
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  });
</script>

<section
  class="hero"
  bind:this={root}
  data-v2-hero
  data-phase={phase}
  data-mobile-phase={mobilePhase}
  aria-labelledby="hero-title"
  style={`--p:${progress};--intrusion:${intrusion};--scan:${scan};--route:${route};--construction:${construction};--quiet:${quiet}`}
>
  <div class="hero-sticky">
    <picture class="room room-clean">
      <source media="(max-width: 767px)" srcset="/generated/tech-v2-hero-mobile-clean.avif" type="image/avif" />
      <source media="(max-width: 767px)" srcset="/generated/tech-v2-hero-mobile-clean.webp" type="image/webp" />
      <source srcset="/generated/tech-v2-hero-clean.avif" type="image/avif" />
      <source srcset="/generated/tech-v2-hero-clean.webp" type="image/webp" />
      <img src="/generated/tech-v2-hero-clean.png" alt="Тёмная гостиная московской квартиры перед акустической диагностикой" width="1672" height="941" fetchpriority="high" />
    </picture>

    {#if progress > 0.12}
      <picture class="room room-cutaway" aria-hidden="true">
        <source media="(max-width: 767px)" srcset="/generated/tech-v2-hero-mobile-cutaway.avif" type="image/avif" />
        <source media="(max-width: 767px)" srcset="/generated/tech-v2-hero-mobile-cutaway.webp" type="image/webp" />
        <source srcset="/generated/tech-v2-hero-cutaway.avif" type="image/avif" />
        <source srcset="/generated/tech-v2-hero-cutaway.webp" type="image/webp" />
        <img src="/generated/tech-v2-hero-cutaway.png" alt="" width="1672" height="941" decoding="async" />
      </picture>
    {/if}

    <div class="room-shade" aria-hidden="true"></div>

    <svg class="acoustic-field" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="scan-gradient" x1="0" x2="1">
          <stop offset="0" stop-color="#fffdf8" stop-opacity="0" />
          <stop offset=".5" stop-color="#fffdf8" stop-opacity=".24" />
          <stop offset="1" stop-color="#fffdf8" stop-opacity="0" />
        </linearGradient>
        <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <g class="impulses" style={`opacity:${(1 - quiet) * Math.max(0.18, intrusion)}`}>
        <path d="M1290 145 C1180 170 1115 245 1070 330" pathLength="1" style={`stroke-dashoffset:${1 - intrusion}`} />
        <path d="M1325 215 C1205 245 1150 305 1110 382" pathLength="1" style={`stroke-dashoffset:${1 - clamp(intrusion * 0.86)}`} />
        <path d="M1260 92 C1165 132 1102 198 1055 276" pathLength="1" style={`stroke-dashoffset:${1 - clamp(intrusion * 0.72)}`} />
      </g>

      <g class="scan" style={`transform:translateX(${-430 + scan * 1950}px);opacity:${scan > 0 && scan < 1 ? 1 : 0}`}>
        <rect x="0" y="60" width="230" height="780" fill="url(#scan-gradient)" />
        <line x1="114" y1="60" x2="114" y2="840" />
      </g>

      <g class="checkpoints" style={`opacity:${scan}`}>
        <g transform="translate(1010 208)"><circle r="7" /><text x="14" y="4">ПЕРЕКРЫТИЕ</text></g>
        <g transform="translate(1118 338)"><circle r="7" /><text x="14" y="4">ПРИМЫКАНИЕ</text></g>
        <g transform="translate(1225 410)"><circle r="7" /><text x="-118" y="-13">КАНАЛ</text></g>
        <g transform="translate(890 570)"><circle r="7" /><text x="14" y="4">РОЗЕТКА</text></g>
        <g transform="translate(780 730)"><circle r="7" /><text x="14" y="4">ПЕРИМЕТР</text></g>
      </g>

      <g class="routes" style={`opacity:${Math.max(0, route)}`}>
        <path class="candidate" d="M1260 128 C1150 196 1118 296 1060 352 C970 440 842 438 735 515" pathLength="1" style={`stroke-dashoffset:${1 - route}`} />
        <path class="candidate secondary" d="M1285 248 C1190 275 1160 348 1135 410 C1090 520 950 555 820 624" pathLength="1" style={`stroke-dashoffset:${1 - route}`} />
        <path class="candidate secondary" d="M1228 410 C1140 430 1092 474 1048 526 C985 602 872 676 762 730" pathLength="1" style={`stroke-dashoffset:${1 - route}`} />
        <path class="selected" d="M1260 128 C1150 196 1118 296 1060 352 C970 440 842 438 735 515" pathLength="1" style={`stroke-dashoffset:${1 - clamp((route - 0.34) / 0.66)};opacity:${clamp((route - 0.22) / 0.78) * (1 - quiet * .84)}`} />
        <circle class="confirmed" cx="735" cy="515" r="9" style={`opacity:${clamp((route - 0.72) / 0.28) * (1 - quiet * .9)}`} />
      </g>

      <g class="local-assembly" style={`opacity:${construction};transform:translate(${(1 - construction) * 86}px, ${-176 + (1 - construction) * -28}px)`}>
        <path class="layer mass" d="M1025 415 L1295 338 L1316 356 L1045 435 Z" style={`transform:translateY(${quiet * 36}px)`} />
        <path class="layer decoupling" d="M1038 451 L1308 374 L1329 392 L1058 471 Z" style={`transform:translateY(${quiet * 12}px)`} />
        <path class="layer absorption" d="M1051 487 L1321 410 L1342 428 L1071 507 Z" style={`transform:translateY(${quiet * -12}px)`} />
        <path class="layer seal" d="M1064 523 L1334 446 L1355 464 L1084 543 Z" style={`transform:translateY(${quiet * -36}px)`} />
        <g style={`opacity:${1 - quiet}`}>
          <text x="1100" y="414">МАССА</text>
          <text x="1115" y="451">РАЗВЯЗКА</text>
          <text x="1130" y="488">ПОГЛОЩЕНИЕ</text>
          <text x="1145" y="525">ГЕРМЕТИЗАЦИЯ + УЗЕЛ</text>
        </g>
      </g>

      <path class="residual" d="M1260 128 C1150 196 1118 296 1060 352 C970 440 842 438 735 515" pathLength="1" style={`opacity:${quiet * .64};stroke-dashoffset:0`} />
    </svg>

    <div class="hero-copy shell">
      <p class="eyebrow mono">Инженерная шумоизоляция квартир в Москве</p>
      <h1 class="display" id="hero-title">Сначала найдём, как шум попадает в комнату. Потом рассчитаем решение.</h1>
      <p class="supporting">Диагностика, проект, собственная бригада, монтаж и проверка результата. Без покупки материалов вслепую.</p>
      <div class="hero-actions">
        <a class="button" href="/diagnostika-shuma/" on:click={() => track('hero_cta_click', { state: phase + 1 })}>Разобрать мой шум</a>
        <a class="secondary-action" href="#noise-path-lab">Увидеть, как ищем путь <span aria-hidden="true">↓</span></a>
      </div>
      <p class="proof">Бесплатная первичная диагностика. Следующий коммерческий шаг — выезд на объект.</p>
    </div>

    <ol class="diagnostic-rail desktop-rail" aria-label="Этапы акустической диагностики">
      {#each phases as item, index}
        <li class:active={phase === index} class:complete={phase > index}>
          <span class="mono">{item.code}</span>
          <strong>{item.label}</strong>
          <small>{item.conclusion}</small>
        </li>
      {/each}
    </ol>

    <ol class="diagnostic-rail mobile-rail" aria-label="Мобильные этапы акустической диагностики">
      {#each mobilePhases as item, index}
        <li class:active={mobilePhase === index} class:complete={mobilePhase > index}>
          <span class="mono">{item.code}</span>
          <strong>{item.label}</strong>
          <small>{item.conclusion}</small>
        </li>
      {/each}
    </ol>

    <div class="state-controls desktop-controls" role="group" aria-label="Перейти к этапу hero">
      {#each phases as item, index}
        <button
          bind:this={controls[index]}
          type="button"
          aria-pressed={phase === index}
          tabindex={phase === index ? 0 : -1}
          class:active={phase === index}
          on:click={() => jumpTo(index)}
          on:keydown={(event) => onControlKeydown(event, index)}
        >
          <span class="mono">{item.code}</span><span class="control-label">{item.label}</span>
        </button>
      {/each}
    </div>

    <div class="state-controls mobile-controls" role="group" aria-label="Перейти к мобильному этапу hero">
      {#each mobilePhases as item, index}
        <button
          bind:this={mobileControls[index]}
          type="button"
          aria-pressed={mobilePhase === index}
          tabindex={mobilePhase === index ? 0 : -1}
          class:active={mobilePhase === index}
          on:click={() => jumpToMobile(index)}
          on:keydown={(event) => onMobileControlKeydown(event, index)}
        >
          <span class="mono">{item.code}</span><span class="control-label">{item.label}</span>
        </button>
      {/each}
    </div>

    <aside class="reduced-summary" aria-label="Статический итог акустической диагностики">
      <div class="route-key"><span class="route-swatch candidate-swatch"></span><span>Кандидатный путь</span></div>
      <div class="route-key"><span class="route-swatch selected-swatch"></span><span>Выбранный путь</span></div>
      <p class="mono">Масса · Развязка · Поглощение · Герметизация + узел</p>
      <strong>Конструкция появляется только после диагноза.</strong>
    </aside>
  </div>
</section>

<style>
  .hero {
    position: relative;
    height: 210svh;
    color: var(--tech-v2-white);
    background: var(--tech-v2-ink);
  }

  .hero-sticky {
    position: sticky;
    top: 0;
    height: 100svh;
    min-height: 620px;
    overflow: hidden;
    isolation: isolate;
    background: #090b0a;
  }

  .room,
  .room img,
  .room-shade,
  .acoustic-field {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .room { z-index: -5; }
  .room img {
    object-fit: cover;
    object-position: center;
    transform: scale(calc(1.02 + var(--p) * .04)) translate3d(calc(var(--p) * -1%), calc(var(--p) * -.5%), 0);
    filter: brightness(calc(.61 + var(--quiet) * .14)) saturate(calc(.72 + var(--quiet) * .18));
    will-change: transform, filter;
  }

  .room-cutaway {
    z-index: -4;
    opacity: calc(var(--scan) * .72 - var(--quiet) * .48);
    mask-image: linear-gradient(102deg, transparent 16%, #000 47%, #000 100%);
  }

  .room-shade {
    z-index: -3;
    background:
      linear-gradient(90deg, rgba(8, 11, 10, .93) 0, rgba(8, 11, 10, .72) 38%, rgba(8, 11, 10, .08) 73%),
      linear-gradient(0deg, rgba(8, 11, 10, .7), transparent 52%);
  }

  .acoustic-field { z-index: -1; pointer-events: none; }
  .impulses path { fill: none; stroke: var(--tech-v2-coral); stroke-width: 2.2; stroke-dasharray: 1; filter: url(#route-glow); }
  .scan { transition: opacity var(--tech-v2-micro) linear; }
  .scan line { stroke: rgba(255, 253, 248, .52); stroke-width: 1; }
  .checkpoints circle { fill: var(--tech-v2-ink); stroke: var(--tech-v2-teal); stroke-width: 2; }
  .checkpoints text,
  .local-assembly text { fill: rgba(255, 253, 248, .72); font: 500 10px/1 'IBM Plex Mono', monospace; letter-spacing: .08em; }
  .routes path { fill: none; stroke-width: 2; stroke-dasharray: 1; }
  .candidate { stroke: rgba(122, 168, 159, .72); }
  .candidate.secondary { stroke-dasharray: .06 .035; opacity: calc(1 - var(--route) * .66); }
  .selected { stroke: var(--tech-v2-coral); stroke-width: 3; filter: url(#route-glow); }
  .confirmed { fill: var(--tech-v2-coral); filter: url(#route-glow); }
  .local-assembly { transform-origin: center; }
  .local-assembly .layer { fill: rgba(8, 11, 10, .72); stroke-width: 1.2; }
  .local-assembly .mass { stroke: rgba(255, 253, 248, .72); }
  .local-assembly .decoupling { stroke: var(--tech-v2-teal); }
  .local-assembly .absorption { stroke: rgba(215, 170, 109, .9); }
  .local-assembly .seal { stroke: var(--tech-v2-coral); }
  .residual { fill: none; stroke: rgba(122, 168, 159, .56); stroke-width: 1; }

  .hero-copy {
    position: relative;
    z-index: 3;
    height: 100%;
    padding-top: clamp(132px, 18svh, 210px);
    padding-bottom: 112px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .eyebrow { margin: 0 0 22px; color: var(--tech-v2-teal); }
  h1 {
    width: min(940px, 69vw);
    margin: 0;
    font-size: clamp(3.5rem, 5.35vw, 6.45rem);
    line-height: .92;
  }
  .supporting { width: min(590px, 47vw); margin: 26px 0 0; color: var(--tech-v2-copy-muted); font-size: clamp(1rem, 1.25vw, 1.22rem); }
  .hero-actions { display: flex; align-items: center; gap: 28px; margin-top: 30px; }
  .hero-actions .button { min-width: 238px; }
  .secondary-action { min-height: 44px; display: inline-flex; align-items: center; gap: 28px; color: var(--tech-v2-copy-muted); font-size: .86rem; border-bottom: 1px solid var(--tech-v2-hairline); }
  .secondary-action span { color: var(--tech-v2-coral); }
  .proof { margin: 18px 0 0; width: min(590px, 48vw); color: var(--tech-v2-copy-quiet); font-size: .76rem; }

  .diagnostic-rail {
    position: absolute;
    z-index: 4;
    right: var(--tech-v2-gutter);
    top: 50%;
    width: min(300px, 22vw);
    margin: 0;
    padding: 0;
    list-style: none;
    transform: translateY(-48%);
  }
  .diagnostic-rail li { display: grid; grid-template-columns: 34px 1fr; gap: 7px 12px; padding: 13px 0; border-top: 1px solid var(--tech-v2-hairline); color: var(--tech-v2-copy-quiet); transition: color var(--tech-v2-control) var(--tech-v2-ease); }
  .diagnostic-rail li span { grid-row: 1 / 3; color: inherit; }
  .diagnostic-rail strong { font-size: .82rem; font-weight: 500; }
  .diagnostic-rail small { font: 500 9px/1.35 'IBM Plex Mono', monospace; letter-spacing: .06em; }
  .diagnostic-rail li.active { color: var(--tech-v2-white); border-color: var(--tech-v2-coral); }
  .diagnostic-rail li.complete { color: var(--tech-v2-teal); }

  .state-controls {
    position: absolute;
    z-index: 5;
    left: var(--tech-v2-gutter);
    right: var(--tech-v2-gutter);
    bottom: 22px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }
  .state-controls button { min-height: 48px; padding: 9px 0; display: flex; align-items: center; gap: 12px; border: 0; border-top: 1px solid var(--tech-v2-hairline); background: transparent; color: var(--tech-v2-copy-quiet); text-align: left; cursor: pointer; }
  .state-controls button.active { color: var(--tech-v2-white); border-color: var(--tech-v2-coral); }
  .state-controls button.active .mono { color: var(--tech-v2-coral); }
  .control-label { font-size: .78rem; }
  .mobile-rail,
  .mobile-controls { display: none; }
  .reduced-summary { display: none; }

  @media (max-width: 1000px) {
    h1 { width: min(800px, 78vw); font-size: clamp(3.3rem, 7vw, 5.6rem); }
    .supporting { width: min(560px, 58vw); }
    .diagnostic-rail { top: 104px; right: var(--tech-v2-gutter); width: auto; transform: none; }
    .diagnostic-rail li { display: none; }
    .diagnostic-rail li.active {
      display: grid;
      grid-template-columns: 28px 1fr;
      padding: 9px 12px;
      border: 1px solid var(--tech-v2-hairline);
      background: rgba(8,11,10,.72);
      backdrop-filter: blur(10px);
    }
    .diagnostic-rail small { display: none; }
  }

  @media (min-width: 768px) and (max-width: 1000px) {
    .local-assembly { transform: translate(-340px, -336px) scale(.72) !important; }
  }

  @media (max-width: 767px) {
    .hero { height: 150svh; }
    .hero-sticky { min-height: 100svh; }
    .room img { object-position: 54% center; transform: scale(calc(1.01 + var(--p) * .025)) translate3d(calc(var(--p) * -.6%), 0, 0); }
    .room-cutaway { mask-image: linear-gradient(180deg, #000 0 54%, transparent 80%); opacity: calc(var(--route) * .7); }
    .room-shade {
      background:
        linear-gradient(0deg, rgba(8,11,10,.98) 0 48%, rgba(8,11,10,.48) 74%, rgba(8,11,10,.38)),
        linear-gradient(90deg, rgba(8,11,10,.42), transparent 66%);
    }
    .acoustic-field {
      height: 50%;
      top: 0;
      transform: scale(1.08) translate(-5%, -2%);
      transform-origin: center top;
      mask-image: linear-gradient(180deg, #000 0 48%, transparent 68%);
    }
    .routes .secondary:nth-of-type(3) { display: none; }
    .checkpoints text, .local-assembly text { display: none; }
    .local-assembly { transform: translate(-118px, -104px) scale(.56) !important; }
    .hero-copy { height: auto; min-height: 100%; padding-top: 88px; padding-bottom: 112px; justify-content: flex-end; }
    .eyebrow { margin-bottom: 14px; font-size: .62rem; }
    h1 { width: 100%; font-size: clamp(2rem, 9.4vw, 2.75rem); line-height: .96; }
    .supporting { width: 100%; margin-top: 16px; font-size: .9rem; line-height: 1.42; }
    .hero-actions { width: 100%; margin-top: 18px; flex-direction: column; align-items: stretch; gap: 6px; }
    .hero-actions .button { min-width: 0; min-height: 50px; }
    .secondary-action { justify-content: space-between; min-height: 40px; }
    .proof { width: 100%; margin-top: 10px; font-size: .67rem; line-height: 1.35; }
    .diagnostic-rail { top: 80px; right: 18px; width: auto; transform: none; }
    .diagnostic-rail li { display: none; }
    .diagnostic-rail li.active { display: grid; grid-template-columns: 25px 1fr; padding: 8px 10px; border: 1px solid var(--tech-v2-hairline); background: rgba(8,11,10,.68); }
    .diagnostic-rail li.active small { display: none; }
    .desktop-rail,
    .desktop-controls { display: none; }
    .mobile-rail { display: block; }
    .mobile-controls { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .state-controls { left: 18px; right: 18px; bottom: max(12px, env(safe-area-inset-bottom)); gap: 5px; }
    .state-controls button { min-height: 44px; justify-content: center; }
    .control-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
  }

  @media (max-width: 360px), (max-height: 650px) and (max-width: 767px) {
    .hero-copy { padding-top: 74px; padding-bottom: 70px; }
    h1 { font-size: clamp(1.82rem, 9vw, 2.15rem); }
    .supporting { font-size: .79rem; margin-top: 10px; }
    .hero-actions { margin-top: 11px; }
    .hero-actions .button { min-height: 46px; }
    .proof { font-size: .62rem; }
    .diagnostic-rail { display: none; }
    .acoustic-field { height: 46%; transform: scale(.98) translate(-4%, -5%); }
    .local-assembly { transform: translate(-104px, -142px) scale(.48) !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero { height: auto; }
    .hero-sticky { position: relative; min-height: 100svh; }
    .room img { transform: scale(1.02); }
    .room-cutaway { opacity: .38; }
    .acoustic-field { opacity: 1; }
    .reduced-summary {
      position: absolute;
      z-index: 6;
      right: var(--tech-v2-gutter);
      bottom: 92px;
      width: min(360px, 32vw);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 16px;
      padding: 16px;
      border: 1px solid var(--tech-v2-hairline);
      background: rgba(8,11,10,.86);
      backdrop-filter: blur(12px);
    }
    .reduced-summary p,
    .reduced-summary strong { grid-column: 1 / -1; margin: 0; }
    .reduced-summary p { color: var(--tech-v2-teal); font-size: .62rem; line-height: 1.5; }
    .reduced-summary strong { font-size: .78rem; line-height: 1.35; }
    .route-key { display: flex; align-items: center; gap: 8px; color: var(--tech-v2-copy-muted); font-size: .68rem; }
    .route-swatch { width: 30px; height: 0; border-top: 1px solid var(--tech-v2-teal); }
    .candidate-swatch { border-top-style: dashed; opacity: .62; }
    .selected-swatch { border-color: var(--tech-v2-coral); border-top-width: 2px; }
  }

  @media (prefers-reduced-motion: reduce) and (max-width: 767px) {
    .hero-sticky { height: auto; }
    .reduced-summary {
      position: relative;
      inset: auto;
      width: auto;
      margin: 0 18px 82px;
      grid-template-columns: 1fr;
    }
    .reduced-summary p,
    .reduced-summary strong { grid-column: auto; }
  }
</style>
