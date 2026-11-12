<script lang="ts">
  import type { Size } from '../types';
  import type { HTMLTextareaAttributes } from 'svelte/elements';
  interface Props extends Omit<HTMLTextareaAttributes, 'value' | 'defaultValue'> {
    value?: string;
    defaultValue?: string;
    size?: Size;
    
  }
  let { defaultValue, value = $bindable(defaultValue ?? ''), size = 'm', class: className, ...attrs }: Props = $props();
</script>

<textarea {...attrs} {defaultValue} bind:value data-size={size} class={['aui-control', 'aui-scrollbar', className]}></textarea>
<style>
  textarea { min-height: calc(var(--control-height, 48px) * 1.7); resize: vertical; }
</style>
