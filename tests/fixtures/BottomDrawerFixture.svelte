<script lang="ts">
  import { Article, Button, Drawer, Field, Input, Theme } from '../../src/lib';
  let {
    side = 'bottom', long = false, withFooter = true,
    closeOnEscape = true, closeOnBackdrop = true,
  }: {
    side?: 'left' | 'right' | 'bottom'; long?: boolean; withFooter?: boolean;
    closeOnEscape?: boolean; closeOnBackdrop?: boolean;
  } = $props();
  let open = $state(false);
  let nested = $state(false);
</script>
{#snippet actions()}<Button label="Done" onclick={() => open = false} />{/snippet}
<Theme palette="paper">
  <div style="min-height: 2500px">
    <Button label="Open details" onclick={() => open = true} />
    <Drawer bind:open title="City details" {side} {closeOnEscape} {closeOnBackdrop} footer={withFooter ? actions : undefined}>
      <Article>
      <p>Details stay anchored to the bottom of the available viewport.</p>
      {#if long}
        {#each Array.from({ length: 40 }, (_, index) => index) as row (row)}
          <p>Detail {row + 1}: long content scrolls within the panel.</p>
        {/each}
      {/if}
      <Button label="Open nested details" onclick={() => nested = true} />
      <Field label="Notes">{#snippet children(control)}<Input {...control} />{/snippet}</Field>
      </Article>

    </Drawer>
    <Drawer bind:open={nested} title="Nested details" side="bottom">
      <p>Second modal.</p>
    </Drawer>
  </div>
</Theme>
