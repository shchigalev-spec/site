<script lang="ts">
  import { trackEvent } from '$lib/analytics';

  const stages = [
    { title: 'Подготовленная площадка', image: 'a-modul-lower-prepared', detail: 'Пятно объекта, подъезд и точки будущих опор рассматриваются до выхода модулей с производства.' },
    { title: 'Первая модульная группа', image: 'a-modul-lower-first-group', detail: 'Последовательность монтажа формируется вместе с логистическими партиями и доступом крана.' },
    { title: 'Связанные здания', image: 'a-modul-lower-connected', detail: 'Модульные группы становятся единым функциональным контуром, но площадка ещё остаётся строительной.' },
    { title: 'Инженерная инфраструктура', image: 'a-modul-lower-engineering', detail: 'Подключения и сервисные узлы проходят отдельный этап до ввода объекта в эксплуатацию.' },
    { title: 'Эксплуатация', image: 'a-modul-lower-operational', detail: 'Финальное состояние показывает работающий зимний объект, а не обещание конкретного архитектурного решения.' }
  ];

  let active = 0;
  let tabButtons: HTMLButtonElement[] = [];

  function select(index: number, moveFocus = false) {
    active = index;
    trackEvent('lower_object_stage_change', { stage: index + 1 });
    if (moveFocus) queueMicrotask(() => tabButtons[index]?.focus());
  }

  function handleKey(event: KeyboardEvent, index: number) {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % stages.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + stages.length) % stages.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = stages.length - 1;
    else return;
    event.preventDefault();
    select(next, true);
  }
</script>

<section class="lower-object chapter" aria-labelledby="lower-object-title">
  <div class="chapter__heading chapter__heading--split">
    <div>
      <p class="eyebrow">Единая зимняя площадка / 05 состояний</p>
      <h2 id="lower-object-title">Объект собирается по этапам, а не появляется одним кадром.</h2>
    </div>
    <p>Последовательность держит один северный контекст: подготовка, монтаж, связи, инженерия и эксплуатация читаются как единый производственно-строительный сценарий.</p>
  </div>

  <div class="lower-object__workspace">
    <div class="lower-object__visual" data-active-stage={active}>
      {#key active}
        <picture>
          <source media="(max-width: 760px)" type="image/avif" srcset={`/generated/${stages[active].image}-mobile.avif`} />
          <source media="(max-width: 760px)" type="image/webp" srcset={`/generated/${stages[active].image}-mobile.webp`} />
          <source type="image/avif" srcset={`/generated/${stages[active].image}-desktop.avif`} />
          <img src={`/generated/${stages[active].image}-desktop.webp`} width="1920" height="1080" alt={`Концептуальная визуализация: ${stages[active].title.toLowerCase()} на зимней модульной площадке`} loading="lazy" />
        </picture>
      {/key}
      <span class="visualization-label">Концептуальная визуализация этапа — не фото объекта и не рабочая документация</span>
      <div class="lower-object__caption" aria-live="polite">
        <span>{String(active + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')}</span>
        <strong>{stages[active].title}</strong>
        <p>{stages[active].detail}</p>
      </div>
    </div>

    <div class="lower-object__tabs" role="tablist" aria-label="Состояния объекта">
      {#each stages as stage, index}
        <button bind:this={tabButtons[index]} type="button" role="tab" id={`lower-object-tab-${index}`} aria-controls="lower-object-panel" aria-selected={active === index} tabindex={active === index ? 0 : -1} class:active={active === index} onclick={() => select(index)} onkeydown={(event) => handleKey(event, index)}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          {stage.title}
        </button>
      {/each}
      <div id="lower-object-panel" role="tabpanel" tabindex="0" aria-labelledby={`lower-object-tab-${active}`}>
        <p>{stages[active].detail}</p>
      </div>
    </div>
  </div>
</section>
