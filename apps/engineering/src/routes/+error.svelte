<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head><title>{$page.status === 404 ? 'Страница не найдена' : 'Ошибка'} — Лаборатория тишины</title><meta name="robots" content="noindex" /></svelte:head>
<section class="error-page"><div><div class="section-label">{$page.status}</div><h1>{$page.status}</h1><p>{$page.status === 404 ? 'Такого листа в проекте нет. Вернитесь к общей схеме или опишите задачу инженеру.' : 'Страница временно недоступна.'}</p><a class="primary-button" href="/">На главную</a></div></section>
