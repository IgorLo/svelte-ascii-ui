<script lang="ts">
  import { Checkbox, Range, Slider, Theme } from '../../src/lib';
  import type { Palette } from '../../src/lib/theme';
  let { palette = 'phosphor', width = 280 }: { palette?: Palette; width?: number } = $props();
</script>

<Theme {palette}>
  <div class="examples" style:max-width={`${width}px`}>
    {#each ['s', 'm', 'l'] as const as size (size)}
      <section>
        <h2>{size.toUpperCase()}</h2>
        <div class="choices">
          <Checkbox {size} label="Empty" />
          <Checkbox {size} label="Selected" checked />
          <Checkbox {size} label="Mixed" indeterminate />
          <Checkbox {size} label="Disabled" disabled />
        </div>
        <p>Weight</p>
        <Slider {size} aria-label={`${size.toUpperCase()} weight`} value={60} marks />
        <p>Interval</p>
        <Range {size} label={`${size.toUpperCase()} interval`} lower={20} upper={70} marks />
        <p>Coincident endpoints</p>
        <Range {size} label={`${size.toUpperCase()} coincident interval`} lower={50} upper={50} />
      </section>
    {/each}
  </div>
</Theme>

<style>
  .examples { width: 100%; display: grid; gap: 24px; }
  .choices { display: flex; flex-wrap: wrap; gap: 12px; }
  h2 { margin: 0 0 12px; }
  p { margin: 16px 0 4px; }
</style>
