<script lang="ts">
  import { page } from '$app/stores';
  import HeroScan from '$components/HeroScan.svelte';
  import NoiseDeck from '$components/NoiseDeck.svelte';
  import ApartmentXray from '$components/ApartmentXray.svelte';
  import ProcessBridge from '$components/ProcessBridge.svelte';
  import EngineeringAssembly from '$components/EngineeringAssembly.svelte';
  import RenovationStages from '$components/RenovationStages.svelte';
  import MeasurementCases from '$components/MeasurementCases.svelte';
  import ScenarioLab from '$components/ScenarioLab.svelte';
  import QualityFaq from '$components/QualityFaq.svelte';
  import DiagnosticForm from '$components/DiagnosticForm.svelte';

  export let form: {
    success?: boolean;
    message?: string;
    reference?: string;
    issues?: Record<string, string[]>;
  } | null;
</script>

<svelte:head>
  <title>Шумоизоляция квартиры в Москве — Лаборатория тишины</title>
  <meta name="description" content="Сначала найдём, как шум попадает в комнату. Затем рассчитаем инженерное решение по шумоизоляции квартиры и смонтируем своей бригадой." />
  <link rel="canonical" href={$page.url.origin + '/'} />
  <meta property="og:title" content="Лаборатория тишины — сначала найдём путь шума" />
  <meta property="og:description" content="Инженерная шумоизоляция квартир и домов в Москве: диагностика, проектирование, монтаж и проверка результата." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={$page.url.origin + '/'} />
  <meta property="og:image" content={$page.url.origin + '/generated/tech-og.png'} />
</svelte:head>

<HeroScan />
<NoiseDeck />
<ApartmentXray />
<ProcessBridge />
<EngineeringAssembly />
<RenovationStages />
<MeasurementCases />
<ScenarioLab />
<QualityFaq />
<DiagnosticForm {form} />
