<script lang="ts">
  import type { Size } from '../types';
  import type { HTMLInputAttributes } from 'svelte/elements';
  interface Props extends Omit<HTMLInputAttributes, 'value' | 'size' | 'type'> {
    value?: string;
    size?: Size;
    type?: 'text' | 'email' | 'tel' | 'url' | 'search' | 'password';
  }
  let { defaultValue, value = $bindable(defaultValue ?? ''), size = 'm', class: className, type = 'text', ...attrs }: Props = $props();
</script>

<input {...attrs} {type} {defaultValue} bind:value data-size={size} class={['aui-control', className]} />

