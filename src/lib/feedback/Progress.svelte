<!-- Prototype: normalized progress, whole glyphs with a fractional final glyph. -->
<script lang="ts">
  let { value = 0, label = 'Прогресс', size = 'm' }: { value?: number; label?: string; size?: 's' | 'm' | 'l' } = $props();
  let width = $state(0);
  let glyphWidth = $state(10);
  const progress = $derived(Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0);
  const count = $derived(Math.max(1, Math.floor(width / Math.max(1, glyphWidth))));
  const fill = (index: number) => Math.max(0, Math.min(1, progress * count - index));
  function observeWidth(update: (width: number) => void) {
    return (node: HTMLElement) => {
      const observer = new ResizeObserver(([entry]) => update(entry.contentRect.width));
      observer.observe(node);
      return () => observer.disconnect();
    };
  }
</script>

<div class="ascii-progress aui-frame" data-size={size} role="progressbar" aria-label={label} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="1">
  <div class="measured-progress" {@attach observeWidth((next) => width = next)} aria-hidden="true">
    <span class="glyph-measure" {@attach observeWidth((next) => glyphWidth = next)}>#</span>
    <div class="progress-dots">{#each Array(25) as _, i (i)}<span style:opacity={1 - Math.max(0, Math.min(1, progress * 25 - i))}>·</span>{/each}</div>
    <div class="progress-ink">{#each Array(count) as _, i (i)}<span style:opacity={fill(i)}>#</span>{/each}</div>
  </div>
</div>

<style>
  .ascii-progress{padding:6px;background:transparent}
  .measured-progress { position: relative; min-width: 0; overflow: hidden; height: 20px; font: 16px/20px var(--art-font); font-variant-east-asian: normal; letter-spacing: 0; }
  .glyph-measure { position: absolute; display: inline-block; visibility: hidden; white-space: pre; }
  .progress-dots { position: absolute; inset: 0; display: flex; justify-content: space-between; color: var(--line); }
  .progress-ink { position: absolute; top: 0; left: 0; display: flex; width: max-content; color: var(--accent); }
  .progress-ink span { flex: 0 0 auto; }
  [data-size='s'] .measured-progress, [data-size='m'] .measured-progress { font-size: 13px; height: 16px; line-height: 16px; }
</style>
