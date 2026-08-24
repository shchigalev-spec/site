<script lang="ts">
  import { page } from '$app/stores';
  import AcousticHeroV2 from '$components/AcousticHeroV2.svelte';
  import ProofStrip from '$components/ProofStrip.svelte';
  import DeferredChapter from '$components/DeferredChapter.svelte';
  import { stableSiteUrl } from '$lib/metadata';

  export let form: {
    success?: boolean;
    message?: string;
    reference?: string;
    issues?: Record<string, string[]>;
    values?: Record<string, string>;
  } | null;
  $: canonicalUrl = stableSiteUrl($page.url, '/');
</script>

<svelte:head>
  <title>Шумоизоляция квартиры в Москве — Лаборатория тишины</title>
  <meta name="description" content="Сначала найдём, как шум попадает в комнату. Затем рассчитаем инженерное решение по шумоизоляции квартиры и смонтируем своей бригадой." />
  <link rel="canonical" href={canonicalUrl} />
  <meta property="og:title" content="Лаборатория тишины — сначала найдём путь шума" />
  <meta property="og:description" content="Инженерная шумоизоляция квартир и домов в Москве: диагностика, проектирование, монтаж и проверка результата." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={stableSiteUrl($page.url, '/generated/tech-og.png')} />
</svelte:head>

<div class="home-page">
  <AcousticHeroV2 />
  <ProofStrip />
  <DeferredChapter chapter="path" anchor="noise-path-lab" rootMargin="200px 0px" loader={() => import('$components/NoisePathLab.svelte')} />
  <DeferredChapter chapter="construction" anchor="construction" rootMargin="300px 0px" loader={() => import('$components/DiagnosisToConstruction.svelte')} />
  <DeferredChapter chapter="renovation" anchor="renovation-morph" rootMargin="500px 0px" loader={() => import('$components/RenovationMorphV2.svelte')} />
  <DeferredChapter chapter="measured" anchor="cases" loader={() => import('$components/MeasuredEvidenceV2.svelte')} />
  <DeferredChapter chapter="scenario" anchor="scenario-v2" loader={() => import('$components/ScenarioLabV2.svelte')} />
  <DeferredChapter chapter="quality" loader={() => import('$components/QualityFaq.svelte')} />
  <DeferredChapter chapter="conversion" anchor="home-short-form" loader={() => import('$components/ShortDiagnosticForm.svelte')} props={{ form }} />
</div>
