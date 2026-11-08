<script lang="ts">
  let { width = '100%', height = '1.2em', size = 'm', animated = true, paused = false }: {
    width?: string; height?: string; size?: 's' | 'm' | 'l'; animated?: boolean; paused?: boolean;
  } = $props();
  let measuredWidth = $state(0);
  let measuredHeight = $state(0);
  const cellWidth = $derived(size === 'l' ? 9 : 7);
  const cellHeight = $derived(size === 'l' ? 16 : 13);
  const columns = $derived(Math.max(1, Math.ceil(measuredWidth / cellWidth)));
  const rows = $derived(Math.max(1, Math.ceil(measuredHeight / cellHeight)));
  function measure(node: HTMLElement) {
    const observer = new ResizeObserver(([entry]) => { measuredWidth = entry.contentRect.width; measuredHeight = entry.contentRect.height; });
    observer.observe(node);
    return () => observer.disconnect();
  }
</script>
<!-- Geometry is supplied by the caller; the parent announces loading once. -->
<div class="ascii-skeleton" data-size={size} data-animated={animated} style:width style:height style:--columns={columns} style:--cell-width={`${cellWidth}px`} style:--cell-height={`${cellHeight}px`} style:--skeleton-play={paused ? 'paused' : 'var(--loader-play, running)'} aria-hidden="true" {@attach measure}>
  <div class="skeleton-ink">{#each Array(columns * rows) as _, i (i)}<span style:animation-delay={`${-(i % columns) * .055}s`}>░</span>{/each}</div>
</div>
<style>
  .ascii-skeleton { position: relative; overflow: hidden; max-width: 100%; color: var(--muted); }
  .skeleton-ink { position: absolute; inset: 0; display: grid; grid-template-columns: repeat(var(--columns),var(--cell-width)); grid-auto-rows: var(--cell-height); font: 15px/var(--cell-height) var(--art-font,monospace); font-variant-east-asian: normal; }
  [data-size='s'] .skeleton-ink, [data-size='m'] .skeleton-ink { font-size: 13px; }
  .skeleton-ink span { opacity: .4; }
  @media (prefers-reduced-motion: no-preference) {
    [data-animated='true'] .skeleton-ink span { animation: quiet-wave 2.6s linear infinite; animation-play-state: var(--skeleton-play); }
  }
  @keyframes quiet-wave { 0%,65%,100% { opacity: .25; } 82% { opacity: .65; } }
</style>
