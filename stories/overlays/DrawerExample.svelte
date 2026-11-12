<script lang="ts">
  import Button from '../../src/lib/Button.svelte';
  import Drawer from '../../src/lib/overlays/Drawer.svelte';
  let { title = 'Session details', side = 'right', size = 'm', longContent = false }: {
    title?: string; side?: 'left' | 'right' | 'bottom'; size?: 's' | 'm' | 'l' | 'xl'; longContent?: boolean;
  } = $props();
  let open = $state(false);
</script>
<Button label="Open drawer" onclick={() => open = true} />
<Drawer bind:open {title} {side} {size}>
  <p>Keep the controls and summary together while you review the current session.</p>
  {#if longContent}
    {#each Array.from({ length: 30 }, (_, index) => index) as row (row)}
      <p>Activity {row + 1}: review the session history while the heading and actions remain available.</p>
    {/each}
  {/if}
  <label>Notes <input /></label>
  <label><input type="checkbox" /> Include previous activity</label>
  {#snippet footer()}<Button size="s" label="Done" onclick={() => open = false} />{/snippet}
</Drawer>
