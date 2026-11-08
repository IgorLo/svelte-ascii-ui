<script lang="ts">import Panel from'../src/lib/feedback/Panel.svelte';import Button from'../src/lib/Button.svelte';let{title='Панель',size='m'}:{title?:string;size?:'s'|'m'}=$props();</script>
<Panel {title} {size}><p>Рамка объединяет. Отступ разделяет.</p>{#snippet footer()}<Button label="Продолжить" {size}/>{/snippet}</Panel>
