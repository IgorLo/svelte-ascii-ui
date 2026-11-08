<script lang="ts">
  import { Theme, Input, Textarea, Select, Button, Progress, Panel } from '../src/lib';
  import type { Palette, Size } from '../src/lib';
  let { palette='phosphor', size='m' }: {palette?:Palette;size?:Size}=$props();
</script>
<Theme {palette} {size}>
  <div aria-label="Page surface" style:background="var(--bg)">
    <Input {size} aria-label="Editable" />
    <Input {size} aria-label="Invalid" aria-invalid="true" />
    <Input {size} aria-label="Read only" readonly value="Locked" />
    <Textarea {size} aria-label="Description" />
    <Select {size} aria-label="Selection" options={[]} />
    <Button {size} label="Apply" variant="primary" />
    <Button {size} label="Cancel" />
    <Button {size} label="Loading" variant="primary" loading />
    <Progress {size} label="Empty track" value={0} />
    <Panel {size}><Input {size} aria-label="In panel" /><Progress {size} label="Panel track" value={.4} /></Panel>
  </div>
</Theme>
