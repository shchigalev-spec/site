<script lang="ts">
  import { onMount } from 'svelte';

  const stages = [
    { label: 'Площадка', detail: 'Исходные данные и подготовленное пятно застройки', position: 0.04, image: 'empty' },
    { label: 'Основания', detail: 'Планировочная сетка, оси и подготовленные точки опирания', position: 0.32, image: 'foundations' },
    { label: 'Доставка и монтаж', detail: 'Модульные группы доставляются и устанавливаются в проектной последовательности', position: 0.68, image: 'assembly' },
    { label: 'Запуск', detail: 'Инженерия, стыковка и готовый объект в эксплуатации', position: 0.94, image: 'operational' }
  ] as const;

  const mobileStageIndexes = [0, 2, 3];
  let activeStage = 0;
  let progress = 0;
  let reducedMotion = false;
  let mobile = false;
  let root: HTMLElement;
  let frame = 0;
  let foundationProgress = 0;
  let assemblyProgress = 0;
  let operationalProgress = 0;

  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  $: foundationProgress = clamp((progress - .2) / .25);
  $: assemblyProgress = clamp((progress - .45) / .43);
  $: operationalProgress = clamp((progress - .88) / .12);

  function stageForProgress(value: number) {
    if (value < .2) return 0;
    if (value < .45) return 1;
    if (value < .88) return 2;
    return 3;
  }

  function updateFromScroll() {
    frame = 0;
    if (mobile || reducedMotion || !root) return;
    const story = root.closest<HTMLElement>('.hero');
    if (!story) return;
    const rect = story.getBoundingClientRect();
    const available = Math.max(1, story.offsetHeight - window.innerHeight + 88);
    progress = Math.max(0, Math.min(1, -rect.top / available));
    activeStage = stageForProgress(progress);
  }

  function requestUpdate() {
    if (!frame) frame = window.requestAnimationFrame(updateFromScroll);
  }

  function selectStage(index: number) {
    activeStage = index;
    if (mobile || reducedMotion) return;
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
        updateFromScroll();
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
      if (frame) window.cancelAnimationFrame(frame);
    };
  });
</script>

<figure bind:this={root} class="assembly" data-stage={activeStage} data-progress={Math.round(progress * 100)} aria-labelledby="assembly-caption">
  <div class="assembly__viewport">
    {#each stages as stage, index}
      <picture class:visible={activeStage === index} class="assembly__plate assembly__plate--{stage.image}" aria-hidden="true">
        {#if index !== 1}<source media="(max-width: 820px)" type="image/avif" srcset="/generated/a-modul-general-hero-v2-{stage.image}-mobile.avif" />{/if}
        {#if index !== 1}<source media="(max-width: 820px)" type="image/webp" srcset="/generated/a-modul-general-hero-v2-{stage.image}-mobile.webp" />{/if}
        <source type="image/avif" srcset="/generated/a-modul-general-hero-v2-{stage.image}-desktop.avif" />
        <img src="/generated/a-modul-general-hero-v2-{stage.image}-desktop.webp" width="1600" height="900" alt="" fetchpriority={index === 0 ? 'high' : 'auto'} />
      </picture>
    {/each}

    <svg class="assembly__technical" class:assembly__technical--complete={activeStage === 3} viewBox="0 0 1600 900" aria-hidden="true">
      <g class="technical__datum">
        <path d="M412 706 1214 348" />
        <path d="M522 760 1312 408" />
        <path d="m515 658 110 48M699 576l112 48M885 493l114 49M1073 410l115 50" />
      </g>
      <g class="technical__zones" style={`opacity: ${activeStage === 1 ? Math.max(.18, foundationProgress) : 0}`}>
          <polygon points="610,596 807,507 994,581 796,674" />
          <polygon points="836,492 1030,404 1184,468 991,557" />
          <polygon points="1046,394 1193,327 1318,379 1170,447" />
      </g>
      <g class="technical__labels" style={`opacity: ${activeStage === 1 ? foundationProgress : 0}`}>
          <text x="695" y="588">ЖИЛАЯ ГРУППА</text><text x="926" y="482">АБК / БЫТ</text><text x="1120" y="382">ИНЖЕНЕРИЯ</text>
      </g>
      <g class="technical__connections" style={`opacity: ${activeStage === 2 ? Math.max(.24, assemblyProgress) : 0}`}>
          <path d="M735 616 925 530 1113 453 1265 386" style={`stroke-dashoffset: ${Math.round((1 - assemblyProgress) * 220)}`} />
          <circle cx="735" cy="616" r="7"/><circle cx="925" cy="530" r="7"/><circle cx="1113" cy="453" r="7"/><circle cx="1265" cy="386" r="7"/>
          <g class="technical__module" transform={`translate(${Math.round(735 + assemblyProgress * 530)} ${Math.round(616 - assemblyProgress * 230)})`}>
            <rect x="-24" y="-12" width="48" height="24" rx="2" />
            <path d="M-13 12v8m26-8v8" />
          </g>
      </g>
      <g class="technical__status" style={`opacity: ${activeStage === 3 ? Math.max(.7, operationalProgress) : 0}`}>
        <path d="M1090 690h305v118h-305z"/>
        <text x="1115" y="724">ПЛАНИРОВОЧНАЯ ЛЕГЕНДА</text>
        <rect x="1116" y="745" width="12" height="12"/><text x="1138" y="756">ЖИЛАЯ ГРУППА</text>
        <rect x="1248" y="745" width="12" height="12"/><text x="1270" y="756">АБК</text>
        <rect x="1116" y="776" width="12" height="12"/><text x="1138" y="787">ИНЖЕНЕРИЯ</text>
      </g>
    </svg>

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
