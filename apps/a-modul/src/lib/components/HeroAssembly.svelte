<script lang="ts">
  import { onMount } from 'svelte';

  const stages = [
    { label: 'Площадка', detail: 'Подготовка основания и исходных данных' },
    { label: 'Проект', detail: 'Планировочная сетка и состав объекта' },
    { label: 'Монтаж', detail: 'Поставка и установка модульных групп' },
    { label: 'Запуск', detail: 'Инженерия, стыковка и ввод в эксплуатацию' }
  ];

  let activeStage = 0;
  let playing = false;
  let reducedMotion = false;
  let timers: number[] = [];
  let root: HTMLElement;

  function clearTimeline() {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers = [];
    playing = false;
  }

  function selectStage(index: number) {
    clearTimeline();
    activeStage = index;
  }

  function playSequence() {
    clearTimeline();
    if (reducedMotion) {
      activeStage = 3;
      return;
    }

    playing = true;
    activeStage = 0;
    [1, 2, 3].forEach((stage, index) => {
      const timer = window.setTimeout(() => {
        activeStage = stage;
        if (stage === 3) playing = false;
      }, 1600 * (index + 1));
      timers.push(timer);
    });
  }

  function toggleSequence() {
    if (playing) clearTimeline();
    else playSequence();
  }

  onMount(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reducedMotion = preference.matches;
      clearTimeline();
      if (reducedMotion) activeStage = 3;
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

<figure bind:this={root} class="assembly" data-stage={activeStage} aria-labelledby="assembly-caption">
  <div class="assembly__viewport">
    <picture class:visible={activeStage <= 1} class="assembly__plate assembly__plate--empty" aria-hidden="true">
      <source media="(max-width: 760px)" type="image/avif" srcset="/generated/a-modul-general-hero-empty-site-mobile.avif" />
      <source media="(max-width: 760px)" type="image/webp" srcset="/generated/a-modul-general-hero-empty-site-mobile.webp" />
      <source type="image/avif" srcset="/generated/a-modul-general-hero-empty-site-desktop.avif" />
      <img src="/generated/a-modul-general-hero-empty-site-desktop.webp" width="1600" height="900" alt="" fetchpriority="high" />
    </picture>

    <picture class:visible={activeStage === 2} class="assembly__plate assembly__plate--partial" aria-hidden="true">
      <source media="(max-width: 760px)" type="image/avif" srcset="/generated/a-modul-general-hero-partial-settlement-mobile.avif" />
      <source media="(max-width: 760px)" type="image/webp" srcset="/generated/a-modul-general-hero-partial-settlement-mobile.webp" />
      <source type="image/avif" srcset="/generated/a-modul-general-hero-partial-settlement-desktop.avif" />
      <img src="/generated/a-modul-general-hero-partial-settlement-desktop.webp" width="1600" height="900" alt="" />
    </picture>

    <picture class:visible={activeStage === 3} class="assembly__plate assembly__plate--complete" aria-hidden="true">
      <source media="(max-width: 760px)" type="image/avif" srcset="/generated/a-modul-general-hero-operational-object-mobile.avif" />
      <source media="(max-width: 760px)" type="image/webp" srcset="/generated/a-modul-general-hero-operational-object-mobile.webp" />
      <source type="image/avif" srcset="/generated/a-modul-general-hero-operational-object-desktop.avif" />
      <img src="/generated/a-modul-general-hero-operational-object-desktop.webp" width="1600" height="900" alt="" />
    </picture>

    <svg class:visible={activeStage === 1} class="assembly__grid" viewBox="0 0 1000 620" aria-hidden="true">
      <g class="assembly__grid-lines">
        <path d="M154 505 660 246 928 360 427 604Z" />
        <path d="m234 465 270 122M317 423l274 121M401 380l277 122M486 337l280 122M571 294l282 123" />
        <path d="m251 556 508-260M350 596l504-257M171 514l505-260" />
      </g>
      <g class="assembly__footprints">
        <path d="m584 353 142-72 83 36-143 73Z" />
        <path d="m454 443 128-65 78 35-128 65Z" />
        <path d="m296 521 115-58 71 32-115 58Z" />
      </g>
    </svg>

    <div class="assembly__hud" aria-hidden="true">
      <span>СЦЕНА 01</span>
      <span>{String(activeStage + 1).padStart(2, '0')} / 04</span>
    </div>
  </div>

  <div class="assembly__stages" role="group" aria-label="Этапы запуска объекта">
    {#each stages as stage, index}
      <button type="button" class:active={activeStage === index} aria-pressed={activeStage === index} onclick={() => selectStage(index)}>
        <span>{String(index + 1).padStart(2, '0')}</span>
        {stage.label}
      </button>
    {/each}
  </div>

  <figcaption id="assembly-caption" class="assembly__caption">
    <div role="status" aria-live="polite" aria-atomic="true">
      <span class="mono-label">{stages[activeStage].label}</span>
      <strong>{stages[activeStage].detail}</strong>
    </div>
    <button type="button" class="assembly__play" onclick={toggleSequence} aria-pressed={playing}>
      {playing ? 'Остановить сборку' : reducedMotion ? 'Итог показан' : 'Запустить сборку'}
      <span aria-hidden="true">→</span>
    </button>
  </figcaption>
</figure>
