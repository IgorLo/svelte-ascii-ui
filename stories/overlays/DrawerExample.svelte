<script lang="ts">
  import Button from '../../src/lib/Button.svelte';
  import Drawer from '../../src/lib/overlays/Drawer.svelte';
  let { title = 'Session details', side = 'right', size = 'm' }: {
    title?: string; side?: 'left' | 'right'; size?: 's' | 'm' | 'l' | 'xl';
  } = $props();
  let open = $state(false);
</script>
<Button label="Open drawer" onclick={() => open = true} />
<Drawer bind:open {title} {side} {size}>
  <p>Keep the controls and summary together while you review the current session.</p>
  <label><input type="checkbox" /> Include previous activity</label>
  {#snippet footer()}<Button size="s" label="Done" onclick={() => open = false} />{/snippet}
</Drawer>
