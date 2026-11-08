<script lang="ts">
  import Button from '../../src/lib/Button.svelte';
  import Popover from '../../src/lib/overlays/Popover.svelte';
  let { label = 'Display options', title = 'Display options', size = 's', triggerVariant = 'button' }: {
    label?: string; title?: string; size?: 's' | 'm' | 'l'; triggerVariant?: 'button' | 'compact';
  } = $props();
  let compact = $state(false);
</script>
<Popover {label} {title} {size} {triggerVariant}>
  {#snippet children(close)}
    <label><input type="checkbox" bind:checked={compact} /> Compact rows</label>
    <p><Button size="s" variant="primary" label="Done" onclick={close} /></p>
  {/snippet}
</Popover>
<p role="status">Row density: {compact ? 'compact' : 'comfortable'}</p>
