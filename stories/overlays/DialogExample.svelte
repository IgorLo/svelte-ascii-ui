<script lang="ts">
  import Button from '../../src/lib/Button.svelte';
  import Field from '../../src/lib/forms/Field.svelte';
  import Input from '../../src/lib/forms/Input.svelte';
  import Dialog from '../../src/lib/overlays/Dialog.svelte';
  let { title = 'Session settings', size = 'm', long = false, closeOnEscape = true, closeOnBackdrop = true, mobilePlacement = 'center' }: {
    title?: string; size?: 's' | 'm' | 'l' | 'xl' | 'fit'; long?: boolean;
    closeOnEscape?: boolean; closeOnBackdrop?: boolean; mobilePlacement?: 'center' | 'bottom';
  } = $props();
  let open = $state(false), result = $state('');
  let note = $state('Keep this text while resizing');
</script>
<Button label="Open dialog" onclick={() => open = true} />
<p role="status">{result}</p>
<Dialog bind:open {title} {size} {closeOnEscape} {closeOnBackdrop} {mobilePlacement}>
  {#snippet header()}<small>System configuration</small>{/snippet}
  <p>Choose whether this workspace should remember your preferences.</p>
  <label><input type="checkbox" /> Remember my settings</label>
  <Field label="Workspace note">{#snippet children(control)}<Input {...control} bind:value={note} />{/snippet}</Field>
  {#if long}
    {#each Array.from({ length: 28 }, (_, n) => n + 1) as section (section)}
      <p>{section}. Preferences apply to the current workspace. Review each section before saving.</p>
    {/each}
  {/if}
  {#snippet footer()}
    <Button size="s" label="Cancel" onclick={() => { open = false; result = 'Changes discarded.'; }} />
    <Button size="s" variant="primary" label="Save" onclick={() => { open = false; result = 'Settings saved.'; }} />
  {/snippet}
</Dialog>
