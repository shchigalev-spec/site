<script lang="ts">
  import { page } from '$app/stores';
  import DiagnosticForm from '$components/DiagnosticForm.svelte';
  export let form: { success?: boolean; message?: string; reference?: string; issues?: Record<string, string[]> } | null;
</script>

<svelte:head>
  <title>Диагностика шума в квартире — Лаборатория тишины</title>
  <meta name="description" content="Опишите шум, квартиру и стадию ремонта. Можно приложить план, фото, видео или аудио. После заявки менеджер согласует следующий шаг." />
  <link rel="canonical" href={$page.url.origin + $page.url.pathname} />
  <meta property="og:title" content="Диагностика шума в квартире" />
  <meta property="og:description" content="Сначала найдём источник и путь передачи, затем рассчитаем решение." />
  <meta property="og:url" content={$page.url.href} />
  <meta property="og:image" content={$page.url.origin + '/generated/tech-diagnosis.png'} />
</svelte:head>

<section class="diagnostic-route-hero">
  <picture class="diagnostic-visual">
    <source media="(max-width: 960px)" srcset="/generated/tech-diagnosis-960.webp" type="image/webp" />
    <source srcset="/generated/tech-diagnosis.webp" type="image/webp" />
    <img src="/generated/tech-diagnosis.png" alt="Инженер проводит акустическое измерение в жилой комнате" width="1672" height="941" />
  </picture>
  <div class="route-shade"></div>
  <div class="shell route-grid">
    <p class="mono">ДИАГНОСТИКА ШУМА / МОСКВА</p>
    <h1 class="display">Сначала симптом. Затем путь.</h1>
    <p class="lead">Бесплатная первичная диагностика помогает собрать контекст. Следующий коммерческий шаг после разговора с менеджером — выездная диагностика.</p>
    <a href="#diagnostic-form" class="button">Описать проблему</a>
  </div>
</section>

<DiagnosticForm {form} />

<style>
  .diagnostic-route-hero{position:relative;min-height:90svh;display:flex;align-items:end;overflow:hidden;isolation:isolate}.diagnostic-visual{position:absolute;inset:0;z-index:-3}.diagnostic-visual img{width:100%;height:100%;object-fit:cover;filter:brightness(.52) saturate(.72)}.route-shade{position:absolute;inset:0;z-index:-2;background:linear-gradient(0deg,var(--ink-900),transparent 70%),linear-gradient(90deg,rgba(7,9,8,.75),transparent 65%)}.route-grid{display:grid;grid-template-columns:repeat(16,1fr);gap:24px;align-items:end;padding-bottom:80px}.route-grid>.mono{grid-column:1/5;color:var(--acoustic)}h1{grid-column:1/13;margin:20px 0 0;font-size:clamp(4rem,8vw,9rem)}.lead{grid-column:2/9;margin:28px 0 0}.button{grid-column:12/-1}@media(max-width:767px){.route-grid{display:block}.button{margin-top:30px}.diagnostic-visual img{object-position:65% center}}
</style>
