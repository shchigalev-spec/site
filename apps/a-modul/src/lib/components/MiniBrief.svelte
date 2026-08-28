<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { trackEvent } from '$lib/analytics';
  import CommissioningSelector from '$lib/components/CommissioningSelector.svelte';
  import {
    applyLandingDefaults, clearObjectType, commitProjectTransfer, initProjectContext, metricLabel, metricUnit, objectTypeDefinitions, projectContext, regionOptions,
    setCommissioning, setCustomCapacity, setDiagnosisMode, setMetric, setObjectType, setRegion,
    type CapacityMetric, type DiagnosisMode, type ObjectTypeId, type ObjectTypeSelection, type RegionId
  } from '$lib/state/projectContext';

  export let initialObjectType: ObjectTypeSelection = '';
  export let initialRegion: RegionId | undefined = undefined;
  export let typeLabel = '';
  export let initialMode: DiagnosisMode = 'standard';

  let checked = false;
  let mounted = false;
  let briefObjectType: ObjectTypeId | '' = initialObjectType;
  const initialDefinition = objectTypeDefinitions.find((item) => item.id === initialObjectType);
  let briefMetric: CapacityMetric = initialDefinition?.metric ?? 'people';
  let briefCapacity = initialDefinition?.capacityOptions[0] ?? '';
  let briefRegion: RegionId = initialRegion ?? '';
  let commissioning = '';
  let errors = { objectType: '', capacity: '', region: '', commissioning: '' };
  let dirty = { objectType: false, capacity: false, region: false };

  $: allowedMetrics = briefObjectType === 'service'
    ? [{ value: 'area' as CapacityMetric, label: 'Площадь' }, { value: 'people' as CapacityMetric, label: 'Персонал' }]
    : [{ value: briefObjectType === 'abk' ? 'workplaces' as CapacityMetric : 'people' as CapacityMetric, label: briefObjectType === 'abk' ? 'Рабочие места' : 'Персонал' }];
  $: if (mounted) {
    const requestedMode = $page.url.searchParams.get('mode');
    if ((requestedMode === 'tender' || requestedMode === 'standard' || requestedMode === 'leasing') && $projectContext.mode !== requestedMode) {
      setDiagnosisMode(requestedMode as DiagnosisMode);
    }
  }
  $: displayMode = mounted ? $projectContext.mode : initialMode;

  onMount(() => {
    initProjectContext();
    applyLandingDefaults({ objectType: initialObjectType, region: initialRegion, typeIntent: typeLabel });
    mounted = true;
    const requestedMode = new URL(window.location.href).searchParams.get('mode');
    setDiagnosisMode(requestedMode === 'tender' || requestedMode === 'standard' || requestedMode === 'leasing' ? requestedMode : initialMode);
    const unsubscribe = projectContext.subscribe((value) => {
      if (!dirty.objectType) briefObjectType = value.objectType;
      briefMetric = value.metric;
      if (!dirty.capacity) briefCapacity = value.capacity === 'custom' ? value.customCapacity : value.capacity;
      if (!dirty.region) briefRegion = value.region;
      commissioning = value.commissioning;
      syncCommissioningFields(value.commissioning);
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  });

  function clearError(field: keyof typeof errors) {
    errors = { ...errors, [field]: '' };
    checked = false;
  }

  function changeObjectType(value: string) {
    briefObjectType = objectTypeDefinitions.some((item) => item.id === value) ? value as ObjectTypeId : '';
    dirty = { ...dirty, objectType: !value, capacity: false };
    clearError('objectType');
    if (objectTypeDefinitions.some((item) => item.id === value)) setObjectType(value as ObjectTypeId);
    else clearObjectType();
    trackEvent('object_type_select', { value });
  }

  function changeMetric(value: CapacityMetric) {
    briefMetric = value;
    clearError('capacity');
    setMetric(value);
  }

  function changeCapacity(value: string) {
    briefCapacity = value;
    dirty = { ...dirty, capacity: !value };
    clearError('capacity');
    setCustomCapacity(value);
    trackEvent('capacity_select', { metric: briefMetric, has_value: Boolean(value) });
  }

  function changeRegion(value: string) {
    briefRegion = regionOptions.some((item) => item.value === value) ? value as RegionId : '';
    dirty = { ...dirty, region: !value };
    clearError('region');
    if (regionOptions.some((item) => item.value === value)) setRegion(value as RegionId);
    trackEvent('region_select', { value });
  }

  function changeCommissioning(value: string) {
    commissioning = value;
    syncCommissioningFields(value);
    clearError('commissioning');
    setCommissioning(value);
    trackEvent('commissioning_date_select', { has_value: Boolean(value) });
  }

  function syncCommissioningFields(value: string) {
    if (typeof document === 'undefined') return;
    for (const selector of ['#project-brief input[name="commissioning"]', '#full-brief input[name="desiredCommissioningDate"]']) {
      const input = document.querySelector<HTMLInputElement>(selector);
      if (!input) continue;
      input.value = value;
      input.setAttribute('value', value);
    }
  }

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const nextErrors = {
      objectType: briefObjectType ? '' : 'Выберите тип объекта.',
      capacity: Number(briefCapacity) > 0 ? '' : `Укажите значение: ${metricLabel(briefMetric).toLowerCase()}.`,
      region: briefRegion ? '' : 'Выберите регион проекта.',
      commissioning: commissioning ? '' : 'Укажите желаемый срок ввода.'
    };
    errors = nextErrors;
    const firstError = (Object.entries(nextErrors) as [keyof typeof nextErrors, string][]).find(([, message]) => message)?.[0];
    if (firstError) {
      const form = event.currentTarget as HTMLFormElement;
      const target = firstError === 'commissioning'
        ? form.querySelector<HTMLElement>('[data-commissioning-control] button')
        : form.elements.namedItem(firstError === 'capacity' ? briefMetric : firstError) as HTMLElement | null;
      target?.focus();
      checked = false;
      return;
    }
    checked = true;
    commitProjectTransfer();
    trackEvent('hero_brief_complete', { mode: $projectContext.mode, object_type: briefObjectType, region: briefRegion });
    window.location.hash = 'full-brief';
    requestAnimationFrame(() => document.getElementById('full-brief-title')?.focus({ preventScroll: true }));
    document.getElementById('full-brief')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
</script>

<section class="brief" id="project-brief" aria-labelledby="brief-title">
  <div class="brief__intro">
    <p class="eyebrow">Шаг 01 / исходные данные</p>
    <h2 id="brief-title">Зафиксируем контур объекта.</h2>
    <p>Четырёх параметров достаточно, чтобы определить следующий инженерный шаг и подготовить предварительное КП после получения основных исходных данных.</p>
    {#if typeLabel}<p class="brief__mode"><span>Контекст запроса</span> {typeLabel}</p>{/if}
    {#if displayMode === 'tender'}<p class="brief__mode"><span>Режим</span> Приглашение в тендер</p>{/if}
    {#if displayMode === 'leasing'}<p class="brief__mode"><span>Режим</span> Поставка в лизинг</p>{/if}
  </div>

  <form class="brief__form" onsubmit={handleSubmit} novalidate aria-describedby="brief-note brief-status">
    <label class="field field--object">
      <span>Тип объекта</span>
      <select name="objectType" value={briefObjectType} onchange={(event) => changeObjectType(event.currentTarget.value)} required aria-invalid={errors.objectType ? 'true' : 'false'} aria-describedby="brief-object-error">
        <option value="">Выберите задачу</option>
        {#each objectTypeDefinitions as item}<option value={item.id}>{item.label}</option>{/each}
      </select>
      <span class="field__error" id="brief-object-error">{errors.objectType}</span>
    </label>

    <fieldset class="field field--metric">
      <legend>Масштаб</legend>
      <div class="segmented">
        {#each allowedMetrics as option}
          <label><input type="radio" name="metric" value={option.value} checked={briefMetric === option.value} onchange={() => changeMetric(option.value)} /> {option.label}</label>
        {/each}
      </div>
      <label class="metric-input">
        <span class="visually-hidden">{metricLabel(briefMetric)}, {metricUnit(briefMetric)}</span>
        <input type="number" name={briefMetric} min="1" inputmode="numeric" value={briefCapacity} oninput={(event) => changeCapacity(event.currentTarget.value)} placeholder="Введите значение" required aria-invalid={errors.capacity ? 'true' : 'false'} aria-describedby="brief-capacity-error" />
        <span>{metricUnit(briefMetric)}</span>
      </label>
      <span class="field__error" id="brief-capacity-error">{errors.capacity}</span>
    </fieldset>

    <label class="field">
      <span>Регион</span>
      <select name="region" value={briefRegion} onchange={(event) => changeRegion(event.currentTarget.value)} required aria-invalid={errors.region ? 'true' : 'false'} aria-describedby="brief-region-error">
        {#each regionOptions as item}<option value={item.value}>{item.label}</option>{/each}
      </select>
      <span class="field__error" id="brief-region-error">{errors.region}</span>
    </label>

    <div class="field field--commissioning">
      <span>Планируемый ввод в эксплуатацию</span>
      <CommissioningSelector bind:value={commissioning} inputName="commissioning" invalid={Boolean(errors.commissioning)} errorId="brief-commissioning-error" onValueChange={changeCommissioning} />
      <span class="field__error" id="brief-commissioning-error">{errors.commissioning}</span>
    </div>

    <div class="brief__carry" role="status" aria-live="polite">
      <span>Контекст передан</span>
      <p>
        {typeLabel || objectTypeDefinitions.find((item) => item.id === $projectContext.objectType)?.label || 'Тип объекта нужно уточнить'} ·
        {#if $projectContext.capacity}
          {metricLabel($projectContext.metric)}: {$projectContext.capacity === 'custom' ? $projectContext.customCapacity || 'нужно уточнить' : $projectContext.capacity} {metricUnit($projectContext.metric)}
        {:else}
          {metricLabel($projectContext.metric)} нужно уточнить
        {/if} ·
        {regionOptions.find((item) => item.value === $projectContext.region)?.label || 'Регион нужно уточнить'}
      </p>
      <p>{$projectContext.selectedZones.length ? $projectContext.selectedZones.join(' · ') : 'Функциональный состав нужно уточнить.'}</p>
    </div>

    <div class="brief__submit">
      <button class="button button--primary" type="submit">Получить КП за 1 рабочий день</button>
      <p id="brief-note">Проверим параметры и перейдём к полной заявке. На этом шаге данные ещё не отправляются.</p>
    </div>
    <p class="brief__status" id="brief-status" aria-live="polite">{#if checked}Параметры перенесены в полную заявку. Заявка ещё не отправлена.{/if}</p>
  </form>
</section>
