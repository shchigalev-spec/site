<script lang="ts">
  import '../app.css';
  import { afterNavigate } from '$app/navigation';
  import { env } from '$env/dynamic/public';
  import { onMount } from 'svelte';
  import TechHeader from '$components/TechHeader.svelte';
  import TechFooter from '$components/TechFooter.svelte';
  import MobileStickyCta from '$components/MobileStickyCta.svelte';
  import { initAnalytics, track } from '$lib/analytics';

  let { children } = $props();
  const phone = env.PUBLIC_SITE_PHONE ?? '';
  const email = env.PUBLIC_SITE_EMAIL ?? '';
  const sent = new Set<number>();

  onMount(() => {
    initAnalytics(env.PUBLIC_YANDEX_METRICA_ID ?? '');
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const progress = window.scrollY / max;
      if (progress >= 0.5 && !sent.has(50)) { sent.add(50); track('scroll_50'); }
      if (progress >= 0.9 && !sent.has(90)) { sent.add(90); track('scroll_90'); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  afterNavigate(({ to }) => {
    sent.clear();
    track('page_view', { path: to?.url.pathname ?? '/' });
  });
</script>

<a class="skip-link" href="#main-content">Перейти к содержанию</a>
<TechHeader {phone} {email} />
<main id="main-content" tabindex="-1">{@render children()}</main>
<MobileStickyCta />
<TechFooter {phone} {email} />
