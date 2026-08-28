<script lang="ts">
  import RouteLanding from '$lib/components/RouteLanding.svelte';
  let { data } = $props();
</script>

<RouteLanding {data} />
