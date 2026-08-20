<script lang="ts">
  import { page } from '$app/stores';
  import DiagnosticForm from '$components/DiagnosticForm.svelte';
  import DiagnosisOpeningV2 from '$components/DiagnosisOpeningV2.svelte';
  import { stableSiteUrl } from '$lib/metadata';
  export let form: { success?: boolean; message?: string; reference?: string; issues?: Record<string, string[]>; values?: Record<string, string> } | null;
  $: canonicalUrl = stableSiteUrl($page.url);
  $: structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Диагностика шума в квартире',
    description: 'Первичный разбор симптома, проверка маршрутов передачи на объекте и фиксация границ инженерного решения.',
    areaServed: 'Москва',
    provider: { '@type': 'Organization', name: 'Лаборатория тишины' },
    url: canonicalUrl
  };
</script>

<svelte:head>
  <title>Диагностика шума в квартире — Лаборатория тишины</title>
  <meta name="description" content="Опишите шум, квартиру и стадию ремонта. Можно приложить план, фото, видео или аудио. После заявки менеджер согласует следующий шаг." />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:title" content="Диагностика шума в квартире" />
  <meta property="og:description" content="Сначала найдём источник и путь передачи, затем рассчитаем решение." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={stableSiteUrl($page.url, '/generated/tech-diagnosis.png')} />
  {@html `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`}
</svelte:head>

<section class="diagnostic-route-hero" data-service-family="diagnosis">
  <div class="shell route-grid">
    <div class="route-index"><a href="/" class="mono">← TECH</a><span class="mono">ДИАГНОСТИКА / МОСКВА</span></div>
    <h1 class="display">Сначала симптом.<br />Затем путь.</h1>
    <div class="route-summary"><p class="lead">Бесплатная первичная диагностика помогает собрать контекст. Следующий коммерческий шаг после разговора с менеджером — выездная диагностика.</p><a href="#diagnosis-opening-title" class="button">Как это работает</a></div>
    <div class="signal-rail" aria-hidden="true"><i></i><i></i><i></i><i></i><b></b></div>
  </div>
</section>

<DiagnosisOpeningV2 />
<DiagnosticForm {form} />

<style>
  .diagnostic-route-hero{min-height:76svh;padding:115px 0 76px;background:var(--ink-950);display:flex;align-items:end;overflow:hidden}.route-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:24px;align-items:end}.route-index{grid-column:1/-1;align-self:start;display:flex;justify-content:space-between;color:var(--white-48);margin-bottom:clamp(60px,8vw,120px)}h1{grid-column:1/10;margin:0;font-size:clamp(4rem,8vw,9.4rem);line-height:.84}.route-summary{grid-column:8/-1;display:grid;gap:26px}.lead{color:var(--white-64)}.signal-rail{grid-column:1/-1;position:relative;height:42px;margin-top:55px;border-bottom:1px solid var(--white-16)}.signal-rail i{position:absolute;bottom:-5px;width:10px;height:10px;border:1px solid var(--acoustic);border-radius:50%}.signal-rail i:nth-child(1){left:0}.signal-rail i:nth-child(2){left:33%}.signal-rail i:nth-child(3){left:66%}.signal-rail i:nth-child(4){right:0}.signal-rail b{position:absolute;left:0;bottom:-1px;width:100%;height:2px;background:linear-gradient(90deg,var(--signal),var(--acoustic),transparent);transform-origin:left;animation:diagnosis-line .9s cubic-bezier(.2,.8,.2,1) both}@keyframes diagnosis-line{from{transform:scaleX(0)}to{transform:scaleX(1)}}@media(prefers-reduced-motion:reduce){.signal-rail b{animation:none}}@media(max-width:767px){.diagnostic-route-hero{min-height:84svh;padding-top:104px}.route-grid{display:block}.route-index{margin-bottom:66px}.route-index span{display:none}h1{font-size:clamp(3.5rem,17vw,6rem)}.route-summary{margin-top:36px}.route-summary .button{width:100%}.signal-rail{margin-top:52px}}
</style>
