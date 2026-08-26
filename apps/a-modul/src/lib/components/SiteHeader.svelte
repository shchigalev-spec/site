<script lang="ts">
  import { tick } from 'svelte';
  import { publicContacts } from '$lib/content/facts';
  import { trackEvent } from '$lib/analytics';
  import { page } from '$app/state';
  import { diagnosisHref } from '$lib/navigation';

  let { currentPath = '' } = $props<{ currentPath?: string }>();
  let open = $state(false);
  let menu = $state<HTMLElement>();
  let toggle = $state<HTMLButtonElement>();

  const routes = [
    { href: '/modulnye-zdaniya/', label: 'Все здания' },
    { href: '/vahtovye-poselki/', label: 'Вахтовые поселки' },
    { href: '/modulnye-ofisy-abk/', label: 'Офисы и АБК' },
    { href: '/modulnye-obshchezhitiya/', label: 'Общежития' }
  ];

  async function setOpen(value: boolean, returnFocus = false) {
    open = value;
    if (value) {
      await tick();
      menu?.querySelector<HTMLElement>('a, button')?.focus();
    } else if (returnFocus) {
      await tick();
      toggle?.focus();
    }
  }

  function handleMenuKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false, true);
      return;
    }
    if (event.key !== 'Tab' || !menu) return;
    const items = [...menu.querySelectorAll<HTMLElement>('a, button')].filter((item) => !item.hasAttribute('disabled'));
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
</script>

<header class="site-header">
  <a class="brand" href="/modulnye-zdaniya/" aria-label="Ависта Модуль, главная">
    <img src="/brand/avista-logo-white.svg" width="68" height="84" alt="Ависта Модуль" />
  </a>
  <nav class="desktop-nav" aria-label="Основная навигация">
    {#each routes as route}<a href={route.href} aria-current={currentPath === route.href ? 'page' : undefined}>{route.label}</a>{/each}
  </nav>
  <a class="header-phone" href={publicContacts.phoneHref} onclick={() => trackEvent('phone_click', { placement: 'header' })}>{publicContacts.phoneDisplay}</a>
  <a class="button button--header desktop-cta" href={diagnosisHref(page.url, 'standard')}>Рассчитать стоимость</a>
  <button bind:this={toggle} class="mobile-menu-toggle" type="button" aria-expanded={open} aria-controls={open ? 'mobile-menu' : undefined} onclick={() => setOpen(!open)}>
    <span aria-hidden="true">{open ? '×' : '≡'}</span><span>{open ? 'Закрыть' : 'Меню'}</span>
  </button>
  {#if open}
    <div bind:this={menu} id="mobile-menu" class="mobile-nav" role="dialog" aria-modal="true" aria-label="Мобильная навигация" tabindex="0" onkeydown={handleMenuKeydown}>
      <nav aria-label="Разделы сайта">
        {#each routes as route}<a href={route.href} aria-current={currentPath === route.href ? 'page' : undefined} onclick={() => setOpen(false)}>{route.label}</a>{/each}
        <a href={publicContacts.phoneHref} onclick={() => trackEvent('phone_click', { placement: 'mobile-menu' })}>{publicContacts.phoneDisplay}</a>
        <a class="button button--primary" href={diagnosisHref(page.url, 'standard')} onclick={() => setOpen(false)}>Рассчитать стоимость</a>
      </nav>
    </div>
  {/if}
</header>
