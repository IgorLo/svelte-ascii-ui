<script lang="ts">
  import { Checkbox, Switch, Theme } from '../src/lib';
  let { size = 's', width = 120 }: { size?: 's' | 'm'; width?: number } = $props();
</script>

<Theme>
  <div style:width={`${width}px`}>
    <Checkbox {size} label="Short" />
    <Checkbox {size} label="Receive detailed notifications about changes to all projects" />
    <Checkbox {size} checked label="Include completed projects in the detailed notifications" />
    <Checkbox {size} indeterminate label="Some projects are included in these detailed notifications" />
    <Switch {size} label="Automatically deliver detailed notifications for every project" />
    <Switch {size} checked label="Automatically include completed projects in notifications" />
  </div>
</Theme>
