<script lang="ts">
  import { Range, Slider, Theme, type Mark, type Size } from '../../src/lib';
  import type { Palette } from '../../src/lib/theme';
  let { size = 's', width = 280, palette = 'paper', marks = true }: { size?: Size; width?: number; palette?: Palette; marks?: boolean | Mark[] } = $props();
</script>

<Theme {palette}>
  <div class="examples" style:width={`${width}px`}>
    <p>Slider: minimum, selected interval and maximum</p>
    <Slider {size} {marks} value={0} aria-label="Minimum value" />
    <Slider {size} {marks} value={60} aria-label="Selected interval" />
    <Slider {size} {marks} value={100} aria-label="Maximum value" />
    <p>Range: reaches minimum</p>
    <Range {size} {marks} lower={0} upper={70} label="Starts at minimum" />
    <p>Range: reaches maximum</p>
    <Range {size} {marks} lower={20} upper={100} label="Ends at maximum" />
    <p>Range: interior interval</p>
    <Range {size} {marks} lower={20} upper={70} label="Interior interval" />
  </div>
</Theme>

<style>
  .examples { display: grid; gap: 12px; max-width: 100%; overflow-wrap: anywhere; }
  p { margin: 0; }
</style>
