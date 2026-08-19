<script lang="ts">
  import DiagnosisForm from '$lib/components/DiagnosisForm.svelte';
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Диагностика шума в квартире — Лаборатория тишины</title>
  <meta name="description" content="Опишите шум и приложите план, фото, видео или аудио. Менеджер уточнит задачу и согласует выездную диагностику в Москве." />
  <link rel="canonical" href="/diagnostika-shuma/" />
  <meta property="og:image" content={`${$page.url.origin}/generated/engineering-og.webp`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={`${$page.url.origin}/generated/engineering-og.webp`} />
</svelte:head>

<section class="diagnosis-page">
  <header><div class="section-label">Диагностика шума / Москва</div><h1>Сначала соберём симптомы и ограничения.</h1><p class="lead">Первичная диагностика бесплатна. После заявки менеджер свяжется с вами; следующий коммерческий шаг — выездное обследование.</p></header>
  <DiagnosisForm />
</section>
