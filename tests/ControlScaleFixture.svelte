<script lang="ts">
  import { Theme, Button, IconButton, NumberInput, Select, Input, Panel, Badge, Pagination } from '../src/lib';
  import type { Size } from '../src/lib';
  import '../src/lib/fonts.css';
  let { size = 'm' }: { size?: Size } = $props();
</script>
<Theme {size}>
  <Panel {size} title="Control scale">
    <Button {size} label="Save" />
    <Button {size} label="Go" />
    <Badge {size} label="Ready" />
    <Pagination {size} totalPages={3} />
    <IconButton {size} label="Close" />
    <Input {size} aria-label="Title" value="A long translated title" />
    <NumberInput {size} aria-label="Quantity" value={2} />
    <Select {size} aria-label="Collection" options={[{value:'one',label:'Personal'}]} value="one" />
    <Select {size} aria-label="Loading collection" options={[]} loading />
    <Button {size} label="This is a long translated action that must wrap inside its container" />
  </Panel>
</Theme>
