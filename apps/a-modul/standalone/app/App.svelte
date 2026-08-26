<script lang="ts">
  import HeroAssembly from '$lib/components/HeroAssembly.svelte';
  import MiniBrief from '$lib/components/MiniBrief.svelte';
  import ObjectConfigurator from '$lib/components/ObjectConfigurator.svelte';
  import RiskChain from '$lib/components/RiskChain.svelte';
  import RouteVisualSequence from '$lib/components/RouteVisualSequence.svelte';
  import LogisticsMap from '$lib/components/LogisticsMap.svelte';
  import ProjectFinder from '$lib/components/ProjectFinder.svelte';
  import BimSequence from '$lib/components/BimSequence.svelte';
  import FactorySequence from '$lib/components/FactorySequence.svelte';
  import PriceScope from '$lib/components/PriceScope.svelte';
  import ProofCase from '$lib/components/ProofCase.svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import FullLeadForm from '$lib/components/FullLeadForm.svelte';
  import FaqSection from '$lib/components/FaqSection.svelte';
  import ProposalProcess from '$lib/components/ProposalProcess.svelte';
  import Analytics from '$lib/components/Analytics.svelte';
  import { trackEvent } from '$lib/analytics';
  import { page } from '$app/state';
  import { diagnosisHref } from '$lib/navigation';
  import { evidenceFacts } from '$lib/content/facts';
  import { resolveLandingData } from '$lib/content/routes';

  const data = resolveLandingData('general', new URL('https://offline.local/modulnye-zdaniya/'));
</script>

<a class="skip-link" href="#main">К основному содержанию</a>

<SiteHeader currentPath={data.route.path} />

<main id="main" tabindex="-1">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__copy">
      <p class="eyebrow">{data.route.eyebrow}</p>
      <h1 id="hero-title">{data.route.h1}</h1>
      <p class="hero__support">{data.route.support}</p>
      <div class="hero__actions">
        <div class="hero__primary-action">
          <a class="button button--primary" href={diagnosisHref(page.url, 'standard')} onclick={() => trackEvent('hero_brief_start', { route: 'general' })}>Получить КП за 1 рабочий день</a>
          <p class="hero__cta-note">После получения основных исходных данных.</p>
        </div>
        <a class="button button--ghost" href={diagnosisHref(page.url, 'tender')} onclick={() => trackEvent('tender_start', { route: 'general' })}>Пригласить в тендер</a>
      </div>
      <div class="hero__context">
        <span>Регион проекта</span>
        <strong>{data.regionLabel}</strong>
      </div>
    </div>

    <div id="assembly" class="hero__visual">
      <HeroAssembly />
    </div>
  </section>

  <section class="scope-line" aria-label="Зона ответственности Ависты">
    <span>Проектирование</span>
    <span>Производство</span>
    <span>Инженерия</span>
    <span>Доставка</span>
    <span>Монтаж</span>
    <span>Комплектация</span>
  </section>

  <MiniBrief initialObjectType={data.initialObjectType} initialRegion={data.initialRegion} typeLabel={data.typeLabel} initialMode={data.initialMode} />

  <section class="evidence" id="evidence" aria-labelledby="evidence-title">
    <div class="evidence__heading">
      <p class="eyebrow">Производственный контур</p>
      <h2 id="evidence-title">Масштаб, на который можно опереться.</h2>
      <p>Данные собраны с официальных страниц «Ависта Модуль» и закреплены в реестре источников.</p>
    </div>
    <div class="evidence__rail">
      {#each evidenceFacts as fact, index}
        <article>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{fact.value}</strong>
          <p>{fact.label}</p>
        </article>
      {/each}
    </div>
  </section>

  <RouteVisualSequence items={data.route.visualStory} />

  <ObjectConfigurator />
  <RiskChain />
  <LogisticsMap />
  <ProjectFinder />
  <BimSequence />
  <FactorySequence />
  <PriceScope />
  <ProofCase />
  <FaqSection faq={data.route.faq} />
  <ProposalProcess />
  <FullLeadForm initialObjectType={data.initialObjectType} initialRegion={data.initialRegion} typeLabel={data.typeLabel} initialMode={data.initialMode} />

  <section class="milestone-boundary" aria-label="Следующий раздел проекта">
    <p class="eyebrow">Следующий инженерный шаг</p>
    <p>Зафиксируем исходные данные, найдём аналог и подготовим предварительный контур коммерческого предложения.</p>
    <a class="button button--light" href="#full-brief">Передать исходные данные</a>
  </section>
</main>

<SiteFooter />
<Analytics />
