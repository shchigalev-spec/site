<script lang="ts">
  import { onMount } from 'svelte';
  import { trackEvent } from '$lib/analytics';

  const stages = [
    { label: 'Генплан', detail: 'Фиксируем площадку, связи и ограничения', asset: 'a-modul-bim-integrated-genplan' },
    { label: 'Состав', detail: 'Переносим функциональные группы в реальную разбивку площадки', asset: 'a-modul-bim-integrated-functional-layout' },
    { label: 'Модули', detail: 'Собираем производимую сетку из реальных базовых рам', asset: 'a-modul-bim-integrated-module-grid' },
    { label: 'Производство', detail: 'Связываем рабочую документацию с маршрутами изготовления', asset: 'a-modul-factory' },
    { label: 'Доставка', detail: 'Комплектуем партии под подтверждённую схему маршрута', asset: 'a-modul-general-hero-partial-settlement' },
    { label: 'Монтаж', detail: 'Стыкуем группы, переходы и инженерные подключения', asset: 'a-modul-general-hero-partial-settlement' },
    { label: 'Объект', detail: 'Завершаем единый контур до операционного результата', asset: 'a-modul-general-hero-operational-object' }
  ];

  let active = $state(0);
  let reducedMotion = $state(false);
  let interactionStarted = $state(false);

  function startInteraction() {
    if (interactionStarted) return;
    interactionStarted = true;
    trackEvent('bim_interaction_start');
  }

  function completeInteraction() {
    trackEvent('bim_interaction_complete', { stage: stages.length });
  }

  function selectStage(index: number) {
    startInteraction();
    active = index;
    if (index === stages.length - 1) completeInteraction();
  }

  function advance() {
    selectStage(active === stages.length - 1 ? 0 : active + 1);
  }

  onMount(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reducedMotion = preference.matches;
      if (reducedMotion) active = stages.length - 1;
    };
    sync();
    preference.addEventListener('change', sync);
    return () => {
      preference.removeEventListener('change', sync);
    };
  });
</script>

<section class="bim chapter" id="bim" aria-labelledby="bim-title">
  <div class="chapter__heading chapter__heading--split">
    <div>
      <p class="eyebrow">BIM → объект / управляемая последовательность</p>
      <h2 id="bim-title">Сначала вы видите объект в модели. Потом запускаем производство.</h2>
    </div>
    <p>Состав модели и степень детализации зависят от этапа и договора. Эта схема объясняет процесс, а не обещает готовую рабочую модель до получения исходных данных.</p>
  </div>

  <div class="bim__sequence" data-stage={active}>
    <div class="bim__viewport">
      {#each stages as stage, index}
        <picture class:visible={active === index} class="bim__plate" aria-hidden="true">
          <source media="(max-width: 760px)" type="image/avif" srcset={`/generated/${stage.asset}-mobile.avif`} />
          <source media="(max-width: 760px)" type="image/webp" srcset={`/generated/${stage.asset}-mobile.webp`} />
          <source type="image/avif" srcset={`/generated/${stage.asset}-desktop.avif`} />
          <img src={`/generated/${stage.asset}-desktop.webp`} width="1600" height="900" alt="" loading="lazy" />
        </picture>
      {/each}

      <div class="bim__hud"><span>ЭТАП {String(active + 1).padStart(2, '0')}</span><span>{stages[active].label}</span></div>
      <span class="visualization-label">Процессная визуализация</span>
    </div>

    <div class="bim__controls">
      <div class="bim__stages" role="group" aria-label="Этапы от модели до объекта">
        {#each stages as stage, index}
          <button type="button" class:active={active === index} aria-pressed={active === index} onclick={() => selectStage(index)}><span>{String(index + 1).padStart(2, '0')}</span>{stage.label}</button>
        {/each}
      </div>
      <div class="bim__caption">
        <div role="status" aria-live="polite" aria-atomic="true"><span class="mono-label">{stages[active].label}</span><strong>{stages[active].detail}</strong></div>
        <button class="bim__play" type="button" onclick={advance} disabled={reducedMotion}>{reducedMotion ? 'Итоговая стадия показана' : active === stages.length - 1 ? 'Вернуться к генплану' : `Следующий этап: ${stages[active + 1].label}`}<span aria-hidden="true">→</span></button>
      </div>
    </div>
  </div>
</section>
