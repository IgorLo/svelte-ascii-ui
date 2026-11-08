<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { palettes,themeStyle,type Palette,type ThemeColors } from './theme';
  import type { Size } from './types';
  import './theme.css';
  let { palette='phosphor',colors={},size='m',font="'Monocraft', monospace",children,class:className='',style='',...rest }: Omit<HTMLAttributes<HTMLDivElement>,'children'> & {palette?:Palette;colors?:Partial<ThemeColors>;size?:Size;font?:string;children?:Snippet}=$props();
  const resolved=$derived({...palettes[palette],...colors});
</script>
<div {...rest} class={`ascii-theme ${className}`} data-palette={palette} data-size={size} style={`${themeStyle(resolved)};--text-font:${font};${style}`}>{@render children?.()}</div>
