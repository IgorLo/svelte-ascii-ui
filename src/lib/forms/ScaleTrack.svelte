<script lang="ts">
  let { start = 0, end }: { start?: number; end: number } = $props();
</script>

<div class="rail" aria-hidden="true">
  <span class="line"></span>
  <span class="line selected" style:clip-path={`inset(0 calc(16px + (100% - 32px) * ${1 - end}) 0 calc(16px + (100% - 32px) * ${start}))`}></span>
</div>

<style>
  .rail { position: absolute; inset: 0 10px; color: var(--muted); pointer-events: none; }
  .line { position: absolute; inset-inline: 0; top: 50%; height: 1px; background: repeating-linear-gradient(to right, currentColor 0 4px, transparent 4px 8px); }
  .selected { color: var(--accent); }
  .rail::before, .rail::after { content: ''; position: absolute; top: calc(50% - 6px); width: 4px; height: 13px; background: linear-gradient(currentColor, currentColor) center / 100% 1px no-repeat; }
  .rail::before { left: 0; border-left: 1px solid currentColor; }
  .rail::after { right: 0; border-right: 1px solid currentColor; }
  @media (forced-colors: active) { .rail { color: CanvasText; forced-color-adjust: none; } .selected { color: Highlight; } }
</style>
