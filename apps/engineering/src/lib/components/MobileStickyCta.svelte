<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { track } from '$lib/analytics';
  import { buildDiagnosisHref } from '$lib/diagnosis-link';

  let leftHero = false;
  let nearFinal = false;
  let nearInteractive = false;
  let menuOpen = false;
  let mobile = false;
  $: diagnosisHref = buildDiagnosisHref($page.url, 'mobile_sticky');

  $: visible = mobile && leftHero && !nearFinal && !nearInteractive && !menuOpen;

  onMount(() => {
    const query = matchMedia('(max-width: 800px)');
    const updateMobile = () => (mobile = query.matches);
    updateMobile();
    query.addEventListener('change', updateMobile);

    const hero = document.querySelector('#hero');
    const finalForm = document.querySelector('#diagnosis');
    const scenario = document.querySelector('#brief');
    const heroObserver = hero ? new IntersectionObserver(([entry]) => (leftHero = !entry.isIntersecting), { threshold: 0.05 }) : null;
    const finalObserver = finalForm ? new IntersectionObserver(([entry]) => (nearFinal = entry.isIntersecting), { rootMargin: '160px 0px 220px', threshold: 0 }) : null;
    const scenarioObserver = scenario ? new IntersectionObserver(([entry]) => (nearInteractive = entry.isIntersecting), { rootMargin: '80px 0px 80px', threshold: 0 }) : null;
    if (hero) heroObserver?.observe(hero);
    if (finalForm) finalObserver?.observe(finalForm);
    if (scenario) scenarioObserver?.observe(scenario);

    const onMenu = (event: Event) => (menuOpen = (event as CustomEvent<{ open: boolean }>).detail.open);
    window.addEventListener('engineering:menu-state', onMenu);
    return () => {
      query.removeEventListener('change', updateMobile);
      heroObserver?.disconnect();
      finalObserver?.disconnect();
      scenarioObserver?.disconnect();
      window.removeEventListener('engineering:menu-state', onMenu);
    };
  });
</script>

{#if visible}
  <a class="mobile-sticky-cta" href={diagnosisHref} on:click={() => track('mobile_sticky_cta_click', { source: 'homepage' })}>
    <span>Разобрать мой шум</span><b aria-hidden="true">→</b>
  </a>
{/if}

<style>
  .mobile-sticky-cta { position: fixed; z-index: 28; left: 0.8rem; right: 0.8rem; bottom: calc(0.75rem + env(safe-area-inset-bottom)); display: none; align-items: center; justify-content: space-between; min-height: 54px; padding: 0.8rem 1rem; border: 1px solid rgba(251, 250, 246, 0.3); background: #151915; color: #fbfaf6; text-decoration: none; box-shadow: 0 12px 32px rgba(21, 25, 21, 0.24); }
  .mobile-sticky-cta b { color: #efb8a8; font-size: 1.4rem; }
  @media (max-width: 800px) { .mobile-sticky-cta { display: flex; } }
  @media (prefers-reduced-motion: reduce) { .mobile-sticky-cta { scroll-behavior: auto; } }
</style>
