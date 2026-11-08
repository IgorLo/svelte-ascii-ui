<script lang="ts">
  import { Theme, Popover, Button } from '../../src/lib';
  let { size = 's', edge = false }: { size?: 's' | 'm' | 'l'; edge?: boolean } = $props();
</script>

<Theme {size}>
  <div class={['help-row', { edge }]} lang="ru">
    <span>Срок хранения резервных копий и восстановление предыдущих редакций</span>
    <Popover label="About retention" title="Retention help" triggerVariant="compact" {size}>
      {#snippet children(close)}
        <p>Файлы и резервные копии сохраняются в течение тридцати дней после завершения обработки. Этот срок позволяет восстановить случайно удалённые материалы и сравнить предыдущие версии документов. После окончания срока хранения материалы удаляются автоматически; важные документы лучше сохранить в своём архиве.</p>
        <Button label="Got it" onclick={close} />
      {/snippet}
    </Popover>
    <Popover label="About backups" triggerVariant="compact" {size}>
      {#snippet trigger()}<span aria-hidden="true">[i]</span>{/snippet}
      <p>Резервные копии создаются ежедневно. Время последнего сохранения и доступные версии можно проверить в настройках проекта.</p>
    </Popover>
    <Popover label="Display options" {size} />
  </div>
</Theme>

<style>
  .help-row { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
  .edge { position: fixed; inset-inline: 8px; bottom: 8px; justify-content: flex-end; }
</style>
