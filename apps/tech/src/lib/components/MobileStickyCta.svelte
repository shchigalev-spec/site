<script lang="ts">
  import { onDestroy } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { track } from '$lib/analytics';

  let visible = false;
  let nearForm = false;
  let isHome = false;
  let menuOpen = false;
  let active = false;
  let cleanupPage = () => {};
  $: active = isHome && visible && !nearForm && !menuOpen;

  function bindPage() {
    cleanupPage();
    isHome = window.location.pathname === '/';
    visible = false;
    nearForm = false;
    menuOpen = document.documentElement.hasAttribute('data-menu-open');
    if (!isHome) return;
    const hero = document.querySelector<HTMLElement>('[data-v2-hero]');
    const blockedZones = Array.from(document.querySelectorAll<HTMLElement>('#scenario-v2, #home-short-form'));
    const visibleBlocks = new Set<Element>();
    const update = () => { visible = Boolean(hero && hero.getBoundingClientRect().bottom < window.innerHeight * .22); };
    const formObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleBlocks.add(entry.target);
        else visibleBlocks.delete(entry.target);
      }
      nearForm = visibleBlocks.size > 0;
    }, { rootMargin: '0px 0px 18% 0px', threshold: 0 });
    const menuObserver = new MutationObserver(() => {
      menuOpen = document.documentElement.hasAttribute('data-menu-open');
    });
    blockedZones.forEach((zone) => formObserver.observe(zone));
    menuObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-menu-open'] });
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    cleanupPage = () => {
      formObserver.disconnect();
      menuObserver.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }

  afterNavigate(() => queueMicrotask(bindPage));
  onDestroy(() => cleanupPage());
</script>

{#if isHome}
  <a
    class="mobile-sticky"
    class:visible={active}
    href="#home-short-form"
    aria-hidden={!active}
    tabindex={active ? 0 : -1}
    on:click={() => track('mobile_sticky_cta_click')}
  >Разобрать мой шум</a>
{/if}

<style>
  .mobile-sticky{display:none}
  @media(max-width:767px){
    .mobile-sticky{position:fixed;z-index:70;left:14px;right:14px;bottom:calc(12px + env(safe-area-inset-bottom));display:grid;place-items:center;min-height:54px;padding:13px 18px;border:1px solid rgba(255,255,255,.22);border-radius:14px;background:var(--signal);box-shadow:0 16px 38px rgba(0,0,0,.36);color:var(--ink-950);font-weight:650;opacity:0;transform:translateY(calc(120% + env(safe-area-inset-bottom)));pointer-events:none;transition:opacity 180ms ease,transform 220ms ease}
    .mobile-sticky.visible{opacity:1;transform:translateY(0);pointer-events:auto}
    :global(html[data-menu-open]) .mobile-sticky{opacity:0;pointer-events:none;transform:translateY(calc(120% + env(safe-area-inset-bottom)))}
  }
  @media(prefers-reduced-motion:reduce){.mobile-sticky{transition:none}}
</style>
