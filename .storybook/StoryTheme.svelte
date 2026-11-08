<script lang="ts">
  import Theme from '../src/lib/Theme.svelte';
  import type { Palette } from '../src/lib/theme';
  let { children, palette='phosphor' }:{children?:import('svelte').Snippet;palette?:Palette}=$props();
</script>
<Theme {palette}><div class="story-surface">{@render children?.()}</div></Theme>
<style>.story-surface{padding:24px;background:var(--bg);min-height:100px;min-width:0;overflow-wrap:anywhere}@media(max-width:480px){.story-surface{padding:12px}}</style>
