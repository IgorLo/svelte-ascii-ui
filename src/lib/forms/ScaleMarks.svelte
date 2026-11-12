<script lang="ts">
  import type { Mark } from './types';
  import { ratio } from './scale';
  let { marks, min, max }: { marks: Mark[]; min: number; max: number } = $props();
  const labelColumns = $derived(Math.max(2, marks.length));
  const numericLabel = /^[+-]?\d+(?:\.\d+)?$/;
</script>

{#if marks.length}
  <div class="marks" aria-hidden="true" style:--label-columns={labelColumns}>
    {#each marks as mark (mark.value)}
      {@const position = ratio(mark.value, min, max)}
      {@const custom = mark.label !== undefined && !numericLabel.test(mark.label.trim())}
      <div class={['mark', { custom, start: custom && position < .5 / labelColumns, end: custom && position > 1 - .5 / labelColumns }]} style:--position={`${position * 100}%`}>
        <span class="label">{mark.label ?? mark.value}</span>
      </div>
    {/each}
  </div>
{/if}

<style>
  .marks { display: grid; position: relative; margin-inline: 26px; min-height: 1.5em; font-size: .75em; color: var(--muted); }
  .mark { grid-area: 1 / 1; position: relative; min-width: 0; }
  .mark::before { content: ''; position: absolute; left: var(--position); top: -4px; width: 1px; height: 3px; background: currentColor; }
  .label { display: block; position: relative; left: var(--position); width: max-content; white-space: nowrap; transform: translateX(-50%); }
  .custom .label { max-width: calc(100% / var(--label-columns)); white-space: normal; overflow-wrap: anywhere; }
  .start .label { transform: none; }
  .end .label { left: auto; right: calc(100% - var(--position)); margin-left: auto; transform: none; text-align: right; }
</style>
