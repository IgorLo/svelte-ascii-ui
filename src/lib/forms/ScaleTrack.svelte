<script lang="ts">
  let { start = 0, end }: { start?: number; end: number } = $props();
  const selectedStart = $derived(start === 0 ? '0px' : `calc(16px + (100% - 32px) * ${start})`);
  const selectedEnd = $derived(end === 1 ? '0px' : `calc(16px + (100% - 32px) * ${1 - end})`);
</script>

<div class={['rail', { 'start-selected': start === 0, 'end-selected': end === 1 }]} aria-hidden="true">
  <span class="line" style:background-image={`linear-gradient(to right, var(--rail-muted) 0 ${selectedStart}, var(--rail-accent) ${selectedStart} calc(100% - ${selectedEnd}), var(--rail-muted) calc(100% - ${selectedEnd}) 100%)`}></span>
</div>

<style>
  .rail { --rail-muted: var(--muted); --rail-accent: var(--accent); position: absolute; inset: 0 10px; color: var(--rail-muted); pointer-events: none; }
  .line { position: absolute; inset-inline: 0; top: 50%; height: 1px; mask-image: repeating-linear-gradient(to right, #000 0 4px, transparent 4px 8px); }
  .rail::before, .rail::after { content: ''; position: absolute; top: calc(50% - 6px); width: 4px; height: 13px; background: linear-gradient(currentColor, currentColor) center / 100% 1px no-repeat; }
  .rail::before { left: 0; border-left: 1px solid currentColor; }
  .rail::after { right: 0; border-right: 1px solid currentColor; }
  .start-selected::before, .end-selected::after { color: var(--rail-accent); }
  @media (forced-colors: active) { .rail { --rail-muted: CanvasText; --rail-accent: Highlight; forced-color-adjust: none; } }
</style>
