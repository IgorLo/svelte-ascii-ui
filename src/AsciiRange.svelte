<script lang="ts">
  let { lower = $bindable(20), upper = $bindable(80), size = 'm', label = 'Диапазон', showMarks = true }: {
    lower?: number; upper?: number; size?: 's' | 'm'; label?: string; showMarks?: boolean;
  } = $props();
  const left = $derived(Math.max(0, Math.min(100, lower)));
  const right = $derived(Math.max(left, Math.min(100, upper)));
  const midpoint = $derived((left + right) / 200);
  function update(event: Event, edge: 'lower' | 'upper') {
    const input = event.currentTarget as HTMLInputElement;
    const next = Number(input.value);
    if (edge === 'lower') { lower = Math.max(0, Math.min(right, next)); input.value = String(lower); }
    else { upper = Math.min(100, Math.max(left, next)); input.value = String(upper); }
  }
</script>

<div class="ascii-range" data-size={size} role="group" aria-label={label} style:--split={midpoint}>
  <div class="range-track">
    <div class="range-drawing" aria-hidden="true">
      <span class="range-cap start">├</span><span class="range-cap end">┤</span>
      <div class="range-dashes">{#each Array.from({length: 41},(_,i)=>i) as i (i)}<span class={{chosen: i / 40 * 100 >= left && i / 40 * 100 <= right}}>-</span>{/each}</div>
      <span class="range-handle lower" style:left={`calc(26px + (100% - 52px) * ${left / 100})`}>[‹]</span>
      <span class="range-handle upper" style:left={`calc(26px + (100% - 52px) * ${right / 100})`}>[›]</span>
    </div>
    <!-- Pointer hit areas meet midway. Even coincident handles retain one half each. -->
    <input class="range-native lower-input" type="range" min="0" max="100" step="1" value={left} aria-label="Нижняя граница" aria-valuemax={right} oninput={(event) => update(event,'lower')} />
    <input class="range-native upper-input" type="range" min="0" max="100" step="1" value={right} aria-label="Верхняя граница" aria-valuemin={left} oninput={(event) => update(event,'upper')} />
  </div>
  {#if showMarks}<div class="range-scale" aria-hidden="true"><span>0</span><span>50</span><span>100</span></div>{/if}
</div>

<style>
  .ascii-range { --range-height: 30px; margin-block: 10px; min-width: 0; }
  .ascii-range[data-size='s'] { --range-height: 24px; }
  .range-track { position: relative; height: var(--range-height); margin-block: 6px; }
  .range-track:has(input:focus-visible)::after { content: ''; position: absolute; inset: -3px; pointer-events: none; background: repeating-linear-gradient(90deg,var(--accent) 0 10px,transparent 10px 16px) top left / 100% 1px no-repeat, repeating-linear-gradient(90deg,var(--accent) 0 10px,transparent 10px 16px) bottom left / 100% 1px no-repeat, repeating-linear-gradient(0deg,var(--accent) 0 10px,transparent 10px 16px) top left / 1px 100% no-repeat, repeating-linear-gradient(0deg,var(--accent) 0 10px,transparent 10px 16px) top right / 1px 100% no-repeat; }
  .range-drawing { height: 100%; font: 16px/20px var(--art-font); font-variant-east-asian: normal; color: var(--muted); pointer-events: none; }
  .range-cap,.range-handle { position: absolute; top: 50%; transform: translateY(-50%); }
  .range-cap.start { left: 10px; }
  .range-cap.end { right: 10px; }
  .range-dashes { position: absolute; inset: 0 26px; display: grid; grid-template-columns: repeat(41,minmax(0,1fr)); align-items: center; text-align: center; overflow: hidden; }
  .chosen { color: var(--accent); font-weight: 700; }
  .range-handle { width: 32px; transform: translate(-50%,-50%); text-align: center; color: var(--accent); background: var(--bg); white-space: nowrap; }
  [data-size='s'] .range-handle { font-size: 14px; }
  .range-track:has(.lower-input:focus-visible) .lower,.range-track:has(.upper-input:focus-visible) .upper { color: var(--text); font-weight: 700; z-index: 1; }
  .ascii-range input.range-native { position: absolute; inset: 0 16px; width: calc(100% - 32px); height: var(--range-height); margin: 0; padding: 0; border: 0; appearance: none; opacity: 0; background: transparent; touch-action: pan-y; }
  .lower-input { clip-path: inset(0 calc(100% - (10px + (100% - 20px) * var(--split))) 0 0); }
  .upper-input { clip-path: inset(0 0 0 calc(10px + (100% - 20px) * var(--split))); }
  .ascii-range input.range-native::-webkit-slider-runnable-track { height: var(--range-height); background: transparent; }
  .ascii-range input.range-native::-webkit-slider-thumb { appearance: none; width: 20px; height: var(--range-height); margin: 0; border: 0; outline: 0; background: transparent; }
  .ascii-range input.range-native::-moz-range-track { height: var(--range-height); background: transparent; }
  .ascii-range input.range-native::-moz-range-thumb { width: 20px; height: var(--range-height); border: 0; background: transparent; }
  .range-scale { position: relative; margin-inline: 26px; height: 1.5em; font-size: .75em; color: var(--muted); }
  .range-scale span { position: absolute; top: 0; }
  .range-scale span:first-child { left: -16px; }
  .range-scale span:nth-child(2) { left: 50%; transform: translateX(-50%); }
  .range-scale span:nth-child(2)::before { content: ''; position: absolute; left: 50%; top: -5px; height: 3px; width: 1px; background: var(--muted); }
  .range-scale span:last-child { right: -16px; }
  @media (pointer:coarse) { .ascii-range { --range-height: 44px; } .ascii-range[data-size='s'] { --range-height: 44px; } }
  @media (forced-colors:active) { .range-track:has(input:focus-visible) { outline: 2px solid Highlight; } .chosen,.range-handle { color: Highlight; } }
</style>
