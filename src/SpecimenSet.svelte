<!-- Experimental specimen set. Each size has independent state and IDs. -->
<script lang="ts">
  import { onDestroy } from 'svelte';
  import AsciiLoader from './AsciiLoader.svelte';
  import FileInputDemo from './FileInputDemo.svelte';
  import FormExamples from './FormExamples.svelte';
  import OverlayExamples from './OverlayExamples.svelte';
  import ExtendedExamples from './ExtendedExamples.svelte';
  import ButtonWithIcon from './ButtonWithIcon.svelte';
  import AsciiDialog from './AsciiDialog.svelte';
  import AsciiSlider from './AsciiSlider.svelte';
  import AsciiProgress from './lib/feedback/Progress.svelte';
  let { componentSize }: { componentSize: 's' | 'm' } = $props();
  let name = $state('Новая коллекция');
  let contrast = $state(64);
  let checked = $state(true);
  let notifications = $state(false);
  let radio = $state('auto');
  let progressValue = $state(64);
  let format = $state('PNG');
  let tab = $state('components');
  let status = $state('Готов к экспериментам.');
  let paused = $state(false);
  let loading = $state(false);
  let loadingTimer: ReturnType<typeof setTimeout>;
  function loadDemo() {
    if (loading) return;
    loading = true;
    status = 'Загрузка примеров…';
    loadingTimer = setTimeout(() => { loading = false; status = 'Данные загружены. Это локальная демонстрация.'; }, 2200);
  }
  onDestroy(() => clearTimeout(loadingTimer));
  let dialogOpen = $state(false);
  const tabs = [{ key: 'components', label: 'Элементы' }, { key: 'states', label: 'Состояния' }, { key: 'type', label: 'Типографика' }];

  function tabKeyboard(event: KeyboardEvent) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let index = tabs.findIndex((item) => item.key === tab);
    index = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : -1) + 3) % 3;
    tab = tabs[index].key;
    document.getElementById(`${componentSize}-tab-${tab}`)?.focus();
  }
</script>
<section class="size-scope" data-size={componentSize} style:--loader-play={paused ? "paused" : "running"} aria-labelledby={`size-${componentSize}`}>
  <h2 class="size-heading" id={`size-${componentSize}`}>{componentSize.toUpperCase()} / {componentSize === 's' ? 'Компактные компоненты' : 'Обычные компоненты'}</h2>
  <p class="density-note">{componentSize === 's' ? 'S — компактная форма: меньше текст, высота элементов и интервалы.' : 'M — обычный размер: больше текст и свободнее расположение элементов.'} Диалог открывается в этом же размере.</p>
  <nav class="catalog-jumps" aria-label="Разделы образца">
    {#each [{id:'actions',label:'Кнопки'},{id:'forms-fields',label:'Формы'},{id:'forms-selection',label:'Выбор'},{id:'overlays',label:'Окна'},{id:'data-states',label:'Состояния'},{id:'navigation',label:'Навигация'},{id:'article',label:'Статья'},{id:'composed',label:'Редактор'}] as link (link.id)}<a href={link.id === 'article' ? '#article' : `#${componentSize}-${link.id}`}>{link.label}</a>{/each}
  </nav>
  <div class="catalog-shell" id={componentSize + "-catalog"}>
    <aside class="index"><span class="eyebrow">СОДЕРЖАНИЕ</span><a href={"#" + componentSize + "-actions"}>01 / Действия</a><a href={"#" + componentSize + "-inputs"}>02 / Ввод</a><a href={"#" + componentSize + "-choices"}>03 / Выбор</a><a href={"#" + componentSize + "-structure"}>04 / Структура</a><a href={"#" + componentSize + "-feedback"}>05 / Обратная связь</a><p>Один шрифт.<br />Одна сетка.<br />Много состояний.</p></aside>
    <div class="catalog">
      <section class="panel actions-panel" id={componentSize + "-actions"}>
        <div class="section-heading"><h2><span>01</span> Действия</h2><span class="kind">BUTTON / LINK</span></div>
        <p class="annotation">Нажми. Перейди. Попробуй с клавиатуры.</p>
        <div class="sample-row"><ButtonWithIcon class="primary" onclick={() => status = 'Коллекция создана. Это локальный пример.'}>{#snippet icon()}<svg viewBox="0 0 12 12" focusable="false" aria-hidden="true"><path d="M1 6h10M6 1v10" fill="none" stroke="currentColor" stroke-width="1.2" /></svg>{/snippet}Создать</ButtonWithIcon><button onclick={() => status = 'Изменения применены.'}>Применить</button><button class="quiet" onclick={() => status = 'Изменения отменены.'}>Отмена</button></div>
        <div class="state-grid"><div><span class="sample-label">HOVER · образец</span><button class="preview-hover" onclick={() => status = 'Образец наведения нажат.'}>Наведение</button></div><div><span class="sample-label">FOCUS · образец</span><button class="preview-focus" onclick={() => status = 'Образец фокуса нажат.'}>Фокус</button></div><div><span class="sample-label">DISABLED</span><button disabled>Недоступно</button></div></div>
        <div class="button-sizing-examples"><span class="sample-label">ШИРИНА ПО ТЕКСТУ</span><button onclick={() => status = 'Настройки применены ко всем изображениям.'}>Применить настройки ко всем изображениям</button><span class="sample-label">НА ВСЮ ШИРИНУ</span><button class="full-width" onclick={() => status = 'Изменения сохранены.'}>Сохранить изменения и продолжить <span aria-hidden="true">↗</span></button></div>
        <div class="sample-row icon-examples"><span class="sample-label">ICON BUTTON</span><button class="icon-button" aria-label="Добавить элемент" onclick={() => status = 'Элемент добавлен.'}><span aria-hidden="true">+</span></button><button class="icon-button" aria-label="Удалить элемент" onclick={() => dialogOpen = true}><span aria-hidden="true">×</span></button><button class="icon-button" aria-label="Недоступное действие" disabled><span aria-hidden="true">−</span></button></div><div class="sample-row bottom-row"><button class="danger" onclick={() => dialogOpen = true}>Удалить</button><button class="loading-button" aria-disabled="true" aria-busy="true"><AsciiLoader size={componentSize} /> Сохранение</button><a href={"#" + componentSize + "-structure"}>Смотреть дальше <span aria-hidden="true">↗</span></a></div>
      </section>

      <section class="panel" id={componentSize + "-inputs"}>
        <div class="section-heading"><h2><span>02</span> Поля ввода</h2><span class="kind">INPUT / FIELD</span></div>
        <div class="form-grid"><label>Название<input bind:value={name} placeholder="Название коллекции" /><span class="hint">Короткое, но узнаваемое.</span></label><label>Формат<select bind:value={format}><option>PNG</option><option>SVG</option><option>TXT</option></select><span class="hint">Нативный список.</span></label></div>
        <div class="form-grid"><label>Почта · пример ошибки<input type="email" value="hello@" aria-invalid="true" aria-describedby={componentSize + "-email-error"} /><span class="error-text" id={componentSize + "-email-error"}>! Укажите полный адрес.</span></label><label>Недоступное поле<input value="Только после публикации" disabled /><span class="hint">Состояние disabled.</span></label></div>
        <div class="async-examples">
          <button class="primary loading-button" aria-disabled={loading} aria-busy={loading} onclick={loadDemo}><span class="loading-slot">{#if loading}<AsciiLoader size={componentSize} />{:else}<span class="button-icon" aria-hidden="true">↻</span>{/if}</span>Обновить данные</button>
          <p class="hint">Запускает загрузку списка и поиск на 2 секунды.</p>
          <div class="form-grid">
            <label>Набор пресетов<span class="busy-field"><select disabled={loading} aria-busy={loading}><option>{loading ? 'Загрузка…' : 'Базовый набор'}</option>{#if !loading}<option>Пиксельный набор</option>{/if}</select>{#if loading}<span class="field-loader"><AsciiLoader size={componentSize} /></span>{/if}</span></label>
            <label>Поиск<span class="busy-field"><input type="search" placeholder="Название пресета" readonly={loading} aria-busy={loading} />{#if loading}<span class="field-loader"><AsciiLoader size={componentSize} /></span>{/if}</span></label>
          </div>
        </div>
        <label>Заметка<textarea rows="2" placeholder="С чего начнём следующий проект?"></textarea></label>
      </section>

      <section class="panel" id={componentSize + "-files"}>
        <div class="section-heading"><h2><span>03a</span> Файлы</h2><span class="kind">FILE INPUT</span></div>
        <FileInputDemo size={componentSize} />
      </section>
      <section class="panel" id={componentSize + "-choices"}>
        <div class="section-heading"><h2><span>03</span> Выбор и значения</h2><span class="kind">CONTROL</span></div>
        <div class="choice-columns"><fieldset><legend>Параметры</legend><label class="check-label"><input type="checkbox" bind:checked /> Сохранять пропорции</label><label class="check-label"><input type="checkbox" /> Прозрачный фон</label><label class="check-label"><input type="checkbox" disabled /> Экспериментальная функция</label></fieldset><fieldset><legend>Режим</legend><label class="check-label"><input type="radio" bind:group={radio} value="auto" /> Автоматический</label><label class="check-label"><input type="radio" bind:group={radio} value="manual" /> Ручной</label><label class="check-label"><input type="checkbox" role="switch" bind:checked={notifications} /> Уведомления</label></fieldset></div>
        <label class="range-label" for={componentSize + "-contrast"}><span>Контраст <output for={componentSize + "-contrast"}>{contrast}%</output></span></label>
        <AsciiSlider bind:value={contrast} id={componentSize + '-contrast'} size={componentSize} label="Контраст" />
        <details><summary>Вариант без шкалы</summary><AsciiSlider value={35} id={componentSize + '-bare-slider'} size={componentSize} label="Интенсивность" showMarks={false} /></details>
        <div class="status-strip"><span aria-hidden="true">└─</span> {radio === 'auto' ? 'Авто' : 'Ручной'} / {checked ? 'Пропорции сохранены' : 'Свободный размер'}</div>
      </section>

      <section class="panel" id={componentSize + "-structure"}>
        <div class="section-heading"><h2><span>04</span> Структура</h2><span class="kind">TABS / PANEL</span></div>
        <div class="tabs" role="tablist" aria-label="Пример вкладок">{#each tabs as item (item.key)}<button role="tab" id={`${componentSize}-tab-${item.key}`} aria-selected={tab === item.key} aria-controls={`${componentSize}-pane-${item.key}`} tabindex={tab === item.key ? 0 : -1} onkeydown={tabKeyboard} onclick={() => tab = item.key}>{item.label}</button>{/each}</div>
        <div class="tab-content" role="tabpanel" id={`${componentSize}-pane-${tab}`} aria-labelledby={`${componentSize}-tab-${tab}`} tabindex="0">
          {#if tab === 'components'}<div class="mini-panel"><span class="sample-label">ПАНЕЛЬ / ВЛОЖЕННАЯ ГРУППА</span><h3>Место для следующей идеи.</h3><p>Рамка объединяет. Отступ разделяет.<br />Заголовок задаёт порядок.</p><span class="badge">12 элементов</span> <span class="badge accent-badge">В работе</span></div>
          {:else if tab === 'states'}<div class="empty-state"><span aria-hidden="true">[ · · · ]</span><h3>Пока ничего нет</h3><p>Добавь первый элемент, чтобы начать.</p><button onclick={() => status = 'Первый элемент добавлен в демонстрации.'}>+ Добавить</button></div>
          {:else}<div class="type-sample"><h3>Аа Бб Вв / Aa Bb Cc</h3><p>0123456789 → ← ↗ + − ×</p><p>┌ ┐ └ ┘ ─ │ ├ ┤ ┬ ┴ ┼</p><p>Съешь ещё этих мягких французских булок.</p></div>{/if}
        </div>
        <details><summary>Как устроены разделители?</summary><p>Горизонтальные линии и углы поддерживают ритм текста. Декор не попадает в названия интерактивных элементов.</p></details>
      </section>

      <section class="panel feedback-panel" id={componentSize + "-feedback"}>
        <div class="section-heading"><h2><span>05</span> Обратная связь</h2><span class="kind">STATUS / DIALOG</span></div>
        <div class="loader-gallery">
          <div class="loader-heading"><h3>Загрузчик</h3><button onclick={() => paused = !paused} aria-pressed={paused}>{paused ? 'Продолжить анимацию' : 'Пауза анимации'}</button></div>
          <div class="loader-options"><div><AsciiLoader size={componentSize} /><span>Ротор / загрузка</span></div></div>
          <p class="hint">При уменьшении движения в настройках системы анимация останавливается.</p>
        </div>
        <div class="feedback-grid"><div><div class="notice"><span aria-hidden="true">[✓]</span><div><strong>Всё на своих местах</strong><p>Изменения сохранены. Можно продолжать.</p></div></div><div class="notice warning"><span aria-hidden="true">[!]</span><div><strong>Нужно немного внимания</strong><p>Проверь данные перед публикацией.</p></div></div></div><div class="progress-example"><div class="progress-title">Подготовка файлов <span>{progressValue} / 100</span></div><AsciiProgress value={progressValue / 100} label="Подготовка файлов" /><p class="hint">Шаг 1% · решётки заполняют ширину без промежутков</p><details class="progress-cases"><summary>Граничные значения прогресса</summary><p class="hint">0%</p><AsciiProgress value={0} label="Прогресс 0 процентов" /><p class="hint">5% · частичный символ</p><AsciiProgress value={0.05} label="Прогресс 5 процентов" /><p class="hint">100% · узкий контейнер</p><div class="narrow-progress"><AsciiProgress value={1} label="Прогресс 100 процентов" /></div></details><div class="sample-row"><button class="icon-button" onclick={() => progressValue = Math.max(0, progressValue - 1)} disabled={progressValue === 0} aria-label="Уменьшить загрузку"><span aria-hidden="true">−</span></button><button class="icon-button" onclick={() => progressValue = Math.min(100, progressValue + 1)} disabled={progressValue === 100} aria-label="Увеличить загрузку"><span aria-hidden="true">+</span></button><button onclick={() => dialogOpen = true}>Открыть диалог <span aria-hidden="true">↗</span></button></div></div></div>
      </section>
      <FormExamples size={componentSize} />
      <OverlayExamples size={componentSize} />
      <ExtendedExamples size={componentSize} />
    </div>
  </div>

  <p class="demo-status" role="status">&gt; {status}</p>
  <AsciiDialog bind:open={dialogOpen} title="Начать с чистого листа?" size="s">
    {#snippet header()}<span class="hint">CONFIRM / 001</span>{/snippet}
    <p>Это пример диалога. Настоящие данные останутся на месте.</p>
    {#snippet footer()}<button onclick={() => dialogOpen = false}>Оставить</button><button class="primary" onclick={() => { status = 'Действие подтверждено. Данные не удалялись.'; dialogOpen = false; }}>Подтвердить</button>{/snippet}
  </AsciiDialog>
</section>
