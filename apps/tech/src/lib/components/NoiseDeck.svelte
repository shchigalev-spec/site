<script lang="ts">
  import { noiseProfiles } from '$lib/data/site';
  import { diagnosticContext } from '$lib/stores/diagnostic';
  import { track } from '$lib/analytics';

  let activeIndex = 0;
  let tabs: HTMLButtonElement[] = [];
  $: active = noiseProfiles[activeIndex];

  function choose(index: number, focus = false) {
    activeIndex = (index + noiseProfiles.length) % noiseProfiles.length;
    diagnosticContext.update((context) => ({ ...context, noise: noiseProfiles[activeIndex].key }));
    track('noise_selected', { noise: noiseProfiles[activeIndex].key });
    if (focus) tabs[activeIndex]?.focus();
  }

  function onKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); choose(index + 1, true); }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); choose(index - 1, true); }
    if (event.key === 'Home') { event.preventDefault(); choose(0, true); }
    if (event.key === 'End') { event.preventDefault(); choose(noiseProfiles.length - 1, true); }
  }

  function useFallback(event: Event) {
    const image = event.currentTarget as HTMLImageElement;
    if (!image.src.endsWith('/generated/tech-style-anchor.png')) image.src = '/generated/tech-style-anchor.png';
  }
</script>

<section class="noise-deck" id="noise-deck" aria-labelledby="noise-title">
  <div class="shell section-head">
    <p class="mono">СИГНАЛ / 02</p>
    <h2 class="display" id="noise-title">Что именно вы слышите?</h2>
    <p>Одинаковая громкость не означает одинаковый путь.</p>
  </div>

  <div class="deck-stage shell" data-noise={active.key}>
    <div class="selector" role="tablist" aria-label="Выберите тип шума">
      {#each noiseProfiles as profile, index}
        <button
          bind:this={tabs[index]}
          type="button"
          role="tab"
          aria-selected={activeIndex === index}
          aria-controls="noise-panel"
          tabindex={activeIndex === index ? 0 : -1}
          class:active={activeIndex === index}
          on:click={() => choose(index)}
          on:keydown={(event) => onKeydown(event, index)}
        >
          <span class="mono">0{index + 1}</span>
          <strong>{profile.short}</strong>
          <em>{profile.share}</em>
        </button>
      {/each}
    </div>

    <div class="room-frame" id="noise-panel" role="tabpanel" tabindex="0">
      <picture>
        <source media="(max-width: 960px)" srcset={active.asset.replace('.png', '-960.webp')} type="image/webp" />
        <source srcset={active.asset.replace('.png', '.webp')} type="image/webp" />
        <img src={active.asset} alt={`Визуализация сценария: ${active.label}`} width="1672" height="941" on:error={useFallback} />
      </picture>
      <div class="room-mask"></div>
      <div class="direction-marker mono">{active.direction}</div>
      <div class="waveform" aria-label={`Характер сигнала: ${active.character}`}>
        {#each active.wave as value, index}
          <i style={`--height:${value}%;--delay:${index * 35}ms`}></i>
        {/each}
      </div>
      <div class="frequency mono">{active.character}</div>
    </div>

    <aside class="profile-readout" aria-live="polite">
      <span class="mono">ВЕРОЯТНЫЕ ПУТИ</span>
      <h3>{active.label}</h3>
      <ol>
        {#each active.likelyPaths as path, index}<li><span>0{index + 1}</span>{path}</li>{/each}
      </ol>
      <a class="button" href="#xray" on:click={() => track('path_selected', { source: 'noise_deck', noise: active.key })}>{active.cta}</a>
      <p>Доли — частые сценарии по данным компании, а не диагноз конкретной квартиры.</p>
    </aside>
  </div>
</section>

<style>
  .noise-deck { position: relative; min-height: 150svh; padding: clamp(110px, 12vw, 220px) 0; overflow: hidden; background: var(--ink-900); }
  .noise-deck::before { content: ''; position: absolute; width: 55vw; height: 55vw; left: 24%; top: 30%; border: 1px solid var(--white-16); border-radius: 50%; opacity: .35; }
  .section-head { position: relative; z-index: 2; }
  .deck-stage { position: relative; z-index: 1; min-height: 860px; margin-top: 84px; display: grid; grid-template-columns: repeat(16, minmax(0, 1fr)); gap: 24px; align-items: center; }
  .selector { grid-column: 1 / 5; display: flex; flex-direction: column; }
  .selector button { min-height: 72px; display: grid; grid-template-columns: 36px 1fr auto; gap: 12px; align-items: center; padding: 12px 0; border: 0; border-bottom: 1px solid var(--white-16); background: transparent; color: var(--white-64); text-align: left; cursor: pointer; }
  .selector button strong { font-size: clamp(.92rem, 1.2vw, 1.12rem); font-weight: 500; }
  .selector button em { font: normal 500 .68rem/1 'IBM Plex Mono', monospace; }
  .selector button.active { color: var(--white); border-bottom-color: var(--signal); }
  .selector button.active .mono { color: var(--signal); }
  .room-frame { grid-column: 5 / 13; position: relative; aspect-ratio: 1 / 1; max-height: 760px; overflow: hidden; border-radius: 50%; outline: none; isolation: isolate; box-shadow: 0 28px 90px rgba(0,0,0,.34); }
  .room-frame img { position: absolute; inset: 0; z-index: -2; width: 100%; height: 100%; object-fit: cover; object-position: center; filter: brightness(.62) saturate(.8); transition: object-position 520ms ease, filter 520ms ease; }
  [data-noise='impact'] .room-frame img { object-position: 60% 18%; }
  [data-noise='voices'] .room-frame img { object-position: 87% 50%; }
  [data-noise='bass'] .room-frame img { object-position: 54% 72%; }
  [data-noise='lift'] .room-frame img { object-position: 95% 46%; filter: brightness(.5) saturate(.65); }
  [data-noise='road'] .room-frame img { object-position: 58% 50%; filter: brightness(.75) saturate(.9); }
  [data-noise='ventilation'] .room-frame img { object-position: 72% 10%; }
  .room-mask { position: absolute; inset: 0; z-index: -1; border-radius: inherit; background: radial-gradient(circle at 50% 58%, transparent 12%, rgba(7,9,8,.36) 72%); box-shadow: inset 0 0 0 1px var(--white-16); }
  .direction-marker { position: absolute; top: 11%; left: 50%; transform: translateX(-50%); padding: 8px 12px; border: 1px solid var(--white-16); border-radius: 100px; background: rgba(7,9,8,.7); color: var(--white-64); white-space: nowrap; }
  .waveform { position: absolute; inset: 34% 12%; display: flex; gap: clamp(4px, .7vw, 12px); align-items: center; justify-content: center; }
  .waveform i { flex: 1; max-width: 10px; height: var(--height); border-radius: 10px; background: linear-gradient(to top, var(--signal), var(--acoustic)); box-shadow: 0 0 16px rgba(255,101,79,.28); animation: signal 1.8s var(--delay) ease-in-out infinite alternate; transform-origin: center; }
  @keyframes signal { 45% { transform: scaleY(.64); opacity: .55; } }
  .frequency { position: absolute; left: 50%; bottom: 11%; transform: translateX(-50%); width: 76%; text-align: center; color: var(--white-64); }
  .profile-readout { grid-column: 13 / -1; align-self: end; padding-bottom: 64px; }
  .profile-readout > .mono { color: var(--acoustic); }
  .profile-readout h3 { margin: 18px 0 34px; font-family: 'Geologica', sans-serif; font-size: clamp(1.8rem, 2.8vw, 3.3rem); line-height: 1.02; letter-spacing: -.045em; }
  .profile-readout ol { list-style: none; padding: 0; margin: 0 0 34px; }
  .profile-readout li { display: flex; gap: 14px; padding: 9px 0; border-bottom: 1px solid var(--white-16); color: var(--white-64); }
  .profile-readout li span { font: 500 .65rem/1.8 'IBM Plex Mono', monospace; color: var(--signal); }
  .profile-readout .button { width: 100%; font-size: .82rem; }
  .profile-readout > p { margin-top: 18px; font-size: .72rem; color: var(--white-64); }

  @media (max-width: 1100px) {
    .deck-stage { grid-template-columns: repeat(8, 1fr); }
    .selector { grid-column: 1 / 3; }
    .room-frame { grid-column: 3 / 7; }
    .profile-readout { grid-column: 7 / -1; }
  }

  @media (max-width: 767px) {
    .noise-deck { min-height: auto; }
    .deck-stage { min-height: 0; grid-template-columns: repeat(4, 1fr); margin-top: 48px; }
    .selector { grid-column: 1 / -1; flex-direction: row; overflow-x: auto; scrollbar-width: none; }
    .selector button { min-width: 142px; grid-template-columns: 26px 1fr; }
    .selector button em { grid-column: 2; }
    .room-frame { grid-column: 1 / -1; margin-top: 24px; aspect-ratio: 1 / 1.08; }
    .profile-readout { grid-column: 1 / -1; padding: 30px 0 0; }
  }

  @media (prefers-reduced-motion: reduce) { .waveform i { animation: none; } }
</style>
