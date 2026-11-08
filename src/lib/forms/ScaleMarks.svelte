<script lang="ts">
  import type { Mark } from './types';
  import { ratio } from './scale';
  let { marks, min, max }: { marks: Mark[]; min: number; max: number } = $props();
</script>

{#if marks.length}
  <div class="marks" aria-hidden="true">
    {#each marks as mark (mark.value)}
      <span style:left={ratio(mark.value, min, max) * 100 + '%'}>{mark.label ?? mark.value}</span>
    {/each}
  </div>
{/if}

<style>
  .marks { position: relative; margin-inline: 26px; min-height: 1.5em; font-size: .75em; color: var(--muted); }
  span { position: absolute; transform: translateX(-50%); }
  span::before { content: ''; position: absolute; left: 50%; top: -4px; width: 1px; height: 3px; background: currentColor; }
</style>
