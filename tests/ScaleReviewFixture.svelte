<script lang="ts">
  import { Slider, Range, Theme, type Mark, type Size } from '../src/lib';
  let { size = 's', width = 280, padded = false, marks = true, value = 60, lower = 20, upper = 70 }: { size?: Size; width?: number; padded?: boolean; marks?: boolean | Mark[]; value?: number; lower?: number; upper?: number } = $props();
</script>

<Theme colors={{ background: '#000000', surface: '#000000', text: '#ffffff', muted: '#888888', accent: '#00ff00' }}>
  <div style:width={`${width + (padded ? 40 : 0)}px`} style:padding={padded ? '20px' : undefined} style:background="var(--bg)" style:overflow-wrap="anywhere">
    <Slider {size} {marks} {value} aria-label="Weight" />
    <Range {size} {marks} {lower} {upper} label="Interval" />
  </div>
</Theme>
