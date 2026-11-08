<script lang="ts">
  import type { Size } from '../types';
  import type { HTMLInputAttributes } from 'svelte/elements';
  type Base = Omit<HTMLInputAttributes, 'size' | 'type' | 'value' | 'children' | 'defaultValue'>;
  import Button from '../Button.svelte';
  interface Props extends Base { value?: string; defaultValue?: string; size?: Size; showLabel?: string; hideLabel?: string; }
  const uid = $props.id();
  let { defaultValue, value = $bindable(defaultValue ?? ''), size = 'm', id = uid, disabled, readonly, class: className, showLabel = 'Show password', hideLabel = 'Hide password', ...attrs }: Props = $props();
  let visible = $state(false);
</script>

<div class="inline" data-size={size}>
  <input {...attrs} {defaultValue} {id} type={visible ? 'text' : 'password'} bind:value {disabled} {readonly} class={['aui-control', className]} />
  <Button {size} label={visible ? hideLabel : showLabel} aria-controls={id} disabled={disabled} onclick={() => { visible = !visible; }} />
</div>

<style>
  .inline { display: flex; align-items: stretch; gap: .5rem; }
  input { min-width: 0; flex: 1 1 0; }
</style>
