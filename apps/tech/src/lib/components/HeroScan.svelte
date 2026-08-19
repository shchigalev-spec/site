<script lang="ts">
  import { onMount } from 'svelte';
  import { track } from '$lib/analytics';

  let root: HTMLElement;
  let active = 0;
  let progress = 0;
  let reducedMotion = false;

  const states = [
    {
      code: '01 / СИМПТОМ',
      title: 'Сначала найдём, как шум попадает в комнату.',
      text: 'Спокойный интерьер не раскрывает маршрут звука. Симптом — только начало исследования.'
    },
    {
      code: '02 / СКАН',
      title: 'Проверяем поверхности, каналы и примыкания.',
      text: 'Измерительная плоскость разделяет вероятные пути: перекрытие, стену, вентиляцию и жёсткие связи.'
    },
    {
      code: '03 / ДИАГНОЗ',
      title: 'Не поверхность. Путь передачи.',
      text: 'Доминирующий маршрут становится видимым, а неподтверждённые пути остаются гипотезами.'
    },
    {
      code: '04 / РЕШЕНИЕ',
      title: 'Конструкция появляется только после диагноза.',
      text: 'Масса, развязка, герметизация и узлы собираются под конкретное помещение и стадию ремонта.'
    }
  ];

  function selectState(index: number) {
    active = index;
    progress = index / 3;
  }

  onMount(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const compactViewport = window.matchMedia('(max-width: 767px)').matches;
    if (reducedMotion || compactViewport) return;

    let cleanup = () => {};
    void (async () => {
      const gsapModule = await import('gsap');
      const scrollModule = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.35,
        onUpdate(self) {
          progress = self.progress;
          active = Math.min(3, Math.floor(self.progress * 4));
        }
      });
      cleanup = () => trigger.kill();
    })();

    return () => cleanup();
  });
</script>

<section class="hero" bind:this={root} data-state={active} style={`--hero-progress:${progress}`} aria-labelledby="hero-title">
  <div class="hero-sticky">
    <picture>
      <source media="(max-width: 960px)" srcset="/generated/tech-style-anchor-960.webp" type="image/webp" />
      <source srcset="/generated/tech-style-anchor.webp" type="image/webp" />
      <img class="hero-base" src="/generated/tech-style-anchor.png" alt="Интерьер квартиры с визуализированными акустическими полями" width="1672" height="941" fetchpriority="high" />
    </picture>
    <picture>
      <source media="(max-width: 960px)" srcset="/generated/tech-hero-cutaway-960.webp" type="image/webp" />
      <source srcset="/generated/tech-hero-cutaway.webp" type="image/webp" />
      <img class="hero-cutaway" src="/generated/tech-hero-cutaway.png" alt="" width="1672" height="941" />
    </picture>
    <div class="vignette"></div>
    <div class="scan-plane" aria-hidden="true"></div>
    <div class="architecture" aria-hidden="true">
      <span class="plane plane-ceiling"></span>
      <span class="plane plane-wall"></span>
      <span class="plane plane-floor"></span>
    </div>
    <div class="routes" aria-hidden="true">
      <i class="route route-a"></i><i class="route route-b"></i><i class="route route-c"></i>
    </div>
    <div class="assembly" aria-hidden="true">
      <i>МАССА</i><i>РАЗВЯЗКА</i><i>КОНТУР</i><i>УЗЕЛ</i>
    </div>

    <div class="hero-copy shell">
      <p class="mono state-code">{states[active].code}</p>
      <h1 class="display" id="hero-title">{states[active].title}</h1>
      <p class="hero-text">{states[active].text}</p>
      <div class="hero-actions">
        <a class="button" href="/diagnostika-shuma/" on:click={() => track('hero_cta_click', { state: active + 1 })}>
          {active === 3 ? 'Разобрать мой шум' : 'Записаться на диагностику'}
        </a>
        <a class="scroll-hint" href="#noise-deck"><span>Провести скан</span><i aria-hidden="true"></i></a>
      </div>
    </div>

    <div class="state-index" aria-label="Состояния акустического сканирования">
      {#each states as state, index}
        <button type="button" class:active={active === index} on:click={() => selectState(index)} aria-label={state.code} aria-current={active === index ? 'step' : undefined}>
          <span>0{index + 1}</span>
        </button>
      {/each}
    </div>

    <div class="measurement-labels mono" aria-hidden="true">
      <span>ПРИМЫКАНИЕ / A-04</span>
      <span>ПЕРЕКРЫТИЕ / Z-17</span>
      <span>КАНАЛ / V-02</span>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    height: 220svh;
    background: var(--ink-950);
  }

  .hero-sticky {
    position: sticky;
    top: 0;
    height: 100svh;
    overflow: hidden;
    isolation: isolate;
    background: #0a0c0b;
  }

  .hero img {
    position: absolute;
    inset: 0;
    z-index: -5;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transform: scale(calc(1.03 + var(--hero-progress) * 0.055)) translate3d(calc(var(--hero-progress) * -1.5%), calc(var(--hero-progress) * -0.8%), 0);
    filter: saturate(calc(0.82 + var(--hero-progress) * 0.18)) brightness(calc(0.67 + var(--hero-progress) * 0.09));
    transition: filter 300ms ease;
  }

  .hero-cutaway {
    opacity: 0;
    mix-blend-mode: normal;
    transition: opacity 500ms ease, filter 500ms ease;
  }

  [data-state='1'] .hero-cutaway { opacity: .72; }
  [data-state='2'] .hero-cutaway { opacity: .92; }
  [data-state='3'] .hero-cutaway { opacity: .58; filter: brightness(.72) saturate(.74); }

  .vignette {
    position: absolute;
    inset: 0;
    z-index: -4;
    background:
      radial-gradient(circle at 67% 42%, transparent 12%, rgba(7, 9, 8, 0.12) 42%, rgba(7, 9, 8, 0.7) 100%),
      linear-gradient(90deg, rgba(7, 9, 8, 0.82) 0 26%, transparent 62%);
  }

  .scan-plane {
    position: absolute;
    z-index: -1;
    inset: 6% auto 4% calc(-25% + var(--hero-progress) * 150%);
    width: 18%;
    opacity: 0;
    transform: skewX(-12deg);
    border-inline: 1px solid rgba(255, 253, 248, 0.42);
    background: linear-gradient(90deg, transparent, rgba(255, 253, 248, 0.15), transparent);
  }

  [data-state='1'] .scan-plane { opacity: 1; }

  .plane {
    position: absolute;
    border: 1px solid rgba(108, 159, 150, 0.46);
    opacity: 0;
    transition: opacity 420ms ease, transform 700ms cubic-bezier(.22,.72,.2,1);
  }

  .plane-ceiling { inset: 10% 5% auto 22%; height: 20%; transform: perspective(900px) rotateX(65deg) translateY(-60%); }
  .plane-wall { top: 20%; right: 5%; width: 22%; height: 64%; transform: perspective(800px) rotateY(-38deg) translateX(30%); }
  .plane-floor { inset: auto 8% 7% 32%; height: 24%; transform: perspective(800px) rotateX(62deg) translateY(45%); }
  [data-state='1'] .plane, [data-state='2'] .plane { opacity: 0.72; transform: none; }

  .route {
    position: absolute;
    z-index: 0;
    height: 2px;
    border-radius: 4px;
    opacity: 0;
    transform-origin: left;
    transform: scaleX(0);
    background: var(--signal);
    box-shadow: 0 0 18px rgba(255, 101, 79, 0.72);
    transition: opacity 400ms ease, transform 700ms ease, background 400ms ease;
  }

  .route-a { width: 39%; top: 30%; left: 55%; transform: rotate(54deg) scaleX(0); }
  .route-b { width: 30%; top: 54%; left: 42%; transform: rotate(-22deg) scaleX(0); }
  .route-c { width: 31%; top: 77%; left: 58%; transform: rotate(-72deg) scaleX(0); }
  [data-state='1'] .route { opacity: 0.6; transform: scaleX(1); }
  [data-state='1'] .route-a { transform: rotate(54deg) scaleX(1); }
  [data-state='1'] .route-b { transform: rotate(-22deg) scaleX(1); }
  [data-state='1'] .route-c { transform: rotate(-72deg) scaleX(1); }
  [data-state='2'] .route-a { opacity: 1; transform: rotate(54deg) scaleX(1); background: var(--acoustic); box-shadow: 0 0 22px rgba(108,159,150,.8); }
  [data-state='2'] .route-b, [data-state='2'] .route-c { opacity: .12; transform: scaleX(.7); }

  .assembly {
    position: absolute;
    right: 9%;
    top: 19%;
    width: 29%;
    height: 61%;
    display: grid;
    place-content: center;
    gap: 10px;
    opacity: 0;
    perspective: 900px;
    transition: opacity 500ms ease;
  }

  .assembly i {
    display: grid;
    place-items: center;
    width: clamp(190px, 26vw, 460px);
    height: clamp(34px, 4vw, 66px);
    border: 1px solid rgba(255, 253, 248, 0.35);
    background: rgba(13, 17, 16, 0.65);
    color: var(--white-64);
    font: 500 10px/1 'IBM Plex Mono', monospace;
    letter-spacing: .1em;
    transform: translate3d(calc((var(--i, 1) - 2) * 20px), calc((var(--i, 1) - 2) * -12px), 0) rotateX(62deg);
  }

  .assembly i:nth-child(1) { --i: 1; }
  .assembly i:nth-child(2) { --i: 2; border-color: var(--acoustic); }
  .assembly i:nth-child(3) { --i: 3; border-color: var(--signal); }
  .assembly i:nth-child(4) { --i: 4; }
  [data-state='3'] .assembly { opacity: 1; }

  .hero-copy {
    height: 100%;
    padding-top: 25svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
  }

  .state-code { color: var(--acoustic); margin: 0 0 22px; }
  h1 { width: min(960px, 76vw); margin: 0; font-size: clamp(3.4rem, 7.2vw, 8.25rem); }
  .hero-text { width: min(480px, 40vw); margin: 26px 0 0; color: var(--white-64); }
  .hero-actions { display: flex; align-items: center; gap: 30px; margin-top: 34px; }

  .scroll-hint { display: inline-flex; align-items: center; gap: 12px; color: var(--white-64); font-size: .82rem; }
  .scroll-hint i { width: 70px; height: 1px; background: var(--white-16); position: relative; }
  .scroll-hint i::after { content: ''; position: absolute; top: -2px; left: 0; width: 5px; height: 5px; border-radius: 50%; background: var(--signal); animation: travel 2s ease-in-out infinite; }
  @keyframes travel { 50%, 100% { transform: translateX(65px); } }

  .state-index {
    position: absolute;
    z-index: 2;
    left: var(--gutter);
    bottom: 30px;
    display: flex;
    gap: 8px;
  }

  .state-index button {
    width: 54px;
    height: 34px;
    border: 0;
    border-bottom: 1px solid var(--white-16);
    background: transparent;
    color: var(--white-64);
    font: 500 10px/1 'IBM Plex Mono', monospace;
    cursor: pointer;
  }

  .state-index button.active { border-color: var(--signal); color: var(--white); }

  .measurement-labels { position: absolute; right: var(--gutter); bottom: 34px; display: flex; gap: 24px; color: var(--white-64); opacity: 0; transition: opacity 400ms ease; }
  [data-state='1'] .measurement-labels, [data-state='2'] .measurement-labels { opacity: 1; }

  @media (max-width: 900px) {
    .hero { height: 205svh; }
    .hero img { object-position: 64% center; }
    .vignette { background: linear-gradient(0deg, rgba(7,9,8,.9), rgba(7,9,8,.1) 75%); }
    .hero-copy { padding-top: 34svh; justify-content: flex-end; padding-bottom: 112px; }
    h1 { width: min(800px, 92vw); font-size: clamp(2.9rem, 10vw, 6rem); }
    .hero-text { width: min(540px, 82vw); }
    .assembly { right: -5%; top: 14%; width: 60%; }
    .measurement-labels { display: none; }
  }

  @media (max-width: 767px) {
    .hero { height: 100svh; }
    .hero-actions { width: 100%; flex-direction: column; align-items: stretch; gap: 12px; }
    .scroll-hint { display: none; }
    .state-index { right: var(--gutter); justify-content: space-between; }
    .state-index button { flex: 1; }
    .state-index button { height: 44px; }
    .architecture { opacity: .5; }
  }

  @media (prefers-reduced-motion: reduce) {
    .hero { height: 100svh; }
    .hero img { transform: scale(1.03); }
    .scan-plane { display: none; }
    .scroll-hint i::after { animation: none; }
  }
</style>
