<script lang="ts">
  import { onMount } from 'svelte';
  import UpdatesExample from './examples/UpdatesExample.svelte';
  import {
    Accordion, Alert, Article, Background, Badge, Breadcrumbs, Button, Callout,
    Checkbox, Collapsible, Combobox, ContextMenu, DataState, Dialog, Drawer,
    DropdownMenu, EmptyState, Field, Figure, FileInput, IconButton, Input, Link,
    Loader, MultiSelect, NumberInput, Pagination, Panel, PasswordInput, Popover,
    Progress, Quote, RadioGroup, Range, SearchInput, Select, Separator, Skeleton,
    Slider, Switch, Tabs, TagInput, Textarea, Theme, Toast, ToggleGroup, Toolbar, Tooltip, createSineWaves,
    palettes, type Palette, type Size,
  } from './lib';

  let palette = $state<Palette>('phosphor');
  // The viewport lives above Theme and shares the selected gallery palette.
  $effect(() => {
    document.documentElement.style.setProperty('--muted', palettes[palette].muted);
    document.documentElement.style.setProperty('--accent', palettes[palette].accent);
  });
  let paused = $state(false);
  let dialogOpen = $state(false);
  let drawerOpen = $state(false);
  let toastOpen = $state(false);
  let message = $state('');
  let progress = $state(.37);
  let page = $state(1);
  let seed = $state(42);
  onMount(() => { seed = crypto.getRandomValues(new Int32Array(1))[0]; });
  const backgroundPattern = $derived(createSineWaves({ angle: -25, amplitude: 100, wavelength: 500, spacing: 500, wavelengthVariability: .5, waveRandomness: .9, seed, characters: ' .:-=+*#' }));
  const sizes: Size[] = ['s', 'm', 'l'];
  const options = [
    { value: 'personal', label: 'Личная коллекция' },
    { value: 'shared', label: 'Общая коллекция редакции' },
    { value: 'archive', label: 'Архив', disabled: true },
  ];
  const modes = [{ value: 'draft', label: 'Сохранить как черновик' }, { value: 'review', label: 'Передать на проверку' }];
  const menu = [{ id: 'edit', label: 'Редактировать' }, { id: 'copy', label: 'Создать копию' }, { id: 'delete', label: 'Удалить', disabled: true }];
  const fontLicense = new URL('./lib/fonts/OFL-Monocraft.txt', import.meta.url).href;
  const iconLicense = new URL('./lib/icons/LICENSE-Pixelarticons.txt', import.meta.url).href;
  const image = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="720" height="240" viewBox="0 0 720 240"><rect width="720" height="240" fill="#202621"/><g fill="none" stroke="#c4ed83" stroke-width="2" stroke-dasharray="8 6"><path d="M40 200 180 60 290 170 430 40 680 200Z"/><path d="M40 200H680"/></g><circle cx="590" cy="55" r="22" fill="#e6d99b"/></svg>');
  function notify(text: string) { message = text; toastOpen = true; }
</script>

<svelte:head><title>Svelte ASCII UI — компоненты</title><meta name="description" content="Живая витрина компонентов Svelte ASCII UI: размеры, состояния, формы и примеры." /></svelte:head>

<Theme {palette}>
  <div class="gallery" lang="ru">
    <div class="background" aria-hidden="true"><Background {paused} cellWidth={14} cellHeight={14} speed={.35} color="#70cfff" opacity={.2} fps={12} pattern={backgroundPattern} /></div>
    <a class="skip" href="#components">К компонентам</a>
    <header class="intro">
      <p>S V E L T E / A S C I I / U I</p>
      <h1>Символы. Система.</h1>
      <p>Компоненты библиотеки в трёх размерах. Одинаковые API, доступность и состояния в приложении и в Storybook.</p>
      <div class="settings">
        <Field label="Палитра">{#snippet children(control)}<Select {...control} size="m" showPlaceholder={false} value={palette} onchange={event => palette = event.currentTarget.value as Palette} options={[{value:'phosphor',label:'Phosphor'},{value:'paper',label:'Paper'},{value:'plum',label:'Plum'}]} />{/snippet}</Field>
        <Switch size="m" label="Приостановить фон" bind:checked={paused} />
      </div>
      <nav aria-label="Разделы витрины" class="links">
        {#each sizes as size (size)}<Link href={`#size-${size}`} label={`Размер ${size.toUpperCase()}`} />{/each}
        <Link href="#updates" label="Новые возможности" />
        <Link href="#overlays" label="Окна и навигация" /><Link href="#article" label="Текст и изображения" />
      </nav>
    </header>

    <main id="components">
      <section id="updates" class="size-section" aria-labelledby="updates-title"><h2 id="updates-title">Новые возможности</h2><UpdatesExample {palette} /></section>
      {#each sizes as size (size)}
        <section id={`size-${size}`} class="size-section" aria-labelledby={`heading-${size}`}>
          <h2 id={`heading-${size}`}>Размер {size.toUpperCase()}</h2>
          <Theme {palette} {size}>
            <div class="grid">
              <Panel {size} title="Действия">
                <div class="stack">
                  <div class="row"><Button {size} label="Создать" icon="plus" variant="primary" onclick={() => notify('Новая подборка создана.')} /><Button {size} label="Обновить" icon="refresh" onclick={() => notify('Данные обновлены.')} /><IconButton {size} label="Информация о подборке" icon="info" onclick={() => notify('Подборки объединяют материалы по теме.')} /></div>
                  <div class="row"><Button {size} label="Удалить" variant="danger" onclick={() => dialogOpen = true} /><Button {size} label="Недоступно" disabled /><Button {size} label="Сохранение" loading /></div>
                  <Button {size} label="Сохранить подборку и продолжить редактирование" fullWidth onclick={() => notify('Изменения сохранены.')} />
                  <Link {size} button href="#article" label="Перейти к статье" />
                </div>
              </Panel>
              <Panel {size} title="Новая подборка">
                <div class="stack">
                  <Field label="Название" hint="Название видно другим участникам.">{#snippet children(control)}<Input {...control} {size} value="Книги на выходные" />{/snippet}</Field>
                  <Field label="Коллекция">{#snippet children(control)}<Select {...control} {size} {options} value="personal" />{/snippet}</Field>
                  <Field label="Количество материалов">{#snippet children(control)}<NumberInput {...control} {size} value={12} min={0} max={100} incrementLabel="Добавить материал" decrementLabel="Убрать материал" />{/snippet}</Field>
                  <Field label="Электронная почта редактора" error="Укажите полный адрес.">{#snippet children(control)}<Input {...control} {size} type="email" value="reader@" />{/snippet}</Field>
                  <Field label="Описание">{#snippet children(control)}<Textarea {...control} {size} placeholder="Что объединяет эти материалы?" rows={3} />{/snippet}</Field>
                </div>
              </Panel>
              <Panel {size} title="Выбор и фильтры">
                <div class="stack">
                  <Field label="Поиск">{#snippet children(control)}<SearchInput {...control} {size} placeholder="Найти материал" clearLabel="Очистить" />{/snippet}</Field>
                  <Field label="Коллекция с поиском">{#snippet children(control)}<Combobox {...control} {size} {options} value="personal" placeholder="Выберите коллекцию" />{/snippet}</Field>
                  <Field label="Несколько коллекций">{#snippet children(control)}<MultiSelect {...control} {size} {options} value={['personal']} placeholder="Добавьте коллекцию" />{/snippet}</Field>
                  <Field label="Метки">{#snippet children(control)}<TagInput {...control} {size} value={['книги']} addLabel="Добавить" removeLabel="Удалить" />{/snippet}</Field>
                  <Field label="Загрузка вариантов">{#snippet children(control)}<Select {...control} {size} options={[]} loading placeholder="Загрузка…" />{/snippet}</Field>
                </div>
              </Panel>
              <Panel {size} title="Настройки">
                <div class="stack">
                  <Checkbox {size} label="Получать уведомления об изменениях" />
                  <Checkbox {size} label="Выбрана часть материалов" indeterminate />
                  <Checkbox {size} label="Архив недоступен для изменения" checked disabled />
                  <Switch {size} label="Автоматически сохранять изменения" checked />
                  <RadioGroup {size} name={`mode-${size}`} label="После сохранения" options={modes} value="draft" />
                  <ToggleGroup {size} label="Представление" options={[{value:'list',label:'Список'},{value:'cards',label:'Карточки'}]} value="list" />
                </div>
              </Panel>
              <Panel {size} title="Значения и файлы">
                <div class="stack">
                  <Field label="Контраст">{#snippet children(control)}<Slider {...control} {size} value={50} marks />{/snippet}</Field>
                  <Range {size} label="Диапазон" lowerLabel="От" upperLabel="До" lower={20} upper={80} marks />
                  <Field label="Пароль">{#snippet children(control)}<PasswordInput {...control} {size} value="secret-example" />{/snippet}</Field>
                  <FileInput {size} aria-label="Прикрепить файл" chooseLabel="Выбрать файл" emptyText="Файл не выбран" clearLabel="Убрать" />
                  <Progress {size} value={progress} label="Подготовка файлов" />
                  <div class="row"><IconButton {size} label="Уменьшить прогресс" icon="minus" disabled={progress <= 0} onclick={() => progress = Math.max(0,progress-.01)} /><span>{Math.round(progress*100)}%</span><IconButton {size} label="Увеличить прогресс" icon="plus" disabled={progress >= 1} onclick={() => progress = Math.min(1,progress+.01)} /><Loader {size} /></div>
                </div>
              </Panel>
              <Panel {size} title="Обратная связь">
                <div class="stack">
                  <div class="row"><Badge {size} label="Черновик" /><Badge {size} label="Сохранено" tone="success" /><Badge {size} label="Ошибка" tone="danger" /></div>
                  <Alert {size} title="Изменения сохранены" message="Можно продолжить редактирование." tone="success" />
                  <Alert {size} title="Не удалось сохранить" message="Проверьте соединение и повторите попытку." tone="danger" />
                  <Skeleton {size} width="80%" /><Skeleton {size} width="100%" /><Skeleton {size} width="65%" />
                  <EmptyState title="Материалов пока нет" description="Добавьте первый материал в эту подборку." />
                </div>
              </Panel>
            </div>
          </Theme>
        </section>
      {/each}

      <section id="overlays" class="size-section" aria-labelledby="overlays-title">
        <h2 id="overlays-title">Окна, навигация и состояния</h2>
        <div class="grid">
          <Panel title="Окна и подсказки">
            <div class="stack">
              <Toolbar label="Открыть пример"><Button label="Открыть диалог" onclick={() => dialogOpen=true} /><Button label="Боковая панель" onclick={() => drawerOpen=true} /><Tooltip label="Подсказка" text="Подсказка доступна при наведении, фокусе и нажатии." /></Toolbar>
              <Popover label="Настройки отображения" title="Отображение">{#snippet children(close)}<div class="stack"><Checkbox label="Показывать архив" /><Button label="Готово" onclick={close} /></div>{/snippet}</Popover>
              <DropdownMenu label="Действия с подборкой" items={menu} onselect={item => notify(`Выбрано: ${item.label}`)} />
              <ContextMenu label="Контекстные действия" buttonLabel="Открыть меню" items={menu} onselect={item => notify(`Выбрано: ${item.label}`)}><p>Контекстное меню также открывается правой кнопкой мыши.</p></ContextMenu>
            </div>
          </Panel>
          <Panel title="Навигация">
            <div class="stack">
              <Breadcrumbs items={[{label:'Библиотека',href:'#components'},{label:'Подборки',href:'#size-m'},{label:'Книги',current:true}]} />
              <Tabs label="Разделы подборки" items={[{id:'materials',label:'Материалы'},{id:'members',label:'Участники'},{id:'history',label:'История'}]}>{#snippet panel(tab)}<p>{tab.label}: содержимое выбранного раздела.</p>{/snippet}</Tabs>
              <Pagination bind:page totalPages={7} />
              <Accordion items={[{id:'visibility',title:'Кто видит подборку?',content:'Участники, которым вы предоставили доступ.'},{id:'archive',title:'Можно ли восстановить архив?',content:'Архивные материалы можно вернуть в активную подборку.'}]} />
              <Collapsible title="Дополнительные настройки"><p>Здесь можно разместить дополнительные поля приложения.</p></Collapsible>
            </div>
          </Panel>
          <Panel title="Состояния данных"><div class="stack"><DataState state="loading" /><Separator /><DataState state="error" message="Сервер временно недоступен." onretry={() => notify('Повторная попытка отправлена.')} /></div></Panel>
        </div>
      </section>

      <section id="article" class="size-section article-example" aria-labelledby="article-title">
        <h2 id="article-title">Текст и изображения</h2>
        <Article>
          <h1>Место для хороших историй</h1>
          <p>У статьи нет размеров S/M/L. Заголовки, абзацы и подписи образуют собственную иерархию, а ширину задаёт страница.</p>
          <h2>Небольшие детали</h2>
          <p>Обычный текст, <strong>выделенная мысль</strong> и <a href="#components">ссылка на компоненты</a> используют общую тему.</p>
          <Quote text="Хорошая система оставляет место содержанию." author="Редактор" />
          <Callout title="Важно" message="Настройки темы и компоненты остаются одинаковыми во всех разделах приложения." />
          <Figure src={image} alt="Схематичные горные вершины и солнце на тёмном фоне" caption="Пример изображения с подписью. Нажмите, чтобы увеличить." expandable />
        </Article>
      </section>
      <div class="toast-area"><Toast bind:open={toastOpen} {message} tone="success" /></div>
    </main>

    <Dialog bind:open={dialogOpen} title="Начать с чистого листа?" closeLabel="Закрыть диалог">
      <p>Это пример диалога подтверждения. Материалы в этой витрине не удаляются.</p>
      {#snippet footer()}<Button label="Отмена" onclick={() => dialogOpen=false} /><Button label="Подтвердить" variant="danger" onclick={() => {dialogOpen=false;notify('Действие подтверждено.');}} />{/snippet}
    </Dialog>
    <Drawer bind:open={drawerOpen} title="Настройки подборки" closeLabel="Закрыть панель">
      <div class="stack"><Field label="Название">{#snippet children(control)}<Input {...control} value="Книги на выходные" />{/snippet}</Field><Switch label="Открытый доступ" /><Checkbox label="Сообщать об изменениях" checked /></div>
      {#snippet footer()}<Button label="Сохранить" variant="primary" onclick={() => {drawerOpen=false;notify('Настройки сохранены.');}} />{/snippet}
    </Drawer>
    <footer class="page-footer"><a href={iconLicense} target="_blank" rel="noreferrer">Pixelarticons · MIT</a><span>Svelte ASCII UI · Monocraft</span><a href={fontLicense}>Лицензия шрифта · SIL OFL 1.1</a></footer>
  </div>
</Theme>

<style>
  :global(body) { margin: 0; }
  .gallery { position: relative; isolation: isolate; min-height: 100vh; padding: clamp(16px,4vw,48px); background: var(--bg); }
  .background { position: fixed; inset: 0; z-index: -1; pointer-events: none; }
  .intro { max-width: 76rem; margin: 0 auto 3rem; }
  h1 { font-size: clamp(1.8rem,4vw,3rem); line-height: 1.3; }
  h2 { font-size: 1.5rem; margin: 0 0 1.25rem; }
  p { line-height: 1.7; }
  .settings { display: flex; align-items: center; flex-wrap: wrap; gap: 1.5rem; margin-block: 2rem; }
  .links, .row { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; }
  main { max-width: 100rem; margin-inline: auto; }
  .size-section { margin-block: 3rem; scroll-margin-top: 1rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(min(100%,25rem),1fr)); gap: 1.5rem; align-items: start; }
  .stack { display: grid; gap: 1rem; min-width: 0; }
  .article-example { max-width: 68ch; margin-inline: auto; }
  .toast-area { position: fixed; inset-inline: 1rem; bottom: 1rem; max-width: 36rem; margin-inline: auto; z-index: 5; }
  .page-footer { max-width: 100rem; margin: 4rem auto 0; display: flex; flex-wrap: wrap; gap: 1rem; justify-content: space-between; color: var(--muted); }
  .page-footer a { color: var(--accent); }
  .skip { position: absolute; top: 0; left: 1rem; transform: translateY(-150%); padding: .75rem; background: var(--bg); color: var(--text); z-index: 10; }
  .skip:focus { transform: none; }
</style>
