<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import WallDetailV2 from './WallDetailV2.svelte';
  import CeilingDetailV2 from './CeilingDetailV2.svelte';
  import FloorDetailV2 from './FloorDetailV2.svelte';
  import { track } from '$lib/analytics';
  import { buildDiagnosisHref } from '$lib/diagnosis-link';

  const method = [
    ['Фиксируем симптом', 'Что слышно, где и когда — без преждевременного выбора конструкции.'],
    ['Сравниваем гипотезы', 'Разделяем источник и возможные прямые или обходные пути передачи.'],
    ['Обследуем объект', 'Проверяем основание, примыкания, проходки и реальные ограничения помещения.'],
    ['Проектируем узлы', 'Собираем конструкцию и отдельно решаем критические стыки.'],
    ['Считаем объём', 'Определяем состав работ и бюджет после уменьшения существенных неизвестных.'],
    ['Монтируем и проверяем', 'Фиксируем скрытые работы, принимаем узлы и проверяем результат.']
  ];

  const contexts = {
    wall: {
      label: 'Стена',
      note: 'Стеновой узел должен сохранять массу, развязку и герметичный периметр — включая розетки и оба примыкания.',
      bridge: 'Опасность: крепёж или подрозетник связывает основание с облицовкой.',
      controlled: 'Контроль: раздельные связи, непрерывная герметизация и проверка обхода через пол и потолок.',
      checkpoint: 'До закрытия: периметр, каркас, проходки и розетки видны на одном комплекте фиксации.',
      labels: ['масса', 'развязка', 'поглощение', 'герметичный контур', 'розетка', 'обходные пути']
    },
    ceiling: {
      label: 'Потолок',
      note: 'Потолок рассматривается вместе с перекрытием, подвесами и верхним примыканием стен.',
      bridge: 'Опасность: жёсткий подвес передаёт энергию сразу в облицовку.',
      controlled: 'Контроль: принцип виброразвязки сохраняется в подвесах и в примыкании к стене.',
      checkpoint: 'До закрытия: видны подвесы, каркас, поглощение, проходки и непрерывность контура.',
      labels: ['перекрытие', 'подвесы', 'поглощение', 'подвесная система', 'примыкание']
    },
    floor: {
      label: 'Пол',
      note: 'Плавающий слой работает, пока нагрузка отделена от плиты и стен по всему периметру.',
      bridge: 'Опасность: стяжка, отделка или плинтус создаёт жёсткий контакт со стеной.',
      controlled: 'Контроль: упругое разделение продолжается без разрывов и не зажато отделкой.',
      checkpoint: 'До финиша: фиксируем периметр, нахлёсты, проходки и отсутствие контакта с основанием.',
      labels: ['финиш / нагрузка', 'упругая развязка', 'несущая плита', 'периметр']
    }
  } as const;

  const states = ['Собрано', 'Раскрыто', 'Жёсткий мост', 'Контролируемый узел', 'Скрытые работы'];
  type ContextKey = keyof typeof contexts;
  let activeMethod = 0;
  let context: ContextKey = 'wall';
  let detailState = 0;
  let methodRoot: HTMLElement;
  let contextTabs: HTMLElement;

  onMount(() => {
    const steps = Array.from(methodRoot.querySelectorAll<HTMLElement>('[data-method-step]'));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) activeMethod = Number((visible.target as HTMLElement).dataset.methodStep);
    }, { rootMargin: '-30% 0px -48%', threshold: [0, .15, .45, .75] });
    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  });

  function chooseContext(next: ContextKey) {
    context = next;
    detailState = 0;
    track('path_selected', { detail: next, chapter: 'construction-v2' });
  }

  function setState(index: number) {
    detailState = index;
    track('path_selected', { detail: context, construction_state: states[index], chapter: 'construction-v2' });
  }

  function tabKey(event: KeyboardEvent, index: number) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const keys = Object.keys(contexts) as ContextKey[];
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? keys.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + keys.length) % keys.length;
    chooseContext(keys[next]);
    contextTabs.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
  }

  $: current = contexts[context];
</script>

<section class="method-construction-v2" id="method" data-chapter="04 · Метод + конструкция" bind:this={methodRoot}>
  <div class="method-v2">
    <header class="method-intro">
      <div class="section-label">04 / Метод + конструкция</div>
      <h2>Как жалоба становится инженерным решением.</h2>
      <p>Не подбираем слои по одному симптому. Сначала уменьшаем неизвестность, затем проектируем конструкцию и её критические стыки.</p>
    </header>

    <div class="method-story">
      <div class="method-map" aria-hidden="true">
        <div class="method-map-index">0{activeMethod + 1} / 06</div>
        <svg viewBox="0 0 520 420">
          <path class="map-base" d="M54 88H156L216 154H332L398 232H468M216 154 168 282H286L348 348H462"/>
          <path class="map-live" style={`--map-step:${activeMethod}`} d="M54 88H156L216 154H332L398 232H468M216 154 168 282H286L348 348H462"/>
          <g class:active={activeMethod >= 0}><circle cx="54" cy="88" r="14"/><text x="54" y="56">симптом</text></g>
          <g class:active={activeMethod >= 1}><circle cx="216" cy="154" r="14"/><text x="216" y="124">гипотезы</text></g>
          <g class:active={activeMethod >= 2}><circle cx="168" cy="282" r="14"/><text x="168" y="322">объект</text></g>
          <g class:active={activeMethod >= 3}><circle cx="398" cy="232" r="14"/><text x="398" y="202">узлы</text></g>
          <g class:active={activeMethod >= 4}><circle cx="286" cy="348" r="14"/><text x="286" y="388">объём</text></g>
          <g class:active={activeMethod >= 5}><circle cx="462" cy="348" r="14"/><text x="462" y="388">проверка</text></g>
        </svg>
        <p>{method[activeMethod][1]}</p>
      </div>

      <ol class="method-datum-v2" style={`--datum:${activeMethod / (method.length - 1)}`}>
        {#each method as step, index}
          <li data-method-step={index} class:current={activeMethod === index} class:read={activeMethod > index}>
            <span>0{index + 1}</span>
            <div><h3>{step[0]}</h3><p>{step[1]}</p></div>
          </li>
        {/each}
      </ol>
    </div>
  </div>

  <div class="construction-v2" id="construction">
    <header>
      <div class="section-label">04.2 / Три разных узла</div>
      <h2>Работает не слой.<br />Работает собранный контур.</h2>
      <p>Стена, потолок и пол передают энергию по-разному. Поэтому здесь три отдельных чертежа, а не один повёрнутый набор слоёв.</p>
    </header>

    <div class="context-tabs" role="tablist" aria-label="Выбрать конструктивный узел" bind:this={contextTabs}>
      {#each Object.entries(contexts) as [key, item], index}
        <button id={`context-${key}`} type="button" role="tab" aria-selected={context === key} aria-controls="construction-panel" tabindex={context === key ? 0 : -1} on:click={() => chooseContext(key as ContextKey)} on:keydown={(event) => tabKey(event, index)}><span>0{index + 1}</span>{item.label}</button>
      {/each}
    </div>

    <div class="construction-workbench" id="construction-panel" role="tabpanel" aria-labelledby={`context-${context}`}>
      <div class="diagram-column">
        <div class="diagram-frame">
          {#if context === 'wall'}<WallDetailV2 state={detailState} />
          {:else if context === 'ceiling'}<CeilingDetailV2 state={detailState} />
          {:else}<FloorDetailV2 state={detailState} />{/if}
        </div>
        <ul class="diagram-key" aria-label={`Функциональные элементы: ${current.label}`}>
          {#each current.labels as label, index}<li><span>0{index + 1}</span>{label}</li>{/each}
        </ul>
        <div class="state-controls" role="group" aria-label={`Состояние узла: ${current.label}`}>
          {#each states as label, index}
            <button type="button" aria-pressed={detailState === index} on:click={() => setState(index)}><span>0{index + 1}</span>{label}</button>
          {/each}
        </div>
      </div>

      <aside class="construction-note" aria-live="polite">
        <span>Узел / {current.label}</span>
        <h3>{states[detailState]}</h3>
        <p>{current.note}</p>
        {#if detailState === 2}<strong class="risk">{current.bridge}</strong>
        {:else if detailState >= 3}<strong>{detailState === 4 ? current.checkpoint : current.controlled}</strong>
        {:else}<strong>Сначала читаем функцию каждого элемента, затем проверяем связи между ними.</strong>{/if}
        <a href={buildDiagnosisHref($page.url, 'construction_v2', { construction: context })} class="primary-button" on:click={() => track('diagnostic_start', { placement: 'construction-v2', detail: context })}>Разобрать мой узел</a>
      </aside>
    </div>
  </div>
</section>

<style>
  .method-construction-v2{scroll-margin-top:4rem;background:#20231f;color:#fbfaf6}.method-construction-v2 .section-label{font-size:.75rem}.method-v2{padding:clamp(4.5rem,6vw,6.5rem) var(--margin)}
  .method-intro{display:grid;grid-template-columns:repeat(12,1fr);gap:var(--gutter);align-items:end}.method-intro .section-label{grid-column:1/4;color:#c4d1cc}.method-intro h2{grid-column:1/8;margin:1.6rem 0 0;max-width:12ch}.method-intro>p{grid-column:9/13;color:#c6cbc5;max-width:38ch}
  .method-story{display:grid;grid-template-columns:repeat(12,1fr);gap:var(--gutter);margin-top:4rem}.method-map{grid-column:1/6;position:sticky;top:8rem;align-self:start;min-height:30rem;padding:1.5rem;border:1px solid rgba(251,250,246,.18);background:#292d28}.method-map-index{font:.75rem 'IBM Plex Mono';color:#b9c9c2}.method-map svg{width:100%;height:auto;margin-top:1rem}.map-base,.map-live{fill:none;stroke-width:3}.map-base{stroke:rgba(251,250,246,.14)}.map-live{stroke:#a94332;stroke-dasharray:920;stroke-dashoffset:calc(920 - (var(--map-step) + 1) * 153);transition:stroke-dashoffset 480ms ease}.method-map g circle{fill:#292d28;stroke:rgba(251,250,246,.22);stroke-width:3}.method-map g.active circle{fill:#a94332;stroke:#d9ae9f}.method-map text{font:14px 'IBM Plex Mono';text-anchor:middle;fill:rgba(251,250,246,.66)}.method-map p{max-width:35ch;margin:1rem 0 0;color:#e4dcd2}
  .method-datum-v2{--datum:0;grid-column:7/13;position:relative;margin:0;padding:0 0 0 3rem;list-style:none}.method-datum-v2:before,.method-datum-v2:after{content:'';position:absolute;left:0;top:.9rem;width:1px;height:calc(100% - 4rem)}.method-datum-v2:before{background:rgba(251,250,246,.22)}.method-datum-v2:after{background:#b9c9c2;transform-origin:top;transform:scaleY(var(--datum));transition:transform 420ms ease}.method-datum-v2 li{position:relative;display:grid;grid-template-columns:3rem 1fr;gap:1.5rem;min-height:9rem;transition:color 240ms ease}.method-datum-v2 li:before{content:'';position:absolute;left:calc(-3rem - 6px);top:.45rem;width:11px;height:11px;border:1px solid #b9c9c2;background:#20231f;transform:rotate(45deg);transition:background 240ms ease}.method-datum-v2 li.current:before,.method-datum-v2 li.read:before{background:#b9c9c2}.method-datum-v2 li>span{font:.75rem 'IBM Plex Mono';color:#c4d1cc}.method-datum-v2 h3{margin:0 0 .6rem;color:#aeb5ae;font-size:clamp(1.65rem,2.4vw,2.6rem)}.method-datum-v2 p{max-width:40ch;color:#aeb5ae}.method-datum-v2 li.read h3{color:#d6dbd5}.method-datum-v2 li.read p{color:#bdc5be}.method-datum-v2 li.current h3{color:#fbfaf6}.method-datum-v2 li.current p{color:#d9ded8}
  .construction-v2{padding:clamp(4.5rem,6vw,6.5rem) var(--margin);background:#f2eee6;color:#242824}.construction-v2>header{display:grid;grid-template-columns:repeat(12,1fr);gap:var(--gutter);align-items:end}.construction-v2>header .section-label{grid-column:1/4;color:#48635f}.construction-v2>header h2{grid-column:1/8;margin:1.3rem 0 0;max-width:13ch}.construction-v2>header p{grid-column:9/13;max-width:38ch;color:var(--ink-soft)}
  .context-tabs{display:grid;grid-template-columns:repeat(3,1fr);margin-top:3.5rem;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule)}.context-tabs button{min-height:76px;padding:0 1.4rem;border:0;border-right:1px solid var(--rule);background:transparent;color:var(--ink);font:1rem 'Geologica';text-align:left;cursor:pointer}.context-tabs button:last-child{border-right:0}.context-tabs button span{margin-right:1rem;font:.75rem 'IBM Plex Mono';color:#48635f}.context-tabs button[aria-selected='true']{background:#20231f;color:#fbfaf6}.context-tabs button[aria-selected='true'] span{color:#e8c5b9}
  .construction-workbench{display:grid;grid-template-columns:minmax(0,8fr) minmax(17rem,4fr);gap:clamp(2rem,5vw,6rem);align-items:start;margin-top:2rem}.diagram-frame{min-height:30rem;border:1px solid var(--rule);background:#ece6dc}.diagram-key{display:none}.state-controls{display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--rule);border-top:0}.state-controls button{min-height:64px;padding:.7rem;border:0;border-right:1px solid var(--rule);background:#fbfaf6;color:#343833;font:.75rem 'IBM Plex Mono';cursor:pointer}.state-controls button:last-child{border-right:0}.state-controls button span{display:block;margin-bottom:.35rem;color:#48635f}.state-controls button[aria-pressed='true']{background:#a94332;color:#fff}.state-controls button[aria-pressed='true'] span{color:#f7ddd5}
  .construction-note{position:sticky;top:8rem;padding:1.2rem 0;border-top:2px solid #343833}.construction-note>span{font:.75rem 'IBM Plex Mono';color:#48635f}.construction-note h3{margin:1rem 0;font-size:clamp(2rem,3vw,3.4rem)}.construction-note p{color:var(--ink-soft)}.construction-note strong{display:block;margin:1rem 0;padding:.9rem;border-left:4px solid #698078;background:#e3e4dc}.construction-note strong.risk{border-color:#a94332;background:#ead9d2}.construction-note .primary-button{width:100%;justify-content:center}
  @media(max-width:800px){.method-v2,.construction-v2{padding:4rem 1.1rem}.method-intro,.construction-v2>header{display:block}.method-intro h2,.construction-v2>header h2{margin:1.1rem 0}.method-intro>p,.construction-v2>header p{margin-top:1rem}.method-story{display:block;margin-top:2.25rem}.method-map{display:none}.method-datum-v2{padding-left:2.25rem}.method-datum-v2 li{min-height:6rem;grid-template-columns:2.2rem 1fr}.method-datum-v2 li:before{left:calc(-2.25rem - 6px)}.method-datum-v2 h3{font-size:clamp(1.45rem,7.5vw,2rem)}.method-datum-v2 p{font-size:.9rem;line-height:1.4}.context-tabs{margin-top:2rem}.context-tabs button{min-height:60px;padding:.5rem .65rem;font-size:.88rem}.context-tabs button span{display:block;margin:0 0 .25rem}.construction-workbench{display:block;margin-top:1.25rem}.diagram-frame{min-height:0;overflow:hidden}.diagram-key{display:grid;grid-template-columns:1fr 1fr;gap:0;margin:0;padding:0;list-style:none;border:1px solid var(--rule);border-top:0}.diagram-key li{min-height:48px;padding:.65rem;border-right:1px solid var(--rule);border-bottom:1px solid var(--rule);font:.75rem 'IBM Plex Mono'}.diagram-key li:nth-child(even){border-right:0}.diagram-key li span{display:block;margin-bottom:.2rem;color:#48635f}.state-controls{grid-template-columns:1fr 1fr}.state-controls button{display:grid;grid-template-columns:2.4rem 1fr;align-items:center;min-height:52px;text-align:left;border-right:1px solid var(--rule);border-bottom:1px solid var(--rule)}.state-controls button:nth-child(even){border-right:0}.state-controls button:last-child{grid-column:1/-1;border-bottom:0;border-right:0}.state-controls button span{margin:0}.construction-note{position:relative;top:auto;margin-top:1.25rem}.construction-note .primary-button{min-height:52px}}
  @media(max-width:360px){.context-tabs button{font-size:.78rem}.method-map{padding:.8rem}}
  @media(prefers-reduced-motion:reduce){.map-live,.method-datum-v2:after,.method-datum-v2 li,.method-datum-v2 li:before{transition:none}.method-datum-v2 li{opacity:1}}
</style>
