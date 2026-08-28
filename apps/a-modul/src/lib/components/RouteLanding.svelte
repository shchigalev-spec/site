<script lang="ts">
  import RouteHero from '$lib/components/RouteHero.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import MiniBrief from '$lib/components/MiniBrief.svelte';
  import FullLeadForm from '$lib/components/FullLeadForm.svelte';
  import FaqSection from '$lib/components/FaqSection.svelte';
  import ProposalProcess from '$lib/components/ProposalProcess.svelte';
  import RoutePlanner from '$lib/components/RoutePlanner.svelte';
  import RouteVisualSequence from '$lib/components/RouteVisualSequence.svelte';
  import ShiftLogic from '$lib/components/ShiftLogic.svelte';
  import ObjectConfigurator from '$lib/components/ObjectConfigurator.svelte';
  import ProjectTeam from '$lib/components/ProjectTeam.svelte';
  import ProofCase from '$lib/components/ProofCase.svelte';
  import { evidenceFacts } from '$lib/content/facts';
  import { publicContacts, publicSiteOrigin } from '$lib/content/facts';
  import type { LandingRoute } from '$lib/content/routes';
  import type { ObjectTypeSelection, RegionId } from '$lib/state/projectContext';
  import type { DiagnosisMode } from '$lib/state/projectContext';

  let { data }: { data: {
    route: LandingRoute; canonical: string; robots: string; regionLabel: string;
    initialRegion?: RegionId; initialObjectType: ObjectTypeSelection; typeLabel: string; initialMode: DiagnosisMode; landingVariant: string;
  } } = $props();

  let schema = $derived({
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${publicSiteOrigin}/#organization`, name: 'Ависта Модуль', legalName: 'ООО «Ависта Модуль Инжиниринг»', url: `${publicSiteOrigin}/`, telephone: publicContacts.phoneE164, email: publicContacts.email },
      { '@type': 'ProfessionalService', '@id': `${data.canonical}#service-provider`, name: 'Ависта Модуль', url: data.canonical, parentOrganization: { '@id': `${publicSiteOrigin}/#organization` } },
      { '@type': 'Service', '@id': `${data.canonical}#service`, name: data.route.h1, description: data.route.support, areaServed: { '@type': 'Country', name: 'Россия' }, provider: { '@id': `${publicSiteOrigin}/#organization` } },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Модульные здания', item: `${publicSiteOrigin}/modulnye-zdaniya/` }, { '@type': 'ListItem', position: 2, name: data.route.eyebrow, item: data.canonical }] },
      { '@type': 'FAQPage', mainEntity: data.route.faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }
    ]
  });

  function jsonLdMarkup(value: unknown) {
    return '<script type="application/ld+json">' + JSON.stringify(value).replaceAll('<', '\\u003c') + '</scr' + 'ipt>';
  }
</script>

<svelte:head>
  <title>{data.route.title}</title>
  <meta name="description" content={data.route.description} />
  <meta name="robots" content={data.robots} />
  <link rel="canonical" href={data.canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={data.route.title} />
  <meta property="og:description" content={data.route.description} />
  <meta property="og:url" content={data.canonical} />
  <meta property="og:image" content={`${publicSiteOrigin}/generated/${data.route.ogImage}`} />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={data.route.visualStory.at(-1)?.alt ?? data.route.imageAlt} />
  <meta name="twitter:card" content="summary_large_image" />
  {@html jsonLdMarkup(schema)}
</svelte:head>

<a class="skip-link" href="#main">К основному содержанию</a>
<SiteHeader currentPath={data.route.path} />
<main id="main" tabindex="-1">
  <RouteHero route={data.route} regionLabel={data.regionLabel} />
  <section class="scope-line" aria-label="Зона ответственности Ависты"><span>Проектирование</span><span>Производство</span><span>Инженерия</span><span>Доставка</span><span>Монтаж</span><span>Комплектация</span></section>
  <MiniBrief initialObjectType={data.initialObjectType} initialRegion={data.initialRegion} typeLabel={data.typeLabel} initialMode={data.initialMode} />
  <section class="evidence evidence--compact" aria-labelledby="route-evidence-title">
    <div class="evidence__heading"><p class="eyebrow">Производственный контур</p><h2 id="route-evidence-title">Масштаб, на который можно опереться.</h2><p>Проверенные данные компании; точные параметры предложения зависят от исходных данных проекта.</p></div>
    <div class="evidence__rail">{#each evidenceFacts as fact, index}<article><span>{String(index + 1).padStart(2, '0')}</span><strong>{fact.value}</strong><p>{fact.label}</p></article>{/each}</div>
  </section>
  <RouteVisualSequence items={data.route.visualStory} />
  {#if data.route.key === 'shift'}
    <ShiftLogic />
    <ObjectConfigurator />
    <ProjectTeam />
    <ProofCase mode="seismic" />
  {:else}
    <RoutePlanner kind={data.route.key === 'office' ? 'office' : 'dorm'} />
    <section class="route-case chapter" aria-labelledby="route-case-title">
    <div class="route-case__visual"><picture><source media="(max-width: 720px)" srcset={`/generated/${data.route.caseImage}-mobile.avif`} type="image/avif" /><source media="(max-width: 720px)" srcset={`/generated/${data.route.caseImage}-mobile.webp`} type="image/webp" /><source srcset={`/generated/${data.route.caseImage}-desktop.avif`} type="image/avif" /><img src={`/generated/${data.route.caseImage}-desktop.webp`} width="1600" height="900" alt={data.route.caseImageAlt} loading="lazy" /></picture></div>
    <div class="route-case__copy"><p class="eyebrow">Релевантный контур</p><h2 id="route-case-title">{data.route.caseTitle}</h2><p>{data.route.caseIntro}</p><ul>{#each data.route.caseFacts as fact}<li>{fact}</li>{/each}</ul><a class="button button--ghost" href="#project-brief">Обсудить похожую задачу</a></div>
    </section>
  {/if}
  <FaqSection faq={data.route.faq} />
  <ProposalProcess />
  <FullLeadForm initialObjectType={data.initialObjectType} initialRegion={data.initialRegion} typeLabel={data.typeLabel} initialMode={data.initialMode} />
</main>
<SiteFooter />
