<script lang="ts">
  let { value = $bindable(50), id, label, size = 'm', showMarks = true }: {value?: number; id: string; label: string; size?: 's'|'m'; showMarks?: boolean} = $props();
</script>
<div class="slider-component" data-size={size}>
  <div class="ascii-slider compact-slider"><div class="slider-art" aria-hidden="true"><span>├</span><span class="track-cells">{#each Array(31) as _, i (i)}<span>-</span>{/each}</span><span>┤</span><span class="slider-cursor" style:left={`calc(26px + (100% - 52px) * ${value / 100})`}>[◆]</span></div><input {id} type="range" aria-label={label} min="0" max="100" step="1" value={value} oninput={(event) => { value = Number(event.currentTarget.value); event.currentTarget.value = String(value); }} /></div>
  {#if showMarks}<div class="range-labels" aria-hidden="true"><span class="range-start">0</span><span class="range-middle">50</span><span class="range-end">100</span></div>{/if}
</div>
