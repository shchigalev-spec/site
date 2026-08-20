<script lang="ts">
  import type { CasePage } from '$lib/types';

  export let item: CasePage;
  export let compact = false;

  function revealOnce(node: HTMLElement) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const complete = () => {
      node.dataset.graphState = 'complete';
      node.dispatchEvent(new CustomEvent('evidencegraphcomplete', { bubbles: true, detail: { case: item.slug } }));
    };

    if (reduce || !('IntersectionObserver' in window)) {
      node.dataset.graphAnimated = 'false';
      complete();
      return {};
    }

    node.dataset.graphState = 'waiting';
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      node.dataset.graphAnimated = 'true';
      node.dataset.graphState = 'animating';
      timer = setTimeout(complete, 1400);
      observer.disconnect();
    }, { threshold: compact ? 0.2 : 0.35 });
    observer.observe(node);

    return {
      destroy() {
        observer.disconnect();
        if (timer) clearTimeout(timer);
      }
    };
  }
</script>

<figure
  class="evidence-graph"
  class:compact
  class:envelope={item.graphType === 'envelope'}
  class:peak={item.graphType === 'peak'}
  class:band={item.graphType === 'band'}
  use:revealOnce
  aria-label={`Схематичное сопоставление измеренного результата: ${item.result}. Не протокол измерения.`}
>
  <div class="graph-meta mono">
    <span>{item.graphType === 'peak' ? 'ПИКОВОЕ СОБЫТИЕ' : item.graphType === 'band' ? 'ПОЛОСА СНИЖЕНИЯ' : 'ДО / ПОСЛЕ'}</span>
    <span>СХЕМА, НЕ ПРОТОКОЛ</span>
  </div>

  {#if item.graphType === 'envelope'}
    <svg viewBox="0 0 640 220" role="img" aria-hidden="true">
      <path class="axis" d="M20 188H620 M20 28V188" />
      <path class="trace trace-before" pathLength="1" d="M20 140 C70 54 122 166 176 62 S282 158 336 70 S448 154 500 78 S580 138 620 92" />
      <path class="trace trace-after" pathLength="1" d="M20 154 C78 116 124 166 184 126 S292 162 350 130 S456 164 514 132 S584 155 620 138" />
    </svg>
  {:else if item.graphType === 'peak'}
    <svg viewBox="0 0 640 220" role="img" aria-hidden="true">
      <path class="axis" d="M20 188H620 M20 28V188" />
      <path class="trace trace-before" pathLength="1" d="M20 168 L196 166 L226 152 L252 36 L280 154 L314 166 L620 168" />
      <path class="trace trace-after" pathLength="1" d="M20 176 L204 174 L236 164 L254 94 L278 164 L318 174 L620 176" />
      <path class="reduction-mark" d="M286 42V98 M276 42H296 M276 98H296" />
    </svg>
  {:else}
    <svg viewBox="0 0 640 220" role="img" aria-hidden="true">
      <path class="axis" d="M20 188H620" />
      <rect class="band-shape band-before" x="20" y="54" width="560" height="38" rx="4" />
      <rect class="band-shape band-after" x="20" y="126" width="376" height="38" rx="4" />
      <path class="band-guide" d="M396 116V174 M580 44V102" />
    </svg>
  {/if}

  <figcaption>
    <span><small>{item.graphType === 'peak' ? 'ПИК' : 'ДО'}</small><b>{item.resultParts[0]}</b></span>
    <i aria-hidden="true"></i>
    <span><small>{item.graphType === 'peak' ? 'СНИЖЕНИЕ' : 'ПОСЛЕ'}</small><b>{item.resultParts[1]}</b></span>
  </figcaption>
</figure>

<style>
  .evidence-graph {
    position: relative;
    margin: 0;
    padding: clamp(18px, 2vw, 30px);
    border: 1px solid rgba(7, 9, 8, 0.18);
    background: rgba(255, 253, 248, 0.82);
    color: var(--ink-950);
    overflow: hidden;
  }

  .evidence-graph::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: linear-gradient(rgba(49, 94, 87, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(49, 94, 87, 0.08) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: linear-gradient(90deg, #000, transparent 86%);
  }

  .graph-meta,
  figcaption {
    position: relative;
    z-index: 1;
  }

  .graph-meta {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    color: var(--acoustic-dark);
  }

  svg {
    position: relative;
    z-index: 1;
    display: block;
    width: 100%;
    height: auto;
    margin-block: 12px 4px;
    overflow: visible;
  }

  .axis {
    fill: none;
    stroke: rgba(7, 9, 8, 0.2);
    stroke-width: 2;
  }

  .trace {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 5;
    stroke-dasharray: 1;
    stroke-dashoffset: 0;
  }

  .trace-before { stroke: var(--signal); }
  .trace-after { stroke: var(--acoustic-dark); }
  .reduction-mark,
  .band-guide { fill: none; stroke: var(--acoustic-dark); stroke-width: 2; stroke-dasharray: 5 5; }
  .band-shape { transform-origin: left center; transform-box: fill-box; }
  .band-before { fill: var(--signal); }
  .band-after { fill: var(--acoustic-dark); }

  :global(.evidence-graph[data-graph-state='waiting']) .trace { stroke-dashoffset: 1; }
  :global(.evidence-graph[data-graph-state='waiting']) .band-shape { transform: scaleX(0.02); }
  :global(.evidence-graph[data-graph-state='waiting']) .reduction-mark,
  :global(.evidence-graph[data-graph-state='waiting']) .band-guide { opacity: 0; }
  :global(.evidence-graph[data-graph-state='animating']) .trace { animation: draw-evidence 1050ms cubic-bezier(.22,.8,.2,1) both; }
  :global(.evidence-graph[data-graph-state='animating']) .trace-after { animation-delay: 160ms; }
  :global(.evidence-graph[data-graph-state='animating']) .band-shape { animation: expand-evidence 900ms cubic-bezier(.22,.8,.2,1) both; }
  :global(.evidence-graph[data-graph-state='animating']) .band-after { animation-delay: 180ms; }
  :global(.evidence-graph[data-graph-state='animating']) .reduction-mark,
  :global(.evidence-graph[data-graph-state='animating']) .band-guide { animation: mark-evidence 500ms 720ms ease both; }

  figcaption {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: end;
    gap: clamp(12px, 2vw, 28px);
  }

  figcaption span { display: grid; gap: 3px; }
  figcaption span:last-child { text-align: right; }
  figcaption small { font-family: 'IBM Plex Mono', monospace; font-size: .63rem; letter-spacing: .08em; color: rgba(7, 9, 8, .58); }
  figcaption b { font-family: 'Geologica', sans-serif; font-size: clamp(1.35rem, 2.7vw, 3.2rem); line-height: 1; font-weight: 500; letter-spacing: -.045em; }
  figcaption span:last-child b { color: var(--acoustic-dark); }
  figcaption i { height: 1px; margin-bottom: .45rem; background: linear-gradient(90deg, var(--signal), var(--acoustic-dark)); }

  .compact { padding: 16px; }
  .compact .graph-meta span:last-child { display: none; }
  .compact svg { margin-top: 4px; }
  .compact figcaption b { font-size: clamp(1.2rem, 2vw, 2rem); }

  @keyframes draw-evidence { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  @keyframes expand-evidence { from { transform: scaleX(.02); } to { transform: scaleX(1); } }
  @keyframes mark-evidence { from { opacity: 0; } to { opacity: 1; } }

  @media (prefers-reduced-motion: reduce) {
    .trace,
    .band-shape,
    .reduction-mark,
    .band-guide { animation: none !important; stroke-dashoffset: 0 !important; transform: none !important; opacity: 1 !important; }
  }
</style>
