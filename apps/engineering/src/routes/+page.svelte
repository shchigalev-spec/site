<script lang="ts">
  import HeroV2 from '$lib/components/HeroV2.svelte';
  import SymptomPathV2 from '$lib/components/SymptomPathV2.svelte';
  import RenovationStagesV2 from '$lib/components/RenovationStagesV2.svelte';
  import MethodConstructionV2 from '$lib/components/MethodConstructionV2.svelte';
  import CasesV2 from '$lib/components/CasesV2.svelte';
  import ScenarioBuilder from '$lib/components/ScenarioBuilder.svelte';
  import ShortLeadForm from '$lib/components/ShortLeadForm.svelte';
  import MobileStickyCta from '$lib/components/MobileStickyCta.svelte';
  import { faqs } from '$lib/content';
  import { track } from '$lib/analytics';
  import { page } from '$app/stores';
  import { buildDiagnosisHref } from '$lib/diagnosis-link';

  let openFaq = -1;
  const faqHref = (href: string, index: number) => href.startsWith('/diagnostika-shuma/')
    ? buildDiagnosisHref($page.url, `faq_${index + 1}`)
    : href;

  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Лаборатория тишины',
    areaServed: { '@type': 'City', name: 'Москва' },
    description: 'Инженерная шумоизоляция квартир и домов: диагностика пути шума, проект, монтаж и проверка результата.',
    serviceType: 'Шумоизоляция квартир и диагностика шума'
  });

</script>

<svelte:head>
  <title>Шумоизоляция квартиры в Москве — Лаборатория тишины</title>
  <meta name="description" content="Сначала найдём причину шума, потом спроектируем решение. Диагностика, проект, собственная бригада, монтаж и проверка результата в Москве." />
  <link rel="canonical" href="/" />
  <meta property="og:title" content="Лаборатория тишины — сначала диагностика" />
  <meta property="og:description" content="Инженерная шумоизоляция квартир: от поиска пути шума до монтажа и проверки результата." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={`${$page.url.origin}/generated/engineering-og.webp`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={`${$page.url.origin}/generated/engineering-og.webp`} />
  <link rel="preload" as="image" href="/generated/engineering-v2-hero-mobile-clean.webp" type="image/webp" media="(max-width: 767px)" />
  <link rel="preload" as="image" href="/generated/engineering-v2-hero-clean.webp" type="image/webp" media="(min-width: 768px)" />
  {@html `<script type="application/ld+json">${structuredData}</script>`}
</svelte:head>

<HeroV2 />
<MobileStickyCta />

<section class="evidence-band" aria-label="Ключевые факты">
  <div><strong>15 лет</strong><span>работаем с шумом и вибрацией</span></div>
  <div><strong>Сначала диагноз</strong><span>потом конструкция и расчёт</span></div>
  <div><strong>Своя бригада</strong><span>ответственность за монтаж</span></div>
  <div><strong>До и после</strong><span>проверка результата</span></div>
</section>

<SymptomPathV2 />

<RenovationStagesV2 />

<MethodConstructionV2 />

<CasesV2 />

<ScenarioBuilder />

<div class="final-conversion" data-chapter="07 · FAQ + диагностика">
  <section class="faq-section" id="faq">
    <div class="faq-heading"><div class="section-label">07 / Короткие ответы</div><h2>До обследования важно знать границы.</h2></div>
    <div class="faq-list">
      {#each faqs as item, index}
        <div class:open={openFaq === index} class="faq-item">
          <button type="button" aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} on:click={() => { openFaq = openFaq === index ? -1 : index; if (openFaq === index) track('faq_open', { question: index }); }}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.question}</strong><i aria-hidden="true">{openFaq === index ? '−' : '+'}</i></button>
          <div class="faq-answer" id={`faq-answer-${index}`} hidden={openFaq !== index}><p>{item.answer}</p><a href={faqHref(item.href, index)} on:click={() => { if (item.href.startsWith('/diagnostika-shuma/')) track('diagnostic_start', { source: 'faq', question: index }); }}>{item.link} →</a></div>
        </div>
      {/each}
    </div>
  </section>

  <section class="application-section" id="diagnosis">
    <header class="application-heading">
      <div class="section-label">07.2 / Первый контакт</div>
      <h2>Начните с короткой заявки.</h2>
      <p class="lead">Основной шум, этап квартиры и контакт. План можно добавить после этих полей — или перейти к полному инженерному брифу.</p>
    </header>
    <ShortLeadForm />
  </section>
</div>
