<script lang="ts">
  import Button from '../../src/lib/Button.svelte';
  import Popover from '../../src/lib/overlays/Popover.svelte';
  let { label = 'Display options', title = 'Display options', size = 's' }: {
    label?: string; title?: string; size?: 's' | 'm';
  } = $props();
  let compact = $state(false);
</script>
<Popover {label} {title} {size}>
  {#snippet children(close)}
    <label><input type="checkbox" bind:checked={compact} /> Compact rows</label>
    <p><Button size="s" variant="primary" label="Done" onclick={close} /></p>
  {/snippet}
</Popover>
<p role="status">Row density: {compact ? 'compact' : 'comfortable'}</p>
