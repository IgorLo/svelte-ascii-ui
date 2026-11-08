<script lang="ts">
  import Button from '../../src/lib/Button.svelte';
  import Dialog from '../../src/lib/overlays/Dialog.svelte';
  let { title = 'Command palette' }: { title?: string } = $props();
  const id = $props.id();
  let open = $state(false), query = $state(''), index = $state(0), result = $state('');
  const commands = [
    { id: 'session', label: 'Open session' },
    { id: 'clear', label: 'Clear terminal' },
    { id: 'copy', label: 'Copy session link' },
    { id: 'export', label: 'Export session' },
  ];
  const filtered = $derived(commands.filter(command => command.label.toLowerCase().includes(query.trim().toLowerCase())));
  const active = $derived(filtered[index]);

  function run(command: (typeof commands)[number]) {
    result = command.label + ' completed.';
    open = false;
  }
  function navigate(event: KeyboardEvent) {
    if (!filtered.length || event.isComposing) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      index = (index + (event.key === 'ArrowDown' ? 1 : -1) + filtered.length) % filtered.length;
    } else if (event.key === 'Enter' && active) {
      event.preventDefault(); run(active);
    }
  }
</script>

<Button label="Open command palette" onclick={() => { query = ''; index = 0; open = true; }} />
<p role="status">{result}</p>
<Dialog bind:open {title} size="s">
  <label for={id + '-search'}>Find a command</label>
  <!-- The search field is the intended starting point for the palette. -->
  <!-- svelte-ignore a11y_autofocus -->
  <input autofocus id={id + '-search'} class="aui-control" type="text" placeholder="Filter commands"
    role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls={id + '-results'}
    aria-activedescendant={active ? id + '-' + active.id : undefined} value={query}
    oninput={(event) => { query = event.currentTarget.value; index = 0; }} onkeydown={navigate} />
  <div class="results" id={id + '-results'} role="listbox" aria-label="Matching commands">
    {#each filtered as command, n (command.id)}
      <button type="button" class="aui-button" data-size="s" data-variant={n === index ? 'primary' : undefined}
        id={id + '-' + command.id} role="option" aria-selected={n === index} tabindex="-1"
        onpointerdown={(event) => event.preventDefault()} onclick={() => run(command)}>{command.label}</button>
    {/each}
  </div>
  <p role="status">{filtered.length === 0 ? 'No matching commands.' : ''}</p>
</Dialog>
<style>
  .results { display: grid; gap: .35em; margin-top: .6em; }
  .results > button { justify-content: start; text-align: start; }
</style>
