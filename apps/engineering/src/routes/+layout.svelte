<script lang="ts">
  import '../fonts.css';
  import '../v2-tokens.css';
  import '../critical.css';
  import appStyles from '../app.css?url';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import geologicaCyrillic500 from '@fontsource/geologica/files/geologica-cyrillic-500-normal.woff2?url';
  import { afterNavigate } from '$app/navigation';
  import { onMount } from 'svelte';
  import { track } from '$lib/analytics';

  let reached50 = false;
  let reached90 = false;

  afterNavigate(() => {
    reached50 = false;
    reached90 = false;
    track('page_view', { path: window.location.pathname });
  });

  onMount(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const progress = window.scrollY / max;
      if (progress >= 0.5 && !reached50) { reached50 = true; track('scroll_50'); }
      if (progress >= 0.9 && !reached90) { reached90 = true; track('scroll_90'); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });
</script>

<svelte:head>
  <link rel="preload" as="font" type="font/woff2" href={geologicaCyrillic500} crossorigin="anonymous" />
  {@html `<link rel="stylesheet" href="${appStyles}" media="print" onload="this.media='all';this.onload=null">`}
  {@html `<noscript><link rel="stylesheet" href="${appStyles}"></noscript>`}
</svelte:head>

<a class="skip-link" href="#main">К содержанию</a>
<Header />
<main id="main"><slot /></main>
<Footer />
