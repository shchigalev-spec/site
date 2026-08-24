<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import type { StageKey } from '$lib/types';
  import { diagnosticContext } from '$lib/stores/diagnostic';
  import { track } from '$lib/analytics';

  type Stage = {
    key: StageKey;
    asset: 'newbuild' | 'renovation' | 'finished';
    index: string;
    label: string;
    eyebrow: string;
    conclusion: string;
    text: string;
    constraints: string[];
    risk: string;
    cta: string;
  };

  const stages: Stage[] = [
    {
      key: 'new-build', asset: 'newbuild', index: '01', label: 'До ремонта', eyebrow: 'ОТКРЫТЫЕ ОСНОВАНИЯ',
      conclusion: 'Можно заложить контур до того, как узлы станут скрытыми.',
      text: 'Видны основания, примыкания и проходки. Это момент связать акустический маршрут с будущей планировкой.',
      constraints: ['проверить основания', 'согласовать примыкания', 'учесть инженерные проходки'],
      risk: 'Примыкание перегородки к плите', cta: 'Разобрать шум до ремонта'
    },
    {
      key: 'renovation', asset: 'renovation', index: '02', label: 'Ремонт идёт', eyebrow: 'СКРЫТЫЕ РАБОТЫ ОТКРЫТЫ',
      conclusion: 'Главное — проверить узлы до их закрытия.',
      text: 'Каркас и развязка уже читаются как система. До обшивки можно увидеть жёсткие связи и непрерывность контура.',
      constraints: ['не закрывать без осмотра', 'зафиксировать скрытые узлы', 'согласовать смежные работы'],
      risk: 'Жёсткая связь у колонны', cta: 'Проверить решение в ремонте'
    },
    {
      key: 'finished', asset: 'finished', index: '03', label: 'Готовая квартира', eyebrow: 'ИНТЕРЬЕР НУЖНО СОХРАНИТЬ',
      conclusion: 'Сначала определяем путь и допустимый масштаб вмешательства.',
      text: 'Отделка скрывает конструкцию, поэтому решение начинается с измерения, локального доступа и границ вмешательства.',
      constraints: ['защитить интерьер', 'обосновать локальный доступ', 'согласовать допустимый демонтаж'],
      risk: 'Скрытый маршрут у проёма', cta: 'Описать шум в готовой квартире'
    }
  ];

  let root: HTMLElement;
  let mobileRail: HTMLElement;
  let activeIndex = 0;
  let mobileIndex = 0;
  let progress = 0;
  let reducedMotion = false;
  let mobileFrame = 0;
  let desktopAssets = false;
  let completionTracked = false;

  $: active = stages[activeIndex];
  $: renovationReveal = Math.max(0, Math.min(100, progress * 200));
  $: finishedReveal = Math.max(0, Math.min(100, (progress - 0.5) * 200));
  $: renovationCeiling = range(progress, 0, 0.16);
  $: renovationWalls = range(progress, 0.08, 0.28);
  $: renovationJunction = range(progress, 0.18, 0.4);
  $: renovationFloor = range(progress, 0.3, 0.5);
  $: finishedWalls = range(progress, 0.5, 0.65);
  $: finishedCeiling = range(progress, 0.55, 0.72);
  $: finishedOpening = range(progress, 0.63, 0.82);
  $: finishedFloor = range(progress, 0.75, 0.95);

  function range(value: number, start: number, end: number) {
    return Math.max(0, Math.min(100, ((value - start) / (end - start)) * 100));
  }

  function trackCompletion(mode: 'scroll' | 'control' | 'mobile-scroll') {
    if (completionTracked) return;
    completionTracked = true;
    track('renovation_sequence_complete', { stage: 'finished', mode });
  }

  function selectStage(index: number, emit = true) {
    if (index === activeIndex) return;
    activeIndex = index;
    diagnosticContext.update((context) => ({ ...context, stage: stages[index].key }));
    if (emit) track('renovation_stage_selected', { stage: stages[index].key });
  }

  function chooseDesktop(index: number) {
    if (!root) return;
    const range = Math.max(1, root.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: window.scrollY + root.getBoundingClientRect().top + range * (index / (stages.length - 1)),
      behavior: reducedMotion ? 'auto' : 'smooth'
    });
    selectStage(index);
    if (index === stages.length - 1) trackCompletion('control');
  }

  function goMobile(index: number) {
    mobileIndex = index;
    const frames = mobileRail?.querySelectorAll<HTMLElement>('.mobile-frame');
    frames?.[index]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'start' });
    selectStage(index);
    if (index === stages.length - 1) trackCompletion('control');
  }

  function syncMobileIndex() {
    if (mobileFrame) return;
    mobileFrame = window.requestAnimationFrame(() => {
      mobileFrame = 0;
      const frames = [...(mobileRail?.querySelectorAll<HTMLElement>('.mobile-frame') ?? [])];
      if (!frames.length) return;
      const railCenter = mobileRail.getBoundingClientRect().left + mobileRail.clientWidth / 2;
      const next = frames.reduce((closest, frame, index) => {
        const rect = frame.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - railCenter);
        return distance < closest.distance ? { index, distance } : closest;
      }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
      mobileIndex = next;
      selectStage(next, false);
      if (next === stages.length - 1) trackCompletion('mobile-scroll');
    });
  }

  onMount(() => {
    const layoutQuery = window.matchMedia('(min-width: 768px)');
    const syncLayout = () => { desktopAssets = layoutQuery.matches; };
    syncLayout();
    layoutQuery.addEventListener('change', syncLayout);
    return () => layoutQuery.removeEventListener('change', syncLayout);
  });

  onMount(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = motionQuery.matches;
    if (reducedMotion) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const range = Math.max(1, root.offsetHeight - window.innerHeight);
      progress = Math.max(0, Math.min(1, -rect.top / range));
      const nextIndex = progress < 0.28 ? 0 : progress < 0.72 ? 1 : 2;
      selectStage(nextIndex, false);
      if (progress >= 0.96) trackCompletion('scroll');
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
      if (mobileFrame) window.cancelAnimationFrame(mobileFrame);
    };
  });
</script>

<section
  class="renovation-morph"
  id="renovation-morph-panel"
  bind:this={root}
  aria-labelledby="renovation-title"
  data-stage={active.asset}
  data-progress={progress.toFixed(3)}
  style={`--renovation-reveal:${renovationReveal}%;--finished-reveal:${finishedReveal}%;--renovation-ceiling:${renovationCeiling}%;--renovation-walls:${renovationWalls}%;--renovation-junction:${renovationJunction}%;--renovation-floor:${renovationFloor}%;--finished-walls:${finishedWalls}%;--finished-ceiling:${finishedCeiling}%;--finished-opening:${finishedOpening}%;--finished-floor:${finishedFloor}%;--exposure:${0.18 + progress * 0.2}`}
>
  <div class="desktop-sequence">
    <div class="plate-stack" aria-hidden="true">
      {#if desktopAssets}
      <div class="stage-plate base-layer">
        <picture>
          <source srcset="/generated/tech-v2-stage-newbuild.avif" type="image/avif" />
          <source srcset="/generated/tech-v2-stage-newbuild.webp" type="image/webp" />
          <img src="/generated/tech-v2-stage-newbuild.png" alt="" width="1672" height="941" loading="eager" decoding="async" />
        </picture>
      </div>
      <div class="stage-plate renovation-layer">
        {#each ['ceiling', 'walls', 'junction', 'floor'] as zone}
          <picture class={`local-zone zone-${zone}`}>
            <source srcset="/generated/tech-v2-stage-renovation.avif" type="image/avif" />
            <source srcset="/generated/tech-v2-stage-renovation.webp" type="image/webp" />
            <img src="/generated/tech-v2-stage-renovation.png" alt="" width="1672" height="941" loading="eager" decoding="async" />
          </picture>
        {/each}
      </div>
      <div class="stage-plate finished-layer">
        {#each ['walls', 'ceiling', 'opening', 'floor'] as zone}
          <picture class={`local-zone zone-${zone}`}>
            <source srcset="/generated/tech-v2-stage-finished.avif" type="image/avif" />
            <source srcset="/generated/tech-v2-stage-finished.webp" type="image/webp" />
            <img src="/generated/tech-v2-stage-finished.png" alt="" width="1672" height="941" loading="eager" decoding="async" />
          </picture>
        {/each}
        <picture class="finished-complete">
          <source srcset="/generated/tech-v2-stage-finished.avif" type="image/avif" />
          <source srcset="/generated/tech-v2-stage-finished.webp" type="image/webp" />
          <img src="/generated/tech-v2-stage-finished.png" alt="" width="1672" height="941" loading="eager" decoding="async" />
        </picture>
      </div>
      {/if}
      <div class="exposure"></div>
      <div class="protection-state"></div>
      <div class="risk-marker"><span></span>{#key active.key}<p class="mono" in:fade={{ duration: 220 }}>РИСК / {active.risk}</p>{/key}</div>
    </div>

    <div class="shell stage-layout">
      <header class="stage-heading">
        <p class="mono">04 / СТАДИЯ РЕМОНТА</p>
        <h2 class="display" id="renovation-title">Одна комната.<br />Три момента решения.</h2>
      </header>

      <div class="stage-narrative" aria-live="polite" aria-atomic="true">
        {#key active.key}
          <div class="narrative-state" in:fly={{ y: 16, duration: 260 }} out:fade={{ duration: 140 }}>
            <p class="mono">{active.index} / {active.label.toUpperCase()}</p>
            <span class="eyebrow mono">{active.eyebrow}</span>
            <h3>{active.conclusion}</h3>
            <p>{active.text}</p>
            <ul>{#each active.constraints as item}<li>{item}</li>{/each}</ul>
            <a class="button" href="/diagnostika-shuma/">{active.cta}</a>
          </div>
        {/key}
      </div>

      <div class="stage-datum" role="group" aria-label="Состояние ремонта">
        {#each stages as stage, index}
          <button type="button" class:active={index === activeIndex} aria-pressed={index === activeIndex} on:click={() => chooseDesktop(index)}>
            <span class="mono">{stage.index}</span><strong>{stage.label}</strong>
          </button>
        {/each}
      </div>
    </div>
  </div>

  <div class="mobile-sequence">
    <header class="mobile-heading shell">
      <p class="mono">04 / СТАДИЯ РЕМОНТА</p>
      <h2 class="display">Одна комната.<br />Три момента решения.</h2>
    </header>
    <div class="mobile-rail" bind:this={mobileRail} role="region" aria-label="Три состояния одной комнаты" on:scroll={syncMobileIndex}>
      {#each stages as stage}
        <article class="mobile-frame" data-mobile-stage={stage.asset}>
          <picture>
            <source srcset={`/generated/tech-v2-stage-mobile-${stage.asset}.avif`} type="image/avif" />
            <source srcset={`/generated/tech-v2-stage-mobile-${stage.asset}.webp`} type="image/webp" />
            <img src={`/generated/tech-v2-stage-mobile-${stage.asset}.png`} alt={`Та же комната: ${stage.label.toLowerCase()}`} width="1024" height="1366" loading="lazy" decoding="async" />
          </picture>
          <div class="mobile-copy">
            <p class="mono">{stage.index} / 03 · {stage.label.toUpperCase()}</p>
            <h3>{stage.conclusion}</h3>
            <ul>{#each stage.constraints as item}<li>{item}</li>{/each}</ul>
            <a class="button" href="/diagnostika-shuma/">{stage.cta}</a>
          </div>
        </article>
      {/each}
    </div>
    <div class="mobile-progress shell" role="group" aria-label="Перейти к состоянию комнаты">
      {#each stages as stage, index}
        <button type="button" aria-label={`${stage.index}: ${stage.label}`} aria-current={mobileIndex === index ? 'step' : undefined} on:click={() => goMobile(index)}><span></span></button>
      {/each}
      <p class="mono">{stages[mobileIndex].index} / 03</p>
    </div>
  </div>
</section>

<style>
  .renovation-morph { height: 200svh; color: var(--white); background: var(--ink-950); }
  .desktop-sequence { position: sticky; top: 0; height: 100svh; overflow: hidden; isolation: isolate; }
  .plate-stack, .stage-plate, .stage-plate picture, .stage-plate img, .exposure { position: absolute; inset: 0; }
  .plate-stack { z-index: -2; background: var(--ink-950); }
  .stage-plate, .stage-plate picture { margin: 0; }
  .stage-plate picture { overflow: hidden; }
  .stage-plate img { width: 100%; height: 100%; object-fit: cover; object-position: center; filter: saturate(.78) contrast(1.03); }
  .local-zone img { will-change: clip-path; transition: clip-path 80ms linear; }
  .renovation-layer .zone-ceiling, .finished-layer .zone-ceiling { clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%); }
  .renovation-layer .zone-walls, .finished-layer .zone-walls { clip-path: polygon(0 25%, 100% 25%, 100% 72%, 0 72%); }
  .renovation-layer .zone-junction, .finished-layer .zone-opening { clip-path: polygon(58% 0, 100% 0, 100% 100%, 58% 100%); }
  .renovation-layer .zone-floor, .finished-layer .zone-floor { clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%); }
  .zone-ceiling { -webkit-mask-image: linear-gradient(to bottom, #000 0 82%, transparent 100%); mask-image: linear-gradient(to bottom, #000 0 82%, transparent 100%); }
  .zone-walls { -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 10% 88%, transparent 100%); mask-image: linear-gradient(to bottom, transparent 0, #000 10% 88%, transparent 100%); }
  .zone-junction, .zone-opening { -webkit-mask-image: linear-gradient(to right, transparent 0, #000 14% 100%); mask-image: linear-gradient(to right, transparent 0, #000 14% 100%); }
  .zone-floor { -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 16% 100%); mask-image: linear-gradient(to bottom, transparent 0, #000 16% 100%); }
  .renovation-layer .zone-ceiling img { clip-path: inset(0 calc(100% - var(--renovation-ceiling)) 0 0); }
  .renovation-layer .zone-walls img { clip-path: inset(0 0 0 calc(100% - var(--renovation-walls))); }
  .renovation-layer .zone-junction img { clip-path: inset(0 0 calc(100% - var(--renovation-junction)) 0); }
  .renovation-layer .zone-floor img { clip-path: inset(calc(100% - var(--renovation-floor)) 0 0 0); }
  .finished-layer .zone-walls img { clip-path: inset(0 calc(100% - var(--finished-walls)) 0 0); }
  .finished-layer .zone-ceiling img { clip-path: inset(0 0 0 calc(100% - var(--finished-ceiling))); }
  .finished-layer .zone-opening img { clip-path: inset(0 0 calc(100% - var(--finished-opening)) 0); }
  .finished-layer .zone-floor img { clip-path: inset(calc(100% - var(--finished-floor)) 0 0 0); }
  .finished-layer .finished-complete { opacity: 0; transition: opacity 180ms var(--tech-v2-ease); }
  [data-stage='finished'] .finished-layer .finished-complete { opacity: 1; }
  .exposure { background: linear-gradient(90deg, rgba(7,9,8,.88) 0%, rgba(7,9,8,var(--exposure)) 47%, rgba(7,9,8,.68) 100%); }
  .protection-state { position: absolute; inset: auto 0 0; height: 10%; opacity: 0; background: repeating-linear-gradient(110deg, rgba(255,253,248,.1) 0 22px, transparent 22px 44px); transition: opacity 260ms ease; }
  [data-stage='renovation'] .protection-state { opacity: 1; }
  .stage-layout { height: 100%; display: grid; grid-template-columns: repeat(16, 1fr); gap: 24px; align-items: center; }
  .stage-heading { grid-column: 1 / 9; align-self: start; padding-top: clamp(112px, 14vh, 170px); }
  .stage-heading > p { color: var(--acoustic); }
  .stage-heading h2 { max-width: 920px; margin: 18px 0 0; font-size: clamp(3.3rem, 6.3vw, 7.4rem); line-height: .88; }
  .stage-narrative { grid-column: 11 / -1; align-self: center; padding: clamp(24px, 3vw, 40px); border: 1px solid var(--white-16); border-radius: 22px; background: rgba(7,9,8,.58); backdrop-filter: blur(18px); }
  .narrative-state > .mono { color: var(--signal); }
  .stage-narrative .eyebrow { display: block; margin-top: 26px; color: var(--acoustic); }
  .stage-narrative h3 { margin: 14px 0 18px; font-family: 'Geologica', sans-serif; font-size: clamp(1.8rem, 2.6vw, 3.15rem); line-height: 1.02; letter-spacing: -.04em; }
  .narrative-state > p:not(.mono) { color: var(--white-64); }
  .stage-narrative ul { margin: 24px 0; padding: 0; list-style: none; border-top: 1px solid var(--white-16); }
  .stage-narrative li { padding: 10px 0; color: var(--white-64); border-bottom: 1px solid var(--white-16); }
  .stage-narrative li::before { content: '—'; margin-right: 10px; color: var(--signal); }
  .stage-narrative .button { width: 100%; }
  .stage-datum { grid-column: 1 / 10; align-self: end; display: grid; grid-template-columns: repeat(3, 1fr); padding-bottom: 30px; }
  .stage-datum button { min-height: 74px; display: flex; align-items: center; gap: 14px; padding: 12px 4px; color: var(--white-64); border: 0; border-bottom: 1px solid var(--white-16); background: transparent; text-align: left; cursor: pointer; }
  .stage-datum button.active { color: var(--white); border-color: var(--signal); }
  .stage-datum button span { color: var(--acoustic); }
  .stage-datum button strong { font-weight: 500; }
  .risk-marker { position: absolute; left: 48%; top: 48%; display: flex; align-items: center; gap: 10px; transform: translate(-50%, -50%); transition: left 360ms var(--tech-v2-ease), top 360ms var(--tech-v2-ease); }
  [data-stage='renovation'] .risk-marker { left: 45%; top: 43%; }
  [data-stage='finished'] .risk-marker { left: 47%; top: 53%; }
  .risk-marker span { width: 18px; height: 18px; border: 4px solid var(--signal); border-radius: 50%; box-shadow: 0 0 0 8px rgba(255,107,78,.18); }
  .risk-marker p { max-width: 190px; margin: 0; padding: 7px 9px; color: var(--white); border-radius: 8px; background: rgba(7,9,8,.76); }
  .mobile-sequence { display: none; }

  @media (max-width: 900px) and (min-width: 768px) {
    .stage-layout { grid-template-columns: repeat(8, 1fr); }
    .stage-heading { grid-column: 1 / 6; }
    .stage-narrative { grid-column: 5 / -1; }
    .stage-datum { grid-column: 1 / 5; }
  }

  @media (max-width: 767px) {
    .renovation-morph { height: auto; padding: 90px 0 100px; }
    .desktop-sequence { display: none; }
    .mobile-sequence { display: block; }
    .mobile-heading > p { color: var(--acoustic); }
    .mobile-heading h2 { margin: 16px 0 34px; font-size: clamp(2.65rem, 13vw, 4.4rem); line-height: .92; }
    .mobile-rail { display: flex; gap: 14px; overflow-x: auto; padding: 0 var(--gutter) 20px; scroll-padding-inline: var(--gutter); scroll-snap-type: x mandatory; overscroll-behavior-inline: contain; scrollbar-width: none; }
    .mobile-rail::-webkit-scrollbar { display: none; }
    .mobile-frame { flex: 0 0 min(86vw, 390px); overflow: hidden; border: 1px solid var(--white-16); border-radius: 24px; background: var(--ink-900); scroll-snap-align: start; }
    .mobile-frame picture { display: block; aspect-ratio: 3 / 4; overflow: hidden; }
    .mobile-frame img { width: 100%; height: 100%; object-fit: cover; }
    .mobile-copy { padding: 24px 20px 20px; }
    .mobile-copy > .mono { color: var(--signal); }
    .mobile-copy h3 { min-height: 5.1em; margin: 15px 0 20px; font-family: 'Geologica', sans-serif; font-size: 1.55rem; line-height: 1.04; letter-spacing: -.035em; }
    .mobile-copy ul { min-height: 7.6em; margin: 0 0 22px; padding: 0; list-style: none; color: var(--white-64); }
    .mobile-copy li { padding: 8px 0; border-top: 1px solid var(--white-16); }
    .mobile-copy .button { width: 100%; min-height: 52px; padding-inline: 14px; font-size: .78rem; }
    .mobile-progress { display: grid; grid-template-columns: repeat(3, 44px) 1fr; gap: 7px; align-items: center; padding-top: 8px; }
    .mobile-progress button { min-width: 44px; min-height: 44px; display: grid; place-items: center; padding: 0; border: 0; background: transparent; }
    .mobile-progress button span { width: 100%; height: 2px; background: var(--white-16); }
    .mobile-progress button[aria-current='step'] span { background: var(--signal); }
    .mobile-progress p { justify-self: end; margin: 0; color: var(--white-64); }
  }

  @media (prefers-reduced-motion: reduce) {
    .renovation-morph { height: auto; padding: 100px 0; }
    .desktop-sequence { display: none; }
    .mobile-sequence { display: block; }
    .mobile-rail { scroll-behavior: auto; }
    .mobile-frame { scroll-snap-align: none; }
    .mobile-progress { display: none; }
  }

  @media (prefers-reduced-motion: reduce) and (min-width: 768px) {
    .mobile-heading { display: block; }
    .mobile-heading h2 { margin: 16px 0 34px; font-size: clamp(3rem, 6vw, 6rem); }
    .mobile-rail { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; overflow: visible; padding: 0 var(--gutter); }
    .mobile-frame { min-width: 0; border: 1px solid var(--white-16); border-radius: 20px; overflow: hidden; background: var(--ink-900); }
    .mobile-frame picture { display: block; aspect-ratio: 3 / 4; overflow: hidden; }
    .mobile-frame img { width: 100%; height: 100%; object-fit: cover; }
    .mobile-copy { padding: 22px; }
    .mobile-copy h3 { font-family: 'Geologica', sans-serif; font-size: 1.45rem; }
    .mobile-copy ul { padding-left: 18px; color: var(--white-64); }
    .mobile-copy .button { width: 100%; }
  }
</style>
