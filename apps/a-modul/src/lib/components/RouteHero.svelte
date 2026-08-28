<script lang="ts">
  import type { LandingRoute } from '$lib/content/routes';
  import { trackEvent } from '$lib/analytics';
  import { page } from '$app/state';
  import { diagnosisHref } from '$lib/navigation';

  let { route, regionLabel }: { route: LandingRoute; regionLabel: string } = $props();
</script>

<section class="route-hero" aria-labelledby="hero-title">
  <div class="route-hero__visual">
    <picture>
      <source media="(max-width: 720px)" srcset={`/generated/${route.image}-mobile.avif`} type="image/avif" />
      <source media="(max-width: 720px)" srcset={`/generated/${route.image}-mobile.webp`} type="image/webp" />
      <source srcset={`/generated/${route.image}-desktop.avif`} type="image/avif" />
      <img src={`/generated/${route.image}-desktop.webp`} width="1600" height="900" alt={route.imageAlt} fetchpriority="high" />
    </picture>
    <span class="visualization-label">{route.visualLabel}</span>
  </div>
  <div class="route-hero__copy">
    <p class="eyebrow">{route.eyebrow}</p>
    <h1 id="hero-title">{route.h1}</h1>
    <p class="hero__support">{route.support}</p>
    <div class="hero__actions">
      <div class="hero__primary-action">
        <a class="button button--primary" href={diagnosisHref(page.url, 'standard')} onclick={() => trackEvent('hero_brief_start', { route: route.key })}>Получить КП за 1 рабочий день</a>
        <p class="hero__cta-note">После получения основных исходных данных.</p>
      </div>
      <a class="button button--ghost" href={diagnosisHref(page.url, 'tender')} onclick={() => trackEvent('tender_start', { route: route.key })}>Пригласить в тендер</a>
    </div>
  </div>
</section>
