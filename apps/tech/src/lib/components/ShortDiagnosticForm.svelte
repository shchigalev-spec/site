<script lang="ts">
  import { enhance } from '$app/forms';
  import { onMount } from 'svelte';
  import { validateFiles } from '$lib/diagnostic';
  import { noiseProfiles } from '$lib/data/site';
  import { diagnosticContext } from '$lib/stores/diagnostic';
  import { track } from '$lib/analytics';

  type FormState = {
    success?: boolean;
    message?: string;
    reference?: string;
    issues?: Record<string, string[]>;
    values?: Record<string, string>;
  } | null;

  export let form: FormState = null;

  let heard = form?.values?.heard ?? '';
  let stage = form?.values?.stage ?? '';
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
  let files: File[] = [];
  let fileErrors: string[] = [];
  let submitting = false;
  let started = false;
  let successTracked = false;

  $: if (!heard && $diagnosticContext.noise) heard = noiseProfiles.find((profile) => profile.key === $diagnosticContext.noise)?.label ?? '';
  $: if (!stage && $diagnosticContext.stage) stage = $diagnosticContext.stage;
  $: if (form?.success && !successTracked) {
    successTracked = true;
    track('form_submit_success', { form_mode: 'short' });
  }

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
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
  });

  function markStarted() {
    if (started) return;
    started = true;
    track('form_started', { form_mode: 'short' });
  }

  function selectedFiles() {
    files = Array.from(fileInput.files ?? []);
    fileErrors = validateFiles(files);
    if (fileErrors.length) track('form_validation_error', { field: 'files', form_mode: 'short' });
  }

  function markInvalid(event: Event) {
    const target = event.target as HTMLInputElement;
    track('form_validation_error', { field: target.name, form_mode: 'short' });
  }
</script>

<section class="conversion-close" id="home-short-form-panel" aria-labelledby="conversion-title">
  <div class="quiet-plate" aria-hidden="true">
    <picture>
      <source media="(max-width: 960px)" srcset="/generated/tech-final-quiet-960.webp" type="image/webp" />
      <source srcset="/generated/tech-final-quiet.webp" type="image/webp" />
      <img src="/generated/tech-final-quiet.png" alt="" width="1672" height="941" loading="lazy" />
    </picture>
    <div class="quiet-shade"></div>
    <div class="shell quiet-copy">
      <p class="mono">КОНТРОЛИРУЕМЫЙ РЕЗУЛЬТАТ / 10</p>
      <h2 class="display" id="conversion-title">Тишина начинается<br />не с материала.</h2>
      <p>Измеряем исходное состояние → проверяем путь → согласуем критерий приёмки.</p>
    </div>
  </div>

  <div class="shell close-grid">
    <div class="next-column">
      <p class="mono">ЧТО ПРОИЗОЙДЁТ ДАЛЬШЕ</p>
      <ol>
        <li><span>01</span><strong>Менеджер уточнит симптом.</strong></li>
        <li><span>02</span><strong>Команда изучит переданный контекст.</strong></li>
        <li><span>03</span><strong>Следующий коммерческий шаг — выездная диагностика.</strong></li>
      </ol>
    </div>

    <form
      method="POST"
      action="?"
      enctype="multipart/form-data"
      data-form-mode="short"
      use:enhance={() => {
        submitting = true;
        track('short_form_submit');
        return async ({ result, update }) => {
          submitting = false;
          if (result.type === 'failure' || result.type === 'error') track('form_submit_error', { form_mode: 'short' });
          await update({ reset: result.type === 'success' });
        };
      }}
      on:focusin={markStarted}
      on:invalid={markInvalid}
    >
      <div class="form-heading">
        <p class="mono">КОРОТКАЯ ЗАЯВКА</p>
        <h3>Разобрать мой шум.</h3>
        <p>Пять полей — остальной контекст можно добавить позже.</p>
      </div>

      <input type="hidden" name="formMode" value="short" />
      <input type="hidden" name="direction" value={$diagnosticContext.direction} />
      <input type="hidden" name="timing" value="" />
      <input type="hidden" name="rooms" value={$diagnosticContext.room} />
      <input type="hidden" name="path" value={$diagnosticContext.path} />
      <input type="hidden" name="spaceLoss" value={$diagnosticContext.spaceLoss} />
      <input type="hidden" name="comment" value={$diagnosticContext.comment} />
      <input type="hidden" name="sourceContext" value={sourceContext} />
      <input type="hidden" name="utmSource" value={utmSource} />
      <input type="hidden" name="utmMedium" value={utmMedium} />
      <input type="hidden" name="utmCampaign" value={utmCampaign} />
      <input type="hidden" name="utmContent" value={utmContent} />
      <input type="hidden" name="utmTerm" value={utmTerm} />

      <label>Основной шум
        <select name="heard" bind:value={heard} required>
          <option value="">Выберите симптом</option>
          {#each noiseProfiles as profile}<option value={profile.label}>{profile.label}</option>{/each}
          <option value="Другое">Другое</option>
        </select>
        {#if form?.issues?.heard}<small class="error">{form.issues.heard[0]}</small>{/if}
      </label>
      <fieldset>
        <legend>Стадия квартиры</legend>
        <div class="stage-options">
          {#each [{v:'new-build',l:'До ремонта'},{v:'renovation',l:'Ремонт идёт'},{v:'finished',l:'Готовая'}] as option}
            <label><input type="radio" name="stage" value={option.v} bind:group={stage} required /><span>{option.l}</span></label>
          {/each}
        </div>
        {#if form?.issues?.stage}<small class="error">{form.issues.stage[0]}</small>{/if}
      </fieldset>
      <div class="contact-row">
        <label>Имя <input name="name" bind:value={name} autocomplete="name" required />{#if form?.issues?.name}<small class="error">{form.issues.name[0]}</small>{/if}</label>
        <label>Телефон <input name="phone" bind:value={phone} type="tel" autocomplete="tel" required placeholder="+7 999 000-00-00" />{#if form?.issues?.phone}<small class="error">{form.issues.phone[0]}</small>{/if}</label>
      </div>
      <label>Email <span class="optional">необязательно</span><input name="email" bind:value={email} type="email" autocomplete="email" />{#if form?.issues?.email}<small class="error">{form.issues.email[0]}</small>{/if}</label>

      <details class="advanced">
        <summary>Добавить план, запись или фотографию <span>необязательно</span></summary>
        <label class="upload">Файлы
          <input bind:this={fileInput} on:change={selectedFiles} name="files" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.heic,.mp4,.mov,.m4a,.mp3,.wav" />
          <small>До 6 файлов, общий объём до 40 МБ.</small>
        </label>
        {#if files.length}<p class="file-count">Выбрано файлов: {files.length}</p>{/if}
        {#each [...fileErrors, ...(form?.issues?.files ?? [])] as issue}<small class="error">{issue}</small>{/each}
      </details>

      <label class="consent"><input name="consent" type="checkbox" required /><span>Согласен на обработку персональных данных по <a href="/privacy-policy/">политике</a>.</span></label>
      {#if form?.issues?.consent}<small class="error">{form.issues.consent[0]}</small>{/if}
      <button class="button" type="submit" disabled={submitting || fileErrors.length > 0}>{submitting ? 'Передаём…' : 'Разобрать мой шум'}</button>
      <a class="full-link" href="/diagnostika-shuma/">Перейти сразу к полной форме →</a>

      {#if form?.message}
        <div class:success={form.success} class="form-message" role="status" tabindex="-1"><strong>{form.success ? 'Заявка принята' : 'Не удалось отправить'}</strong><p>{form.message}</p></div>
      {/if}
    </form>
  </div>
</section>

<style>
  .conversion-close{background:var(--ink-950)}.quiet-plate{position:relative;min-height:76svh;display:flex;align-items:end;overflow:hidden;isolation:isolate}.quiet-plate picture{position:absolute;inset:0;z-index:-2}.quiet-plate img{width:100%;height:100%;object-fit:cover;filter:saturate(.72) brightness(.72)}.quiet-shade{position:absolute;inset:0;z-index:-1;background:linear-gradient(0deg,var(--ink-950),rgba(7,9,8,.16) 68%),linear-gradient(90deg,rgba(7,9,8,.72),transparent 70%)}.quiet-copy{padding-bottom:clamp(54px,8vw,110px)}.quiet-copy>.mono{color:var(--acoustic)}.quiet-copy h2{max-width:12ch;margin:22px 0;font-size:clamp(3.5rem,8vw,9rem)}.quiet-copy>p:last-child{max-width:50ch;color:var(--white-64)}
  .close-grid{display:grid;grid-template-columns:repeat(16,minmax(0,1fr));gap:24px;padding-top:clamp(80px,10vw,150px);padding-bottom:clamp(120px,14vw,220px);align-items:start}.next-column{grid-column:1/7;position:sticky;top:110px}.next-column>.mono{color:var(--acoustic)}.next-column ol{list-style:none;margin:34px 0 0;padding:0}.next-column li{display:grid;grid-template-columns:54px 1fr;gap:15px;padding:22px 0;border-top:1px solid var(--white-16)}.next-column li:last-child{border-bottom:1px solid var(--white-16)}.next-column li span{font:500 .68rem 'IBM Plex Mono',monospace;color:var(--signal)}.next-column li strong{max-width:30ch;font-size:1.05rem;font-weight:500;line-height:1.35}
  form{grid-column:8/-1;display:grid;gap:18px;padding:clamp(24px,4vw,54px);border:1px solid var(--white-16);border-radius:28px;background:rgba(23,28,26,.72)}.form-heading{margin-bottom:14px}.form-heading>.mono{color:var(--signal)}.form-heading h3{margin:12px 0;font-family:'Geologica',sans-serif;font-size:clamp(2.5rem,5vw,5.5rem);line-height:.95;letter-spacing:-.05em}.form-heading>p:last-child{color:var(--white-64)}label{display:grid;gap:8px;color:var(--white-64);font-size:.78rem}input,select{width:100%;min-height:54px;padding:13px 14px;border:1px solid var(--white-16);border-radius:12px;background:var(--ink-800);color:var(--white)}.optional,.advanced summary span{font-size:.68rem;color:var(--acoustic)}fieldset{margin:0;padding:0;border:0}legend{margin-bottom:9px;color:var(--white-64);font-size:.78rem}.stage-options{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.stage-options label{position:relative}.stage-options input{position:absolute;opacity:0}.stage-options span{display:grid;place-items:center;min-height:58px;padding:8px;border:1px solid var(--white-16);border-radius:12px;color:var(--white);text-align:center}.stage-options input:checked+span{border-color:var(--signal);background:rgba(255,101,79,.08)}.stage-options input:focus+span{outline:2px solid var(--white);outline-offset:3px}.contact-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.advanced{padding:18px 0;border-top:1px solid var(--white-16);border-bottom:1px solid var(--white-16)}.advanced summary{cursor:pointer}.upload{margin-top:18px}.upload input{padding:11px}.upload small,.file-count{color:var(--white-64)}.consent{display:grid;grid-template-columns:25px 1fr;align-items:center;min-height:44px}.consent input{width:21px;min-height:21px;margin:0;accent-color:var(--signal)}.consent a{text-decoration:underline}.full-link{text-align:center;color:var(--acoustic);font-size:.78rem}.error{color:var(--error)}.form-message{padding:20px;border:1px solid var(--error);border-radius:14px}.form-message.success{border-color:var(--acoustic)}.form-message p{margin-bottom:0;color:var(--white-64)}
  @media(max-width:900px){.close-grid{grid-template-columns:repeat(8,minmax(0,1fr))}.next-column{grid-column:1/4}.close-grid form{grid-column:4/-1}}
  @media(max-width:767px){.quiet-plate{min-height:68svh}.quiet-copy h2{font-size:clamp(3.3rem,15vw,5.7rem)}.close-grid{display:block}.next-column{position:static;margin-bottom:54px}.close-grid form{padding:24px 17px}.contact-row,.stage-options{grid-template-columns:1fr}.stage-options span{min-height:54px}}
</style>
