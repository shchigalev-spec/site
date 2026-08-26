<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { getAttribution, trackEvent } from '$lib/analytics';
  import { diagnosisHref } from '$lib/navigation';
  import CommissioningSelector from '$lib/components/CommissioningSelector.svelte';
  import { isPlausiblePhone, isValidEmail, projectStageOptions, regionVariantSlugs, scopeOptions, typeVariantSlugs } from '$lib/content/lead-options';
  import {
    applyLandingDefaults, clearObjectType, initProjectContext, objectTypeDefinitions, projectContext, regionOptions, setDiagnosisMode, setObjectType,
    type CapacityMetric, type DiagnosisMode, type ObjectTypeSelection, type ProjectContext, type RegionId
  } from '$lib/state/projectContext';

  export let initialObjectType: ObjectTypeSelection = '';
  export let initialRegion: RegionId | undefined = undefined;
  export let typeLabel = '';
  export let initialMode: DiagnosisMode = 'standard';

  const initialDefinition = objectTypeDefinitions.find((item) => item.id === initialObjectType);
  const initialCapacity = initialDefinition?.capacityOptions[0] ?? '';
  const acceptedExtensions = ['pdf', 'docx', 'xlsx', 'dwg', 'jpg', 'jpeg', 'png', 'zip'];
  const visibleServerFields = new Set([
    'objectType', 'personnelCount', 'area', 'region', 'desiredCommissioningDate', 'projectStage', 'comment',
    'company', 'name', 'phone', 'email', 'contact', 'tenderName', 'deadline', 'consent', 'files', 'capacity'
  ]);

  let mounted = false;
  let submitting = false;
  let started = false;
  let formInteracted = false;
  let lastTransferRevision = 0;
  let status: 'idle' | 'success' | 'error' = 'idle';
  let statusMessage = '';
  let reference = '';
  let fieldErrors: Record<string, string> = {};
  let files: FileList | null = null;
  $: fileSummary = !files?.length ? 'Файлы не выбраны' : files.length === 1 ? files[0].name : `Выбрано файлов: ${files.length}`;

  let formObjectType: ObjectTypeSelection = initialObjectType;
  let formMetric: CapacityMetric = initialDefinition?.metric ?? 'people';
  let personnelCount = formMetric === 'area' ? '' : initialCapacity;
  let area = formMetric === 'area' ? initialCapacity : '';
  let desiredCommissioningDate = '';
  let projectStage = '';
  let formRegion: RegionId = initialRegion ?? '';
  let selectedScope: string[] = [];
  let leasingInterest = initialMode === 'leasing';
  let comment = '';
  let company = '';
  let name = '';
  let phone = '';
  let email = '';
  let tenderName = '';
  let deadline = '';
  let consent = false;

  $: requestedMode = $page.url.searchParams.get('mode');
  $: desiredMode = requestedMode === 'standard' || requestedMode === 'tender' || requestedMode === 'leasing' ? requestedMode as DiagnosisMode : initialMode;
  $: if (mounted && $projectContext.mode !== desiredMode) setDiagnosisMode(desiredMode);
  $: mode = mounted ? $projectContext.mode : initialMode;
  $: tender = mode === 'tender';
  $: if (mounted && (!formInteracted || $projectContext.transferRevision !== lastTransferRevision)) {
    syncFromContext($projectContext);
    lastTransferRevision = $projectContext.transferRevision;
  }

  function contextCapacity(context: ProjectContext) {
    return context.capacity === 'custom' ? context.customCapacity : context.capacity;
  }

  function syncFromContext(context: ProjectContext) {
    formObjectType = context.objectType;
    formMetric = context.metric;
    const capacity = contextCapacity(context);
    personnelCount = context.metric === 'area' ? '' : capacity;
    area = context.metric === 'area' ? capacity : '';
    desiredCommissioningDate = context.commissioning;
    syncDesiredCommissioningField(context.commissioning);
    formRegion = context.region;
    if (context.mode === 'leasing') leasingInterest = true;
  }

  function changeDesiredCommissioning(value: string) {
    desiredCommissioningDate = value;
    syncDesiredCommissioningField(value);
  }

  function syncDesiredCommissioningField(value: string) {
    if (typeof document === 'undefined') return;
    const input = document.querySelector<HTMLInputElement>('#full-brief input[name="desiredCommissioningDate"]');
    if (!input) return;
    input.value = value;
    input.setAttribute('value', value);
  }

  onMount(() => {
    initProjectContext();
    applyLandingDefaults({ objectType: initialObjectType, region: initialRegion, typeIntent: typeLabel });
    const queryMode = new URL(window.location.href).searchParams.get('mode');
    setDiagnosisMode(queryMode === 'standard' || queryMode === 'tender' || queryMode === 'leasing' ? queryMode : initialMode);
    syncFromContext($projectContext);
    lastTransferRevision = $projectContext.transferRevision;
    mounted = true;
  });

  function markStarted() {
    formInteracted = true;
    if (started) return;
    started = true;
    trackEvent('form_start', { mode });
  }

  function changeFormObjectType(value: string) {
    formObjectType = objectTypeDefinitions.some((item) => item.id === value) ? value as ObjectTypeSelection : '';
    const definition = objectTypeDefinitions.find((item) => item.id === formObjectType);
    if (!definition) {
      personnelCount = '';
      area = '';
      clearObjectType();
      return;
    }
    setObjectType(definition.id);
    formMetric = definition.metric;
    if (formMetric === 'area') {
      area = definition.capacityOptions[0];
      personnelCount = '';
    } else {
      personnelCount = definition.capacityOptions[0];
      area = '';
    }
  }

  function validateFiles(list: FileList | null) {
    if (!list?.length) return '';
    if (list.length > 10) return 'Можно приложить не более 10 файлов.';
    let total = 0;
    for (const file of list) {
      total += file.size;
      const extension = file.name.split('.').at(-1)?.toLowerCase() ?? '';
      if (!acceptedExtensions.includes(extension)) return 'Допустимы PDF, DOCX, XLSX, DWG, JPG, PNG и ZIP.';
      if (file.size > 20 * 1024 * 1024) return 'Размер одного файла не должен превышать 20 МБ.';
    }
    if (total > 40 * 1024 * 1024) return 'Общий размер файлов не должен превышать 40 МБ.';
    return '';
  }

  function handleFiles(event: Event) {
    files = (event.currentTarget as HTMLInputElement).files;
    const error = validateFiles(files);
    fieldErrors = { ...fieldErrors, files: error };
    if (files?.length && !error) trackEvent('file_attach', { count: files.length, mode });
  }

  function clientValidate(form: HTMLFormElement) {
    const data = new FormData(form);
    const next: Record<string, string> = {};
    if (!data.get('consent')) next.consent = 'Подтвердите согласие на обработку данных.';
    const phoneValue = String(data.get('phone') ?? '').trim();
    const emailValue = String(data.get('email') ?? '').trim();
    if (!phoneValue && !emailValue) next.contact = 'Укажите телефон или электронную почту.';
    if (phoneValue && !isPlausiblePhone(phoneValue)) next.phone = 'Укажите корректный телефон: от 10 до 15 цифр.';
    if (emailValue && !isValidEmail(emailValue)) next.email = 'Проверьте электронную почту.';
    if (tender) {
      for (const [field, message] of [['company', 'Укажите компанию.'], ['tenderName', 'Укажите название тендера.'], ['deadline', 'Укажите срок подачи.'], ['region', 'Укажите регион объекта.']] as const) {
        if (!String(data.get(field) ?? '').trim()) next[field] = message;
      }
    } else {
      if (!String(data.get('objectType') ?? '').trim()) next.objectType = 'Выберите тип объекта.';
      if (!String(data.get('region') ?? '').trim()) next.region = 'Выберите регион.';
      if (!String(data.get('personnelCount') ?? '').trim() && !String(data.get('area') ?? '').trim()) next.capacity = 'Укажите численность персонала или ориентировочную площадь.';
    }
    const fileError = validateFiles(files);
    if (fileError) next.files = fileError;
    return next;
  }

  function normalizeServerErrors(errors: Record<string, string> = {}) {
    const normalized: Record<string, string> = {};
    for (const [key, value] of Object.entries(errors)) {
      const target = visibleServerFields.has(key) ? key : 'form';
      normalized[target] = normalized[target] ? `${normalized[target]} ${value}` : value;
    }
    return normalized;
  }

  function focusFirstError(form: HTMLFormElement, errors: Record<string, string>) {
    const errorKeys = new Set(Object.keys(errors));
    if (!errorKeys.size) return;
    const controls = [...form.querySelectorAll<HTMLElement>('[name]')];
    const target = controls.find((control) => {
      const name = control.getAttribute('name') ?? '';
      if (errorKeys.has(name)) return true;
      if (errorKeys.has('capacity') && (name === 'personnelCount' || name === 'area')) return true;
      if (errorKeys.has('contact') && (name === 'phone' || name === 'email')) return true;
      return false;
    });
    (target ?? form.querySelector<HTMLButtonElement>('button[type="submit"]'))?.focus();
  }

  async function switchToTender() {
    trackEvent('tender_start', { placement: 'full-form-toggle' });
    await goto(diagnosisHref(new URL(window.location.href), 'tender', '#full-brief'), { replaceState: true, keepFocus: true, noScroll: true });
    setDiagnosisMode('tender');
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    formInteracted = true;
    const form = event.currentTarget as HTMLFormElement;
    status = 'idle';
    statusMessage = '';
    reference = '';
    fieldErrors = clientValidate(form);
    const firstError = Object.keys(fieldErrors)[0];
    if (firstError) {
      status = 'error';
      statusMessage = 'Проверьте выделенные поля. Введённые данные сохранены.';
      trackEvent('form_validation_error', { mode, field: firstError });
      focusFirstError(form, fieldErrors);
      return;
    }

    submitting = true;
    const body = new FormData(form);
    body.set('mode', mode);
    body.set('landingRoute', window.location.pathname);
    body.set('pageUrl', `${window.location.origin}${window.location.pathname}${window.location.search}`);
    const currentUrl = new URL(window.location.href);
    const regionSlug = currentUrl.searchParams.get('region') ?? '';
    const typeVariant = currentUrl.searchParams.get('type') ?? '';
    body.set('regionSlug', regionVariantSlugs.includes(regionSlug as typeof regionVariantSlugs[number]) ? regionSlug : '');
    body.set('typeVariant', typeVariantSlugs.includes(typeVariant as typeof typeVariantSlugs[number]) ? typeVariant : '');
    const attribution = getAttribution();
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid', 'referrer', 'landing_variant']) {
      const value = attribution[key];
      if (value) body.set(key, value);
    }

    try {
      const response = await fetch('/api/leads', { method: 'POST', body });
      const result = await response.json() as { ok: boolean; message?: string; reference?: string; errors?: Record<string, string> };
      if (!response.ok || !result.ok) {
        fieldErrors = normalizeServerErrors(result.errors);
        status = 'error';
        statusMessage = result.message ?? 'Не удалось передать заявку. Введённые данные сохранены.';
        reference = result.reference ?? '';
        trackEvent('form_submit_error', { mode, status: response.status });
        focusFirstError(form, fieldErrors);
        return;
      }
      status = 'success';
      reference = result.reference ?? '';
      trackEvent(mode === 'tender' ? 'tender_submit_success' : 'form_submit_success', { mode });
    } catch {
      status = 'error';
      statusMessage = 'Нет соединения с сервером. Введённые данные сохранены — попробуйте ещё раз.';
      trackEvent('form_submit_error', { mode, status: 0 });
    } finally {
      submitting = false;
    }
  }
</script>

<section class="full-brief" id="full-brief" aria-labelledby="full-brief-title">
  <div class="full-brief__intro">
    <p class="eyebrow">{tender ? 'Тендерный контур' : mode === 'leasing' ? 'Проект и лизинговая схема' : 'Полная заявка'}</p>
    <h2 id="full-brief-title" tabindex="-1">{tender ? 'Передайте параметры тендера.' : 'Дадим заявке инженерный контекст.'}</h2>
    <p>{tender ? 'Название процедуры, срок подачи, регион и исходные файлы попадут в отдельный тендерный сценарий.' : 'Не обязательно знать всё: укажите численность или площадь, а недостающие параметры менеджер уточнит после отправки.'}</p>
    {#if typeLabel}<p class="full-brief__leasing">Контекст рекламного запроса: <strong>{typeLabel}</strong>.</p>{/if}
    {#if mode === 'leasing'}<p class="full-brief__leasing">Возможна поставка в лизинг. Условия зависят от проекта и лизинговой компании.</p>{/if}
  </div>

  <form class="full-form" onsubmit={submit} onfocusin={markStarted} novalidate aria-describedby="form-status">
    <input type="hidden" name="mode" value={mode} />
    <input type="hidden" name="capacityMetric" value={formMetric} />
    {#each $projectContext.selectedZones as zone}<input type="hidden" name="functionalZones[]" value={zone} />{/each}
    {#if tender}<input type="hidden" name="tenderInvitation" value="true" />{/if}

    {#if tender}
      <label class="field"><span>Компания *</span><input name="company" maxlength="240" autocomplete="organization" bind:value={company} aria-invalid={fieldErrors.company ? 'true' : 'false'} aria-describedby="company-error" /><span class="field__error" id="company-error">{fieldErrors.company ?? ''}</span></label>
      <label class="field"><span>Название тендера *</span><input name="tenderName" maxlength="320" bind:value={tenderName} aria-invalid={fieldErrors.tenderName ? 'true' : 'false'} aria-describedby="tender-name-error" /><span class="field__error" id="tender-name-error">{fieldErrors.tenderName ?? ''}</span></label>
      <label class="field"><span>Срок подачи *</span><input type="date" name="deadline" bind:value={deadline} aria-invalid={fieldErrors.deadline ? 'true' : 'false'} aria-describedby="deadline-error" /><span class="field__error" id="deadline-error">{fieldErrors.deadline ?? ''}</span></label>
      <label class="field"><span>Объект</span><select name="objectType" bind:value={formObjectType} onchange={(event) => changeFormObjectType(event.currentTarget.value)} aria-invalid={fieldErrors.objectType ? 'true' : 'false'} aria-describedby="full-object-error"><option value="">Не выбран</option>{#each objectTypeDefinitions as item}<option value={item.id}>{item.label}</option>{/each}</select><span class="field__error" id="full-object-error">{fieldErrors.objectType ?? ''}</span></label>
    {:else}
      <label class="field"><span>Тип объекта *</span><select name="objectType" bind:value={formObjectType} onchange={(event) => changeFormObjectType(event.currentTarget.value)} aria-invalid={fieldErrors.objectType ? 'true' : 'false'} aria-describedby="full-object-error"><option value="">Выберите тип объекта</option>{#each objectTypeDefinitions as item}<option value={item.id}>{item.label}</option>{/each}</select><span class="field__error" id="full-object-error">{fieldErrors.objectType ?? ''}</span></label>
      <label class="field"><span>{formMetric === 'workplaces' ? 'Рабочие места' : 'Численность персонала'}</span><input type="number" min="1" name="personnelCount" inputmode="numeric" bind:value={personnelCount} aria-invalid={fieldErrors.personnelCount || fieldErrors.capacity ? 'true' : 'false'} aria-describedby="personnel-count-error" /><span class="field__error" id="personnel-count-error">{fieldErrors.personnelCount ?? fieldErrors.capacity ?? ''}</span></label>
      <label class="field"><span>Ориентировочная площадь, м²</span><input type="number" min="1" step="0.01" name="area" inputmode="decimal" bind:value={area} aria-invalid={fieldErrors.area || fieldErrors.capacity ? 'true' : 'false'} aria-describedby="area-error" /><span class="field__error" id="area-error">{fieldErrors.area ?? fieldErrors.capacity ?? ''}</span></label>
      <div class="field field--commissioning"><span>Планируемый ввод в эксплуатацию</span><CommissioningSelector bind:value={desiredCommissioningDate} inputName="desiredCommissioningDate" invalid={Boolean(fieldErrors.desiredCommissioningDate)} errorId="commissioning-error" onValueChange={changeDesiredCommissioning} /><span class="field__error" id="commissioning-error">{fieldErrors.desiredCommissioningDate ?? ''}</span></div>
      <label class="field"><span>Стадия проекта</span><select name="projectStage" bind:value={projectStage} aria-invalid={fieldErrors.projectStage ? 'true' : 'false'} aria-describedby="project-stage-error"><option value="">Не выбрана</option>{#each projectStageOptions as stage}<option value={stage}>{stage}</option>{/each}</select><span class="field__error" id="project-stage-error">{fieldErrors.projectStage ?? ''}</span></label>
    {/if}

    <label class="field"><span>Регион объекта *</span><select name="region" bind:value={formRegion} aria-invalid={fieldErrors.region ? 'true' : 'false'} aria-describedby="full-region-error">{#each regionOptions as item}<option value={item.value}>{item.label}</option>{/each}</select><span class="field__error" id="full-region-error">{fieldErrors.region ?? ''}</span></label>

    {#if !tender}
      <fieldset class="full-form__wide checkbox-group"><legend>Требуемый состав работ</legend>{#each scopeOptions as option}<label><input type="checkbox" name="scope[]" value={option} bind:group={selectedScope} /> <span>{option}</span></label>{/each}</fieldset>
      <label class="full-form__wide checkline"><input type="checkbox" name="leasingInterest" bind:checked={leasingInterest} /> <span>Интересует поставка в лизинг</span></label>
      <label class="full-form__wide checkline"><input type="checkbox" name="tenderInvitation" onchange={(event) => { if (event.currentTarget.checked) switchToTender(); }} /> <span>Это приглашение в тендер — открыть тендерную форму</span></label>
    {/if}

    <label class="field full-form__wide"><span>Комментарий</span><textarea name="comment" rows="4" maxlength="4000" bind:value={comment} placeholder="Функция объекта, площадка, ограничения или недостающие исходные данные" aria-invalid={fieldErrors.comment ? 'true' : 'false'} aria-describedby="comment-error"></textarea><span class="field__error" id="comment-error">{fieldErrors.comment ?? ''}</span></label>
    {#if !tender}<label class="field"><span>Компания</span><input name="company" maxlength="240" autocomplete="organization" bind:value={company} aria-invalid={fieldErrors.company ? 'true' : 'false'} aria-describedby="company-error" /><span class="field__error" id="company-error">{fieldErrors.company ?? ''}</span></label>{/if}
    <label class="field"><span>Имя</span><input name="name" maxlength="160" autocomplete="name" bind:value={name} aria-invalid={fieldErrors.name ? 'true' : 'false'} aria-describedby="name-error" /><span class="field__error" id="name-error">{fieldErrors.name ?? ''}</span></label>
    <label class="field"><span>Телефон</span><input type="tel" name="phone" maxlength="80" autocomplete="tel" bind:value={phone} aria-invalid={fieldErrors.phone || fieldErrors.contact ? 'true' : 'false'} aria-describedby="phone-error" /><span class="field__error" id="phone-error">{fieldErrors.phone ?? fieldErrors.contact ?? ''}</span></label>
    <label class="field"><span>Электронная почта</span><input type="email" name="email" maxlength="254" autocomplete="email" bind:value={email} aria-invalid={fieldErrors.email || fieldErrors.contact ? 'true' : 'false'} aria-describedby="email-error" /><span class="field__error" id="email-error">{fieldErrors.email ?? fieldErrors.contact ?? ''}</span></label>
    <label class="field full-form__wide file-picker"><span>Исходные файлы</span><input class="file-picker__native" type="file" name="files[]" multiple accept=".pdf,.docx,.xlsx,.dwg,.jpg,.jpeg,.png,.zip" onchange={handleFiles} aria-label="Исходные файлы — Выбрать файлы" aria-invalid={fieldErrors.files ? 'true' : 'false'} aria-describedby="files-status files-note files-error" /><span class="file-picker__button" aria-hidden="true">Выбрать файлы</span><span class="file-picker__status" id="files-status" aria-live="polite">{fileSummary}</span><small id="files-note">PDF, DOCX, XLSX, DWG, JPG, PNG, ZIP. До 10 файлов, 20 МБ каждый, 40 МБ суммарно. Файлы передаются только после отправки.</small><span class="field__error" id="files-error">{fieldErrors.files ?? ''}</span></label>
    <label class="full-form__wide checkline consent"><input type="checkbox" name="consent" required bind:checked={consent} aria-invalid={fieldErrors.consent ? 'true' : 'false'} aria-describedby="consent-error" /> <span>Согласен на обработку персональных данных по <a href="/privacy-policy/">политике конфиденциальности</a>.</span><span class="field__error" id="consent-error">{fieldErrors.consent ?? ''}</span></label>

    <div class="full-form__submit full-form__wide">
      <button class="button button--primary" type="submit" disabled={submitting}>{submitting ? 'Передаём…' : tender ? 'Отправить приглашение в тендер' : 'Отправить заявку'}</button>
      <p>Телефон или электронная почта — достаточно одного способа связи.</p>
    </div>

    <div id="form-status" class:form-status--success={status === 'success'} class:form-status--error={status === 'error'} class="form-status full-form__wide" role={status === 'error' ? 'alert' : 'status'} aria-live="polite">
      {#if status === 'success'}
        <strong>Заявка принята.</strong>
        <span>Менеджер уточнит исходные данные.</span>
        <span>Предварительное КП подготовим в течение одного рабочего дня после получения необходимых вводных.</span>
        {#if reference}<small>Номер заявки: {reference}</small>{/if}
      {:else if status === 'error'}
        <strong>Заявка не отправлена.</strong><span>{statusMessage}</span>{#if fieldErrors.form}<span>{fieldErrors.form}</span>{/if}{#if reference}<small>Номер попытки: {reference}</small>{/if}
      {/if}
    </div>
  </form>
</section>
