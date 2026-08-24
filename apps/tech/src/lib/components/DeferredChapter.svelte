<script lang="ts">
  import { onMount } from 'svelte';

  export let loader: () => Promise<{ default: unknown }>;
  export let chapter: 'path' | 'construction' | 'renovation' | 'measured' | 'scenario' | 'quality' | 'conversion';
  export let anchor: string | undefined = undefined;
  export let props: Record<string, unknown> = {};
  export let rootMargin = '900px 0px';

  let host: HTMLElement;
  let Loaded: any = null;
  let loading = false;

  async function activate() {
    if (Loaded || loading) return;
    loading = true;
    const module = await loader();
    Loaded = module.default;
  }

  onMount(() => {
    if (!('IntersectionObserver' in window)) {
      void activate();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      void activate();
    }, { rootMargin, threshold: 0 });

    observer.observe(host);
    if (anchor && window.location.hash === `#${anchor}`) void activate();
    return () => observer.disconnect();
  });
</script>

<div
  bind:this={host}
  id={anchor}
  class="deferred-chapter"
  class:ready={Boolean(Loaded)}
  data-deferred-chapter={chapter}
  aria-busy={loading && !Loaded}
>
  {#if Loaded}
    <svelte:component this={Loaded} {...props} />
  {:else}
    <div class="chapter-placeholder" aria-hidden="true"></div>
  {/if}
</div>

<style>
  .deferred-chapter { min-height: var(--deferred-height); }
  .deferred-chapter[data-deferred-chapter='path'] { --deferred-height: 1183px; }
  .deferred-chapter[data-deferred-chapter='construction'] { --deferred-height: 1574px; }
  .deferred-chapter[data-deferred-chapter='renovation'] { --deferred-height: 1800px; }
  .deferred-chapter[data-deferred-chapter='measured'] { --deferred-height: 2800px; }
  .deferred-chapter[data-deferred-chapter='scenario'] { --deferred-height: 1200px; }
  .deferred-chapter[data-deferred-chapter='quality'] { --deferred-height: 2300px; }
  .deferred-chapter[data-deferred-chapter='conversion'] { --deferred-height: 1700px; }
  .deferred-chapter.ready { min-height: 0; }
  .chapter-placeholder { min-height: inherit; background: var(--ink-950); }
  @media (max-width: 767px) {
    .deferred-chapter[data-deferred-chapter='path'] { --deferred-height: 1463px; }
    .deferred-chapter[data-deferred-chapter='construction'] { --deferred-height: 1408px; }
    .deferred-chapter[data-deferred-chapter='renovation'] { --deferred-height: 1390px; }
    .deferred-chapter[data-deferred-chapter='measured'] { --deferred-height: 3400px; }
    .deferred-chapter[data-deferred-chapter='scenario'] { --deferred-height: 1750px; }
    .deferred-chapter[data-deferred-chapter='quality'] { --deferred-height: 2700px; }
    .deferred-chapter[data-deferred-chapter='conversion'] { --deferred-height: 2200px; }
  }
</style>
