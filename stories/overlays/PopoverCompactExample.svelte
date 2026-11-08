<script lang="ts">
  import { Theme, Popover, Button } from '../../src/lib';
  let { size = 's' }: { size?: 's' | 'm' } = $props();
</script>

<Theme {size}>
  <div class="help-row">
    <span>Retention period</span>
    <Popover label="About retention" title="Retention help" triggerVariant="compact" {size}>
      {#snippet children(close)}
        <p>Files are retained for thirty days.</p>
        <Button label="Got it" onclick={close} />
      {/snippet}
    </Popover>
    <Popover label="About backups" triggerVariant="compact" {size}>
      {#snippet trigger()}<span aria-hidden="true">[i]</span>{/snippet}
      <p>Backups run every day.</p>
    </Popover>
    <Popover label="Display options" {size} />
  </div>
</Theme>

<style>
  .help-row { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
</style>
