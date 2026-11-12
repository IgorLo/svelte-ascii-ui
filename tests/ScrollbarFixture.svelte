<script lang="ts">
  import { Theme } from '../src/lib';
  import type { Palette } from '../src/lib';
  let { palette = 'phosphor' }: { palette?: Palette } = $props();
</script>

<Theme {palette}>
  <div class="layout">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Native scroll regions need keyboard focus.) -->
    <div class="aui-scrollbar scroll" role="region" aria-label="Themed settings" tabindex="0">
      {#each Array.from({ length: 30 }, (_, i) => i) as item (item)}<p>Setting {item + 1}</p>{/each}
      <div class="scroll" role="region" aria-label="Nested settings"><p>Nested scroll content</p></div>
    </div>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Native scroll regions need keyboard focus.) -->
    <div class="scroll" role="region" aria-label="Native settings" tabindex="0"><p>Unstyled scroll area</p></div>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Native scroll regions need keyboard focus.) -->
    <div class="aui-scrollbar scroll horizontal" role="region" aria-label="Wide settings" tabindex="0"><p>Wide scroll content</p></div>
  </div>
</Theme>

<Theme {palette} class="aui-scrollbar" role="region" aria-label="Theme scroll container" tabindex={0} style="height:80px;overflow:auto">
  <div style="height:200px">Theme can also own the scroll container.</div>
</Theme>

<style>
  .layout { display: grid; gap: 24px; padding: 24px; background: var(--bg); }
  .scroll { height: 160px; overflow: auto; }
  .horizontal { width: 240px; }
  .horizontal p { width: 640px; height: 240px; }
  p { margin: 12px 0; }
</style>
