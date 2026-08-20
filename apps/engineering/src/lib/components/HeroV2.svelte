<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { track } from '$lib/analytics';
  import { buildDiagnosisHref } from '$lib/diagnosis-link';

  let root: HTMLElement;
  let progress = 0;
  let reduced = false;
  let motionTracked = false;
  let pathTracked = false;
  let frame = 0;
  $: diagnosisHref = buildDiagnosisHref($page.url, 'hero');

  const clamp = (value: number) => Math.max(0, Math.min(1, value));
  $: timeline = reduced ? 1 : progress;
  $: observed = clamp((timeline - 0.15) / 0.2);
  $: hypotheses = clamp((timeline - 0.35) / 0.25);
  $: isolated = clamp((timeline - 0.6) / 0.22);
  $: decision = clamp((timeline - 0.82) / 0.18);
  $: observedAnnotation = clamp((timeline - 0.1) / 0.08) * (1 - clamp((timeline - 0.34) / 0.1));
  $: hypothesesAnnotation = clamp((timeline - 0.32) / 0.1) * (1 - clamp((timeline - 0.58) / 0.1));
  $: decisionAnnotation = clamp((timeline - 0.58) / 0.12);

  onMount(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const setReduced = () => {
      reduced = media.matches;
      schedule();
    };
    const update = () => {
      frame = 0;
      if (!root || reduced) {
        progress = reduced ? 1 : 0;
        return;
      }
      const rect = root.getBoundingClientRect();
      const range = Math.max(root.offsetHeight - window.innerHeight, 1);
      progress = clamp(-rect.top / range);
      if (progress >= 0.82 && !pathTracked) {
        pathTracked = true;
        track('path_animation_complete', { source: 'hero' });
      }
      if (progress >= 0.985 && !motionTracked) {
        motionTracked = true;
        track('hero_motion_complete');
      }
    };
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    reduced = media.matches;
    progress = reduced ? 1 : 0;
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    media.addEventListener('change', setReduced);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      media.removeEventListener('change', setReduced);
    };
  });
</script>

<section
  id="hero"
  bind:this={root}
  class="hero-v2"
  data-chapter="01 · Диагностика"
  aria-labelledby="hero-v2-title"
  style={`--observed:${observed};--hypotheses:${hypotheses};--isolated:${isolated};--decision:${decision}`}
>
  <div class="hero-v2-stage">
    <div class="hero-v2-plate">
      <picture class="hero-v2-clean" aria-hidden="true">
        <source media="(max-width: 767px)" type="image/webp" srcset="/generated/engineering-v2-hero-mobile-clean.webp" />
        <source type="image/webp" srcset="/generated/engineering-v2-hero-clean.webp" />
        <img src="/generated/engineering-v2-hero-clean.png" alt="" width="1536" height="864" fetchpriority="high" />
      </picture>
      <picture class="hero-v2-cutaway" aria-hidden="true">
        <source media="(max-width: 767px)" type="image/webp" srcset="/generated/engineering-v2-hero-mobile-cutaway.webp" />
        <source type="image/webp" srcset="/generated/engineering-v2-hero-cutaway.webp" />
        <img src="/generated/engineering-v2-hero-cutaway.png" alt="" width="1536" height="864" loading="lazy" fetchpriority="low" decoding="async" />
      </picture>
      <div class="hero-v2-wash" aria-hidden="true"></div>
      <svg class="hero-v2-overlay" viewBox="0 0 1000 600" role="img" aria-labelledby="hero-v2-diagram-title hero-v2-diagram-desc">
        <title id="hero-v2-diagram-title">Диагностическая схема пути шума</title>
        <desc id="hero-v2-diagram-desc">Линия наблюдаемой поверхности, три возможных пути и один выбранный маршрут с точками проверки.</desc>
        <path class="hero-v2-boundary" pathLength="1" d="M665 38 L665 478 L558 552" style={`stroke-dashoffset:${1 - observed}`} />
        <path class="hero-v2-witness" d="M649 38 H681 M649 478 H681 M545 552 H575" />
        <g class="hero-v2-candidates" style={`opacity:${hypotheses * (1 - isolated * 0.55)}`}>
          <path pathLength="1" d="M900 112 C808 118 742 146 665 205" style={`stroke-dashoffset:${1 - hypotheses}`} />
          <path pathLength="1" d="M900 470 C786 468 703 505 610 536" style={`stroke-dashoffset:${1 - hypotheses}`} />
          <path pathLength="1" d="M930 294 C824 293 744 292 665 300" style={`stroke-dashoffset:${1 - hypotheses}`} />
        </g>
        <path class="hero-v2-selected" pathLength="1" d="M930 294 C824 293 744 292 665 300 L665 478 L610 536" style={`stroke-dashoffset:${1 - isolated};opacity:${isolated}`} />
        <g class="hero-v2-checkpoints" style={`opacity:${isolated}`}>
          <circle cx="665" cy="300" r="7" /><circle cx="665" cy="478" r="7" /><circle cx="610" cy="536" r="7" />
        </g>
      </svg>
      <span class="hero-v2-surface" aria-hidden="true" style={`opacity:${clamp((timeline - 0.1) / 0.08)}`}>наблюдаемая поверхность</span>
      <div class="hero-v2-legend" aria-hidden="true">
        <span><i class="heard"></i> где слышно</span>
        <span><i class="candidate"></i> возможный путь</span>
        <span><i class="selected"></i> выбранный путь</span>
        <span><i class="checkpoint"></i> точка проверки</span>
      </div>
    </div>

    <div class="hero-v2-copy">
      <span class="hero-v2-eyebrow">Инженерная шумоизоляция квартир в Москве</span>
      <h1 id="hero-v2-title">Сначала найдём, как шум попадает в комнату. Потом рассчитаем решение.</h1>
      <p class="hero-v2-support">Диагностика, проект, собственная бригада, монтаж и проверка результата. Без покупки материалов вслепую.</p>
      <div class="hero-v2-actions">
        <a class="primary-button" href={diagnosisHref} on:click={() => track('hero_cta_click')}>Разобрать мой шум</a>
        <a class="text-link" href="/#method">Как проходит диагностика</a>
      </div>
      <p class="hero-v2-proof">Бесплатная первичная диагностика. Следующий коммерческий шаг — выезд на объект.</p>
    </div>

    <aside class="hero-v2-notes" aria-live="off">
      <p class="hero-v2-note-observed" style={`opacity:${observedAnnotation}`}>Наблюдаемая поверхность — только начало гипотезы.</p>
      <p class="hero-v2-note-hypotheses" style={`opacity:${hypothesesAnnotation}`}>Источник и видимая поверхность могут не совпасть.</p>
      <p class="hero-v2-note-decision" style={`opacity:${decisionAnnotation}`}>Не назначаем конструкцию, пока не понимаем путь передачи.</p>
    </aside>

    <div class="hero-v2-state" aria-hidden="true">
      <span>01</span><i style={`transform:scaleX(${timeline})`}></i><span>04</span>
    </div>
  </div>
</section>
