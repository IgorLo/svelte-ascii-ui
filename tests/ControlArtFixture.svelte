<script lang="ts">
  import { Checkbox, Slider, Range, Theme } from '../src/lib';
  let { size = 's', width = 420, zoom = 1, state = 'empty', lower = 20, upper = 70 }: { size?: 's' | 'm' | 'l'; width?: number; zoom?: number; state?: 'empty' | 'checked' | 'indeterminate' | 'disabled'; lower?: number; upper?: number } = $props();
</script>

<Theme colors={{ background: '#000000', surface: '#000000', text: '#ffffff', muted: '#ffffff', accent: '#ffffff' }}>
  <div style:width={`${width}px`} style:zoom={zoom} style:padding="12px" style:background="var(--bg)">
    <Checkbox {size} label="Choice" checked={state === 'checked'} indeterminate={state === 'indeterminate'} disabled={state === 'disabled'} />
    <Slider {size} disabled={state === 'disabled'} value={60} aria-label="Weight" />
    <Range {size} disabled={state === 'disabled'} {lower} {upper} label="Interval" />
  </div>
</Theme>
