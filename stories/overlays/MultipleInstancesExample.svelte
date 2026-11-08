<script lang="ts">
  import DropdownMenu from '../../src/lib/overlays/DropdownMenu.svelte';
  import Tooltip from '../../src/lib/overlays/Tooltip.svelte';
  let result = $state('');
</script>
<div class="row">
  <DropdownMenu label="Terminal actions" items={[{ id: 'copy', label: 'Copy log', action: () => result = 'Log copied.' }]} />
  <DropdownMenu label="Workspace actions" items={[{ id: 'copy', label: 'Copy workspace link', action: () => result = 'Workspace link copied.' }]} />
  <Tooltip label="Terminal help" text="The terminal runs commands." />
  <Tooltip label="Workspace help" text="The workspace groups terminals." />
</div>
<p role="status">{result}</p>
<style>.row { display: flex; flex-wrap: wrap; gap: .6em; }</style>
