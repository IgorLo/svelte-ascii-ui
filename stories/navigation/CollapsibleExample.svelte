<script lang="ts">
  import Collapsible from '../../src/lib/navigation/Collapsible.svelte';
  let { title = 'Advanced settings', disabled = false, initialOpen = false, size = 's' }: {
    title?: string; disabled?: boolean; initialOpen?: boolean; size?: 's' | 'm' | 'l';
  } = $props();
  let open = $derived(initialOpen);
</script>
<Collapsible {title} {disabled} {size} bind:open>
  <p>Change how the terminal handles long output.</p>
  <label><input type="checkbox" /> Wrap long lines</label>
</Collapsible>
