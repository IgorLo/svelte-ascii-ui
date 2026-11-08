<script lang="ts">
 import type{Snippet}from'svelte';import type{HTMLImgAttributes}from'svelte/elements';import IconButton from'../IconButton.svelte';
 let{src,alt,caption,children,expandable=false,expandLabel='Увеличить изображение',...rest}:Omit<HTMLImgAttributes,'src'|'alt'|'children'> & {src:string;alt:string;caption?:string;children?:Snippet;expandable?:boolean;expandLabel?:string}=$props();
 let dialog: HTMLDialogElement; let failedSrc=$state<string>();
 const failed=$derived(failedSrc===src);
 function backdrop(event:MouseEvent){if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}}
</script>
<figure>
 {#if failed}<p role="status">Изображение недоступно: {alt}</p>
 {:else if expandable}<button class="image-trigger" type="button" aria-label={expandLabel} onclick={()=>dialog.showModal()}><img {...rest} {src} {alt} onerror={()=>failedSrc=src}/></button>
 {:else}<img {...rest} {src} {alt} onerror={()=>failedSrc=src}/>{/if}
 {#if caption||children}<figcaption>{#if children}{@render children()}{:else}{caption}{/if}</figcaption>{/if}
</figure>
{#if expandable}
<dialog {@attach (element)=>{dialog=element;}} class="aui-frame" aria-label={caption||expandLabel} onclick={backdrop} onkeydown={(event)=>{if(event.key==='Escape')dialog.close();}}><div class="close"><IconButton label="Закрыть изображение" onclick={()=>dialog.close()}/></div><img {src} {alt}/>{#if caption}<p>{caption}</p>{/if}</dialog>
{/if}
<style>figure{margin:1.5em 0;min-width:0}img{display:block;width:100%;height:auto;max-width:100%;object-fit:contain}figcaption{margin-top:.7em;color:var(--muted);font-size:.85em}.image-trigger{display:block;border:0;padding:0;background:none;width:100%;cursor:zoom-in}.image-trigger:focus-visible{outline:2px dashed var(--text);outline-offset:4px}dialog{width:min(1100px,calc(100vw - 24px));max-width:calc(100vw - 12px);max-height:90dvh;overflow:auto;background:var(--bg);color:var(--text);margin:auto}dialog::backdrop{background:#000a}.close{display:flex;justify-content:flex-end;margin-bottom:.5em}dialog img{max-height:70dvh}dialog p{color:var(--muted)}</style>
