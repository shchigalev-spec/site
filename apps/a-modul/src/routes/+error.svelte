<script lang="ts">
  import { page } from '$app/state';
  import SiteHeader from '$lib/components/SiteHeader.svelte';

  const primaryRoutes = [
    { href: '/modulnye-zdaniya/', label: 'Модульные здания' },
    { href: '/vahtovye-poselki/', label: 'Вахтовые поселки' },
    { href: '/modulnye-ofisy-abk/', label: 'Офисы и АБК' },
    { href: '/modulnye-obshchezhitiya/', label: 'Общежития' }
  ] as const;
</script>

<svelte:head>
  <title>{page.status === 404 ? 'Страница не найдена' : 'Страница недоступна'} — Ависта Модуль</title>
  <meta name="robots" content="noindex,follow" />
</svelte:head>

<a class="skip-link" href="#main">К основному содержанию</a>

<SiteHeader />

<main id="main" tabindex="-1" class="error-page">
  <div class="error-page__copy">
    <p class="eyebrow">{page.status === 404 ? 'Ошибка 404' : `Ошибка ${page.status}`}</p>
    <h1>{page.status === 404 ? 'Такой страницы нет.' : 'Страница временно недоступна.'}</h1>
    <p>
      {page.status === 404
        ? 'Перейдите к нужному типу объекта или начните диагностику проекта.'
        : 'Вернитесь к основным направлениям или сообщите нам о задаче через форму проекта.'}
    </p>
    <a class="button button--primary" href="/modulnye-zdaniya/#project-brief">Начать диагностику</a>
  </div>

  <nav class="error-page__routes" aria-label="Основные направления">
    {#each primaryRoutes as route, index}
      <a href={route.href}>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <strong>{route.label}</strong>
      </a>
    {/each}
  </nav>
</main>

<style>
  .error-page {
    display: grid;
    min-height: calc(100svh - 5.5rem);
    grid-template-columns: minmax(0, 1.1fr) minmax(22rem, .9fr);
  }

  .error-page__copy {
    display: flex;
    min-width: 0;
    flex-direction: column;
    justify-content: center;
    padding: clamp(4.5rem, 8vw, 8rem) clamp(1.25rem, 7vw, 7rem);
  }

  .error-page__copy h1 { max-width: 11ch; }
  .error-page__copy > p:not(.eyebrow) {
    max-width: 38rem;
    margin: 2rem 0;
    color: var(--warm-muted);
    font-size: clamp(1rem, 1.5vw, 1.25rem);
    line-height: 1.6;
  }
  .error-page__copy .button { align-self: flex-start; }

  .error-page__routes {
    display: grid;
    align-content: center;
    border-left: 1px solid var(--line-dark);
    background: var(--purple);
  }
  .error-page__routes a {
    display: grid;
    min-height: 7.5rem;
    grid-template-columns: 3rem minmax(0, 1fr);
    gap: 1rem;
    align-items: center;
    padding: 1.5rem clamp(1.25rem, 5vw, 4rem);
    border-bottom: 1px solid rgb(255 255 255 / 22%);
    text-decoration: none;
  }
  .error-page__routes a:first-child { border-top: 1px solid rgb(255 255 255 / 22%); }
  .error-page__routes a:hover { background: rgb(255 255 255 / 8%); }
  .error-page__routes span {
    color: #ff9ab7;
    font-family: 'IBM Plex Mono', monospace;
    font-size: .72rem;
  }
  .error-page__routes strong {
    font-family: 'Geologica', sans-serif;
    font-size: clamp(1.25rem, 2.2vw, 2rem);
    font-weight: 500;
  }

  @media (max-width: 820px) {
    .error-page {
      min-height: calc(100svh - 4.75rem);
      grid-template-columns: 1fr;
    }
    .error-page__routes { border-top: 1px solid var(--line-dark); border-left: 0; }
  }
</style>
