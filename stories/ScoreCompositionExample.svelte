<script lang="ts">
  import { Badge, Button, Panel, Separator, Theme } from '../src/lib';
  import type { Palette, Size } from '../src/lib';
  let { palette = 'phosphor', size = 'm' }: { palette?: Palette; size?: Size } = $props();
  let message = $state('');
</script>

<Theme {palette} {size}>
  <main>
    <header><h1>Make a score understandable</h1><p>Labels explain the value, scale and status. This recipe uses public components and page layout only.</p></header>
      <div class="recipe">
        <Panel {size} title="Collection quality">
          <div class="score-row">
            <div>
              <p class="eyebrow">Metadata completeness</p>
              <p class="score"><strong>82</strong> <span>out of 100</span></p>
            </div>
            <Badge {size} tone="success" label="Ready for review" />
          </div>
          <p>82 of 100 records have the required metadata. Higher values mean more complete records.</p>
          <Separator />
          <dl>
            <div><dt>Scale</dt><dd>0–100; complete records / all records × 100</dd></div>
            <div><dt>Review threshold</dt><dd>80 or more; an example application rule</dd></div>
            <div><dt>Missing information</dt><dd>18 records need an author or publication date</dd></div>
          </dl>
          {#snippet footer()}
            <Button {size} label="Review missing information" onclick={() => message = 'Example action: review the 18 incomplete records.'} />
          {/snippet}
        </Panel>
        <section class="localized-recipe" lang="ru" aria-label="Качество описания коллекции">
          <Panel {size}>
            <h2>Качество описания коллекции</h2>
            <p>Полнота библиографических сведений: <strong>82 из 100</strong>. Чем выше значение, тем полнее описание.</p>
            <Separator />
            <h3>Готовность к редакторской проверке</h3>
            <dl class="status-list">
              <div><dt>Сведения об авторстве и дополнительных участниках</dt><dd><Badge {size} tone="default" label="Ожидает проверки" /></dd></div>
              <div><dt>Название произведения и подтверждённая дата публикации</dt><dd><Badge {size} tone="success" label="Проверено" /></dd></div>
              <div><dt>Источник библиографического описания и условия использования</dt><dd><Badge {size} tone="warning" label="Требует уточнения" /></dd></div>
              <div><dt>Обязательные сведения для размещения в открытом каталоге</dt><dd><Badge {size} tone="danger" label="Недостаточно данных" /></dd></div>
            </dl>
            <Separator />
            <p>Порог готовности — 80. Это правило примера: итоговый балл не заменяет проверку обязательных сведений.</p>
          </Panel>
        </section>
        <p class="note">This is a measured value, not task progress. A labelled number is sufficient here; use a labelled native meter when a bounded graphical measurement is useful. Reserve Progress for completion of work.</p>
      </div>
    <p role="status">{message}</p>
  </main>
</Theme>

<style>
  main { padding: clamp(12px, 3vw, 32px); }
  header { margin-block-end: 24px; max-inline-size: 74ch; }
  h1 { font-size: 1.5rem; line-height: 1.4; }
  h2, h3 { font-size: 1rem; line-height: 1.5; margin: 0; }
  .eyebrow, .note { color: var(--muted); font-size: .875rem; }
  .note { margin-block-start: 24px; }
  .recipe { max-inline-size: 48rem; }
  .localized-recipe { margin-block-start: 24px; overflow-wrap: anywhere; }
  .localized-recipe h2, .localized-recipe h3 { margin-block-end: 8px; }
  .status-list { margin-block-end: 16px; gap: 12px; }
  .score-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
  .score { margin-block: 8px; }
  .score strong { font-size: 2rem; line-height: 1.2; }
  .score span { color: var(--muted); }
  dl { margin: 16px 0 0; display: grid; gap: 16px; }
  dt { color: var(--muted); font-size: .875rem; }
  dd { margin: 0; overflow-wrap: anywhere; }

</style>
