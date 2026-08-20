<script lang="ts">
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  import { validateFiles } from '$lib/diagnostic';
  import { diagnosticContext } from '$lib/stores/diagnostic';
  import { noiseProfiles } from '$lib/data/site';
  import { track } from '$lib/analytics';

  export let form: {
    success?: boolean;
    message?: string;
    reference?: string;
    issues?: Record<string, string[]>;
    values?: Record<string, string>;
  } | null = null;
  export let action = '?';

  let heard = form?.values?.heard ?? '';
  let direction = form?.values?.direction ?? '';
  let timing = form?.values?.timing ?? '';
  let stage = form?.values?.stage ?? '';
  let rooms = form?.values?.rooms ?? '';
  let building = form?.values?.building ?? '';
  let area = form?.values?.area ?? '';
  let comment = form?.values?.comment ?? '';
  let name = form?.values?.name ?? '';
  let phone = form?.values?.phone ?? '';
  let email = form?.values?.email ?? '';
  let sourceContext = form?.values?.sourceContext ?? '';
  let utmSource = form?.values?.utmSource ?? '';
  let utmMedium = form?.values?.utmMedium ?? '';
  let utmCampaign = form?.values?.utmCampaign ?? '';
  let utmContent = form?.values?.utmContent ?? '';
  let utmTerm = form?.values?.utmTerm ?? '';
  let fileInput: HTMLInputElement;
  let formElement: HTMLFormElement;
  let files: File[] = [];
  let fileErrors: string[] = [];
  let submitting = false;
  let dragging = false;
  let focusedStep = 0;
  let maxStep = 0;
  let started = false;
  let submittedSuccess = false;
  const trackedFiles = new WeakSet<File>();

  const persistedPath = {
    impact: 'ceiling',
    voices: 'socket',
    bass: 'junction',
    lift: 'junction',
    road: 'wall',
    ventilation: 'ventilation'
  } as const;
  const persistedDirection = {
    impact: 'above',
    voices: 'side',
    bass: 'unknown',
    lift: 'unknown',
    road: 'facade',
    ventilation: 'ventilation'
  } as const;

  $: if (!heard && $diagnosticContext.noise) heard = noiseProfiles.find((profile) => profile.key === $diagnosticContext.noise)?.label ?? '';
  $: if (!direction && $diagnosticContext.direction) direction = $diagnosticContext.direction;
  $: if (!stage && $diagnosticContext.stage) stage = $diagnosticContext.stage;
  $: if (!rooms && $diagnosticContext.room) rooms = $diagnosticContext.room;
  $: if (!comment && $diagnosticContext.comment) comment = $diagnosticContext.comment;
  $: if (form?.success && !submittedSuccess) {
    submittedSuccess = true;
    track('form_submit_success');
  }

  onMount(() => {
    track('full_form_start');
    const params = new URL(window.location.href).searchParams;
    const storedScenario = sessionStorage.getItem('tech:v2:scenario');
    let scenarioNoise = '';
    if (storedScenario) {
      try {
        const scenario = JSON.parse(storedScenario) as { input?: Record<string, string> };
        if (scenario.input) {
          scenarioNoise = scenario.input.noise ?? '';
          diagnosticContext.update((context) => ({
            ...context,
            noise: (scenario.input?.noise ?? context.noise) as typeof context.noise,
            direction: scenario.input?.direction ?? context.direction,
            path: (scenario.input?.path ?? context.path) as typeof context.path,
            stage: (scenario.input?.stage ?? context.stage) as typeof context.stage,
            room: scenario.input?.room ?? context.room,
            spaceLoss: scenario.input?.spaceLoss ?? context.spaceLoss,
            comment: scenario.input?.comment ?? context.comment
          }));
        }
      } catch { /* ignore an invalid saved scenario */ }
    }
    const queryNoise = params.get('noise');
    const storedNoise = sessionStorage.getItem('tech:v2:noise');
    const key = noiseProfiles.find((profile) => profile.key === (queryNoise || scenarioNoise || storedNoise))?.key;
    if (key) {
      diagnosticContext.update((context) => ({
        ...context,
        noise: key,
        path: context.path || persistedPath[key],
        direction: context.direction || sessionStorage.getItem('tech:v2:direction') || persistedDirection[key]
      }));
    }
    utmSource ||= params.get('utm_source') ?? '';
    utmMedium ||= params.get('utm_medium') ?? '';
    utmCampaign ||= params.get('utm_campaign') ?? '';
    utmContent ||= params.get('utm_content') ?? '';
    utmTerm ||= params.get('utm_term') ?? '';
    sourceContext ||= JSON.stringify({
      page: window.location.pathname,
      noise: $diagnosticContext.noise,
      direction: $diagnosticContext.direction,
      path: $diagnosticContext.path,
      room: $diagnosticContext.room,
      priority: $diagnosticContext.spaceLoss
    });
    const issueNames = Object.keys(form?.issues ?? {});
    if (issueNames.some((name) => ['name', 'phone', 'email', 'consent'].includes(name))) focusedStep = maxStep = 3;
    else if (issueNames.includes('files')) focusedStep = maxStep = 2;
    else if (issueNames.some((name) => ['stage', 'building', 'area', 'comment'].includes(name))) focusedStep = maxStep = 1;
  });

  function goToStep(index: number) {
    if (index > maxStep) return;
    focusedStep = index;
    requestAnimationFrame(() => formElement?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  }

  function nextStep() {
    const fieldset = formElement?.querySelector<HTMLElement>(`fieldset[data-step="${focusedStep}"]`);
    const required = Array.from(fieldset?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[required]') ?? []);
    const invalid = required.find((control) => !control.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      track('form_validation_error', { field: invalid.name, step: focusedStep + 1 });
      return;
    }
    focusedStep = Math.min(3, focusedStep + 1);
    maxStep = Math.max(maxStep, focusedStep);
    requestAnimationFrame(() => formElement?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  }

  function previousStep() {
    focusedStep = Math.max(0, focusedStep - 1);
    requestAnimationFrame(() => formElement?.scrollIntoView({ block: 'start', behavior: 'smooth' }));
  }

  function startedForm() {
    if (started) return;
    started = true;
    track('form_started');
  }

  function selectedFiles() {
    files = Array.from(fileInput.files ?? []);
    fileErrors = validateFiles(files);
    if (fileErrors.length) track('form_validation_error', { field: 'files' });
    else {
      for (const file of files) {
        if (trackedFiles.has(file)) continue;
        trackedFiles.add(file);
        const extension = file.name.split('.').pop()?.toLowerCase() ?? 'unknown';
        const fileCategory = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : file.type.startsWith('audio/') ? 'audio' : 'document';
        const sizeBucket = file.size < 1024 * 1024 ? 'under_1mb' : file.size < 5 * 1024 * 1024 ? '1_to_5mb' : 'over_5mb';
        track('file_attached', { file_category: fileCategory, extension, size_bucket: sizeBucket });
      }
    }
  }

  function removeFile(index: number) {
    const transfer = new DataTransfer();
    files.filter((_, fileIndex) => fileIndex !== index).forEach((file) => transfer.items.add(file));
    fileInput.files = transfer.files;
    selectedFiles();
  }

  function dropped(event: DragEvent) {
    event.preventDefault();
    dragging = false;
    if (!event.dataTransfer?.files?.length) return;
    const transfer = new DataTransfer();
    [...files, ...Array.from(event.dataTransfer.files)].slice(0, 12).forEach((file) => transfer.items.add(file));
    fileInput.files = transfer.files;
    selectedFiles();
  }

  function markInvalid(event: Event) {
    const target = event.target as HTMLInputElement;
    track('form_validation_error', { field: target.name });
  }
</script>

<section class="diagnostic" id="diagnostic-form" aria-labelledby="diagnostic-title">
  <div class="shell diagnostic-head">
    <p class="mono">ДИАГНОСТИКА / 10</p>
    <h2 class="display" id="diagnostic-title">Диагностика начинается с вашего симптома.</h2>
    <p>Можно приложить план, фото, видео или аудио. Запись с телефона помогает понять контекст, но не заменяет профессиональный замер.</p>
  </div>

  <div class="shell diagnostic-layout">
    <aside class="form-progress" aria-label="Этапы формы">
      {#each ['Симптом', 'Объект', 'Материалы', 'Контакт'] as item, index}
        <button type="button" class:active={focusedStep === index} disabled={index > maxStep} aria-current={focusedStep === index ? 'step' : undefined} on:click={() => goToStep(index)}>
          <span class="mono">0{index + 1}</span><strong>{item}</strong>
        </button>
      {/each}
      {#if $diagnosticContext.noise || $diagnosticContext.path || $diagnosticContext.stage}
        <div class="context-frame">
          <span class="mono">КОНТЕКСТ СОХРАНЁН</span>
          {#if $diagnosticContext.noise}<p>Шум: {noiseProfiles.find((profile) => profile.key === $diagnosticContext.noise)?.label}</p>{/if}
          {#if $diagnosticContext.path}<p>Предполагаемый путь: {$diagnosticContext.path}</p>{/if}
          {#if $diagnosticContext.stage}<p>Стадия: {$diagnosticContext.stage}</p>{/if}
          {#if $diagnosticContext.spaceLoss}<p>Пространство: {$diagnosticContext.spaceLoss}</p>{/if}
        </div>
      {/if}
    </aside>

    <form
      bind:this={formElement}
      method="POST"
      {action}
      enctype="multipart/form-data"
      use:enhance={() => {
        submitting = true;
        return async ({ result, update }) => {
          submitting = false;
          if (result.type === 'failure' || result.type === 'error') track('form_submit_error');
          await update({ reset: result.type === 'success' });
        };
      }}
      on:focusin={startedForm}
      on:invalid={markInvalid}
      data-form-mode="full"
    >
      <input type="hidden" name="formMode" value="full" />
      <input type="hidden" name="sourceContext" value={sourceContext} />
      <input type="hidden" name="utmSource" value={utmSource} />
      <input type="hidden" name="utmMedium" value={utmMedium} />
      <input type="hidden" name="utmCampaign" value={utmCampaign} />
      <input type="hidden" name="utmContent" value={utmContent} />
      <input type="hidden" name="utmTerm" value={utmTerm} />
      <fieldset id="form-step-0" data-step="0" class:active={focusedStep === 0}>
        <legend><span class="mono">01 / СИМПТОМ</span><strong>Что происходит в комнате?</strong></legend>
        <label>Что слышно? <select name="heard" bind:value={heard} required>
          <option value="">Выберите симптом</option>{#each noiseProfiles as profile}<option value={profile.label}>{profile.label}</option>{/each}<option value="Другое">Другое</option>
        </select>{#if form?.issues?.heard}<small class="error">{form.issues.heard[0]}</small>{/if}</label>
        <label>Направление или предполагаемый источник <select name="direction" bind:value={direction} required><option value="">Выберите</option><option value="above">сверху</option><option value="side">сбоку</option><option value="below">снизу</option><option value="facade">со стороны фасада</option><option value="ventilation">из вентиляции</option><option value="unknown">не уверен</option></select>{#if form?.issues?.direction}<small class="error">{form.issues.direction[0]}</small>{/if}</label>
        <label>Когда слышно? <input name="timing" bind:value={timing} required placeholder="Например: вечером, ночью, при работе лифта" />{#if form?.issues?.timing}<small class="error">{form.issues.timing[0]}</small>{/if}</label>
        <label>В каких комнатах? <input name="rooms" required bind:value={rooms} placeholder="Спальня, гостиная…" />{#if form?.issues?.rooms}<small class="error">{form.issues.rooms[0]}</small>{/if}</label>
        <div class="step-actions"><span></span><button class="button" type="button" on:click={nextStep}>Дальше: объект →</button></div>
      </fieldset>

      <fieldset id="form-step-1" data-step="1" class:active={focusedStep === 1}>
        <legend><span class="mono">02 / ОБЪЕКТ</span><strong>На какой стадии квартира?</strong></legend>
        <div class="radio-set">
          {#each [{v:'new-build',l:'Новостройка до ремонта'},{v:'renovation',l:'Ремонт идёт'},{v:'finished',l:'Готовая квартира'}] as option}
            <label class="radio"><input type="radio" name="stage" value={option.v} bind:group={stage} required /><span>{option.l}</span></label>
          {/each}
        </div>
        {#if form?.issues?.stage}<small class="error">{form.issues.stage[0]}</small>{/if}
        <label>Тип дома <span class="optional">необязательно</span><input name="building" bind:value={building} placeholder="Монолит, панель, кирпич — если знаете" /></label>
        <label>Примерная проблемная площадь <span class="optional">необязательно</span><input name="area" bind:value={area} placeholder="Например: одна стена в спальне" /></label>
        <label>Комментарий <textarea name="comment" bind:value={comment} rows="5" maxlength="2000" placeholder="Что уже пробовали, чего опасаетесь, какие есть ограничения"></textarea>{#if form?.issues?.comment}<small class="error">{form.issues.comment[0]}</small>{/if}</label>
        <input type="hidden" name="path" value={$diagnosticContext.path} />
        <input type="hidden" name="spaceLoss" value={$diagnosticContext.spaceLoss} />
        <div class="step-actions"><button type="button" class="back" on:click={previousStep}>← Назад</button><button class="button" type="button" on:click={nextStep}>Дальше: материалы →</button></div>
      </fieldset>

      <fieldset id="form-step-2" data-step="2" class:active={focusedStep === 2}>
        <legend><span class="mono">03 / МАТЕРИАЛЫ</span><strong>Покажите контекст, если он есть.</strong></legend>
        <label class="upload" class:dragging on:dragenter|preventDefault={() => (dragging = true)} on:dragover|preventDefault={() => (dragging = true)} on:dragleave={() => (dragging = false)} on:drop={dropped}>
          <input class="sr-only" bind:this={fileInput} on:change={selectedFiles} name="files" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.heic,.mp4,.mov,.m4a,.mp3,.wav" />
          <span class="upload-mark">+</span><strong>Перетащите файлы или выберите на устройстве</strong><small>PDF, JPG, PNG, HEIC, MP4, MOV, M4A, MP3, WAV · необязательно</small>
        </label>
        {#if files.length}<ul class="file-list">{#each files as file, index}<li><span>{file.name}<small>{(file.size / 1024 / 1024).toFixed(1)} МБ</small></span><button type="button" on:click={() => removeFile(index)} aria-label={`Удалить ${file.name}`}>×</button></li>{/each}</ul>{/if}
        {#each [...fileErrors, ...(form?.issues?.files ?? [])] as issue}<small class="error">{issue}</small>{/each}
        <p class="recording-note">Запись с телефона помогает понять контекст, но не заменяет профессиональный замер.</p>
        <div class="step-actions"><button type="button" class="back" on:click={previousStep}>← Назад</button><button class="button" type="button" on:click={nextStep}>Дальше: контакт →</button></div>
      </fieldset>

      <fieldset id="form-step-3" data-step="3" class:active={focusedStep === 3}>
        <legend><span class="mono">04 / КОНТАКТ</span><strong>Куда вернуться с уточнениями?</strong></legend>
        <label>Имя <input name="name" bind:value={name} autocomplete="name" required />{#if form?.issues?.name}<small class="error">{form.issues.name[0]}</small>{/if}</label>
        <label>Телефон <input name="phone" bind:value={phone} type="tel" autocomplete="tel" required placeholder="+7 999 000-00-00" />{#if form?.issues?.phone}<small class="error">{form.issues.phone[0]}</small>{/if}</label>
        <label>Email <span class="optional">необязательно</span><input name="email" bind:value={email} type="email" autocomplete="email" />{#if form?.issues?.email}<small class="error">{form.issues.email[0]}</small>{/if}</label>
        <label class="consent"><input name="consent" type="checkbox" required /><span>Согласен на обработку персональных данных в соответствии с <a href="/privacy-policy/">политикой</a>.</span></label>
        {#if form?.issues?.consent}<small class="error">{form.issues.consent[0]}</small>{/if}
        <div class="step-actions"><button type="button" class="back" on:click={previousStep}>← Назад</button><button class="button submit" type="submit" disabled={submitting || fileErrors.length > 0}>{submitting ? 'Передаём заявку…' : 'Записаться на диагностику'}</button></div>
        <p class="next-step">После заявки менеджер свяжется с вами. Следующий коммерческий шаг — выездная диагностика.</p>
      </fieldset>

      {#if form?.message}
        <div class:success={form.success} class:error-box={!form.success} class="form-message" role="status" tabindex="-1">
          <strong>{form.success ? 'Заявка принята' : 'Не удалось отправить'}</strong><p>{form.message}</p>
        </div>
      {/if}
    </form>
  </div>
</section>

<style>
  .diagnostic { padding: clamp(120px,14vw,240px) 0; background:var(--ink-900); }
  .diagnostic-head { display:grid;grid-template-columns:repeat(16,1fr);gap:24px;align-items:end; }
  .diagnostic-head>.mono{grid-column:1/4;color:var(--acoustic)}.diagnostic-head h2{grid-column:4/14;margin:0;font-size:clamp(3rem,6.4vw,7.5rem)}.diagnostic-head>p:last-child{grid-column:11/-1;margin-top:40px;color:var(--white-64)}
  .diagnostic-layout{display:grid;grid-template-columns:repeat(16,1fr);gap:24px;margin-top:100px;align-items:start}.form-progress{grid-column:1/5;position:sticky;top:120px}.form-progress>button{width:100%;min-height:60px;display:grid;grid-template-columns:45px 1fr;gap:10px;align-items:center;border:0;border-bottom:1px solid var(--white-16);background:transparent;color:var(--white-64);text-align:left;cursor:pointer}.form-progress>button.active{color:var(--white);border-color:var(--signal)}.form-progress strong{font-weight:500}.context-frame{margin-top:36px;padding:18px;border:1px solid var(--white-16);border-radius:14px}.context-frame>.mono{color:var(--acoustic)}.context-frame p{margin:8px 0;font-size:.76rem;color:var(--white-64)}
  form{grid-column:6/15;display:grid;gap:50px;scroll-margin-top:100px}fieldset{display:none;grid-template-columns:repeat(2,1fr);gap:18px 24px;margin:0;padding:38px;border:1px solid var(--white-16);border-radius:24px;background:rgba(7,9,8,.42)}fieldset.active{display:grid}legend{display:grid;gap:8px;padding:0 14px}legend .mono{color:var(--signal)}legend strong{font-family:'Geologica',sans-serif;font-size:clamp(1.5rem,2.5vw,2.7rem);letter-spacing:-.04em}label{display:grid;gap:8px;color:var(--white-64);font-size:.78rem}label:has(textarea),.radio-set,.upload,.file-list,.recording-note,.submit,.next-step,.form-message,.step-actions{grid-column:1/-1}input,select,textarea{width:100%;min-height:52px;padding:13px 14px;border:1px solid var(--white-16);border-radius:12px;background:var(--ink-800);color:var(--white)}textarea{resize:vertical}.optional{font-size:.68rem;color:var(--acoustic)}.radio-set{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.radio{position:relative}.radio input{position:absolute;opacity:0}.radio span{min-height:70px;display:grid;place-items:center;padding:10px;border:1px solid var(--white-16);border-radius:12px;text-align:center}.radio input:checked+span{border-color:var(--signal);background:rgba(255,101,79,.08);color:var(--white)}.radio input:focus+span{outline:2px solid var(--white);outline-offset:3px}.step-actions{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:10px}.step-actions .button{min-width:min(100%,260px)}.step-actions .back{min-height:48px;border:0;background:transparent;color:var(--white-64);cursor:pointer}
  .upload{min-height:190px;place-items:center;align-content:center;padding:28px;border:1px dashed var(--acoustic);border-radius:18px;text-align:center;cursor:pointer;background:rgba(108,159,150,.04)}.upload.dragging{border-color:var(--signal);background:rgba(255,101,79,.1)}.upload-mark{display:grid;place-items:center;width:46px;height:46px;border:1px solid var(--acoustic);border-radius:50%;font-size:1.8rem;color:var(--acoustic)}.upload small{color:var(--white-64)}.file-list{list-style:none;padding:0;margin:0}.file-list li{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--white-16)}.file-list li span{display:grid}.file-list small{color:var(--white-64)}.file-list button{width:44px;height:44px;border:0;border-radius:50%;background:transparent;color:var(--white);font-size:1.5rem;cursor:pointer}.recording-note,.next-step{color:var(--white-64);font-size:.75rem}.consent{grid-column:1/-1;display:grid;grid-template-columns:26px 1fr;align-items:start}.consent input{width:22px;min-height:22px;margin:0;accent-color:var(--signal)}.consent a{text-decoration:underline}.submit{width:100%}.error{display:block;color:var(--error);font-size:.7rem}.form-message{padding:24px;border:1px solid var(--error);border-radius:16px}.form-message.success{border-color:var(--acoustic);background:rgba(108,159,150,.08)}.form-message p{margin-bottom:0;color:var(--white-64)}button:disabled{opacity:.5;cursor:wait}
  @media(max-width:1000px){.diagnostic-head,.diagnostic-layout{grid-template-columns:repeat(8,1fr)}.diagnostic-head>.mono{grid-column:1/3}.diagnostic-head h2{grid-column:3/-1}.diagnostic-head>p:last-child{grid-column:3/-1}.form-progress{grid-column:1/3}form{grid-column:3/-1}}
  @media(max-width:767px){.diagnostic,.diagnostic-head,.diagnostic-layout,form,fieldset{min-width:0;max-width:100%}.diagnostic-head{display:block}.diagnostic-head>.mono{display:block;margin-bottom:20px}.diagnostic-head h2{overflow-wrap:anywhere}.diagnostic-layout{display:block}.form-progress{position:static;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));max-width:100%;min-width:0;overflow:visible;margin-bottom:40px}.form-progress>button{min-width:0;grid-template-columns:34px minmax(0,1fr);padding-inline:4px}.form-progress strong{overflow-wrap:anywhere}.context-frame{display:none}form{display:grid;gap:30px}fieldset{grid-template-columns:1fr;padding:24px 18px}.radio-set{grid-template-columns:1fr}.upload{min-height:170px}legend{margin-bottom:15px}}
</style>
