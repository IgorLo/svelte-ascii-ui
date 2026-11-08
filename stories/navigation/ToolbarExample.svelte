<script lang="ts">
  import Toolbar from '../../src/lib/navigation/Toolbar.svelte';
  import Button from '../../src/lib/Button.svelte';
  import IconButton from '../../src/lib/IconButton.svelte';
  let { label = 'Session actions' }: { label?: string } = $props();
  let status = $state('');
</script>
<Toolbar {label}>
  <Button label="Copy" size="s" onclick={() => status = 'Copied session link.'} />
  <Button label="Export" size="s" onclick={() => status = 'Exported session data.'} />
  <IconButton label="Refresh" glyph="↻" size="s" onclick={() => status = 'Session refreshed.'} />
</Toolbar>
<p role="status">{status}</p>
