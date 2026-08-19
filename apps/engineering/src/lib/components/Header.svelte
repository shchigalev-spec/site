<script lang="ts">
  import { page } from '$app/stores';
  import { onDestroy, tick } from 'svelte';
  import { track } from '$lib/analytics';

  let open = false;
  let compact = false;
  let menuElement: HTMLElement;
  let menuButton: HTMLButtonElement;

  function onScroll() {
    compact = window.scrollY > 48;
  }

  function close() {
    open = false;
    document.documentElement.style.overflow = '';
    tick().then(() => menuButton?.focus());
  }

  async function toggleMenu() {
    open = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) {
      await tick();
      (menuElement?.querySelector('a') as HTMLAnchorElement | null)?.focus();
    }
  }

  onDestroy(() => { if (typeof document !== 'undefined') document.documentElement.style.overflow = ''; });

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

<header class:compact class="site-header">
  <a class="brand" href="/" aria-label="Лаборатория тишины — главная" on:click={close}>Лаборатория тишины</a>
  <nav class="desktop-nav" aria-label="Основная навигация">
    <a href="/#symptoms">Проблемы</a>
    <a href="/#method">Как работаем</a>
    <a href="/cases/">Результаты</a>
    <a href="/diagnostika-shuma/">Диагностика</a>
  </nav>
  <a class="header-cta" href="/diagnostika-shuma/" on:click={() => track('diagnostic_start', { source: 'header' })}>Записаться</a>
  <button bind:this={menuButton} class="menu-button" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Закрыть меню' : 'Открыть меню'} on:click={toggleMenu}>
    <span></span><span></span>
  </button>
</header>

{#if open}
  <div class="menu-backdrop" on:click={close} aria-hidden="true"></div>
  <nav bind:this={menuElement} id="mobile-menu" class="mobile-menu" aria-label="Мобильная навигация">
    <div class="menu-index">План сайта / {$page.url.pathname}</div>
    <a href="/#symptoms" on:click={close}><span>01</span> Проблемы</a>
    <a href="/#method" on:click={close}><span>02</span> Как работаем</a>
    <a href="/cases/" on:click={close}><span>03</span> Результаты</a>
    <a href="/diagnostika-shuma/" on:click={close}><span>04</span> Диагностика</a>
    <a class="menu-primary" href="/diagnostika-shuma/" on:click={() => { close(); track('diagnostic_start', { source: 'mobile_menu' }); }}>Записаться на бесплатную диагностику</a>
  </nav>
{/if}
