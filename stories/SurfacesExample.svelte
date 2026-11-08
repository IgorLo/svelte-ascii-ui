<script lang="ts">
  import { Theme, Field, Input, Textarea, Select, FileInput, Button, Progress, Panel } from '../src/lib';
  import type { Palette, Size } from '../src/lib';
  let { palette = 'phosphor', size = 'm' }: { palette?: Palette; size?: Size } = $props();
</script>

{#snippet controls()}
  <div class="fields">
    <Field label="Collection name">
      {#snippet children(control)}<Input {...control} {size} placeholder="Weekend reading" />{/snippet}
    </Field>
    <Field label="Visibility">
      {#snippet children(control)}<Select {...control} {size} options={[{ value: 'private', label: 'Private collection' }, { value: 'shared', label: 'Shared collection' }]} />{/snippet}
    </Field>
    <Field label="Description">
      {#snippet children(control)}<Textarea {...control} {size} rows={2} placeholder="A few words about this collection" />{/snippet}
    </Field>
    <Field label="Email" error="Enter a complete email address.">
      {#snippet children(control)}<Input {...control} {size} defaultValue="reader@" />{/snippet}
    </Field>
    <Input {size} aria-label="Read only" readonly value="Read-only value" />
    <Input {size} aria-label="Unavailable field" disabled placeholder="Unavailable" />
    <Select {size} aria-label="Loading collections" loading options={[]} />
    <FileInput {size} aria-label="Attachment" />
    <div class="actions">
      <Button {size} variant="primary" label="Save" icon="plus" />
      <Button {size} label="Cancel" />
      <Button {size} variant="danger" label="Delete" />
      <Button {size} variant="primary" label="Unavailable" disabled />
      <Button {size} variant="primary" label="Saving" loading />
    </div>
    <Progress {size} label="Not started" value={0} />
    <Progress {size} label="Importing" value={.4} />
    <Progress {size} label="Complete" value={1} />
  </div>
{/snippet}

<Theme {palette} {size}>
  <main>
    <h1>Control surfaces</h1>
    <p>Fields, primary actions and progress tracks remain visible on a page or inside a panel. Tab through the controls to inspect focus.</p>
    <div class="columns">
      <section aria-label="On the page"><h2>On the page</h2>{@render controls()}</section>
      <section aria-label="Inside a panel"><h2>Inside a panel</h2><Panel {size}>{@render controls()}</Panel></section>
    </div>
  </main>
</Theme>

<style>
  main { padding: 20px; background: var(--bg); }
  h1, h2, p { margin: 0 0 16px; }
  .columns { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 24rem), 1fr)); gap: 24px; }
  section { min-width: 0; }
  .fields { display: grid; gap: 12px; }
  .actions { display: flex; flex-wrap: wrap; gap: 12px; }
</style>
