<script lang="ts">
  import { onMount } from 'svelte';
  import { track } from '$lib/analytics';

  export let phone = '';
  export let email = '';

  let menuOpen = false;
  let menuTrigger: HTMLButtonElement;
  let menuPanel: HTMLElement;
  let pageProgress = 0;
  let currentChapter = '01 / ДИАГНОСТИКА';
  let elevated = false;

  const chapters = [
    { selectors: ['[data-v2-hero]'], label: '01 / ДИАГНОСТИКА' },
    { selectors: ['#noise-path-lab', '#noise-deck', '#xray'], label: '02 / СИМПТОМ И ПУТЬ' },
    { selectors: ['#construction', '#diagnosis-construction', '.process', '.assembly-section'], label: '03 / КОНСТРУКЦИЯ' },
    { selectors: ['#renovation-morph', '.stages'], label: '04 / СТАДИЯ РЕМОНТА' },
    { selectors: ['#measured-evidence', '#cases'], label: '05 / ИЗМЕРЕНИЯ' },
    { selectors: ['#scenario-v2', '#scenario'], label: '06 / МОЙ СЦЕНАРИЙ' },
    { selectors: ['#conversion-close', '.diagnostic'], label: '07 / ДИАГНОСТИКА' }
  ];

  const nav = [
    { href: '/#noise-path-lab', label: 'Симптом и путь' },
    { href: '/#construction', label: 'Конструкция' },
    { href: '/#cases', label: 'Результаты' },
    { href: '/cases/', label: 'Кейсы' },
    { href: '/diagnostika-shuma/', label: 'Диагностика' }
  ];

  function setMenu(open: boolean, returnFocus = false) {
    menuOpen = open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    document.documentElement.toggleAttribute('data-menu-open', open);
    if (open) setTimeout(() => menuPanel?.querySelector<HTMLAnchorElement>('a')?.focus());
    else if (returnFocus) menuTrigger?.focus();
  }

  onMount(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (!menuOpen) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenu(false, true);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = Array.from(menuPanel?.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])') ?? []);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', handleKeydown);
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      pageProgress = Math.max(0, Math.min(1, window.scrollY / maximum));
      elevated = window.scrollY > 28;
      const observationLine = window.innerHeight * .42;
      let active = chapters[0].label;
      for (const chapter of chapters) {
        const elements = chapter.selectors.flatMap((selector) => [...document.querySelectorAll<HTMLElement>(selector)]);
        if (elements.some((element) => element.getBoundingClientRect().top <= observationLine)) active = chapter.label;
      }
      currentChapter = active;
    };
    const scheduleProgress = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('scroll', scheduleProgress);
      window.removeEventListener('resize', scheduleProgress);
      if (frame) window.cancelAnimationFrame(frame);
      document.documentElement.style.overflow = '';
      document.documentElement.removeAttribute('data-menu-open');
    };
  });
</script>

<header class="site-header" class:elevated data-open={menuOpen} style={`--page-progress:${pageProgress}`}>
  <a class="brand" href="/" aria-label="Лаборатория тишины — на главную">
    <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
    <span>Лаборатория<br />тишины</span>
  </a>

  <span class="chapter mono" aria-live="polite">{currentChapter}</span>

  <div class="header-actions">
    <a class="header-cta" href="/diagnostika-shuma/" on:click={() => track('diagnostic_start', { source: 'header' })}>
      Разобрать мой шум
    </a>
    <button bind:this={menuTrigger} class="menu-trigger" type="button" aria-expanded={menuOpen} aria-controls="site-menu" on:click={() => setMenu(!menuOpen, menuOpen)}>
      <span class="sr-only">{menuOpen ? 'Закрыть меню' : 'Открыть меню'}</span>
      <span></span><span></span>
    </button>
  </div>

  {#if menuOpen}
    <div class="menu-scrim" role="presentation" on:click={() => setMenu(false, true)}></div>
    <nav bind:this={menuPanel} class="site-menu" id="site-menu" aria-label="Основная навигация">
      <p class="mono">Диагностический индекс</p>
      <ol>
        {#each nav as item, index}
          <li>
            <span class="mono">0{index + 1}</span>
            <a href={item.href} on:click={() => setMenu(false)}>{item.label}</a>
          </li>
        {/each}
      </ol>
      <div class="menu-contacts">
        {#if phone}<a href={`tel:${phone.replace(/[^+\d]/g, '')}`} on:click={() => track('phone_click')}>{phone}</a>{/if}
        {#if email}<a href={`mailto:${email}`} on:click={() => track('email_click')}>{email}</a>{/if}
      </div>
    </nav>
  {/if}

  <div class="header-progress" role="progressbar" aria-label="Прогресс страницы" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(pageProgress * 100)}><span></span></div>
</header>

<style>
  .site-header {
    position: fixed;
    inset: 0 0 auto;
    z-index: 80;
    height: var(--header-h);
    padding: 14px var(--gutter) 0;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: start;
    color: var(--white);
    isolation: isolate;
  }

  .site-header::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(to bottom, rgba(7, 9, 8, 0.72), rgba(7, 9, 8, 0));
    pointer-events: none;
    transition: background var(--tech-v2-control) ease, backdrop-filter var(--tech-v2-control) ease;
  }

  .site-header.elevated::before { background: rgba(8, 11, 10, .9); backdrop-filter: blur(16px); }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    width: max-content;
    font-family: 'Geologica', sans-serif;
    font-size: 0.78rem;
    font-weight: 500;
    line-height: 0.95;
    letter-spacing: -0.025em;
  }

  .brand-mark {
    width: 30px;
    height: 24px;
    display: flex;
    gap: 3px;
    align-items: center;
  }

  .brand-mark i {
    display: block;
    width: 2px;
    border-radius: 4px;
    background: var(--signal);
  }

  .brand-mark i:nth-child(1) { height: 8px; }
  .brand-mark i:nth-child(2) { height: 23px; background: var(--acoustic); }
  .brand-mark i:nth-child(3) { height: 14px; }

  .chapter {
    color: var(--white-64);
    padding-top: 6px;
  }

  .header-actions {
    justify-self: end;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .header-cta {
    min-height: 42px;
    padding: 10px 15px;
    border: 1px solid var(--white-16);
    border-radius: 12px;
    background: rgba(7, 9, 8, 0.42);
    font-size: 0.82rem;
    backdrop-filter: blur(12px);
  }

  .header-cta:hover { border-color: var(--signal); }

  .menu-trigger {
    position: relative;
    z-index: 3;
    width: 44px;
    height: 44px;
    border: 1px solid var(--white-16);
    border-radius: 12px;
    background: var(--signal);
    display: grid;
    place-content: center;
    gap: 5px;
    cursor: pointer;
  }

  .menu-trigger span:not(.sr-only) {
    display: block;
    width: 18px;
    height: 1px;
    background: var(--ink-950);
    transition: transform 180ms ease;
  }

  [data-open='true'] .menu-trigger span:nth-last-child(2) { transform: translateY(3px) rotate(45deg); }
  [data-open='true'] .menu-trigger span:last-child { transform: translateY(-3px) rotate(-45deg); }

  .menu-scrim {
    position: fixed;
    inset: 0;
    z-index: -1;
    background: rgba(7, 9, 8, 0.68);
    backdrop-filter: blur(8px);
  }

  .site-menu {
    position: fixed;
    z-index: 2;
    top: 10px;
    right: 10px;
    width: min(520px, calc(100vw - 20px));
    min-height: min(680px, calc(100svh - 20px));
    padding: 84px clamp(24px, 4vw, 60px) 34px;
    border: 1px solid var(--white-16);
    border-radius: 28px;
    background: var(--ink-900);
    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.44);
  }

  .site-menu > .mono { color: var(--acoustic); }
  .site-menu ol { list-style: none; padding: 0; margin: 50px 0; }
  .site-menu li { display: grid; grid-template-columns: 48px 1fr; align-items: baseline; padding: 15px 0; border-bottom: 1px solid var(--white-16); }
  .site-menu li span { color: var(--white-64); }
  .site-menu li a { font-family: 'Geologica', sans-serif; font-size: clamp(1.7rem, 4vw, 2.8rem); letter-spacing: -0.04em; }
  .site-menu li a:hover { color: var(--signal); }

  .menu-contacts { display: flex; gap: 24px; flex-wrap: wrap; color: var(--white-64); }

  .header-progress {
    position: absolute;
    bottom: 0;
    left: var(--gutter);
    right: var(--gutter);
    height: 1px;
    overflow: hidden;
    background: var(--white-16);
  }

  .header-progress span {
    display: block;
    width: 100%;
    height: 100%;
    transform: scaleX(var(--page-progress));
    transform-origin: left;
    background: linear-gradient(90deg, var(--signal), var(--acoustic));
    transition: transform 80ms linear;
  }

  @media (max-width: 767px) {
    .site-header { grid-template-columns: 1fr auto; padding-top: 10px; }
    .chapter { display: none; }
    .header-cta { min-height: 44px; padding-inline: 12px; font-size: 0; }
    .header-cta::after { content: 'Диагностика'; font-size: .72rem; }
    .site-menu { min-height: calc(100svh - 20px); }
    .site-menu ol { margin-top: 34px; }
  }
</style>
