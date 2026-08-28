<script lang="ts">
  import { onMount } from 'svelte';
  import { trackEvent } from '$lib/analytics';
  import {
    commitProjectTransfer, initProjectContext, metricLabel, metricUnit, objectTypeDefinitions, projectContext, regionOptions,
    setCapacity, setCustomCapacity, setMetric, setObjectType, setRegion, toggleProjectZone,
    type CapacityMetric, type ObjectTypeId, type RegionId
  } from '$lib/state/projectContext';

  let started = false;

  function start() {
    if (started) return;
    started = true;
    trackEvent('configurator_start');
  }

  function chooseType(value: ObjectTypeId) { start(); setObjectType(value); trackEvent('object_type_select', { value }); }
  function chooseMetric(value: CapacityMetric) { start(); setMetric(value); }
  function chooseCapacity(value: string) { start(); setCapacity(value); trackEvent('capacity_select', { value }); }
  function chooseRegion(value: RegionId) { start(); setRegion(value); trackEvent('region_select', { value }); }
  function chooseZone(value: string) { start(); toggleProjectZone(value); }
  function complete() {
    commitProjectTransfer();
    trackEvent('configurator_complete', { object_type: $projectContext.objectType, zone_count: $projectContext.selectedZones.length });
  }

  $: currentType = objectTypeDefinitions.find((item) => item.id === $projectContext.objectType);
  $: capacityOptions = !currentType ? [] : $projectContext.objectType === 'service' && $projectContext.metric === 'people'
    ? ['50', '100', '300', 'custom'] : currentType.capacityOptions;
  $: capacityLabel = $projectContext.capacity === 'custom'
    ? ($projectContext.customCapacity ? `${$projectContext.customCapacity} ${metricUnit($projectContext.metric)}` : 'нужно уточнить')
    : `${$projectContext.capacity} ${metricUnit($projectContext.metric)}`;
  $: missingInputs = [
    ...($projectContext.capacity === 'custom' && !$projectContext.customCapacity ? [metricLabel($projectContext.metric).toLowerCase()] : []),
    ...($projectContext.selectedZones.length === 0 ? ['функциональный состав'] : []),
    'исходные данные по площадке', 'требования к инженерии', 'желаемый график запуска'
  ];

  onMount(initProjectContext);
</script>

<section class="configurator chapter" id="configurator" aria-labelledby="configurator-title">
  <div class="chapter__heading">
    <p class="eyebrow">Состав объекта / рабочая модель</p>
    <h2 id="configurator-title">Соберите предварительный состав объекта.</h2>
    <p>Конфигуратор фиксирует функциональный контур. Он не выдаёт выдуманное количество модулей или финальную смету.</p>
  </div>

  <div class="configurator__workspace">
    <form class="configurator__controls" onsubmit={(event) => event.preventDefault()}>
      <fieldset class="configurator__type">
        <legend>01 / Тип объекта</legend>
        <div class="choice-grid choice-grid--types">
          {#each objectTypeDefinitions as item}
            <button type="button" class:active={$projectContext.objectType === item.id} aria-pressed={$projectContext.objectType === item.id} onclick={() => chooseType(item.id as ObjectTypeId)}>{item.label}</button>
          {/each}
        </div>
      </fieldset>

      {#if currentType && $projectContext.objectType === 'service'}
        <fieldset class="configurator__metric">
          <legend>02 / Основа масштаба</legend>
          <div class="choice-grid choice-grid--metric">
            {#each [['area', 'Площадь'], ['people', 'Персонал']] as option}
              <button type="button" class:active={$projectContext.metric === option[0]} aria-pressed={$projectContext.metric === option[0]} onclick={() => chooseMetric(option[0] as CapacityMetric)}>{option[1]}</button>
            {/each}
          </div>
        </fieldset>
      {:else}
        <fieldset class="configurator__metric configurator__placeholder" aria-hidden="true">
          <legend>02 / Основа масштаба</legend>
        </fieldset>
      {/if}

      {#if currentType}<fieldset class="configurator__capacity">
        <legend>{$projectContext.objectType === 'service' ? '03' : '02'} / {metricLabel($projectContext.metric)}</legend>
        <div class="choice-grid choice-grid--capacity">
          {#each capacityOptions as item}
            <button type="button" class:active={$projectContext.capacity === item} aria-pressed={$projectContext.capacity === item} onclick={() => chooseCapacity(item)}>{item === 'custom' ? 'Другая' : item}</button>
          {/each}
        </div>
        {#if $projectContext.capacity === 'custom'}
          <label class="configurator__custom">
            <span>Своё значение, {metricUnit($projectContext.metric)}</span>
            <input type="number" min="1" inputmode="numeric" value={$projectContext.customCapacity} oninput={(event) => { start(); setCustomCapacity(event.currentTarget.value); trackEvent('capacity_select', { value: 'custom' }); }} placeholder="Введите значение" />
          </label>
        {/if}
      </fieldset>{/if}

      {#if currentType}<label class="configurator__region">
        <span>{$projectContext.objectType === 'service' ? '04' : '03'} / Регион проекта</span>
        <select value={$projectContext.region} onchange={(event) => chooseRegion(event.currentTarget.value as RegionId)}>
          {#each regionOptions as item}<option value={item.value}>{item.label}</option>{/each}
        </select>
      </label>{/if}

      {#if currentType}<fieldset class="configurator__zones">
        <legend>{$projectContext.objectType === 'service' ? '05' : '04'} / Функциональные зоны</legend>
        <div class="zone-grid">
          {#each currentType.zones as zone}
            <label class:active={$projectContext.selectedZones.includes(zone)}>
              <input type="checkbox" checked={$projectContext.selectedZones.includes(zone)} onchange={() => chooseZone(zone)} />
              <span>{zone}</span>
            </label>
          {/each}
        </div>
      </fieldset>{/if}
    </form>

    <aside class="configurator__output" aria-live="polite">
      {#if currentType}
        <div class="output__index"><span>Предварительный контур</span><strong>{$projectContext.selectedZones.length}<small> функциональных зон</small></strong></div>
        <h3>{currentType.label}</h3>
        <dl>
          <div><dt>{metricLabel($projectContext.metric)}</dt><dd>{capacityLabel}</dd></div>
          <div><dt>Регион</dt><dd>{regionOptions.find((item) => item.value === $projectContext.region)?.label ?? 'Не выбран'}</dd></div>
        </dl>
        <div class="output__zones">
          <span>В составе</span>
          {#if $projectContext.selectedZones.length}
            <ul>{#each $projectContext.selectedZones as zone}<li>{zone}</li>{/each}</ul>
          {:else}<p>Функциональные зоны пока не выбраны.</p>{/if}
        </div>
        <div class="output__guidance">
          <div class="output__missing"><span>Нужно уточнить</span><p>{missingInputs.join(', ')}.</p></div>
          <p class="output__next"><span>Следующий шаг</span>{currentType.next}</p>
        </div>
        <a class="button button--primary" href="#project-brief" onclick={complete}>Передать контур в заявку</a>
      {:else}
        <div class="output__index"><span>Предварительный контур</span><strong>00<small> функций зафиксировано</small></strong></div>
        <h3>Сначала выберите тип объекта.</h3>
        <p class="output__next"><span>Следующий шаг</span>После выбора покажем подходящую основу масштаба и функциональный состав.</p>
      {/if}
    </aside>
  </div>
</section>
