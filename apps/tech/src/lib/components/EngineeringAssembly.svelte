<script lang="ts">
  let progress = 72;
  const principles = [
    { code: '01', label: 'Масса', note: 'Слой сопротивляется передаче воздушной энергии.' },
    { code: '02', label: 'Развязка', note: 'Физический зазор уменьшает жёсткую связь конструкций.' },
    { code: '03', label: 'Герметизация', note: 'Контур закрывает воздушные обходные пути.' },
    { code: '04', label: 'Примыкания', note: 'Узлы не дают энергии обойти основную плоскость.' }
  ];
</script>

<section class="assembly-section" aria-labelledby="assembly-title" style={`--explode:${progress / 100}`}>
  <div class="shell assembly-grid">
    <div class="assembly-copy">
      <p class="mono">МЕТОД / 04</p>
      <h2 class="display" id="assembly-title">Материал не работает отдельно от узла.</h2>
      <p>Разведите слои, чтобы увидеть четыре принципа конструкции. Точный состав определяется после диагностики.</p>
      <label for="assembly-range"><span>Исходная поверхность</span><span>Разобранный узел</span></label>
      <input id="assembly-range" type="range" min="0" max="100" bind:value={progress} aria-label="Развести слои конструкции" />
    </div>
    <div class="layer-stage" aria-label="Разобранная схема конструкции">
      {#each principles as principle, index}
        <div class="layer" style={`--index:${index};--offset:${(index - 1.5) * progress * 0.5}px`}>
          <span class="mono">{principle.code} / {principle.label}</span>
          <p>{principle.note}</p>
        </div>
      {/each}
      <i class="energy before" aria-hidden="true"></i><i class="energy after" aria-hidden="true"></i>
    </div>
  </div>
</section>

<style>
  .assembly-section { min-height: 130svh; padding: clamp(110px, 13vw, 230px) 0; color: var(--ink-950); background: var(--paper-100); overflow: hidden; }
  .assembly-grid { display: grid; grid-template-columns: repeat(16, 1fr); gap: 24px; align-items: center; min-height: 800px; }
  .assembly-copy { grid-column: 2 / 8; }
  .assembly-copy > .mono { color: var(--acoustic-dark); }
  .assembly-copy h2 { margin: 24px 0; font-size: clamp(2.8rem, 5.6vw, 6.5rem); }
  .assembly-copy > p:not(.mono) { max-width: 48ch; color: rgba(7,9,8,.64); }
  label { display: flex; justify-content: space-between; margin-top: 54px; font: 500 .65rem/1.3 'IBM Plex Mono', monospace; text-transform: uppercase; }
  input[type='range'] { width: 100%; height: 44px; margin-top: 8px; accent-color: var(--signal); cursor: ew-resize; }
  .layer-stage { grid-column: 9 / -1; position: relative; min-height: 720px; perspective: 1200px; display: grid; place-content: center; }
  .layer { grid-area: 1 / 1; width: min(40vw, 620px); height: min(27vw, 420px); padding: 28px; border: 1px solid rgba(7,9,8,.34); background: color-mix(in srgb, var(--paper-100) calc(75% - var(--index) * 8%), var(--ink-800)); box-shadow: 0 22px 70px rgba(7,9,8,.12); transform: translate3d(var(--offset), calc(var(--offset) * -.56), calc(var(--index) * 16px)) rotateX(62deg) rotateZ(-22deg); transition: transform 60ms linear; }
  .layer:nth-child(2) { border-color: var(--acoustic-dark); }
  .layer:nth-child(3) { border-color: var(--signal); }
  .layer span { color: rgba(7,9,8,.62); }
  .layer p { max-width: 29ch; opacity: calc(.25 + var(--explode)); font-size: .82rem; }
  .energy { position: absolute; z-index: 6; top: 49%; width: 90px; height: 3px; background: var(--signal); box-shadow: 0 0 18px rgba(255,101,79,.5); }
  .energy.before { left: 0; }
  .energy.after { right: 0; width: calc(90px - var(--explode) * 65px); background: var(--acoustic-dark); }
  @media (max-width: 900px) { .assembly-grid { grid-template-columns: repeat(8,1fr); } .assembly-copy { grid-column: 1 / 5; } .layer-stage { grid-column: 5 / -1; } .layer { width: 48vw; height: 34vw; } }
  @media (max-width: 767px) { .assembly-section { min-height: auto; } .assembly-grid { display: flex; min-height: 0; flex-direction: column; align-items: stretch; } .layer-stage { min-height: 560px; } .layer { width: 72vw; height: 54vw; padding: 18px; } .energy { display: none; } }
</style>
