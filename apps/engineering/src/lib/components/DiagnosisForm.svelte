<script lang="ts">
  import { onMount } from 'svelte';
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
  // HTML pattern is compiled with the Unicode Sets (`v`) flag in current browsers;
  // punctuation reserved inside a character class must be escaped explicitly.
  const phonePattern = '\\+?[0-9\\s\\(\\)\\-]{7,20}';

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
    sourceContext = service ? `Услуга: ${service}` : caseSlug ? `Кейс: ${caseSlug}` : '';
    const carried = params.get('comment');
    if (carried) comment = carried;
  });

  function markStarted() {
    if (!touched) {
      touched = true;
      track('form_started');
    }
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
      for (const file of incoming) track('file_attached', fileCategory(file));
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
    const form = event.currentTarget as HTMLFormElement;
    if (!form.reportValidity()) {
      status = 'idle';
      track('form_validation_error', { field: 'browser_validation' });
      return;
    }
    fileErrors = validateFiles(files);
    if (fileErrors.length) {
      status = 'idle';
      track('form_validation_error', { field: 'files' });
      return;
    }
    const data = new FormData(form);
    data.delete('files');
    for (const file of files) data.append('files', file, file.name);
    try {
      const response = await fetch('/api/diagnosis', { method: 'POST', body: data });
      const payload = (await response.json()) as { ok: boolean; message?: string; errors?: string[] };
      if (!response.ok || !payload.ok) {
        status = 'error';
        errors = payload.errors ?? [];
        message = payload.message || 'Сервер не подтвердил приём заявки.';
        track('form_submit_error', { status: response.status });
        return;
      }
      status = 'success';
      message = 'Заявка принята. Менеджер свяжется с вами, уточнит задачу и согласует выездную диагностику.';
      track('form_submit_success');
      form.reset();
      files = [];
    } catch {
      status = 'error';
      message = 'Не удалось связаться с сервером. Данные остались в форме — попробуйте ещё раз.';
      track('form_submit_error', { status: 'network' });
    }
  }
</script>

<form class="diagnosis-form" method="post" enctype="multipart/form-data" on:submit={submit} on:focusin={markStarted}>
  <div class="form-group">
    <div class="form-group-label"><span>01</span><strong>Симптом</strong></div>
    <label>Что слышно?<textarea name="heard" bind:value={heard} required rows="3" placeholder="Например, шаги и удары вечером"></textarea></label>
    <div class="field-pair">
      <label>Откуда, предположительно?<input name="direction" bind:value={direction} required placeholder="Сверху, сбоку, с улицы" /></label>
      <label>Когда это слышно?<input name="timing" bind:value={timing} required placeholder="Ночью, по выходным, постоянно" /></label>
    </div>
    <label>В каких комнатах?<input name="rooms" bind:value={rooms} required placeholder="Спальня и детская" /></label>
  </div>

  <div class="form-group">
    <div class="form-group-label"><span>02</span><strong>Контекст квартиры</strong></div>
    <label>Этап
      <select name="stage" bind:value={stage} required>
        <option value="" disabled>Выберите этап</option>
        <option>новостройка до ремонта</option><option>ремонт идёт</option><option>готовая квартира</option>
      </select>
    </label>
    {#if sourceContext}<p class="carried-context">Контекст перехода: {sourceContext}</p>{/if}
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

  <div class="form-group">
    <div class="form-group-label"><span>03</span><strong>Материалы к задаче</strong></div>
    <div
      class:dragging
      class="file-tray"
      role="button"
      tabindex="0"
      on:dragover={(event) => { event.preventDefault(); dragging = true; }}
      on:dragleave={() => (dragging = false)}
      on:drop={dropFiles}
      on:keydown={(event) => { if (event.key === 'Enter' || event.key === ' ') (event.currentTarget.querySelector('input') as HTMLInputElement)?.click(); }}
    >
      <label>
        <strong>Приложить план, фото, видео или аудио</strong>
        <span>PDF, JPG, PNG, HEIC, MP4, MOV, M4A, MP3, WAV · необязательно</span>
        <input name="file-picker" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,.mp4,.mov,.m4a,.mp3,.wav" on:change={chooseFiles} />
      </label>
    </div>
    <p class="file-context">Запись с телефона помогает понять контекст, но не заменяет профессиональный замер.</p>
    {#if fileErrors.length}<ul class="form-errors" aria-live="polite">{#each fileErrors as error}<li>{error}</li>{/each}</ul>{/if}
    {#if files.length}
      <ul class="file-list" aria-label="Прикреплённые файлы">
        {#each files as file, index}
          <li><span><strong>{file.name}</strong><small>{(file.size / 1024 / 1024).toFixed(1)} МБ · {file.type || 'тип не указан'}</small></span><button type="button" on:click={() => removeFile(index)} aria-label={`Удалить ${file.name}`}>Удалить</button></li>
        {/each}
      </ul>
    {/if}
  </div>

  <div class="form-group contact-group">
    <div class="form-group-label"><span>04</span><strong>Контакты</strong></div>
    <div class="field-pair">
      <label>Имя<input name="name" bind:value={name} autocomplete="name" required /></label>
      <label>Телефон<input name="phone" bind:value={phone} autocomplete="tel" inputmode="tel" required pattern={phonePattern} /></label>
    </div>
    <label>Email <small>необязательно</small><input name="email" bind:value={email} autocomplete="email" type="email" /></label>
    <label class="consent"><input type="checkbox" name="consent" value="yes" bind:checked={consent} required /><span>Согласен на обработку персональных данных и ознакомлен с <a href="/privacy-policy/" target="_blank">политикой конфиденциальности</a>.</span></label>
  </div>

  <div class="submit-row">
    <button class="primary-button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Передаём заявку…' : 'Отправить заявку на диагностику'}</button>
    <p>После заявки менеджер свяжется с вами. Следующий коммерческий шаг — выездная диагностика.</p>
  </div>

  {#if status === 'success'}<div class="form-status success" role="status">{message}</div>{/if}
  {#if status === 'error'}
    <div class="form-status error" role="alert"><strong>Заявка пока не отправлена.</strong><p>{message}</p>{#if errors.length}<ul>{#each errors as error}<li>{error}</li>{/each}</ul>{/if}</div>
  {/if}
</form>
