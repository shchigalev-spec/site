<script lang="ts">
  import DiagnosisForm from '$lib/components/DiagnosisForm.svelte';
  import ImageFrame from '$lib/components/ImageFrame.svelte';
  import { page } from '$app/stores';

  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Диагностика шума в квартире',
    description: 'Первичный инженерный бриф и согласование выездной диагностики шума в квартире в Москве.',
    url: `${$page.url.origin}/diagnostika-shuma/`,
    areaServed: { '@type': 'City', name: 'Москва' },
    provider: { '@type': 'ProfessionalService', name: 'Лаборатория тишины' }
  });
</script>

<svelte:head>
  <title>Диагностика шума в квартире — Лаборатория тишины</title>
  <meta name="description" content="Прогрессивный инженерный бриф: симптомы, контекст квартиры, план или записи и контакты. Следующий коммерческий шаг — выездная диагностика в Москве." />
  <link rel="canonical" href={`${$page.url.origin}/diagnostika-shuma/`} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Диагностика шума в квартире — Лаборатория тишины" />
  <meta property="og:description" content="Первичный инженерный бриф и согласование выездной диагностики шума в квартире в Москве." />
  <meta property="og:url" content={`${$page.url.origin}/diagnostika-shuma/`} />
  <meta property="og:image" content={`${$page.url.origin}/generated/engineering-v2-og.webp`} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={`${$page.url.origin}/generated/engineering-v2-og.webp`} />
  {@html `<script type="application/ld+json">${structuredData}</script>`}
</svelte:head>

<article class="diagnosis-v2" data-chapter="07 · Диагностика">
  <header class="diagnosis-hero">
    <div class="diagnosis-copy">
      <div class="section-label">Диагностика шума / Москва</div>
      <h1>Сначала соберём симптомы и ограничения.</h1>
      <p class="lead">Первичная диагностика бесплатна. Полный бриф разбит на четыре коротких шага; файлы остаются необязательными.</p>
      <strong>Следующий коммерческий шаг — выездное обследование.</strong>
    </div>
    <div class="diagnosis-image">
      <ImageFrame src="/generated/engineering-v2-final-diagnosis.png" alt="Иллюстративная сцена инженерного разбора плана квартиры" fallback="Инженерный разбор задачи" eager />
    </div>
  </header>

  <section class="expectation" aria-labelledby="expectation-title">
    <header><div class="section-label">Что произойдёт дальше</div><h2 id="expectation-title">Три понятных шага после отправки.</h2></header>
    <ol>
      <li><span>01</span><strong>Менеджер уточнит симптом.</strong><p>Сверит, что слышно, где и при каких условиях.</p></li>
      <li><span>02</span><strong>Команда изучит контекст.</strong><p>План и файлы помогают подготовиться, но не заменяют обследование.</p></li>
      <li><span>03</span><strong>Согласуем выездную диагностику.</strong><p>Не обещаем непроверенное время звонка или результат до обследования.</p></li>
    </ol>
  </section>

  <section class="diagnosis-inputs" aria-labelledby="inputs-title">
    <header><div class="section-label">Что помогает до выезда</div><h2 id="inputs-title">Прислать можно всё, что уточняет симптом. Обязательных файлов нет.</h2></header>
    <div class="input-columns">
      <article>
        <span>До обследования</span>
        <ul><li>кратко: что слышно, где и когда</li><li>план квартиры, если он есть</li><li>аудио или видео как контекст, а не как измерительный протокол</li><li>фотографии доступных узлов и ограничений интерьера</li></ul>
      </article>
      <article>
        <span>На объекте</span>
        <ul><li>сравниваем прямой и обходные маршруты</li><li>осматриваем основания, стыки, проходки и жёсткие связи</li><li>фиксируем этап ремонта и доступ к скрытым зонам</li><li>отделяем наблюдаемые факты от рабочих гипотез</li></ul>
      </article>
    </div>
    <p class="input-note">Запись с телефона помогает понять сценарий, но не заменяет обследование и согласованные условия измерения.</p>
  </section>

  <section class="diagnosis-output" aria-labelledby="output-title">
    <header><div class="section-label">Результат диагностики</div><h2 id="output-title">Проверяемая версия задачи вместо каталога конструкций.</h2></header>
    <div class="output-grid">
      <article><span>01</span><strong>Вероятный маршрут</strong><p>Какие поверхности и узлы участвуют в передаче и что остаётся проверить.</p></article>
      <article><span>02</span><strong>Зоны внимания</strong><p>Основания, примыкания, проходки и ограничения, влияющие на решение.</p></article>
      <article><span>03</span><strong>Следующий шаг</strong><p>Что можно обсуждать дальше и какие неизвестные нельзя закрыть удалённо.</p></article>
    </div>
    <div class="limitations" role="note">
      <span>Честные ограничения</span>
      <p>Диагностика не обещает 100% тишину, универсальную толщину, точную цену по площади или результат чужого объекта. Конструкция и критерии контроля обсуждаются для проверенного пути и конкретных условий.</p>
    </div>
    <nav aria-label="Связанные инженерные страницы"><a href="/shumoizolyatsiya-sten/">Стена</a><a href="/shumoizolyatsiya-potolka/">Потолок</a><a href="/shumoizolyatsiya-pola/">Пол</a><a href="/cases/">Измеренные результаты</a></nav>
  </section>

  <section class="full-brief" aria-labelledby="full-brief-title">
    <header><div class="section-label">Полный инженерный бриф</div><h2 id="full-brief-title">Один экран — одна группа вопросов.</h2><p>Ответы и прикреплённые файлы сохраняются на экране при ошибке сервера.</p></header>
    <DiagnosisForm />
  </section>
</article>

<style>
  .diagnosis-v2 { background: #f2eee6; color: #242824; }
  .diagnosis-hero { display: grid; grid-template-columns: 7fr 5fr; min-height: 86svh; padding-top: 4rem; background: #dfe4de; }
  .diagnosis-copy { display: flex; flex-direction: column; justify-content: flex-end; padding: 8rem clamp(2rem, 6vw, 7rem) 5rem var(--margin); }
  .diagnosis-copy .section-label { color: #48635f; }
  .diagnosis-copy h1 { max-width: 10ch; margin: 1.4rem 0 2rem; font-size: clamp(4rem, 7.5vw, 8.8rem); line-height: 0.88; letter-spacing: -0.065em; }
  .diagnosis-copy .lead { max-width: 42rem; }
  .diagnosis-copy > strong { display: block; max-width: 32rem; margin-top: 1.5rem; color: #48635f; }
  .diagnosis-image { min-height: 42rem; }
  .diagnosis-image :global(.image-frame),
  .diagnosis-image :global(picture),
  .diagnosis-image :global(img) { width: 100%; height: 100%; }
  .diagnosis-image :global(img) { object-fit: cover; }

  .expectation { padding: clamp(6rem, 9vw, 9rem) var(--margin); background: #20231f; color: #fbfaf6; }
  .expectation > header { display: grid; grid-template-columns: 4fr 8fr; gap: var(--gutter); }
  .expectation .section-label { color: #c6d5cf; }
  .expectation h2 { max-width: 13ch; margin: 0; }
  .expectation ol { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gutter); margin: 5rem 0 0; padding: 0; list-style: none; }
  .expectation li { min-height: 15rem; padding: 1.3rem 0; border-top: 2px solid #879d95; }
  .expectation li span { font: 0.75rem 'IBM Plex Mono', monospace; color: #c6d5cf; }
  .expectation li strong { display: block; margin-top: 4rem; font-size: 1.15rem; }
  .expectation li p { color: #d4dad5; }

  .full-brief { padding: clamp(7rem, 11vw, 11rem) var(--margin); }
  .full-brief > header { display: grid; grid-template-columns: 7fr 5fr; gap: var(--gutter); align-items: end; margin-bottom: 5rem; }
  .full-brief .section-label { color: #48635f; }
  .full-brief h2 { max-width: 13ch; margin: 1.2rem 0 0; }
  .full-brief > header > p { max-width: 35ch; color: #4e5650; }
  .full-brief :global(.diagnosis-form) { width: 88%; margin-left: auto; background: #fbfaf6; }

  .diagnosis-inputs { padding: clamp(7rem, 10vw, 10rem) var(--margin); }
  .diagnosis-inputs .section-label, .diagnosis-output .section-label { color: #48635f; }
  .diagnosis-inputs > header, .diagnosis-output > header { display: grid; grid-template-columns: 4fr 8fr; gap: var(--gutter); }
  .diagnosis-inputs h2, .diagnosis-output h2 { max-width: 14ch; }
  .input-columns { display: grid; grid-template-columns: 1fr 1fr; gap: var(--gutter); margin-top: 5rem; }
  .input-columns article { padding: 1.3rem; border-top: 2px solid #698078; background: #fbfaf6; }
  .input-columns span, .diagnosis-output article > span, .limitations > span { font: .75rem 'IBM Plex Mono', monospace; color: #48635f; text-transform: uppercase; }
  .input-columns ul { margin: 1rem 0 0; padding-left: 1.2rem; }
  .input-columns li { margin-top: .75rem; }
  .input-note { width: 50%; margin: 2rem 0 0 auto; padding-left: 1rem; border-left: 4px solid #a94332; color: #4e5650; }

  .diagnosis-output { padding: clamp(7rem, 10vw, 10rem) var(--margin); background: #dfe4de; }
  .output-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gutter); margin-top: 5rem; }
  .output-grid article { min-height: 15rem; padding: 1.2rem; border: 1px solid #98aaa2; background: #f2eee6; }
  .output-grid strong { display: block; margin-top: 4rem; font-size: 1.15rem; }
  .output-grid p { margin-top: .7rem; color: #4e5650; }
  .limitations { display: grid; grid-template-columns: 4fr 8fr; gap: var(--gutter); margin: 4rem 0 0; padding: 1.4rem; border-top: 2px solid #a94332; background: #20231f; color: #fbfaf6; }
  .limitations > span { color: #c6d5cf; }
  .limitations p { max-width: 52rem; color: #d4dad5; }
  .diagnosis-output nav { display: flex; flex-wrap: wrap; gap: .7rem; margin-top: 2rem; }
  .diagnosis-output nav a { min-height: 44px; display: inline-flex; align-items: center; padding: .55rem .75rem; border: 1px solid #82928b; background: #f2eee6; font-weight: 600; }
  .diagnosis-output nav a:hover { border-color: #a94332; }

  @media (max-width: 800px) {
    .diagnosis-hero { display: flex; flex-direction: column; min-height: 0; padding-top: 4.5rem; }
    .diagnosis-copy { padding: 4rem 1.1rem 3rem; }
    .diagnosis-copy h1 { max-width: 100%; font-size: clamp(3rem, 14vw, 5.2rem); hyphens: auto; overflow-wrap: break-word; }
    .diagnosis-image { min-height: 24rem; }
    .expectation,
    .full-brief,
    .diagnosis-inputs,
    .diagnosis-output { padding-inline: 1.1rem; }
    .expectation > header,
    .full-brief > header,
    .diagnosis-inputs > header,
    .diagnosis-output > header { display: block; }
    .expectation h2,
    .full-brief h2 { margin-top: 1.2rem; }
    .expectation ol { grid-template-columns: 1fr; margin-top: 3rem; }
    .expectation li { min-height: 0; }
    .expectation li strong { margin-top: 1.5rem; }
    .full-brief :global(.diagnosis-form) { width: 100%; margin: 0; padding-inline: 1.1rem; }
    .input-columns, .output-grid { grid-template-columns: 1fr; margin-top: 3rem; }
    .input-note { width: 100%; margin-top: 2rem; }
    .output-grid article { min-height: 0; }
    .output-grid strong { margin-top: 1.5rem; }
    .limitations { display: block; }
    .limitations p { margin-top: 1rem; }
  }
</style>
