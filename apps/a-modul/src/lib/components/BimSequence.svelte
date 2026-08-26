<script lang="ts">
  import { onMount } from 'svelte';
  import { trackEvent } from '$lib/analytics';

  const stages = [
    { label: 'Генплан', detail: 'Фиксируем площадку, связи и ограничения', asset: 'a-modul-general-hero-empty-site' },
    { label: 'Состав', detail: 'Собираем функциональные группы в проектной модели', asset: 'a-modul-general-hero-empty-site' },
    { label: 'Модули', detail: 'Разделяем объект на производимые и транспортируемые элементы', asset: 'a-modul-general-hero-empty-site' },
    { label: 'Производство', detail: 'Связываем рабочую документацию с маршрутами изготовления', asset: 'a-modul-factory' },
    { label: 'Доставка', detail: 'Комплектуем партии под подтверждённую схему маршрута', asset: 'a-modul-general-hero-partial-settlement' },
    { label: 'Монтаж', detail: 'Стыкуем группы, переходы и инженерные подключения', asset: 'a-modul-general-hero-partial-settlement' },
    { label: 'Объект', detail: 'Завершаем единый контур до операционного результата', asset: 'a-modul-general-hero-operational-object' }
  ];

  let active = 0;
  let playing = false;
  let reducedMotion = false;
  let timers: number[] = [];
  let interactionStarted = false;
  let root: HTMLElement;

  function startInteraction() {
    if (interactionStarted) return;
    interactionStarted = true;
    trackEvent('bim_interaction_start');
  }

  function completeInteraction() {
    trackEvent('bim_interaction_complete', { stage: stages.length });
  }

  function clearTimeline() {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers = [];
    playing = false;
  }

  function selectStage(index: number) {
    startInteraction();
    clearTimeline();
    active = index;
    if (index === stages.length - 1) completeInteraction();
  }

  function play() {
    startInteraction();
    clearTimeline();
    if (reducedMotion) {
      active = stages.length - 1;
      completeInteraction();
      return;
    }
    playing = true;
    active = 0;
    stages.slice(1).forEach((_, index) => {
      const stage = index + 1;
      timers.push(window.setTimeout(() => {
        active = stage;
        if (stage === stages.length - 1) { playing = false; completeInteraction(); }
      }, stage * 1600));
    });
  }

  function togglePlayback() {
    if (playing) clearTimeline();
    else play();
  }

  onMount(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reducedMotion = preference.matches;
      clearTimeline();
      if (reducedMotion) active = stages.length - 1;
    };
    sync();
    preference.addEventListener('change', sync);
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting && playing) clearTimeline();
    }, { threshold: 0.1 });
    observer.observe(root);
    return () => {
      preference.removeEventListener('change', sync);
      observer.disconnect();
      clearTimeline();
    };
  });
</script>

<section bind:this={root} class="bim chapter" id="bim" aria-labelledby="bim-title">
  <div class="chapter__heading chapter__heading--split">
    <div>
      <p class="eyebrow">BIM → объект / управляемая последовательность</p>
      <h2 id="bim-title">Сначала вы видите объект в модели. Потом запускаем производство.</h2>
    </div>
    <p>Состав модели и степень детализации зависят от этапа и договора. Эта схема объясняет процесс, а не обещает готовую рабочую модель до получения исходных данных.</p>
  </div>

  <div class="bim__sequence" data-stage={active}>
    <div class="bim__viewport">
      {#each stages as stage, index}
        <picture class:visible={active === index} class="bim__plate" aria-hidden="true">
          <source media="(max-width: 760px)" type="image/avif" srcset={`/generated/${stage.asset}-mobile.avif`} />
          <source media="(max-width: 760px)" type="image/webp" srcset={`/generated/${stage.asset}-mobile.webp`} />
          <source type="image/avif" srcset={`/generated/${stage.asset}-desktop.avif`} />
          <img src={`/generated/${stage.asset}-desktop.webp`} width="1600" height="900" alt="" loading="lazy" />
        </picture>
      {/each}

      {#if active <= 2}
        <svg class="bim__overlay" viewBox="0 0 1000 560" aria-hidden="true">
          <path d="M152 430 554 196 875 342 469 530Z" />
          <path d="m248 374 404 185M340 320l405 184M431 267l408 185" />
          <path d="m238 480 404-234M356 526l403-232M469 535l383-221" />
          {#if active === 1}
            <g><path d="m515 310 151-88 109 50-151 88Z" /><path d="m348 405 124-72 94 43-124 72Z" /><path d="m225 457 97-57 74 34-98 57Z" /></g>
          {/if}
          {#if active === 2}
            <g class="bim__module-blocks">
              <path d="m514 310 70-41 48 22-70 41Z" /><path d="m590 268 70-41 48 22-70 41Z" /><path d="m430 359 70-41 48 22-70 41Z" />
              <path d="m347 407 61-36 43 20-62 36Z" /><path d="m414 368 61-36 43 20-62 36Z" /><path d="m267 454 58-34 40 19-58 33Z" />
            </g>
          {/if}
        </svg>
      {/if}

      {#if active === 4}
        <svg class="bim__transport" viewBox="0 0 1000 560" aria-hidden="true">
          <path d="M80 470 C280 420 480 455 730 336" />
          <g transform="translate(350 380)"><rect x="0" y="0" width="110" height="42" rx="3" /><rect x="112" y="15" width="42" height="27" rx="3" /><circle cx="28" cy="50" r="9" /><circle cx="127" cy="50" r="9" /></g>
        </svg>
      {/if}

      <div class="bim__hud"><span>ЭТАП {String(active + 1).padStart(2, '0')}</span><span>{stages[active].label}</span></div>
      <span class="visualization-label">Процессная визуализация</span>
    </div>

    <div class="bim__controls">
      <div class="bim__stages" role="group" aria-label="Этапы от модели до объекта">
        {#each stages as stage, index}
          <button type="button" class:active={active === index} aria-pressed={active === index} onclick={() => selectStage(index)}><span>{String(index + 1).padStart(2, '0')}</span>{stage.label}</button>
        {/each}
      </div>
      <div class="bim__caption">
        <div role="status" aria-live="polite" aria-atomic="true"><span class="mono-label">{stages[active].label}</span><strong>{stages[active].detail}</strong></div>
        <button class="bim__play" type="button" onclick={togglePlayback} aria-pressed={playing}>{playing ? 'Остановить последовательность' : reducedMotion ? 'Итог показан' : 'Показать весь путь'}<span aria-hidden="true">→</span></button>
      </div>
    </div>
  </div>
</section>
