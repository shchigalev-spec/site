<script lang="ts">
  import { page } from '$app/stores';
  import { onDestroy, onMount, tick } from 'svelte';
  import { track } from '$lib/analytics';
  import { buildDiagnosisHref } from '$lib/diagnosis-link';

  let open = false;
  let compact = false;
  let activeChapter = 'Начало';
  let pageProgress = 0;
  let scrollFrame = 0;
  let menuElement: HTMLElement;
  let menuButton: HTMLButtonElement;
  $: headerDiagnosisHref = buildDiagnosisHref($page.url, 'header');
  $: menuDiagnosisHref = buildDiagnosisHref($page.url, 'mobile_menu');

  function measureScroll() {
    scrollFrame = 0;
    compact = window.scrollY > 48;
    const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    pageProgress = Math.max(0, Math.min(1, window.scrollY / max));
    const chapters = [...document.querySelectorAll<HTMLElement>('[data-chapter]')];
    const current = chapters.reduce<HTMLElement | null>((found, chapter) => chapter.getBoundingClientRect().top <= window.innerHeight * 0.42 ? chapter : found, null);
    activeChapter = current?.dataset.chapter || (window.location.pathname === '/' ? 'Начало' : 'Раздел');
  }

  function onScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(measureScroll);
  }

  onMount(() => {
    window.addEventListener('resize', onScroll);
    return () => window.removeEventListener('resize', onScroll);
  });

  function close() {
    open = false;
    document.documentElement.style.overflow = '';
    window.dispatchEvent(new CustomEvent('engineering:menu-state', { detail: { open: false } }));
    tick().then(() => menuButton?.focus());
  }

  async function toggleMenu() {
    open = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    window.dispatchEvent(new CustomEvent('engineering:menu-state', { detail: { open } }));
    if (open) {
      await tick();
      (menuElement?.querySelector('a') as HTMLAnchorElement | null)?.focus();
    }
  }

  onDestroy(() => {
    if (scrollFrame) cancelAnimationFrame(scrollFrame);
    if (typeof document !== 'undefined') document.documentElement.style.overflow = '';
  });

  function onKeydown(event: KeyboardEvent) {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab' || !menuElement) return;
    const focusable = [...menuElement.querySelectorAll<HTMLElement>('a,button,[tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
</script>

<svelte:window on:scroll={onScroll} on:keydown={onKeydown} />

<header class:compact class="site-header v2-header">
  <a class="brand" href="/" aria-label="Лаборатория тишины — главная" on:click={close}>Лаборатория тишины</a>
  <nav class="desktop-nav" aria-label="Основная навигация">
    <a href="/#symptoms">Маршрут шума</a>
    <a href="/#stages">Этап ремонта</a>
    <a href="/#method">Метод</a>
    <a href="/#results">Кейсы</a>
    <a href={headerDiagnosisHref}>Диагностика</a>
  </nav>
  <div class="v2-header-state" aria-hidden="true"><span>{activeChapter}</span><i><b style={`transform:scaleX(${pageProgress})`}></b></i></div>
  <a class="header-cta" href={headerDiagnosisHref} on:click={() => track('diagnostic_start', { source: 'header' })}>Диагностика</a>
  <button bind:this={menuButton} class="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} on:click={toggleMenu}>
    <span></span><span></span>
  </button>
</header>

{#if open}
  <div class="menu-backdrop" on:click={close} aria-hidden="true"></div>
  <nav bind:this={menuElement} id="mobile-menu" class="mobile-menu" aria-label="Мобильная навигация">
    <div class="menu-index">{activeChapter} / {$page.url.pathname}</div>
    <a href="/#symptoms" on:click={close}><span>02</span> Маршрут шума</a>
    <a href="/#stages" on:click={close}><span>03</span> Этап ремонта</a>
    <a href="/#method" on:click={close}><span>04</span> Метод и конструкция</a>
    <a href="/cases/" on:click={close}><span>05</span> Измеренные кейсы</a>
    <a href={menuDiagnosisHref} on:click={close}><span>07</span> Диагностика</a>
    <a class="menu-primary" href={menuDiagnosisHref} on:click={() => { close(); track('diagnostic_start', { source: 'mobile_menu' }); }}>Разобрать мой шум</a>
  </nav>
{/if}
