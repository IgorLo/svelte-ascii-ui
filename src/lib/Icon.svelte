<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';
  import { iconPaths, type IconName } from './icons/pixelarticons';

  let { name, label, class: className = '', ...attrs }: Omit<SVGAttributes<SVGSVGElement>, 'children' | 'role' | 'aria-label' | 'aria-hidden'> & { name: IconName; label?: string } = $props();
</script>

<svg {...attrs} class={`aui-icon ${className}`} viewBox="0 0 24 24" fill="currentColor" role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} focusable="false">
  <path d={iconPaths[name]} />
</svg>

<style>
  .aui-icon { display: block; inline-size: var(--icon-size,18px); block-size: var(--icon-size,18px); flex: none; }
</style>
