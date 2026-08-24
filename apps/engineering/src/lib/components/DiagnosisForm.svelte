<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { track } from '$lib/analytics';
  import { validateFiles, maxFiles } from '$lib/file-policy';

  let heard = '';
  let direction = '';
  let timing = '';
  let rooms = '';
  let stage = '';
  let buildingType = '';
  let area = '';
  let space = '';
  let sourceContext = '';
  let comment = '';
  let name = '';
  let phone = '';
  let email = '';
  let consent = false;
  let files: File[] = [];
  let fileErrors: string[] = [];
  let status: 'idle' | 'sending' | 'success' | 'error' = 'idle';
  let message = '';
  let errors: string[] = [];
  let touched = false;
  let dragging = false;
  let step = 0;
  let stepError = '';
  let contactError = '';
  let submitAttempted = false;
  let handoffTags: string[] = [];
  let formRoot: HTMLFormElement;
  let stepErrorElement: HTMLParagraphElement;
  let contactErrorElement: HTMLParagraphElement;

  const phonePattern = '\\+?[0-9\\s\\(\\)\\-]{7,20}';
  const stepLabels = ['Симптом', 'Контекст', 'Материалы', 'Контакты'];
  $: phoneIsValid = new RegExp(`^${phonePattern}$`).test(phone);

  $: carriedValues = [
    heard && `Шум: ${heard}`,
    direction && `Направление: ${direction}`,
    stage && `Этап: ${stage}`,
    rooms && `Комната: ${rooms}`,
    space && `Приоритет: ${space}`,
    ...handoffTags
  ].filter(Boolean) as string[];

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    heard = params.get('noise') || heard;
    direction = params.get('direction') || direction;
    const carriedStage = params.get('stage');
    if (carriedStage) {
      stage = carriedStage === 'new' ? 'новостройка до ремонта' : carriedStage === 'progress' ? 'ремонт идёт' : carriedStage === 'finished' ? 'готовая квартира' : carriedStage;
    }
    rooms = params.get('room') || rooms;
    area = params.get('area') || area;
    space = params.get('space') || space;
    const service = params.get('service');
    const caseSlug = params.get('case');
    const source = params.get('source');
    const route = params.get('route');
    const noiseId = params.get('noiseId');
    const context = params.get('context');
    const stageContext = params.get('stageContext');
    const construction = params.get('construction');
    const sourcePage = params.get('source_page');
    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');
    const utmTerm = params.get('utm_term');
    const utmContent = params.get('utm_content');
    handoffTags = [
      route && `Маршрут: ${route}`,
      noiseId && `Код симптома: ${noiseId}`,
      context && `Гипотеза: ${context}`,
      stageContext && `Контекст этапа: ${stageContext}`,
      construction && `Узел: ${construction}`,
      source && `Код перехода: ${source}`,
      sourcePage && `Страница-источник: ${sourcePage}`,
      utmSource && `Источник кампании: ${utmSource}`,
      utmMedium && `Канал кампании: ${utmMedium}`,
      utmCampaign && `Кампания: ${utmCampaign}`,
      utmTerm && `Ключ кампании: ${utmTerm}`,
      utmContent && `Вариант объявления: ${utmContent}`
    ].filter(Boolean) as string[];
    const sourceParts = [
      service && `Услуга: ${service}`,
      caseSlug && `Кейс: ${caseSlug}`,
      source === 'scenario-v2' && 'Предварительный сценарий с главной',
      source === 'mobile-sticky' && 'Мобильный sticky CTA',
      source && `Код перехода: ${source}`,
      noiseId && `Код симптома: ${noiseId}`,
      route && `Маршрут: ${route}`,
      context && `Рабочая гипотеза: ${context}`,
      stageContext && `Контекст этапа: ${stageContext}`,
      construction && `Конструктивный узел: ${construction}`,
      sourcePage && `Источник: ${sourcePage}`,
      utmSource && `UTM source: ${utmSource}`,
      utmMedium && `UTM medium: ${utmMedium}`,
      utmCampaign && `UTM campaign: ${utmCampaign}`,
      utmTerm && `UTM term: ${utmTerm}`,
      utmContent && `UTM content: ${utmContent}`
    ].filter(Boolean);
    sourceContext = sourceParts.join(' · ');
    const carried = params.get('comment');
    if (carried) comment = carried;
  });

  function markStarted() {
    if (touched) return;
    touched = true;
    track('form_started', { form: 'full-diagnosis' });
    track('full_form_start', { source: sourceContext || 'direct' });
  }

  async function focusCurrentGroup() {
    await tick();
    const target = formRoot?.querySelector('.form-group:not([hidden]) .form-group-label strong') as HTMLElement | null;
    target?.focus({ preventScroll: true });
  }

  function revealStepError(message: string) {
    stepError = message;
    void tick().then(() => stepErrorElement?.focus());
  }

  function nextStep() {
    stepError = '';
    if (step === 0 && (!heard.trim() || !direction.trim() || !timing.trim() || !rooms.trim())) {
      revealStepError('Заполните четыре поля симптома, чтобы перейти к контексту квартиры.');
      track('form_validation_error', { field: 'full_step_symptom' });
      return;
    }
    if (step === 1 && !stage) {
      revealStepError('Выберите этап квартиры.');
      track('form_validation_error', { field: 'full_step_context' });
      return;
    }
    step = Math.min(step + 1, stepLabels.length - 1);
    void focusCurrentGroup();
  }

  function previousStep() {
    stepError = '';
    step = Math.max(step - 1, 0);
    void focusCurrentGroup();
  }

  function fileCategory(file: File) {
    const file_category = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : file.type.startsWith('audio/') ? 'audio' : 'document';
    const extension = file.name.split('.').pop()?.toLowerCase() ?? 'unknown';
    const size_bucket = file.size < 1024 * 1024 ? 'under_1mb' : file.size < 5 * 1024 * 1024 ? '1_to_5mb' : 'over_5mb';
    return { file_category, extension, size_bucket };
  }

  function addFiles(incoming: File[]) {
    const next = [...files, ...incoming].slice(0, maxFiles);
    const nextErrors = validateFiles(next);
    if (incoming.length + files.length > maxFiles) nextErrors.unshift(`Можно приложить не больше ${maxFiles} файлов.`);
    fileErrors = nextErrors;
    if (!nextErrors.length) {
      files = next;
      incoming.forEach((file) => track('file_attached', fileCategory(file)));
    } else {
      track('form_validation_error', { field: 'files' });
    }
  }

  function chooseFiles(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    addFiles(Array.from(input.files ?? []));
    input.value = '';
  }

  function dropFiles(event: DragEvent) {
    event.preventDefault();
    dragging = false;
    addFiles(Array.from(event.dataTransfer?.files ?? []));
  }

  function removeFile(index: number) {
    files = files.filter((_, current) => current !== index);
    fileErrors = validateFiles(files);
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    status = 'sending';
    errors = [];
    message = '';
    contactError = '';
    submitAttempted = true;
    const form = event.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      status = 'idle';
      contactError = 'Проверьте обязательные поля: имя, телефон и согласие на обработку данных.';
      track('form_validation_error', { field: 'browser_validation' });
      await tick();
      contactErrorElement?.focus();
      return;
    }
    fileErrors = validateFiles(files);
    if (fileErrors.length) {
      status = 'idle';
      step = 2;
      track('form_validation_error', { field: 'files' });
      return;
    }
    const data = new FormData(form);
    data.delete('file-picker');
    files.forEach((file) => data.append('files', file, file.name));
    try {
      const response = await fetch('/api/diagnosis', { method: 'POST', body: data });
      const payload = (await response.json()) as { ok: boolean; message?: string; errors?: string[] };
      if (!response.ok || !payload.ok) {
        status = 'error';
        errors = payload.errors ?? [];
        message = payload.message || 'Сервер не подтвердил приём заявки.';
        track('form_submit_error', { form: 'full-diagnosis', status: response.status });
        return;
      }
      status = 'success';
      message = 'Заявка принята. Менеджер уточнит симптом и согласует следующий коммерческий шаг — выездную диагностику.';
      track('form_submit_success', { form: 'full-diagnosis' });
      files = [];
    } catch {
      status = 'error';
      message = 'Не удалось связаться с сервером. Данные остались в форме — попробуйте ещё раз.';
      track('form_submit_error', { form: 'full-diagnosis', status: 'network' });
    }
  }
</script>

<form bind:this={formRoot} class="diagnosis-form progressive-form" method="post" enctype="multipart/form-data" novalidate on:submit={submit} on:focusin={markStarted}>
  <header class="form-progress">
    <div><span>Полный бриф</span><strong>0{step + 1} / 04 · {stepLabels[step]}</strong></div>
    <ol aria-label="Прогресс формы">
      {#each stepLabels as label, index}<li class:active={index === step} class:done={index < step}><span>{index + 1}</span><small>{label}</small></li>{/each}
    </ol>
  </header>

  {#if sourceContext || carriedValues.length}
    <div class="carried-panel" role="note" aria-label="Контекст, перенесённый в форму">
      <span>Контекст сохранён</span><strong>{sourceContext || 'Предварительные ответы'}</strong>
      {#if carriedValues.length}<ul>{#each carriedValues as value}<li>{value}</li>{/each}</ul>{/if}
    </div>
  {/if}

  <div class="form-group" hidden={step !== 0}>
    <div class="form-group-label"><span>01</span><strong tabindex="-1">Что происходит в квартире?</strong></div>
    <label>Что слышно?<textarea name="heard" bind:value={heard} required rows="3" placeholder="Например, шаги и удары вечером" aria-invalid={step === 0 && stepError && !heard.trim() ? 'true' : undefined} aria-describedby={step === 0 && stepError && !heard.trim() ? 'diagnosis-step-error' : undefined}></textarea></label>
    <div class="field-pair">
      <label>Откуда, предположительно?<input name="direction" bind:value={direction} required placeholder="Сверху, сбоку, с улицы" aria-invalid={step === 0 && stepError && !direction.trim() ? 'true' : undefined} aria-describedby={step === 0 && stepError && !direction.trim() ? 'diagnosis-step-error' : undefined} /></label>
      <label>Когда это слышно?<input name="timing" bind:value={timing} required placeholder="Ночью, по выходным, постоянно" aria-invalid={step === 0 && stepError && !timing.trim() ? 'true' : undefined} aria-describedby={step === 0 && stepError && !timing.trim() ? 'diagnosis-step-error' : undefined} /></label>
    </div>
    <label>В каких комнатах?<input name="rooms" bind:value={rooms} required placeholder="Спальня и детская" aria-invalid={step === 0 && stepError && !rooms.trim() ? 'true' : undefined} aria-describedby={step === 0 && stepError && !rooms.trim() ? 'diagnosis-step-error' : undefined} /></label>
  </div>

  <div class="form-group" hidden={step !== 1}>
    <div class="form-group-label"><span>02</span><strong tabindex="-1">Контекст квартиры</strong></div>
    <label>Этап
      <select name="stage" bind:value={stage} required aria-invalid={step === 1 && stepError && !stage ? 'true' : undefined} aria-describedby={step === 1 && stepError && !stage ? 'diagnosis-step-error' : undefined}><option value="" disabled>Выберите этап</option><option>новостройка до ремонта</option><option>ремонт идёт</option><option>готовая квартира</option></select>
    </label>
    <div class="field-pair">
      <label>Тип дома <small>необязательно</small><input name="buildingType" bind:value={buildingType} /></label>
      <label>Проблемная площадь <small>необязательно</small><input name="area" bind:value={area} /></label>
    </div>
    <label>Допустимая потеря пространства <small>необязательно</small>
      <select name="space" bind:value={space}><option value="">Нужно обсудить</option><option>минимальная</option><option>готов обсуждать</option></select>
    </label>
    <input type="hidden" name="sourceContext" value={sourceContext} />
    <label>Комментарий <small>необязательно</small><textarea name="comment" bind:value={comment} rows="4" placeholder="Что уже пробовали, что важно сохранить"></textarea></label>
  </div>

  <div class="form-group" hidden={step !== 2}>
    <div class="form-group-label"><span>03</span><strong tabindex="-1">Материалы к задаче</strong></div>
    <div class:dragging class="file-tray" role="group" aria-label="Необязательные материалы к задаче" on:dragover={(event) => { event.preventDefault(); dragging = true; }} on:dragleave={() => (dragging = false)} on:drop={dropFiles}>
      <label><strong>Приложить план, фото, видео или аудио</strong><span>PDF, JPG, PNG, HEIC, MP4, MOV, M4A, MP3, WAV · необязательно</span><input name="file-picker" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,.mp4,.mov,.m4a,.mp3,.wav" on:change={chooseFiles} /></label>
    </div>
    <p class="file-context">Запись с телефона помогает понять контекст, но не заменяет профессиональный замер.</p>
    {#if fileErrors.length}<ul class="form-errors" aria-live="polite">{#each fileErrors as error}<li>{error}</li>{/each}</ul>{/if}
    {#if files.length}<ul class="file-list" aria-label="Прикреплённые файлы">{#each files as file, index}<li><span><strong>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(1)} МБ · {file.type || 'тип не указан'}</small></span><button type="button" on:click={() => removeFile(index)} aria-label={`Удалить ${file.name}`}>Удалить</button></li>{/each}</ul>{/if}
    <p class="optional-step">Файлы необязательны — можно продолжить без них.</p>
  </div>

  <div class="form-group contact-group" hidden={step !== 3}>
    <div class="form-group-label"><span>04</span><strong tabindex="-1">Кому ответить?</strong></div>
    <div class="field-pair">
      <label>Имя<input name="name" bind:value={name} autocomplete="name" required aria-invalid={submitAttempted && !name.trim() ? 'true' : undefined} aria-describedby={submitAttempted && !name.trim() ? 'diagnosis-contact-error' : undefined} /></label>
      <label>Телефон<input name="phone" bind:value={phone} autocomplete="tel" inputmode="tel" required pattern={phonePattern} aria-invalid={submitAttempted && !phoneIsValid ? 'true' : undefined} aria-describedby={submitAttempted && !phoneIsValid ? 'diagnosis-contact-error' : undefined} /></label>
    </div>
    <label>Email <small>необязательно</small><input name="email" bind:value={email} autocomplete="email" type="email" /></label>
    <label class="consent"><input type="checkbox" name="consent" value="yes" bind:checked={consent} required aria-invalid={submitAttempted && !consent ? 'true' : undefined} aria-describedby={submitAttempted && !consent ? 'diagnosis-contact-error' : undefined} /><span>Согласен на обработку персональных данных и ознакомлен с <a href="/privacy-policy/" target="_blank">политикой конфиденциальности</a>.</span></label>
  </div>

  {#if stepError}<p bind:this={stepErrorElement} class="step-error" id="diagnosis-step-error" role="alert" tabindex="-1"><strong>Проверьте текущий шаг.</strong> {stepError}</p>{/if}
  {#if contactError}<p bind:this={contactErrorElement} class="step-error" id="diagnosis-contact-error" role="alert" tabindex="-1"><strong>Заявка не готова к отправке.</strong> {contactError}</p>{/if}

  <div class="progressive-actions">
    {#if step > 0}<button type="button" class="back-action" on:click={previousStep}>← Назад</button>{/if}
    {#if step < 3}<button type="button" class="primary-button" on:click={nextStep}>{step === 2 ? 'Продолжить без файлов' : 'Следующий шаг'} →</button>
    {:else}<button class="primary-button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Передаём заявку…' : 'Отправить заявку на диагностику'}</button>{/if}
  </div>

  {#if status === 'success'}<div class="form-status success" role="status">{message}</div>{/if}
  {#if status === 'error'}<div class="form-status error" role="alert"><strong>Заявка пока не отправлена.</strong><p>{message}</p>{#if errors.length}<ul>{#each errors as error}<li>{error}</li>{/each}</ul>{/if}</div>{/if}
</form>

<style>
  .progressive-form [hidden] { display: none !important; }
  .form-progress { margin-bottom: 3rem; }
  .form-progress > div { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
  .form-progress > div span { font: 0.75rem 'IBM Plex Mono', monospace; color: #48635f; text-transform: uppercase; }
  .form-progress > div strong { font-size: 0.9rem; }
  .form-progress ol { display: grid; grid-template-columns: repeat(4, 1fr); margin: 1.3rem 0 0; padding: 0; list-style: none; }
  .form-progress li { display: flex; align-items: center; gap: 0.55rem; min-height: 48px; border-top: 2px solid #c2c8c2; color: #6a716c; }
  .form-progress li.active,
  .form-progress li.done { border-color: #a94332; color: #242824; }
  .form-progress li span { font: 0.75rem 'IBM Plex Mono', monospace; }
  .form-progress li small { font-size: 0.75rem; }
  .carried-panel { margin-bottom: 2.5rem; padding: 1.2rem; border-left: 4px solid #698078; background: #dfe4de; }
  .carried-panel > span { display: block; font: 0.75rem 'IBM Plex Mono', monospace; color: #48635f; text-transform: uppercase; }
  .carried-panel > strong { display: block; margin-top: 0.5rem; }
  .carried-panel ul { display: flex; flex-wrap: wrap; gap: 0.45rem; margin: 1rem 0 0; padding: 0; list-style: none; }
  .carried-panel li { padding: 0.4rem 0.55rem; background: #fbfaf6; font-size: 0.78rem; }
  .progressive-form .form-group { min-height: 31rem; }
  .optional-step { margin-top: 1.2rem; color: #4e5650; }
  .step-error { padding: 0.9rem; border-left: 4px solid #a94332; background: #f0dfd8; }
  .progressive-actions { display: flex; align-items: center; justify-content: flex-end; gap: 1.2rem; padding-top: 1.5rem; border-top: 1px solid #aeb8b0; }
  .back-action { min-height: 48px; padding-inline: 1rem; border: 0; border-bottom: 1px solid #77827b; background: transparent; color: #242824; cursor: pointer; }
  .progressive-actions .primary-button { min-height: 52px; }

  @media (max-width: 700px) {
    .form-progress ol { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .form-progress li { align-items: flex-start; flex-direction: column; gap: 0.2rem; padding-top: 0.55rem; }
    .form-progress li small { font-size: 0.75rem; }
    .progressive-form .form-group { min-height: 0; }
    .carried-panel ul { display: grid; }
    .progressive-actions { position: sticky; bottom: 0; z-index: 4; margin-inline: -1.1rem; padding: 0.8rem 1.1rem calc(0.8rem + env(safe-area-inset-bottom)); background: #f2eee6; box-shadow: 0 -8px 20px rgba(32, 35, 31, 0.08); }
    .progressive-actions .primary-button { flex: 1; justify-content: center; }
  }
</style>
