<script lang="ts">
  import { Article, Button, Checkbox, Dialog, Field, Input, Theme } from '../../src/lib';
  let { mobilePlacement = 'bottom', long = false }: { mobilePlacement?: 'center' | 'bottom'; long?: boolean } = $props();
  let open = $state(false);
  let value = $state('Initial note');
</script>
<Theme palette="paper">
  <main style="min-height:2500px">
    <Button label="Open material" onclick={() => open = true} />
    <Dialog bind:open title="Material details" {mobilePlacement}>
      <Article>
        <p>The same material and form are presented at every viewport width.</p>
        {#if long}{#each Array.from({length:32},(_,i)=>i) as row (row)}<p>Section {row + 1}: explanation and supporting details.</p>{/each}{/if}
        <Checkbox label="Keep source" checked />
        <Field label="Material note">{#snippet children(control)}<Input {...control} bind:value />{/snippet}</Field>
      </Article>
      {#snippet footer()}<Button label="Done" onclick={() => open = false} />{/snippet}
    </Dialog>
  </main>
</Theme>
