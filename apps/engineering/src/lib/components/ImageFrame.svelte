<script lang="ts">
  export let src: string;
  export let alt: string;
  export let fallback = 'Архитектурная визуализация';
  export let position = 'center';
  export let eager = false;

  let failed = false;
  $: desktopWebp = src.replace(/\.png$/i, '.webp');
  $: mobileWebp = src.replace(/\.png$/i, '-960.webp');
</script>

<div class:failed class="image-frame">
  {#if !failed}
    <picture>
      <source media="(max-width: 767px)" type="image/webp" srcset={mobileWebp} />
      <source type="image/webp" srcset={desktopWebp} />
      <img
        {src}
        {alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchpriority={eager ? 'high' : 'auto'}
        style:object-position={position}
        on:error={() => (failed = true)}
      />
    </picture>
  {:else}
    <div class="image-fallback" role="img" aria-label={alt}>
      <span>{fallback}</span>
      <i aria-hidden="true"></i>
    </div>
  {/if}
</div>
