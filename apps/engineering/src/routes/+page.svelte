<script lang="ts">
  import { onMount } from 'svelte';
  import ImageFrame from '$lib/components/ImageFrame.svelte';
  import PathDiagram from '$lib/components/PathDiagram.svelte';
  import LayerDetail from '$lib/components/LayerDetail.svelte';
  import CaseGraph from '$lib/components/CaseGraph.svelte';
  import ScenarioBuilder from '$lib/components/ScenarioBuilder.svelte';
  import DiagnosisForm from '$lib/components/DiagnosisForm.svelte';
  import { noises, renovationStages, cases, faqs } from '$lib/content';
  import { track } from '$lib/analytics';
  import { page } from '$app/stores';

  let hero: HTMLElement;
  let heroProgress = 0;
  let activeNoise = 0;
  let openFaq = 0;
  let cutawayMissing = false;

  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Лаборатория тишины',
    areaServed: { '@type': 'City', name: 'Москва' },
    description: 'Инженерная шумоизоляция квартир и домов: диагностика пути шума, проект, монтаж и проверка результата.',
    serviceType: 'Шумоизоляция квартир и диагностика шума'
  });

  $: selectedNoise = noises[activeNoise];

  function setNoise(index: number) {
    activeNoise = index;
    track('noise_selected', { noise: noises[index].id, source: 'editorial_index' });
  }

  function onNoiseKey(event: KeyboardEvent, index: number) {
    if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(event.key)) return;
    event.preventDefault();
    const delta = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;
    const next = (index + delta + noises.length) % noises.length;
    setNoise(next);
    (document.querySelector(`[data-noise-index="${next}"]`) as HTMLButtonElement)?.focus();
  }

  onMount(() => {
    const update = () => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const range = Math.max(hero.offsetHeight - window.innerHeight, 1);
      heroProgress = Math.max(0, Math.min(1, -rect.top / range));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
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
  <link rel="preload" as="image" href="/generated/engineering-style-anchor-960.webp" type="image/webp" media="(max-width: 767px)" />
  <link rel="preload" as="image" href="/generated/engineering-style-anchor.webp" type="image/webp" media="(min-width: 768px)" />
  <script type="application/ld+json">{structuredData}</script>
</svelte:head>

<section class="hero-scroll" bind:this={hero} style={`--hero-progress:${heroProgress}`}>
  <div class="hero-sticky">
    <div class="hero-image" aria-hidden="true">
      <picture>
        <source media="(max-width: 767px)" type="image/webp" srcset="/generated/engineering-style-anchor-960.webp" />
        <source type="image/webp" srcset="/generated/engineering-style-anchor.webp" />
        <img src="/generated/engineering-style-anchor.png" alt="" fetchpriority="high" />
      </picture>
      <div class="hero-cutaway" class:fallback={cutawayMissing}>
        {#if !cutawayMissing}
          <picture>
            <source media="(max-width: 767px)" type="image/webp" srcset="/generated/engineering-hero-cutaway-960.webp" />
            <source type="image/webp" srcset="/generated/engineering-hero-cutaway.webp" />
            <img src="/generated/engineering-hero-cutaway.png" alt="" on:error={() => (cutawayMissing = true)} />
          </picture>
        {/if}
        <div class="cutaway-structure"><span></span><span></span><span></span><i></i></div>
      </div>
      <div class="hero-paper-wash"></div>
    </div>
    <div class="hero-copy">
      <span class="hero-index">АКУСТИЧЕСКОЕ ОБСЛЕДОВАНИЕ / 01</span>
      <h1>Сначала найдём причину шума. Потом спроектируем тишину.</h1>
      <p>Диагностика, проект, собственная бригада, монтаж и проверка результата в Москве.</p>
      <a class="primary-button hero-button" href="/diagnostika-shuma/" on:click={() => track('hero_cta_click')}>Записаться на бесплатную диагностику</a>
      <a class="text-link hero-secondary" href="#symptoms">Сначала описать проблему</a>
    </div>
    <div class="hero-measure" aria-hidden="true">
      <span class="measure-line"></span><i class="tick tick-a"></i><i class="tick tick-b"></i>
      <em>наблюдаемая поверхность</em>
    </div>
    <div class="hero-route" aria-hidden="true"><span></span><i></i></div>
    <div class="hero-conclusion">Не назначаем конструкцию,<br />пока не понимаем путь передачи.</div>
  </div>
</section>

<section class="evidence-band" aria-label="Ключевые факты">
  <div><strong>15 лет</strong><span>работаем с шумом и вибрацией</span></div>
  <div><strong>Сначала диагноз</strong><span>потом конструкция и расчёт</span></div>
  <div><strong>Своя бригада</strong><span>ответственность за монтаж</span></div>
  <div><strong>До и после</strong><span>проверка результата</span></div>
</section>

<section class="symptom-section" id="symptoms">
  <header class="symptom-heading">
    <div class="section-label">03 / Симптом</div>
    <h2>Что именно<br />вы слышите?</h2>
    <p>Выбор помогает собрать гипотезы. Он не заменяет диагностику в квартире.</p>
  </header>
  <div class="symptom-index" role="tablist" aria-label="Тип шума">
    {#each noises as noise, index}
      <button
        type="button"
        role="tab"
        data-noise-index={index}
        aria-selected={activeNoise === index}
        tabindex={activeNoise === index ? 0 : -1}
        on:click={() => setNoise(index)}
        on:keydown={(event) => onNoiseKey(event, index)}
      >
        <span>{String(index + 1).padStart(2, '0')}</span><strong>{noise.title}</strong><em>{noise.share}</em>
      </button>
    {/each}
  </div>
  <div class="symptom-visual" role="tabpanel">
    <PathDiagram noise={selectedNoise} compact />
  </div>
  <aside class="symptom-note">
    <span>Проверить</span>
    <ul>{#each selectedNoise.inspect as item}<li>{item}</li>{/each}</ul>
    <a class="text-link" href={`/diagnostika-shuma/?noise=${encodeURIComponent(selectedNoise.title)}`}>Описать этот шум</a>
  </aside>
</section>

<section class="renovation-section" id="stages">
  <div class="section-intro offset-intro">
    <div class="section-label">04 / Этап ремонта</div>
    <h2>Ремонт задаёт границы решения.</h2>
    <p class="lead">Один и тот же симптом требует разного планирования до отделки, во время работ и в готовой квартире.</p>
  </div>
  {#each renovationStages as stage, index}
    <article class={`stage-spread stage-${index + 1}`}>
      <div class="stage-image">
        <ImageFrame src={stage.image} alt={stage.fallback} fallback={stage.fallback} position={index === 1 ? '50% 42%' : 'center'} />
        <span class="image-caption">Иллюстративная архитектурная визуализация</span>
      </div>
      <div class="stage-copy">
        <span>{stage.eyebrow}</span>
        <h3>{stage.title}</h3>
        <p>{stage.text}</p>
        <a class="text-link" href={`/diagnostika-shuma/?stage=${encodeURIComponent(stage.id)}`} on:click={() => track('renovation_stage_selected', { stage: stage.id, source: 'spread' })}>Обсудить этот этап</a>
      </div>
    </article>
  {/each}
</section>

<section class="transmission-section" id="path">
  <div class="transmission-head">
    <div class="section-label">05 / Путь передачи</div>
    <h2>Шум выбирает путь, а не очевидную поверхность.</h2>
  </div>
  <div class="transmission-controls" role="tablist" aria-label="Путь для типа шума">
    {#each noises as noise, index}<button type="button" class:active={activeNoise === index} on:click={() => { setNoise(index); track('path_selected', { noise: noise.id }); }}>{noise.short}</button>{/each}
  </div>
  <div class="transmission-drawing"><PathDiagram noise={selectedNoise} /></div>
  <aside class="transmission-caption">
    <span>Выбранный маршрут</span>
    <p>{selectedNoise.mechanism}</p>
    <strong>Проектируем не поверхность, а путь передачи и его примыкания.</strong>
    <a class="primary-button" href={`/diagnostika-shuma/?noise=${encodeURIComponent(selectedNoise.title)}`}>Проверить путь в моей квартире</a>
  </aside>
</section>

<section class="method-section" id="method">
  <div class="method-heading">
    <div class="section-label">06 / Метод</div>
    <h2>Сначала диагноз, потом смета.</h2>
    <p class="lead">Прайс за м² до диагноза создаёт ложную точность.</p>
  </div>
  <ol class="method-datum">
    <li><span>01</span><div><h3>Фиксируем симптом</h3><p>Что слышно, где и когда — формулируем задачу без преждевременного выбора материала.</p></div></li>
    <li><span>02</span><div><h3>Ищем источник и путь</h3><p>Сравниваем прямой и обходные маршруты, проверяем реальные примыкания.</p></div></li>
    <li><span>03</span><div><h3>Проектируем конструкцию</h3><p>Учитываем задачу, здание, этап ремонта и физические ограничения помещения.</p></div></li>
    <li><span>04</span><div><h3>Считаем объём и бюджет</h3><p>Только после того, как существенные неизвестные уменьшены.</p></div></li>
    <li><span>05</span><div><h3>Монтируем своей бригадой</h3><p>Контролируем технологию, критические узлы и фиксируем скрытые работы.</p></div></li>
    <li><span>06</span><div><h3>Проверяем результат</h3><p>Критерии приёмки согласуются до начала работ; измерения входят в путь клиента.</p></div></li>
  </ol>
</section>

<section class="construction-section" id="construction">
  <header>
    <div class="section-label">07 / Конструкция</div>
    <h2>Работает не слой. Работает узел целиком.</h2>
    <p class="lead">Конструкция выбирается для задачи, здания, этапа ремонта и ограничений — без привязки к одному производителю.</p>
  </header>
  <LayerDetail />
  <div class="quality-rail">
    <div class="quality-image"><ImageFrame src="/generated/engineering-stage-renovation.png" alt="Узел шумоизоляционной конструкции до закрытия отделкой" fallback="Узел до закрытия отделкой" /></div>
    <ol>
      <li><span>01</span><strong>Основание и маршрут</strong><p>До монтажа проверяем, с какой конструкцией и примыканиями работаем.</p></li>
      <li><span>02</span><strong>Развязка</strong><p>Контролируем связи, которые могут стать обходным путём.</p></li>
      <li><span>03</span><strong>Герметизация и проходки</strong><p>Малые узлы проверяются до того, как станут скрытыми.</p></li>
      <li><span>04</span><strong>Фиксация до закрытия</strong><p>Фиксируем скрытые работы. Условия гарантии — в договоре.</p></li>
    </ol>
  </div>
</section>

<section class="cases-section" id="results">
  <div class="cases-heading"><div class="section-label">08 / Измеренные результаты</div><h2>Три результата.<br />Без выдуманного контекста.</h2></div>
  {#each cases as item, index}
    <article class={`case-report case-${index + 1}`}>
      <div class="case-copy">
        <span>{item.eyebrow}</span><h3>{item.title}</h3><p>{item.description}</p><small>Иллюстративная визуализация, не фотография объекта заказчика.</small>
        <a class="text-link" href={`/cases/${item.slug}/`} on:click={() => track('case_open', { case: item.slug })}>Открыть отчёт</a>
      </div>
      <div class="case-visual">
        <ImageFrame src={item.image} alt={`Иллюстративный интерьер к результату ${item.title}`} fallback={`Результат ${item.title}`} />
        <CaseGraph {item} />
      </div>
    </article>
  {/each}
</section>

<ScenarioBuilder />

<section class="faq-section" id="faq">
  <div class="faq-heading"><div class="section-label">10 / Честные ограничения</div><h2>Что важно знать до обследования.</h2></div>
  <div class="faq-list">
    {#each faqs as item, index}
      <div class:open={openFaq === index} class="faq-item">
        <button type="button" aria-expanded={openFaq === index} on:click={() => { openFaq = openFaq === index ? -1 : index; if (openFaq === index) track('faq_open', { question: index }); }}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item[0]}</strong><i>{openFaq === index ? '−' : '+'}</i></button>
        {#if openFaq === index}<div class="faq-answer"><p>{item[1]}</p></div>{/if}
      </div>
    {/each}
  </div>
</section>

<section class="application-section" id="diagnosis">
  <header class="application-heading">
    <div class="section-label">11 / Заявка на диагностику</div>
    <h2>Опишите задачу. Мы начнём с вопросов, а не с прайса.</h2>
    <p class="lead">Можно приложить план, фотографии, видео или запись шума. Это необязательно.</p>
  </header>
  <DiagnosisForm />
</section>

<section class="quiet-close">
  <div class="quiet-image"><ImageFrame src="/generated/engineering-final-consultation.png" alt="Стол с планом квартиры перед инженерной консультацией" fallback="Подготовка к диагностике" /></div>
  <div><div class="section-label">12 / Следующий шаг</div><h2>Тишина начинается не с материала, а с правильно поставленной задачи.</h2><a class="primary-button" href="/diagnostika-shuma/">Записаться на бесплатную диагностику</a></div>
</section>
