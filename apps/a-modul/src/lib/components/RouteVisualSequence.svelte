<script lang="ts">
  import type { RouteVisual } from '$lib/content/routes';

  let { items }: { items: RouteVisual[] } = $props();
  let active = $state(0);
  let tabButtons = $state<HTMLButtonElement[]>([]);

  function select(index: number, moveFocus = false) {
    active = index;
    if (moveFocus) queueMicrotask(() => tabButtons[index]?.focus());
  }

  function handleKey(event: KeyboardEvent, index: number) {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;
    event.preventDefault();
    select(next, true);
  }
</script>

<section class="route-visuals chapter" aria-labelledby="route-visuals-title">
  <div class="chapter__heading chapter__heading--split">
    <div><p class="eyebrow">Сценарий объекта</p><h2 id="route-visuals-title">От исходного контура к эксплуатации.</h2></div>
    <p>Кадры показывают разные проектные задачи. Это авторские архитектурные визуализации, а не фотографии реализованных объектов и не рабочая документация.</p>
  </div>
  <div class="route-visuals__workspace">
    <div class="route-visuals__visual" data-active-stage={active}>
      {#key active}
        <picture>
          <source media="(max-width: 720px)" srcset={`/generated/${items[active].image}-mobile.avif`} type="image/avif" />
          <source media="(max-width: 720px)" srcset={`/generated/${items[active].image}-mobile.webp`} type="image/webp" />
          <source srcset={`/generated/${items[active].image}-desktop.avif`} type="image/avif" />
          <img src={`/generated/${items[active].image}-desktop.webp`} width="1600" height="900" alt={items[active].alt} loading="lazy" />
        </picture>
      {/key}
      <span class="visualization-label">{items[active].label}</span>
      <div class="route-visuals__caption" aria-live="polite">
        <span>{String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
        <strong>{items[active].title}</strong>
      </div>
    </div>
    <div class="route-visuals__tabs" role="tablist" aria-label="Проектные кадры">
      {#each items as item, index}
        <button
          bind:this={tabButtons[index]}
          type="button"
          role="tab"
          id={`route-visual-tab-${index}`}
          aria-controls="route-visual-panel"
          aria-selected={active === index}
          tabindex={active === index ? 0 : -1}
          class:active={active === index}
          onclick={() => select(index)}
          onkeydown={(event) => handleKey(event, index)}
        ><span>{String(index + 1).padStart(2, '0')}</span>{item.title}</button>
      {/each}
      <div id="route-visual-panel" role="tabpanel" tabindex="0" aria-labelledby={`route-visual-tab-${active}`}>
        <p>{items[active].detail}</p>
      </div>
    </div>
  </div>
</section>
