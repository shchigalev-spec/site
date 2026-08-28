<script lang="ts">
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { env } from '$env/dynamic/public';
  import { captureAttribution, trackEvent } from '$lib/analytics';

  let seen = new Set<number>();

  function appendScript(src: string, id: string) {
    if (!src || document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.async = true;
    script.src = src;
    document.head.append(script);
  }

  onMount(() => {
    const metricaId = env.PUBLIC_YANDEX_METRICA_ID?.trim();
    if (metricaId && /^\d+$/.test(metricaId)) {
      window.__A_MODUL_METRICA_ID__ = Number(metricaId);
      appendScript('https://mc.yandex.ru/metrika/tag.js', 'a-modul-metrica');
      window.ym = window.ym ?? function (...args: unknown[]) {
        (window.ym!.a = window.ym!.a || []).push(args);
      };
      window.ym.l = Date.now();
      window.ym(Number(metricaId), 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
    }

    const calltrackingUrl = env.PUBLIC_CALLTRACKING_SCRIPT_URL?.trim();
    if (calltrackingUrl) appendScript(calltrackingUrl, 'a-modul-calltracking');

    const handleScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const percent = Math.round((window.scrollY / max) * 100);
      if (percent >= 50 && !seen.has(50)) { seen.add(50); trackEvent('scroll_50'); }
      if (percent >= 90 && !seen.has(90)) { seen.add(90); trackEvent('scroll_90'); }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });

  afterNavigate(() => {
    seen = new Set<number>();
    captureAttribution();
    trackEvent('page_view');
  });
</script>
