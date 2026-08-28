<script lang="ts">
  import '@fontsource/geologica/500.css';
  import '@fontsource/onest/400.css';
  import '@fontsource/onest/600.css';
  import '@fontsource/ibm-plex-mono/500.css';
  import '../app.css';
  import Analytics from '$lib/components/Analytics.svelte';

  let { children } = $props();
</script>

{@render children()}
<Analytics />
