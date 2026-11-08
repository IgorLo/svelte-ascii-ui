<script lang="ts">
  import AsciiDialog from './AsciiDialog.svelte';
  import './overlay-examples.css';
  let { size }: { size: 's' | 'm' } = $props();
  const uid = $props.id();
  let modalOpen = $state(false);
  let drawerOpen = $state(false);
  let confirmOpen = $state(false);
  let commandOpen = $state(false);
  let modalSize = $state<'s' | 'm' | 'l' | 'fit'>('m');
  let drawerSize = $state<'s' | 'm' | 'l' | 'xl'>('m');
  let longContent = $state(false);
  let tooltipShown = $state(false);
  let notice = $state('');
  let query = $state('');
  let compact = $state(true);
  const commands = ['Создать заметку', 'Открыть настройки', 'Перейти к черновикам', 'Показать опубликованные'];
  const matches = $derived(commands.filter(c => c.toLocaleLowerCase().includes(query.toLocaleLowerCase())));
  function action(label: string, popoverId?: string) {
    notice = `${label} — выполнено в примере.`;
    if (popoverId) document.getElementById(popoverId)?.hidePopover();
  }
  function groupKeys(event: KeyboardEvent) {
    if (!['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return;
    const buttons = [...(event.currentTarget as HTMLElement).closest('[role=group]')!.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
    const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
    event.preventDefault(); buttons[index]?.focus();
  }
  function context(event: MouseEvent | KeyboardEvent) {
    if (event instanceof KeyboardEvent && !(event.key === 'F10' && event.shiftKey)) return;
    event.preventDefault(); document.getElementById(`${uid}-context`)?.showPopover();
  }
</script>

<svelte:window onkeydown={(event) => { if (event.key === 'Escape') tooltipShown = false; }} />

<section class="panel overlay-examples" id={`${size}-overlays`}>
  <div class="section-heading"><h2><span>08</span> Окна и подсказки</h2><span class="kind">OVERLAY</span></div>
  <p class="hint">Размер окна независим от размера его кнопок. Попробуйте длинный текст и узкий экран.</p>
  <label class="check-label"><input type="checkbox" bind:checked={longContent} /> Длинное содержимое для проверки скролла</label>
  <h3>Модальное окно</h3>
  <div class="sample-row">{#each ['s','m','l','fit'] as value (value)}<button onclick={() => { modalSize = value as typeof modalSize; modalOpen = true; }}>Окно {value.toUpperCase()}</button>{/each}<button class="danger" onclick={() => confirmOpen = true}>Подтверждение</button></div>
  <h3 class="overlay-subheading">Боковая панель</h3>
  <div class="sample-row">{#each [{key:'s',label:'S · ¼'}, {key:'m',label:'M · ⅓'}, {key:'l',label:'L · ½'}, {key:'xl',label:'XL · ⅔'}] as item (item.key)}<button onclick={() => { drawerSize = item.key as typeof drawerSize; drawerOpen = true; }}>Панель {item.label}</button>{/each}</div>

  <h3 class="overlay-subheading">Короткие подсказки и действия</h3>
  <div class="sample-row">
    <div class="tooltip-example" role="group" onpointerenter={() => tooltipShown = true} onpointerleave={() => tooltipShown = false}>
      <button aria-describedby={tooltipShown ? `${uid}-tooltip` : undefined} onfocus={() => tooltipShown = true} onblur={() => tooltipShown = false}>Что сохраняется?</button>
      {#if tooltipShown}<span role="tooltip" id={`${uid}-tooltip`}>Сохраняются текст и настройки. Escape скрывает подсказку.</span>{/if}
    </div>
    <button popovertarget={`${uid}-popover`} style:anchor-name={`--${uid}-popover-anchor`}>Параметры ↴</button>
    <button popovertarget={`${uid}-actions`} style:anchor-name={`--${uid}-actions-anchor`}>Действия ↴</button>
  </div>
  <div popover="auto" id={`${uid}-popover`} class="ascii-popover" style:position-anchor={`--${uid}-popover-anchor`}>
    <h3>Вид заметки</h3><label class="check-label"><input type="checkbox" bind:checked={compact} /> Компактные отступы</label>
    <p class="hint">Popover содержит любые элементы: текст, поля и кнопки.</p>
    <button popovertarget={`${uid}-popover`} popovertargetaction="hide">Готово</button>
  </div>
  <div popover="auto" id={`${uid}-actions`} class="ascii-popover action-popover" style:position-anchor={`--${uid}-actions-anchor`}>
    <div role="group" aria-label="Действия с заметкой">
      <button onkeydown={groupKeys} onclick={() => action('Переименовать', `${uid}-actions`)}>Переименовать</button><button onkeydown={groupKeys} onclick={() => action('Дублировать', `${uid}-actions`)}>Дублировать</button><button disabled>Опубликовать · недоступно</button><button onkeydown={groupKeys} class="danger" onclick={() => { document.getElementById(`${uid}-actions`)?.hidePopover(); confirmOpen = true; }}>Удалить…</button>
    </div>
  </div>
  <p class="hint">Контекстные действия: правая кнопка мыши, Shift+F10 или обычный клик.</p>
  <button class="context-example full-width" popovertarget={`${uid}-context`} style:anchor-name={`--${uid}-context-anchor`} oncontextmenu={context} onkeydown={context}>[Заметка] Открыть действия</button>
  <div popover="auto" id={`${uid}-context`} class="ascii-popover action-popover" style:position-anchor={`--${uid}-context-anchor`}><div role="group" aria-label="Контекстные действия"><button onkeydown={groupKeys} onclick={() => action('Открыть заметку', `${uid}-context`)}>Открыть</button><button onkeydown={groupKeys} onclick={() => action('Переместить в черновики', `${uid}-context`)}>В черновики</button><button onkeydown={groupKeys} onclick={() => action('Дублировать заметку', `${uid}-context`)}>Дублировать</button></div></div>
  <h3 class="overlay-subheading">Составной пример: командная палитра</h3>
  <p class="hint">Поиск по действиям приложения: набираешь «настройки» и запускаешь нужную команду. Полезен, когда действий становится много.</p>
  <button onclick={() => { query = ''; commandOpen = true; }}>Открыть команды</button>
  <p role="status" class="hint">{notice}</p>
</section>

<AsciiDialog bind:open={modalOpen} title="Настройки публикации" size={modalSize}>
  {#snippet header()}<p class="hint">MODAL / {modalSize.toUpperCase()} · header, body и footer</p>{/snippet}
  <p>Заголовок обязателен для доступного имени. Содержимое и дополнительная подпись остаются под вашим контролем.</p>
  <label>Название<input value="Заметки о пикселях" /></label>
  {#if longContent}{#each Array.from({length:12},(_,i)=>i+1) as paragraph (paragraph)}<p><strong>{paragraph.toString().padStart(2,'0')} / Раздел заметки.</strong> Длинное содержимое прокручивается внутри окна. Заголовок и кнопки остаются доступны. Размер окна ограничен экраном.</p>{/each}{/if}
  {#snippet footer()}<button onclick={() => modalOpen = false}>Отмена</button><button class="primary" onclick={() => { action('Настройки сохранены'); modalOpen = false; }}>Сохранить</button>{/snippet}
</AsciiDialog>
<AsciiDialog bind:open={drawerOpen} title="Боковая панель" size={drawerSize} drawer>
  {#snippet header()}<p class="hint">DRAWER / {drawerSize.toUpperCase()}</p>{/snippet}
  <p>Дополнительная информация рядом с основной задачей. На телефоне панель занимает всю ширину.</p>
  <label>Заголовок<input value="Новый черновик" /></label><label>Описание<textarea rows="4" placeholder="Пара слов о заметке"></textarea></label>
  {#if longContent}{#each Array.from({length:10},(_,i)=>i+1) as paragraph (paragraph)}<p>Раздел {paragraph}. Здесь могут быть настройки, пояснения и другие компоненты.</p>{/each}{/if}
  {#snippet footer()}<button onclick={() => drawerOpen = false}>Закрыть</button><button class="primary" onclick={() => { action('Черновик сохранён'); drawerOpen = false; }}>Сохранить</button>{/snippet}
</AsciiDialog>
<AsciiDialog bind:open={confirmOpen} title="Удалить черновик?" size="s">
  <p>Это пример подтверждения опасного действия. Настоящие данные останутся на месте.</p>
  {#snippet footer()}<button onclick={() => confirmOpen = false}>Оставить</button><button class="danger" onclick={() => { action('Удаление подтверждено'); confirmOpen = false; }}>Удалить</button>{/snippet}
</AsciiDialog>
<AsciiDialog bind:open={commandOpen} title="Найти действие" size="m">
  <label>Поиск команд<input type="search" bind:value={query} placeholder="Например, настройки" onkeydown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); document.getElementById(`${uid}-command-0`)?.focus(); } }} /></label>
  <div role="group" aria-label="Найденные команды" class="command-results">{#each matches as command, i (command)}<button onkeydown={groupKeys} id={`${uid}-command-${i}`} onclick={() => { action(command); commandOpen = false; }}>{command} <span aria-hidden="true">↵</span></button>{:else}<p role="status">Ничего не найдено. Попробуйте другое слово.</p>{/each}</div>
  <p class="hint">↓ — перейти к результатам · Enter — выполнить · Escape — закрыть</p>
</AsciiDialog>
