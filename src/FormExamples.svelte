<!-- Throwaway form-state specimens. Native fields retain their browser behavior. -->
<script lang="ts">
  import { onDestroy } from 'svelte';
  import AsciiTooltip from './AsciiTooltip.svelte';
  import AsciiRange from './AsciiRange.svelte';
  import AsciiLoader from './AsciiLoader.svelte';
  import './form-examples.css';
  let { size }: { size: 's' | 'm' } = $props();
  const prefix = $derived(`${size}-forms`);
  let title = $state('');
  let submitted = $state(false);
  let notice = $state('');
  const titleError = $derived(submitted && !title.trim());
  let passwordVisible = $state(false);
  let password = $state('terminal-001');
  let quantity = $state<number | undefined>(3);
  let search = $state('');
  const fileNames = ['Обложка.png', 'Статья.md', 'Эскиз.svg'];
  let selectedFiles = $state(['Обложка.png', 'Статья.md']);
  const allFiles = $derived(selectedFiles.length === fileNames.length);
  const someFiles = $derived(selectedFiles.length > 0 && !allFiles);
  let tags = $state(['дизайн', 'ASCII']);
  let draftTag = $state('');
  let tagMessage = $state('');
  let tagInput: HTMLInputElement;
  let bold = $state(false);
  let italic = $state(false);
  let alignment = $state('left');
  let minimum = $state(20);
  let maximum = $state(80);
  let selectedTopics = $state(['Интерфейсы']);
  const topics = ['Интерфейсы', 'Типографика', 'Разработка'];
  const presets = [{ value: 'Терминал', disabled: false }, { value: 'Пиксели', disabled: false }, { value: 'Бумага', disabled: false }, { value: 'Экспериментальный', disabled: true }];
  let query = $state('');
  let chosen = $state('');
  let expanded = $state(false);
  let active = $state(-1);
  let selectState = $state<'ready' | 'loading' | 'empty' | 'error'>('ready');
  const matches = $derived(selectState === 'ready' ? presets.filter(item => item.value.toLocaleLowerCase().includes(query.toLocaleLowerCase())) : []);
  let retryTimer: ReturnType<typeof setTimeout>;
  function choose(value: string) { chosen = value; query = value; expanded = false; active = -1; notice = `Выбран пресет: ${value}.`; }
  function setScenario(state: typeof selectState) { clearTimeout(retryTimer); selectState = state; expanded = true; active = -1; query = ''; chosen = ''; }
  function retry() { setScenario('loading'); retryTimer = setTimeout(() => { selectState = 'ready'; notice = 'Список пресетов загружен.'; }, 1400); }
  function comboKey(event: KeyboardEvent) {
    if (event.key === 'Escape') { expanded = false; return; }
    if (event.key === 'Enter' && expanded && active >= 0) { event.preventDefault(); if (matches[active] && !matches[active].disabled) choose(matches[active].value); return; }
    if (!['ArrowDown','ArrowUp'].includes(event.key)) return;
    event.preventDefault(); expanded = true;
    const available = matches.map((item,index) => item.disabled ? -1 : index).filter(index => index >= 0);
    if (!available.length) return;
    const position = available.indexOf(active);
    active = available[position < 0 ? (event.key === 'ArrowDown' ? 0 : available.length - 1) : (position + (event.key === 'ArrowDown' ? 1 : -1) + available.length) % available.length];
  }
  function addTag(event: SubmitEvent) {
    event.preventDefault(); const value = draftTag.trim();
    if (!value) { tagMessage = 'Введите название тега.'; return; }
    if (tags.includes(value)) { tagMessage = 'Такой тег уже добавлен.'; return; }
    tags = [...tags, value]; draftTag = ''; tagMessage = `Добавлен тег ${value}.`;
  }
  function removeTag(value: string) { tags = tags.filter(tag => tag !== value); tagMessage = `Удалён тег ${value}.`; tagInput.focus(); }
  onDestroy(() => clearTimeout(retryTimer));
</script>

<section class="panel form-examples" id={`${prefix}-fields`}>
  <div class="section-heading"><h2>Поля и подсказки</h2><span class="kind">FIELD / VALIDATION</span></div>
  <form novalidate onsubmit={(event) => { event.preventDefault(); submitted = true; notice = title.trim() ? 'Название сохранено. Это пример.' : 'Заполните название статьи.'; if (!title.trim()) document.getElementById(`${prefix}-title`)?.focus(); }}>
    <AsciiTooltip label="Подсказка к названию" text="Название видно в списке заметок. Выберите короткую формулировку; её можно изменить позже." />
    <p class="hint">Tooltip: наведите курсор, перейдите Tab или нажмите [?]. Escape скрывает подсказку.</p>
    <label for={`${prefix}-title`}>Название статьи <span class="hint">(обязательно)</span></label>
    <input id={`${prefix}-title`} bind:value={title} required aria-invalid={titleError} aria-describedby={`${prefix}-title-hint ${prefix}-title-error`} placeholder="Например, дизайн буквами" />
    <p class="hint" id={`${prefix}-title-hint`}>Подсказка помогает до ошибки: коротко опишите тему статьи.</p>
    <p class="error-text" id={`${prefix}-title-error`}>{titleError ? '! Введите название статьи.' : ''}</p>
    <button type="submit">Проверить поле</button>
  </form>
  <div class="form-example-stack">
    <label for={`${prefix}-readonly`}>Адрес публикации · только чтение</label>
    <input id={`${prefix}-readonly`} value="/notes/first-post" readonly aria-describedby={`${prefix}-readonly-hint`} />
    <p class="hint" id={`${prefix}-readonly-hint`}>Readonly: текст можно выделить и скопировать, но нельзя изменить.</p>
    <label for={`${prefix}-password`}>Пароль</label>
    <div class="form-inline"><input id={`${prefix}-password`} type={passwordVisible ? 'text' : 'password'} bind:value={password} autocomplete="new-password" /><button type="button" aria-pressed={passwordVisible} aria-controls={`${prefix}-password`} onclick={() => passwordVisible = !passwordVisible}>{passwordVisible ? 'Скрыть' : 'Показать'}</button></div>
    <label for={`${prefix}-quantity`}>Количество · от 1 до 12</label>
    <div class="form-inline number-stepper"><button type="button" class="icon-button" aria-label="Уменьшить количество" disabled={quantity !== undefined && quantity <= 1} onclick={() => quantity = Math.max(1,(quantity ?? 1) - 1)}><span aria-hidden="true">−</span></button><input id={`${prefix}-quantity`} type="number" min="1" max="12" step="1" bind:value={quantity} onchange={() => quantity = Math.max(1, Math.min(12, Math.round(quantity ?? 1)))} /><button type="button" class="icon-button" aria-label="Увеличить количество" disabled={quantity !== undefined && quantity >= 12} onclick={() => quantity = Math.min(12,(quantity ?? 1) + 1)}><span aria-hidden="true">+</span></button></div>
    <label for={`${prefix}-search`}>Поиск с очисткой</label>
    <div class="form-inline"><input id={`${prefix}-search`} type="search" bind:value={search} placeholder="Введите запрос" /><button type="button" disabled={!search} onclick={() => { search = ''; document.getElementById(`${prefix}-search`)?.focus(); }}>Очистить</button></div>
  </div>
</section>

<section class="panel form-examples" id={`${prefix}-selection`}>
  <div class="section-heading"><h2>Выбор и фильтры</h2><span class="kind">COMBOBOX / STATES</span></div>
  <p class="hint">Поиск по списку: стрелки выбирают пункт, Enter подтверждает, Escape закрывает. «Экспериментальный» недоступен.</p>
  <div class="form-scenarios" aria-label="Состояние списка">{#each [{value:'ready',label:'Готов'}, {value:'loading',label:'Загрузка'}, {value:'empty',label:'Пусто'}, {value:'error',label:'Ошибка'}] as state (state.value)}<button type="button" aria-pressed={selectState === state.value} onclick={() => setScenario(state.value as typeof selectState)}>{state.label}</button>{/each}</div>
  <label for={`${prefix}-combo`}>Пресет с поиском</label>
  <div class="form-combo"><div class="combo-input-shell">
    <input id={`${prefix}-combo`} role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls={`${prefix}-options`} aria-activedescendant={expanded && active >= 0 ? `${prefix}-option-${active}` : undefined} aria-busy={selectState === 'loading'} aria-invalid={selectState === 'error'} aria-describedby={`${prefix}-combo-status`} bind:value={query} oninput={() => { expanded = true; active = -1; chosen = ''; }} onfocus={() => expanded = true} onblur={() => { expanded = false; active = -1; }} onkeydown={comboKey} placeholder="Начните вводить название" autocomplete="off" />
    {#if selectState === 'loading'}<span class="form-combo-loader"><AsciiLoader {size} /></span>{/if}
    </div>
    {#if expanded}
      <div class="form-options" id={`${prefix}-options`} role="listbox" aria-label="Пресеты">
        {#each matches as item, index (item.value)}<button type="button" role="option" tabindex="-1" id={`${prefix}-option-${index}`} aria-selected={chosen === item.value} aria-disabled={item.disabled} data-highlighted={active === index} onpointerdown={(event) => event.preventDefault()} onclick={() => { if (!item.disabled) choose(item.value); }}>{item.value}{item.disabled ? ' · недоступно' : ''}</button>{/each}
      </div>
    {/if}
  </div>
  <p class={selectState === 'error' ? 'error-text' : 'hint'} id={`${prefix}-combo-status`} role="status">{selectState === 'loading' ? 'Загружаем пресеты…' : selectState === 'error' ? '! Не удалось загрузить список.' : selectState === 'empty' ? 'Пока нет пресетов. Создайте первый.' : !matches.length ? 'Ничего не найдено. Попробуйте другой запрос.' : chosen ? `Выбран: ${chosen}` : `${matches.length} варианта. Для пустого результата введите «zzz».`}</p>
  {#if selectState === 'error'}<button type="button" onclick={retry}>Повторить загрузку</button>{/if}
  {#if selectState === 'empty'}<button type="button" onclick={() => { setScenario('ready'); notice = 'Создан демонстрационный набор пресетов.'; }}>Создать пресет</button>{/if}
  <fieldset class="form-example-stack"><legend>Несколько тем</legend>{#each topics as topic (topic)}<label class="check-label"><input type="checkbox" bind:group={selectedTopics} value={topic} />{topic}</label>{/each}<p class="hint">Выбрано: {selectedTopics.join(', ') || 'ничего'}.</p></fieldset>
  <label for={`${prefix}-native`}>Обычный select с недоступным пунктом</label><select id={`${prefix}-native`}><option>Черновик</option><option>Опубликовано</option><option disabled>По расписанию · недоступно</option></select>
</section>

<section class="panel form-examples" id={`${prefix}-groups`}>
  <div class="section-heading"><h2>Группы и частичный выбор</h2><span class="kind">CHECKBOX / TOGGLE</span></div>
  <p class="hint">Выбраны два файла из трёх. Минус в общем чекбоксе означает частичный выбор. Нажатие выбирает все файлы.</p>
  <label class="check-label form-select-all"><input type="checkbox" checked={allFiles} indeterminate={someFiles} onchange={(event) => selectedFiles = event.currentTarget.checked ? [...fileNames] : []} />Выбрать всё · {selectedFiles.length} / {fileNames.length}</label>
  <div class="form-nested">{#each fileNames as file (file)}<label class="check-label"><input type="checkbox" bind:group={selectedFiles} value={file} />{file}</label>{/each}</div>
  <fieldset class="form-example-stack"><legend>Форматирование · независимые переключатели</legend><div class="sample-row"><button type="button" aria-pressed={bold} onclick={() => bold = !bold}>Жирный</button><button type="button" aria-pressed={italic} onclick={() => italic = !italic}>Курсив</button></div><p style:font-weight={bold ? '700' : '400'} style:font-style={italic ? 'italic' : 'normal'}>Пример текста.</p></fieldset>
  <fieldset><legend>Выравнивание · один вариант</legend><div class="form-toggle-group">{#each [{value:'left',label:'Слева'}, {value:'center',label:'По центру'}, {value:'right',label:'Справа'}] as item (item.value)}<label class="check-label"><input type="radio" name={`${prefix}-alignment`} bind:group={alignment} value={item.value} />{item.label}</label>{/each}</div><p style:text-align={alignment as 'left' | 'center' | 'right'}>Предпросмотр</p></fieldset>
  <fieldset class="form-example-stack"><legend>Диапазон · {minimum}–{maximum}%</legend><AsciiRange bind:lower={minimum} bind:upper={maximum} {size} label="Диапазон" /><p class="hint">Два бегунка на одной шкале. Зелёным выделен выбранный интервал.</p></fieldset>
</section>

<section class="panel form-examples" id={`${prefix}-tags`}>
  <div class="section-heading"><h2>Теги</h2><span class="kind">TAG INPUT</span></div>
  <form onsubmit={addTag}><label for={`${prefix}-tag`}>Новый тег</label><div class="form-inline"><input bind:this={tagInput} id={`${prefix}-tag`} bind:value={draftTag} maxlength="32" aria-describedby={`${prefix}-tag-hint`} placeholder="Добавьте тему" /><button type="submit">Добавить</button></div><p class="hint" id={`${prefix}-tag-hint`}>Enter добавляет тег. Повторы не добавляются.</p></form>
  <ul class="form-tag-list">{#each tags as tag (tag)}<li><span>{tag}</span><button type="button" class="icon-button" aria-label={`Удалить тег ${tag}`} onclick={() => removeTag(tag)}><span aria-hidden="true">×</span></button></li>{/each}</ul>
  <p class="hint" role="status">{tagMessage}</p>
  <p class="hint" role="status">{notice}</p>
</section>
