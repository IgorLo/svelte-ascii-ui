<script lang="ts">
  import { Theme, Checkbox, type Palette } from '../src/lib';
  let { palette = 'phosphor', horizontal = false }: { palette?: Palette; horizontal?: boolean } = $props();
</script>

<Theme {palette} class="aui-scrollbars">
  <div class="workspace">
    <!-- svelte-ignore a11y_no_noninteractive_tabindex (Native scrolling needs a keyboard focus target.) -->
    <section class="settings" tabindex="0" aria-label="Настройки представления">
      <h2>Настройки</h2>
      <p>Прокрутка остаётся нативной: колесо, клавиатура и перетаскивание ползунка.</p>
      {#each Array.from({ length: 16 }, (_, i) => i) as item (item)}
        <Checkbox size="s" label={`Показывать группу ${item + 1}`} />
      {/each}
    </section>
    <div class="preview"><h2>Предпросмотр</h2><p>Сетка, высота и overflow принадлежат приложению. Общий класс aui-scrollbars на Theme добавляет цвета темы и прямоугольную геометрию в Chromium/WebKit. Firefox сохраняет системную форму.</p></div>
    {#if horizontal}
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Native scrolling needs a keyboard focus target.) -->
      <section class="wide" tabindex="0" aria-label="Широкая таблица">
        <div class="columns">Период 01 · Период 02 · Период 03 · Период 04 · Период 05 · Период 06 · Период 07 · Период 08</div>
      </section>
    {/if}
  </div>
</Theme>

<style>
  .workspace { display: grid; grid-template-columns: minmax(0, 20rem) minmax(0, 1fr); gap: 24px; background: var(--bg); color: var(--text); padding: 20px; }
  .settings { display: grid; gap: 12px; height: 24rem; overflow: auto; padding: 4px 16px 4px 4px; }
  .preview { min-width: 0; }
  .wide { grid-column: 1 / -1; max-width: 100%; height: 8rem; overflow: auto; }
  .columns { min-width: 80rem; min-height: 12rem; }
  h2 { margin: 0; font-size: 1.125rem; }
  p { margin: 0 0 12px; overflow-wrap: anywhere; }
  @media (max-width: 600px) { .workspace { grid-template-columns: minmax(0, 1fr); } }
</style>
