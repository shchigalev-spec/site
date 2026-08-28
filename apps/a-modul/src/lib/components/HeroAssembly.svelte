<script lang="ts">
  import { onMount } from 'svelte';

  let root = $state<HTMLElement>();
  let progress = $state(0);
  let reducedMotion = $state(false);
  let frame = 0;

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
  style={`--assembly-progress:${progress}; --assembly-reveal:${100 - progress * 100}%;`}
  aria-label="Постепенное раскрытие готового модульного объекта по мере прокрутки"
>
  <div class="assembly__viewport">
    <picture class="assembly__base" aria-hidden="true">
      <source media="(max-width: 820px)" type="image/avif" srcset="/generated/a-modul-general-hero-v2-empty-mobile.avif" />
      <source media="(max-width: 820px)" type="image/webp" srcset="/generated/a-modul-general-hero-v2-empty-mobile.webp" />
      <source type="image/avif" srcset="/generated/a-modul-general-hero-v2-empty-desktop.avif" />
      <img src="/generated/a-modul-general-hero-v2-empty-desktop.webp" width="1600" height="900" alt="" fetchpriority="high" />
    </picture>
    <div class="assembly__reveal" aria-hidden="true">
      <picture>
        <source media="(max-width: 820px)" type="image/avif" srcset="/generated/a-modul-general-hero-v2-operational-mobile.avif" />
        <source media="(max-width: 820px)" type="image/webp" srcset="/generated/a-modul-general-hero-v2-operational-mobile.webp" />
        <source type="image/avif" srcset="/generated/a-modul-general-hero-v2-operational-desktop.avif" />
        <img src="/generated/a-modul-general-hero-v2-operational-desktop.webp" width="1600" height="900" alt="" />
      </picture>
      <div class="assembly__structure" aria-hidden="true"><span></span><span></span><span></span><i></i></div>
    </div>
    <div class="assembly__wash" aria-hidden="true"></div>
    <div class="assembly__measure" aria-hidden="true"><span></span><i></i><i></i></div>
  </div>
</figure>
