<script lang="ts">
  import { onMount } from 'svelte';

  const stages = [
    { label: 'Площадка', detail: 'Исходные данные и геодезическая разбивка пятна застройки', position: 0.04, asset: 'a-modul-general-hero-v3-stakeout' },
    { label: 'Основания', detail: 'Подготовленные точки опирания в границах разбитого пятна', position: 0.32, asset: 'a-modul-general-hero-v2-foundations' },
    { label: 'Доставка и монтаж', detail: 'Модульные группы доставляются и устанавливаются в проектной последовательности', position: 0.68, asset: 'a-modul-general-hero-v2-assembly' },
    { label: 'Запуск', detail: 'Инженерия, стыковка и готовый объект в эксплуатации', position: 0.94, asset: 'a-modul-general-hero-v2-operational' }
  ] as const;

  const mobileStageIndexes = [0, 2, 3];
  let activeStage = $state(0);
  let progress = $state(0);
  let reducedMotion = $state(false);
  let mobile = $state(false);
  let root = $state<HTMLElement>();
  let targetProgress = 0;
  let readFrame = 0;
  let motionFrame = 0;
  let previousMotionTime = 0;

  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  function smoothstep(value: number) {
    const next = clamp(value);
    return next * next * (3 - 2 * next);
  }

  function calculateTransitionVeil(currentProgress: number, isMobile: boolean, reduce: boolean) {
    if (isMobile || reduce) return 0;
    const midpoints = stages.slice(0, -1).map((stage, index) => (stage.position + stages[index + 1].position) / 2);
    const nearest = Math.min(...midpoints.map((midpoint) => Math.abs(currentProgress - midpoint)));
    const radius = .115;
    return smoothstep(1 - clamp(nearest / radius)) * .86;
  }

  let plateOpacities = $derived(stages.map((_, index) => activeStage === index ? 1 : 0));
  let transitionVeil = $derived(calculateTransitionVeil(progress, mobile, reducedMotion));

  function stageForProgress(value: number) {
    if (value < .18) return 0;
    if (value < .5) return 1;
    if (value < .81) return 2;
    return 3;
  }

  function animateTowardsTarget(time: number) {
    motionFrame = 0;
    if (mobile || reducedMotion) return;
    const elapsed = previousMotionTime ? Math.min(16.7, time - previousMotionTime) : 16.7;
    previousMotionTime = time;
    const distance = targetProgress - progress;
    if (Math.abs(distance) <= .0005) {
      progress = targetProgress;
      activeStage = stageForProgress(progress);
      previousMotionTime = 0;
      return;
    }
    const blend = 1 - Math.exp(-elapsed / 175);
    progress += distance * blend;
    activeStage = stageForProgress(progress);
    motionFrame = window.requestAnimationFrame(animateTowardsTarget);
  }

  function startMotion() {
    if (!motionFrame) motionFrame = window.requestAnimationFrame(animateTowardsTarget);
  }

  function updateFromScroll(immediate = false) {
    if (mobile || reducedMotion || !root) return;
    const story = root.closest<HTMLElement>('.hero');
    if (!story) return;
    const rect = story.getBoundingClientRect();
    const available = Math.max(1, story.offsetHeight - window.innerHeight + 88);
    targetProgress = Math.max(0, Math.min(1, -rect.top / available));
    if (immediate) {
      progress = targetProgress;
      activeStage = stageForProgress(progress);
      previousMotionTime = 0;
      return;
    }
    startMotion();
  }

  function requestUpdate() {
    if (readFrame) return;
    readFrame = window.requestAnimationFrame(() => {
      readFrame = 0;
      updateFromScroll();
    });
  }

  function selectStage(index: number) {
    activeStage = index;
    if (mobile || reducedMotion || !root) return;
    const story = root.closest<HTMLElement>('.hero');
    if (!story) return;
    const start = window.scrollY + story.getBoundingClientRect().top;
    const available = Math.max(1, story.offsetHeight - window.innerHeight + 88);
    window.scrollTo({ top: start + stages[index].position * available, behavior: 'smooth' });
  }

  function moveMobile(direction: -1 | 1) {
    const current = mobileStageIndexes.indexOf(activeStage);
    const next = Math.max(0, Math.min(mobileStageIndexes.length - 1, current + direction));
    activeStage = mobileStageIndexes[next];
  }

  onMount(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobilePreference = window.matchMedia('(max-width: 820px)');
    const syncPreferences = () => {
      reducedMotion = motionPreference.matches;
      mobile = mobilePreference.matches;
      if (reducedMotion) {
        activeStage = 3;
        progress = 1;
      } else if (mobile && !mobileStageIndexes.includes(activeStage)) {
        activeStage = 2;
      } else {
        updateFromScroll(true);
      }
    };

    syncPreferences();
    motionPreference.addEventListener('change', syncPreferences);
    mobilePreference.addEventListener('change', syncPreferences);
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    requestUpdate();

    return () => {
      motionPreference.removeEventListener('change', syncPreferences);
      mobilePreference.removeEventListener('change', syncPreferences);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (readFrame) window.cancelAnimationFrame(readFrame);
      if (motionFrame) window.cancelAnimationFrame(motionFrame);
    };
  });
</script>

<figure bind:this={root} class="assembly" data-stage={activeStage} data-progress={Math.round(progress * 100)} aria-labelledby="assembly-caption">
  <div class="assembly__viewport">
    {#each stages as stage, index}
      <picture class:visible={activeStage === index} class="assembly__plate" style={`opacity: ${plateOpacities[index]}`} aria-hidden="true">
        <source media="(max-width: 820px)" type="image/avif" srcset="/generated/{stage.asset}-mobile.avif" />
        <source media="(max-width: 820px)" type="image/webp" srcset="/generated/{stage.asset}-mobile.webp" />
        <source type="image/avif" srcset="/generated/{stage.asset}-desktop.avif" />
        <img src="/generated/{stage.asset}-desktop.webp" width="1600" height="900" alt="" fetchpriority={index === 0 ? 'high' : 'auto'} />
      </picture>
    {/each}
    <div class="assembly__transition-veil" style={`opacity: ${transitionVeil}`} aria-hidden="true"></div>

    <div class="assembly__hud" aria-hidden="true">
      <span>СЕВЕРНЫЙ КОНТУР · СЦЕНА {String(mobile ? mobileStageIndexes.indexOf(activeStage) + 1 : activeStage + 1).padStart(2, '0')}</span>
      <span>{mobile ? mobileStageIndexes.indexOf(activeStage) + 1 : activeStage + 1} / {mobile ? 3 : 4}</span>
    </div>
    <div class="assembly__progress" aria-hidden="true"><span style={`width: ${mobile ? ((mobileStageIndexes.indexOf(activeStage) + 1) / 3) * 100 : progress * 100}%`}></span></div>
  </div>

  <div class="assembly__stages" role="group" aria-label="Этапы запуска объекта">
    {#each stages as stage, index}
      {#if !mobile || mobileStageIndexes.includes(index)}
        <button type="button" class:active={activeStage === index} aria-pressed={activeStage === index} onclick={() => selectStage(index)}>
          <span>{String((mobile ? mobileStageIndexes.indexOf(index) : index) + 1).padStart(2, '0')}</span>
          {stage.label}
        </button>
      {/if}
    {/each}
  </div>

  <figcaption id="assembly-caption" class="assembly__caption">
    <div role="status" aria-live="polite" aria-atomic="true">
      <span class="mono-label">{stages[activeStage].label}</span>
      <strong>{stages[activeStage].detail}</strong>
    </div>
    {#if mobile && !reducedMotion}
      <div class="assembly__mobile-nav">
        <button type="button" onclick={() => moveMobile(-1)} disabled={activeStage === 0} aria-label="Предыдущая стадия">←</button>
        <button type="button" onclick={() => moveMobile(1)} disabled={activeStage === 3} aria-label="Следующая стадия">→</button>
      </div>
    {:else}
      <span class="assembly__scroll-note">{reducedMotion ? 'Итоговая стадия' : 'Листайте страницу'}</span>
    {/if}
  </figcaption>
</figure>
