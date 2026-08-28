<script lang="ts">
  import { onMount } from 'svelte';

  const stages = [
    'a-modul-general-hero-v3-stakeout',
    'a-modul-general-hero-v2-foundations',
    'a-modul-general-hero-v2-assembly',
    'a-modul-general-hero-v2-operational'
  ] as const;

  let root = $state<HTMLElement>();
  let progress = $state(0);
  let reducedMotion = $state(false);
  let frame = 0;

  function smoothstep(value: number) {
    const next = Math.max(0, Math.min(1, value));
    return next * next * (3 - 2 * next);
  }

  let activeStage = $derived(Math.min(3, Math.round(progress * 3)));
  let plateOpacities = $derived.by(() => {
    const position = Math.min(3, progress * 3);
    const segment = Math.min(2, Math.floor(position));
    const blend = smoothstep(position - segment);
    return stages.map((_, index) => {
      if (index === segment) return 1 - blend;
      if (index === segment + 1) return blend;
      return 0;
    });
  });

  function update() {
    frame = 0;
    if (!root) return;
    if (reducedMotion) {
      progress = 1;
      return;
    }
    const story = root.closest<HTMLElement>('.hero');
    if (!story) return;
    const rect = story.getBoundingClientRect();
    const range = Math.max(story.offsetHeight - window.innerHeight, 1);
    progress = Math.max(0, Math.min(1, -rect.top / range));
  }

  function requestUpdate() {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  }

  onMount(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference = () => {
      reducedMotion = preference.matches;
      update();
    };
    syncPreference();
    preference.addEventListener('change', syncPreference);
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    return () => {
      preference.removeEventListener('change', syncPreference);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  });
</script>

<figure
  bind:this={root}
  class="assembly assembly--continuous"
  data-progress={Math.round(progress * 100)}
  data-stage={activeStage}
  aria-label="Четыре стадии запуска модульного объекта плавно сменяются по мере прокрутки"
>
  <div class="assembly__viewport">
    {#each stages as stage, index}
      <picture class="assembly__plate" style={`opacity:${plateOpacities[index]}`} aria-hidden="true">
        <source media="(max-width: 820px)" type="image/avif" srcset={`/generated/${stage}-mobile.avif`} />
        <source media="(max-width: 820px)" type="image/webp" srcset={`/generated/${stage}-mobile.webp`} />
        <source type="image/avif" srcset={`/generated/${stage}-desktop.avif`} />
        <img src={`/generated/${stage}-desktop.webp`} width="1600" height="900" alt="" fetchpriority={index === 0 ? 'high' : 'auto'} />
      </picture>
    {/each}
    <div class="assembly__wash" aria-hidden="true"></div>
  </div>
</figure>
