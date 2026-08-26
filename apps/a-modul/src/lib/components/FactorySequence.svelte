<script lang="ts">
  import { trackEvent } from '$lib/analytics';
  const stages = [
    { title: 'Металл', image: 'a-modul-factory-metal', alt: 'Визуализация подготовки стальных профилей и напольной рамы модуля', detail: 'Подготовка металла открывает производственную последовательность по рабочей документации.' },
    { title: 'Каркас', image: 'a-modul-factory-frame', alt: 'Визуализация собранного стального каркаса модуля', detail: 'Геометрия модуля и несущая схема переходят из документации в производство.' },
    { title: 'Ограждение', image: 'a-modul-factory-envelope', alt: 'Визуализация установки утеплённых ограждающих панелей на каркас', detail: 'Стены, кровля, окна и двери собираются в контролируемых условиях.' },
    { title: 'Инженерия', image: 'a-modul-factory-engineering', alt: 'Визуализация прокладки инженерных систем внутри модуля', detail: 'Сети прокладываются до выхода модулей на площадку в согласованном составе.' },
    { title: 'Отделка', image: 'a-modul-factory-finishing', alt: 'Визуализация внутренней отделки модульного помещения в цехе', detail: 'Отделочные решения выполняются в составе, зафиксированном проектом и договором.' },
    { title: 'Контроль качества', image: 'a-modul-factory-control', alt: 'Визуализация контроля готового модуля в инспекционной зоне', detail: 'Маршрутные листы и поэтапный контроль удерживают производственную последовательность.' },
    { title: 'Отгрузка', image: 'a-modul-factory-shipment', alt: 'Визуализация готового модуля на платформе у ворот производственного цеха', detail: 'Партии комплектуются под подтверждённый маршрут и порядок монтажа.' }
  ];
  let active = 0;
  let tabButtons: HTMLButtonElement[] = [];
  let interactionStarted = false;

  function activate(index: number, moveFocus = false) {
    if (!interactionStarted) {
      interactionStarted = true;
      trackEvent('production_sequence_start');
    }
    active = index;
    if (index === stages.length - 1) trackEvent('production_sequence_complete', { stage: stages.length });
    if (moveFocus) queueMicrotask(() => tabButtons[index]?.focus());
  }

  function selectTab(index: number) {
    activate(index, true);
  }

  function handleTabKey(event: KeyboardEvent, index: number) {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % stages.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + stages.length) % stages.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = stages.length - 1;
    else return;
    event.preventDefault();
    selectTab(next);
  }
</script>

<section class="factory chapter" id="factory" aria-labelledby="factory-title">
  <div class="factory__visual" data-active-stage={active}>
    {#key active}
      <picture>
        <source media="(max-width: 760px)" type="image/avif" srcset={`/generated/${stages[active].image}-mobile.avif`} />
        <source media="(max-width: 760px)" type="image/webp" srcset={`/generated/${stages[active].image}-mobile.webp`} />
        <source type="image/avif" srcset={`/generated/${stages[active].image}-desktop.avif`} />
        <img src={`/generated/${stages[active].image}-desktop.webp`} width="1600" height="900" alt={stages[active].alt} loading="lazy" />
      </picture>
    {/key}
    <span class="visualization-label">Визуализация производственного процесса</span>
    <div class="factory__facts" role="list" aria-label="Производственные показатели">
      <p role="listitem"><strong>25 000 м²</strong><span>производственных площадок</span></p>
      <p role="listitem"><strong>до 750</strong><span>модулей в месяц</span></p>
      <p role="listitem"><strong>до 25</strong><span>модулей в смену</span></p>
    </div>
  </div>

  <div class="factory__copy">
    <p class="eyebrow">Производственный контур</p>
    <h2 id="factory-title">Производство, которое позволяет управлять графиком.</h2>
    <div class="factory__stages" role="tablist" aria-label="Этапы производства">
      {#each stages as stage, index}
        <button bind:this={tabButtons[index]} id={`factory-tab-${index}`} type="button" role="tab" aria-selected={active === index} aria-controls="factory-panel" tabindex={active === index ? 0 : -1} class:active={active === index} onclick={() => activate(index)} onkeydown={(event) => handleTabKey(event, index)}><span>{String(index + 1).padStart(2, '0')}</span>{stage.title}</button>
      {/each}
    </div>
    <div class="factory__detail" id="factory-panel" role="tabpanel" tabindex="0" aria-labelledby={`factory-tab-${active}`} aria-live="polite">
      <span class="mono-label">{stages[active].title}</span>
      <p>{stages[active].detail}</p>
    </div>
    <p class="factory__note">Показатели отражают опубликованные возможности производства, а не гарантированный темп конкретного проекта.</p>
  </div>
</section>
