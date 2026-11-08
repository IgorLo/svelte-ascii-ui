<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Size } from './types';
  import Loader from './Loader.svelte';
  import Icon from './Icon.svelte';
  import type { IconName } from './icons/pixelarticons';
  let {label,children,icon='close',glyph,size='m',variant='default',loading=false,disabled=false,type='button',class:className='',...rest}:Omit<HTMLButtonAttributes,'children'|'aria-label'> & {label:string;children?:Snippet;icon?:IconName;glyph?:string;size?:Size;variant?:'default'|'primary'|'danger';loading?:boolean}=$props();
</script>
<button {...rest} {type} aria-label={label} aria-busy={loading||undefined} disabled={disabled||loading} class={`aui-button aui-icon-button ${className}`} data-size={size} data-variant={variant}>{#if loading}<Loader {size}/>{:else}<span aria-hidden="true">{#if children}{@render children()}{:else if glyph !== undefined}{glyph}{:else}<Icon name={icon} />{/if}</span>{/if}</button>
<style>
  .aui-icon-button { --square: var(--icon-button-size,var(--control-height)); inline-size: var(--square); block-size: var(--square); min-inline-size: var(--square); min-block-size: var(--square); padding: 0; flex: none; }
  .aui-icon-button > span { display: grid; place-items: center; inline-size: var(--icon-size,18px); block-size: var(--icon-size,18px); font: var(--radio-font)/1 var(--art-font); font-variant-east-asian: normal; }
  .aui-icon-button > span :global(svg) { display: block; inline-size: 100%; block-size: 100%; }
  @media(pointer:coarse) { .aui-icon-button { --square: max(44px,var(--icon-button-size,var(--control-height))); } }
</style>
