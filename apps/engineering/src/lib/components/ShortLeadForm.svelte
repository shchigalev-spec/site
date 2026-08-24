<script lang="ts">
  import { tick } from 'svelte';
  import { page } from '$app/stores';
  import { track } from '$lib/analytics';
  import { validateFiles, maxFiles } from '$lib/file-policy';
  import { buildDiagnosisHref, buildSourceContext } from '$lib/diagnosis-link';

  const noiseOptions = ['шаги и удары', 'голоса', 'бас и музыка', 'лифт / вибрация', 'улица', 'вентиляция'];
  const stageOptions = ['новостройка до ремонта', 'ремонт идёт', 'готовая квартира'];
  const phonePattern = '\\+?[0-9\\s\\(\\)\\-]{7,20}';

  let heard = '';
  let stage = '';
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
  let submitAttempted = false;
  let validationError = '';
  let validationErrorElement: HTMLParagraphElement;
  $: phoneIsValid = new RegExp(`^${phonePattern}$`).test(phone);
  $: sourceContext = buildSourceContext($page.url, 'homepage_short');
  $: fullBriefHref = buildDiagnosisHref($page.url, 'homepage_short_alternative');

  function markStarted() {
    if (touched) return;
    touched = true;
    track('form_started', { form: 'homepage-short' });
  }

  function fileCategory(file: File) {
    const file_category = file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'document' : 'other';
    const extension = file.name.split('.').pop()?.toLowerCase() ?? 'unknown';
    const size_bucket = file.size < 1024 * 1024 ? 'under_1mb' : file.size < 5 * 1024 * 1024 ? '1_to_5mb' : 'over_5mb';
    return { file_category, extension, size_bucket };
  }

  function chooseFiles(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const incoming = Array.from(input.files ?? []);
    const next = [...files, ...incoming].slice(0, maxFiles);
    fileErrors = validateFiles(next);
    if (incoming.length + files.length > maxFiles) fileErrors.unshift(`Можно приложить не больше ${maxFiles} файлов.`);
    if (!fileErrors.length) {
      files = next;
      incoming.forEach((file) => track('file_attached', fileCategory(file)));
    } else {
      track('form_validation_error', { field: 'short_files' });
    }
    input.value = '';
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    errors = [];
    message = '';
    validationError = '';
    submitAttempted = true;
    if (!form.checkValidity()) {
      validationError = 'Заполните основной шум, этап, имя, телефон и подтвердите согласие на обработку данных.';
      track('form_validation_error', { field: 'short_browser_validation' });
      await tick();
      validationErrorElement?.focus();
      return;
    }
    fileErrors = validateFiles(files);
    if (fileErrors.length) return;

    status = 'sending';
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
        track('form_submit_error', { form: 'homepage-short', status: response.status });
        return;
      }
      status = 'success';
      message = 'Заявка принята. Менеджер уточнит симптом и согласует следующий коммерческий шаг — выездную диагностику.';
      track('short_form_submit', { form: 'homepage-short' });
      track('form_submit_success', { form: 'homepage-short' });
      files = [];
    } catch {
      status = 'error';
      message = 'Не удалось связаться с сервером. Данные остались в форме — попробуйте ещё раз.';
      track('form_submit_error', { form: 'homepage-short', status: 'network' });
    }
  }
</script>

<div class="short-contact">
  <form class="short-form" method="post" enctype="multipart/form-data" novalidate on:submit={submit} on:focusin={markStarted}>
    <div class="form-intro"><span>Короткая заявка</span><h3>Достаточно симптома и контакта.</h3><p>Полный инженерный бриф можно заполнить позже.</p></div>

    <div class="short-grid">
      <label>Основной шум
        <select name="heard" bind:value={heard} required aria-invalid={submitAttempted && !heard ? 'true' : undefined} aria-describedby={submitAttempted && !heard ? 'short-form-error' : undefined}>
          <option value="" disabled>Выберите симптом</option>
          {#each noiseOptions as option}<option>{option}</option>{/each}
        </select>
      </label>
      <label>Этап квартиры
        <select name="stage" bind:value={stage} required aria-invalid={submitAttempted && !stage ? 'true' : undefined} aria-describedby={submitAttempted && !stage ? 'short-form-error' : undefined}>
          <option value="" disabled>Выберите этап</option>
          {#each stageOptions as option}<option>{option}</option>{/each}
        </select>
      </label>
      <label>Имя<input name="name" bind:value={name} autocomplete="name" required aria-invalid={submitAttempted && !name.trim() ? 'true' : undefined} aria-describedby={submitAttempted && !name.trim() ? 'short-form-error' : undefined} /></label>
      <label>Телефон<input name="phone" bind:value={phone} autocomplete="tel" inputmode="tel" required pattern={phonePattern} aria-invalid={submitAttempted && !phoneIsValid ? 'true' : undefined} aria-describedby={submitAttempted && !phoneIsValid ? 'short-form-error' : undefined} /></label>
      <label class="email-field">Email <small>необязательно</small><input name="email" bind:value={email} autocomplete="email" type="email" /></label>
    </div>

    <input type="hidden" name="direction" value="не указано на первом контакте" />
    <input type="hidden" name="timing" value="не указано на первом контакте" />
    <input type="hidden" name="rooms" value="не указаны на первом контакте" />
    <input type="hidden" name="sourceContext" value={sourceContext} />

    <details class="short-advanced">
      <summary>Добавить план или фотографию <span>необязательно</span></summary>
      <label class="short-upload">Файл
        <input name="file-picker" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.heic,.heif" on:change={chooseFiles} />
      </label>
      <p>PDF, JPG, PNG или HEIC. До {maxFiles} файлов.</p>
      {#if files.length}<ul>{#each files as file}<li>{file.name}</li>{/each}</ul>{/if}
      {#if fileErrors.length}<ul class="form-errors" aria-live="polite">{#each fileErrors as error}<li>{error}</li>{/each}</ul>{/if}
    </details>

    <label class="short-consent"><input type="checkbox" name="consent" value="yes" bind:checked={consent} required aria-invalid={submitAttempted && !consent ? 'true' : undefined} aria-describedby={submitAttempted && !consent ? 'short-form-error' : undefined} /><span>Согласен на обработку персональных данных и ознакомлен с <a href="/privacy-policy/" target="_blank">политикой конфиденциальности</a>.</span></label>

    {#if validationError}<p bind:this={validationErrorElement} class="short-validation" id="short-form-error" role="alert" tabindex="-1"><strong>Заявка не готова к отправке.</strong> {validationError}</p>{/if}

    <div class="short-submit">
      <button class="primary-button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Передаём заявку…' : 'Отправить короткую заявку'}</button>
      <a href={fullBriefHref} on:click={() => track('diagnostic_start', { source: 'homepage-short-alternative' })}>Перейти к полному брифу</a>
    </div>

    {#if status === 'success'}<div class="form-status success" role="status">{message}</div>{/if}
    {#if status === 'error'}<div class="form-status error" role="alert"><strong>Заявка пока не отправлена.</strong><p>{message}</p>{#if errors.length}<ul>{#each errors as error}<li>{error}</li>{/each}</ul>{/if}</div>{/if}
  </form>

  <aside class="next-steps">
    <span>Что произойдёт дальше</span>
    <ol>
      <li><b>01</b><div><strong>Менеджер уточнит симптом.</strong><p>Что слышно, где и при каких условиях.</p></div></li>
      <li><b>02</b><div><strong>Команда изучит контекст.</strong><p>План и файлы помогут подготовить вопросы, но не заменят обследование.</p></div></li>
      <li><b>03</b><div><strong>Согласуем выездную диагностику.</strong><p>Это следующий коммерческий шаг — без обещания непроверенного срока.</p></div></li>
    </ol>
  </aside>
</div>

<style>
  .short-contact { display: grid; grid-template-columns: minmax(0, 8fr) minmax(18rem, 4fr); gap: var(--gutter); margin-top: 5rem; }
  .short-form { padding: clamp(1.4rem, 4vw, 4rem); background: #f2eee6; color: #242824; }
  .form-intro > span,
  .next-steps > span { font: 0.75rem 'IBM Plex Mono', monospace; color: #48635f; text-transform: uppercase; }
  .form-intro h3 { max-width: 12ch; margin: 1rem 0; font-size: clamp(2.4rem, 4vw, 4.6rem); }
  .form-intro p { color: #4e5650; }
  .short-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1.5rem; margin-top: 3rem; }
  .short-form label { display: grid; gap: 0.55rem; margin-bottom: 1.4rem; font-weight: 500; }
  .short-form label small { font-weight: 400; }
  .short-form input:not([type='checkbox']):not([type='file']),
  .short-form select { width: 100%; min-height: 54px; padding: 0.8rem 0.1rem; border: 0; border-bottom: 1px solid #343833; border-radius: 0; background: transparent; color: inherit; }
  .email-field { grid-column: 1 / -1; }
  .short-advanced { margin-top: 1rem; border-top: 1px solid #aeb8b0; border-bottom: 1px solid #aeb8b0; }
  .short-advanced summary { min-height: 54px; padding: 1rem 0; cursor: pointer; }
  .short-advanced summary span { color: #5b635d; font-size: 0.82rem; }
  .short-upload { padding-top: 1rem; }
  .short-upload input { width: 100%; max-width: 100%; min-height: 44px; }
  .short-advanced p,
  .short-advanced li { color: #4e5650; font-size: 0.86rem; }
  .short-consent { grid-template-columns: 1.5rem 1fr !important; align-items: start; min-height: 44px; margin-top: 1.6rem; font-size: 0.84rem; font-weight: 400 !important; }
  .short-consent input { width: 24px; height: 24px; margin-top: 0.15rem; }
  .short-consent a { display: inline-flex; min-height: 44px; align-items: center; }
  .short-submit { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; margin-top: 2rem; }
  .short-validation { margin-top: 1.2rem; padding: 0.9rem; border-left: 4px solid #a94332; background: #f0dfd8; }
  .short-submit > a { color: #38413b; }
  .next-steps { padding: 1.5rem 0 0 1.5rem; border-top: 2px solid #879d95; }
  .next-steps > span { color: #c6d5cf; }
  .next-steps ol { margin: 2rem 0 0; padding: 0; list-style: none; }
  .next-steps li { display: grid; grid-template-columns: 2.5rem 1fr; gap: 0.8rem; padding: 1.4rem 0; border-top: 1px solid rgba(251, 250, 246, 0.24); }
  .next-steps b { color: #c6d5cf; font: 0.75rem 'IBM Plex Mono', monospace; }
  .next-steps strong { color: #fbfaf6; }
  .next-steps p { margin: 0.5rem 0 0; color: #d4dad5; font-size: 0.9rem; }

  @media (max-width: 850px) {
    .short-contact { grid-template-columns: 1fr; gap: 1.25rem; margin-top: 1.5rem; }
    .short-form { padding: 1.1rem; }
    .form-intro { display: none; }
    .short-grid { grid-template-columns: 1fr 1fr; gap: 0 1rem; margin-top: 0; }
    .email-field { grid-column: 1 / -1; }
    .short-form label { margin-bottom: 1rem; }
    .short-consent { margin-top: 1rem; }
    .short-submit { margin-top: 1.2rem; }
    .short-submit { align-items: stretch; flex-direction: column; }
    .short-submit .primary-button { justify-content: center; min-height: 54px; }
    .short-submit > a { min-height: 44px; padding-top: 0.6rem; text-align: center; }
    .next-steps { padding-left: 0; }
    .next-steps ol { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.7rem; margin-top: 0.8rem; }
    .next-steps li { display: block; padding: 0.7rem 0; }
    .next-steps li b { display: block; margin-bottom: 0.45rem; }
    .next-steps li p { font-size: 0.78rem; line-height: 1.35; }
  }

  @media (max-width: 360px) {
    .short-grid { grid-template-columns: 1fr; }
    .email-field { grid-column: auto; }
  }
</style>
