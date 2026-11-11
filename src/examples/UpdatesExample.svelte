<script lang="ts">
  import { Article, Button, Checkbox, Drawer, Field, Input, Panel, Range, Select, Slider, Theme, type Palette } from '../lib';
  import ReadingExample from './ReadingExample.svelte';
  let { palette = 'phosphor' }: { palette?: Palette } = $props();
  let sort = $state('author');
  let sheetOpen = $state(false);
  let longContent = $state(false);
  function openSheet(long: boolean) { longContent = long; sheetOpen = true; }
</script>

<Theme {palette}>
  <div class="review-grid">
    <Panel title="Рамки и шкалы" size="s">
      <div class="stack">
        <div class="row"><Checkbox size="s" label="Выбрано" checked /><Checkbox size="s" label="Пусто" /><Checkbox size="s" label="Часть" indeterminate /></div>
        <Field label="Количество">{#snippet children(control)}<Slider {...control} size="s" value={50} marks />{/snippet}</Field>
        <Range size="s" label="Диапазон" lowerLabel="От" upperLabel="До" lower={20} upper={80} marks />
      </div>
    </Panel>
    <Panel title="Выбор без пустого пункта" size="s">
      <form class="stack" onsubmit={event => event.preventDefault()}>
        <Field label="Сортировка">{#snippet children(control)}<Select {...control} size="s" showPlaceholder={false} options={[{value:'author',label:'По прикольности'},{value:'date',label:'По дате'}]} bind:value={sort} />{/snippet}</Field>
        <p aria-live="polite">Выбрано: {sort === 'author' ? 'По прикольности' : 'По дате'}</p>
        <Button size="s" type="reset" label="Сбросить сортировку" />
      </form>
    </Panel>
    <Panel title="Нативная прокрутка" size="s">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (A named scroll region needs keyboard focus.) -->
      <section class="aui-scrollbar scroll-example" tabindex="0" aria-label="Список настроек">
        {#each Array.from({length:16},(_,i)=>i) as item (item)}<Checkbox size="s" label={`Настройка ${item+1}: показывать подробные сведения`} />{/each}
      </section>
    </Panel>
    <Panel title="Нижняя шторка" size="s">
      <div class="stack"><p>Короткая карточка занимает высоту содержимого, длинная прокручивается внутри.</p><Button size="s" label="Открыть короткую шторку" onclick={()=>openSheet(false)} /><Button size="s" label="Открыть длинную шторку" onclick={()=>openSheet(true)} /></div>
    </Panel>
  </div>
  <h3 class="reading-title">Читаемый текст рядом с плотной формой</h3>
  <ReadingExample {palette} />
  <Drawer side="bottom" bind:open={sheetOpen} title="Подробности материала" closeLabel="Закрыть шторку">
    <Article>
      <p>Шторка прижата к нижнему краю. Заголовок и закрытие доступны, содержимое прокручивается отдельно.</p>
      {#if longContent}{#each Array.from({length:12},(_,i)=>i) as item (item)}<p>Раздел {item+1}. Подробные сведения помогают понять источник и границы применимости данных. На узком экране текст переносится, сохраняя порядок чтения.</p>{/each}{/if}
      <Field label="Комментарий к материалу">{#snippet children(control)}<Input {...control} placeholder="Добавьте заметку" />{/snippet}</Field>
    </Article>
    {#snippet footer()}<Button label="Готово" onclick={()=>sheetOpen=false} />{/snippet}
  </Drawer>
</Theme>

<style>
  .review-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,22rem),1fr)); gap: 24px; align-items: start; }
  .stack { display: grid; gap: 16px; min-width: 0; }
  .row { display: flex; flex-wrap: wrap; gap: 16px; }
  p { margin: 0; overflow-wrap: anywhere; }
  .scroll-example { display: grid; gap: 12px; max-height: 14rem; overflow: auto; padding: 4px; }
  .reading-title { margin-top: 32px; }
</style>
