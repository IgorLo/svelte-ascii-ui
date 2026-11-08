<script lang="ts">let{vertical=false,label}:{vertical?:boolean;label?:string}=$props();</script>
<div role="separator" aria-orientation={vertical?'vertical':'horizontal'} aria-label={label} class={{vertical}}></div>
<style>div{height:1px;width:100%;margin-block:1em;background:repeating-linear-gradient(to right,var(--muted) 0 8px,transparent 8px 14px);opacity:.55}.vertical{height:100%;min-height:2em;width:1px;margin:0 1em;background:repeating-linear-gradient(to bottom,var(--muted) 0 8px,transparent 8px 14px);align-self:stretch}</style>
