<script lang="ts">
  let { text, label = 'Подсказка' }: { text: string; label?: string } = $props();
  const id = $props.id();
  let hovered = $state(false), focused = $state(false), pinned = $state(false), dismissed = $state(false);
  const visible = $derived(!dismissed && (hovered || focused || pinned));
  function dismiss() { dismissed = true; pinned = false; }
</script>
<svelte:window onkeydown={(event) => { if (event.key === 'Escape') dismiss(); }} />
<div class="tooltip-field" role="group" onpointerenter={() => { hovered=true; dismissed=false; }} onpointerleave={() => hovered=false}>
  <button type="button" aria-describedby={visible ? id : undefined} onfocus={() => { focused=true; dismissed=false; }} onblur={() => { focused=false; pinned=false; }} onclick={() => { pinned=!pinned; dismissed=!pinned; }}><span aria-hidden="true">[?]</span> {label}</button>
  {#if visible}<div class="tooltip-bubble" {id} role="tooltip">{text}</div>{/if}
</div>
<style>
  .tooltip-field { position: relative; width: 100%; margin-block: .5em; }
  .tooltip-bubble { position: absolute; z-index: 10; top: 100%; inset-inline-start: 0; width: min(28em,100%); box-sizing: border-box; padding: .6em 1ch; background: var(--bg); color: var(--text); border: 9px solid transparent; border-image: var(--ascii-muted) 12 / 9px space; font-size: .85em; overflow-wrap: anywhere; }
</style>
