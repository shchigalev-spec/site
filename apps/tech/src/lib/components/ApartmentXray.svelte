<script lang="ts">
  import type { PathKey } from '$lib/types';
  import { diagnosticContext } from '$lib/stores/diagnostic';
  import { track } from '$lib/analytics';

  const paths: { key: PathKey; label: string; source: string; conclusion: string }[] = [
    { key: 'wall', label: 'Стены', source: 'Боковой сигнал', conclusion: 'Проверяем перегородку, розетки и примыкания.' },
    { key: 'ceiling', label: 'Потолок', source: 'Удар сверху', conclusion: 'Энергия может уйти из плиты во фланговые стены.' },
    { key: 'floor', label: 'Пол', source: 'Структурная связь', conclusion: 'Периметр и проходки способны обойти развязанный слой.' },
    { key: 'socket', label: 'Розетки', source: 'Воздушный канал', conclusion: 'Полость и коробки связывают соседние помещения.' },
    { key: 'ventilation', label: 'Вентиляция', source: 'Канал', conclusion: 'Звук идёт по воздуху и связанным ответвлениям.' },
    { key: 'junction', label: 'Примыкания', source: 'Фланговый путь', conclusion: 'Стыки конструкций передают энергию вокруг очевидной поверхности.' }
  ];

  let selected = paths[5];

  function choose(path: typeof paths[number]) {
    selected = path;
    diagnosticContext.update((context) => ({ ...context, path: path.key }));
    track('path_selected', { path: path.key });
  }
</script>

<section class="xray" id="xray" aria-labelledby="xray-title" data-path={selected.key}>
  <div class="shell section-head">
    <p class="mono">МАРШРУТ / 03</p>
    <h2 class="display" id="xray-title">Слышно здесь. Передаваться может в другом месте.</h2>
    <p>Выберите конструкцию и проследите, как энергия огибает очевидную поверхность.</p>
  </div>

  <div class="xray-stage shell">
    <div class="path-controls" aria-label="Пути передачи">
      {#each paths as path, index}
        <button type="button" class:active={selected.key === path.key} aria-pressed={selected.key === path.key} on:click={() => choose(path)}>
          <span class="mono">0{index + 1}</span>{path.label}
        </button>
      {/each}
    </div>

    <div class="apartment" aria-label={`Схема квартиры. Выбран путь: ${selected.label}`}>
      <picture>
        <source media="(max-width: 960px)" srcset="/generated/tech-apartment-xray-960.webp" type="image/webp" />
        <source srcset="/generated/tech-apartment-xray.webp" type="image/webp" />
        <img class="xray-base" src="/generated/tech-apartment-xray.png" alt="" width="1672" height="941" loading="lazy" />
      </picture>
      <div class="room room-a"><span>КОМНАТА A</span></div>
      <div class="room room-b"><span>КОМНАТА B</span></div>
      <div class="room room-c"><span>КУХНЯ</span></div>
      <div class="room room-d"><span>КОРИДОР</span></div>
      <div class="route-geometry" aria-hidden="true">
        <i class="segment one"></i><i class="segment two"></i><i class="segment three"></i><b></b>
      </div>
      <span class="socket-dot one" aria-hidden="true"></span><span class="socket-dot two" aria-hidden="true"></span>
      <span class="vent-dot" aria-hidden="true"></span>
      <div class="source-pulse mono">{selected.source}</div>
    </div>

    <aside class="xray-output" aria-live="polite">
      <span class="mono">ВЫБРАННЫЙ ПУТЬ / {selected.label}</span>
      <p class="display">Не лечим плоскость, пока не проверили маршрут.</p>
      <p>{selected.conclusion}</p>
      <a class="button secondary" href="#scenario">Проверить вероятный путь</a>
    </aside>
  </div>
</section>

<style>
  .xray { min-height: 210svh; padding: clamp(120px, 13vw, 230px) 0; background: #090c0b; overflow: hidden; }
  .xray-stage { min-height: 980px; display: grid; grid-template-columns: repeat(16, 1fr); gap: 24px; align-items: center; margin-top: 80px; }
  .path-controls { grid-column: 1 / 4; display: flex; flex-direction: column; align-self: center; }
  .path-controls button { min-height: 62px; padding: 10px 0; display: grid; grid-template-columns: 42px 1fr; align-items: center; border: 0; border-bottom: 1px solid var(--white-16); background: transparent; color: var(--white-64); text-align: left; cursor: pointer; }
  .path-controls button.active { color: var(--white); border-color: var(--acoustic); }
  .path-controls button.active .mono { color: var(--signal); }
  .apartment { grid-column: 4 / 13; position: relative; aspect-ratio: 1.78 / 1; transform-style: preserve-3d; }
  .xray-base { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; filter: brightness(.72) saturate(.74); }
  .room { position: absolute; border: 2px solid rgba(255,253,248,.18); background: rgba(23,28,26,.08); box-shadow: inset 0 0 60px rgba(108,159,150,.04); transition: border-color 350ms ease, background 350ms ease, transform 500ms ease; }
  .room::before { content: ''; position: absolute; inset: 11%; border: 1px solid rgba(255,253,248,.08); }
  .room span { position: absolute; left: 12px; top: 10px; font: 500 9px/1 'IBM Plex Mono', monospace; letter-spacing: .08em; color: var(--white-64); }
  .room-a { inset: 24% 59% 18% 5%; }
  .room-b { inset: 26% 8% 21% 52%; }
  .room-c { inset: 18% 40% 48% 39%; }
  .room-d { inset: 58% 34% 7% 44%; }
  [data-path='wall'] .room-a, [data-path='socket'] .room-a { border-right-color: var(--signal); transform: translateZ(18px); }
  [data-path='ceiling'] .room-b { background: rgba(108,159,150,.22); transform: translateZ(32px); }
  [data-path='floor'] .room-c { background: rgba(255,101,79,.14); transform: translateZ(-10px); }
  [data-path='ventilation'] .room-b, [data-path='ventilation'] .room-d { border-color: var(--acoustic); }
  [data-path='junction'] .room-a, [data-path='junction'] .room-b { border-bottom-color: var(--signal); }
  .route-geometry .segment { position: absolute; z-index: 4; height: 3px; border-radius: 4px; background: var(--signal); box-shadow: 0 0 18px var(--signal); transform-origin: left; animation: route-pulse 1.7s ease-in-out infinite alternate; }
  .segment.one { width: 33%; left: 9%; top: 28%; transform: rotate(20deg); }
  .segment.two { width: 27%; left: 39%; top: 39%; transform: rotate(74deg); }
  .segment.three { width: 30%; left: 48%; top: 68%; transform: rotate(-8deg); background: var(--acoustic); box-shadow: 0 0 18px var(--acoustic); }
  [data-path='ceiling'] .segment.one { transform: rotate(-15deg); top: 10%; }
  [data-path='floor'] .segment.two { top: 72%; transform: rotate(5deg); }
  [data-path='ventilation'] .segment.one { left: 65%; top: 24%; transform: rotate(76deg); }
  [data-path='socket'] .segment.three { left: 20%; top: 45%; transform: rotate(4deg); }
  @keyframes route-pulse { to { filter: brightness(1.7); transform-origin: center; } }
  .route-geometry b { position: absolute; z-index: 5; width: 12px; height: 12px; left: 76%; top: 64%; border-radius: 50%; background: var(--acoustic); box-shadow: 0 0 0 9px rgba(108,159,150,.13); }
  .socket-dot { position: absolute; z-index: 5; width: 12px; height: 12px; border: 2px solid var(--signal); border-radius: 50%; }
  .socket-dot.one { left: 49%; top: 28%; } .socket-dot.two { left: 49%; top: 49%; }
  .vent-dot { position: absolute; z-index: 5; width: 28px; height: 12px; right: 12%; top: 12%; border: 1px solid var(--acoustic); }
  .source-pulse { position: absolute; z-index: 5; left: 5%; top: 12%; padding: 8px 10px; border: 1px solid var(--signal); color: var(--signal); background: var(--ink-950); transform: translateZ(20px); }
  .xray-output { grid-column: 13 / -1; align-self: end; padding-bottom: 120px; }
  .xray-output > .mono { color: var(--acoustic); }
  .xray-output .display { font-size: clamp(2rem, 3vw, 3.8rem); line-height: 1; }
  .xray-output > p:not(.display) { color: var(--white-64); }
  .xray-output .button { margin-top: 20px; width: 100%; font-size: .82rem; }

  @media (max-width: 1000px) {
    .xray-stage { grid-template-columns: repeat(8,1fr); min-height: 900px; }
    .path-controls { grid-column: 1 / 3; }
    .apartment { grid-column: 3 / -1; }
    .xray-output { grid-column: 3 / 8; padding-bottom: 20px; }
  }
  @media (max-width: 767px) {
    .xray { min-height: auto; }
    .xray-stage { display: flex; min-height: 0; flex-direction: column; align-items: stretch; margin-top: 48px; }
    .path-controls { flex-direction: row; overflow-x: auto; }
    .path-controls button { min-width: 130px; }
    .apartment { width: 112%; margin: 80px -6% 50px; }
    .xray-output { padding: 0; }
  }
  @media (prefers-reduced-motion: reduce) { .route-geometry .segment { animation: none; } }
</style>
