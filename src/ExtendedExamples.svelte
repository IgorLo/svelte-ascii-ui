<script lang="ts">
  import { onDestroy } from 'svelte';
  import AsciiSkeleton from './lib/feedback/Skeleton.svelte';
  import AsciiLoader from './AsciiLoader.svelte';
  import './extended-examples.css';
  let { size }: { size: 's' | 'm' } = $props();
  let panelState = $state('empty');
  let skeletonPaused = $state(false);
  let toast = $state('');
  let announcement = $state('');
  let page = $state(1);
  let bold = $state(false);
  let italic = $state(false);
  let draft = $state('Новая заметка о маленьких интерфейсах');
  let timer: ReturnType<typeof setTimeout>;
  function load() { clearTimeout(timer); panelState = 'loading'; timer = setTimeout(() => { panelState = 'ready'; announcement = 'Заметки загружены.'; }, 1500); }
  function setState(state: string) { clearTimeout(timer); panelState = state; }
  function notify() { toast = 'Черновик сохранён'; announcement = toast; }
  onDestroy(() => clearTimeout(timer));
</script>

<section class="panel feedback-panel extended-demo" id={`${size}-data-states`}>
  <div class="section-heading"><h2>Состояния данных</h2><span class="kind">EMPTY / ERROR / LOADING</span></div>
  <div class="sample-row">{#each [{key:'empty',name:'Пусто'},{key:'loading',name:'Первая загрузка'},{key:'updating',name:'Обновление'},{key:'error',name:'Ошибка'},{key:'ready',name:'Данные'}] as item (item.key)}<button aria-pressed={panelState === item.key} onclick={() => setState(item.key)}>{item.name}</button>{/each}</div>
  <div class="state-preview" aria-busy={panelState === 'loading' || panelState === 'updating'}>
    {#if panelState === 'empty'}<div class="empty-state"><span aria-hidden="true">[ · ]</span><h3>Пока нет заметок</h3><p>Создайте первую — она появится здесь.</p><button onclick={() => {panelState='ready'; announcement='Первая заметка создана.';}}>+ Создать заметку</button></div>
    {:else if panelState === 'error'}<div class="notice warning"><span aria-hidden="true">[!]</span><div><h3>Не удалось загрузить заметки</h3><p>Содержимое сохранено. Попробуйте ещё раз.</p><button onclick={load}>Повторить</button></div></div>
    {:else if panelState === 'loading'}<p class="inline-status"><AsciiLoader {size} /> Загрузка заметок…</p><div class="skeleton-example"><AsciiSkeleton {size} width="72%" height="1.5em" paused={skeletonPaused} /><AsciiSkeleton {size} width="100%" paused={skeletonPaused} /><AsciiSkeleton {size} width="85%" paused={skeletonPaused} /></div>
    {:else}{#if panelState === 'updating'}<p class="inline-status"><AsciiLoader {size} /> Обновление… Старые данные доступны.</p>{/if}<h3>Маленькие интерфейсы</h3><p>Три заметки о типографике, ритме и свободном месте.</p><span class="badge">Черновик</span>{/if}
  </div>
  <details class="skeleton-presets"><summary>Скелетон: строка, заголовок и блок</summary><div class="skeleton-example"><AsciiSkeleton {size} width="80%" paused={skeletonPaused} /><AsciiSkeleton {size} width="60%" height="2em" paused={skeletonPaused} /><AsciiSkeleton {size} height="80px" paused={skeletonPaused} /></div><p class="hint">Ширина и высота задаются там, где используется placeholder.</p></details>
  <button aria-pressed={skeletonPaused} onclick={() => skeletonPaused = !skeletonPaused}>{skeletonPaused ? 'Продолжить волну' : 'Пауза волны'}</button>
  <div class="sample-row"><button onclick={notify}>Показать toast</button><span class="hint">Уведомление остаётся до закрытия.</span></div>
  <p class="sr-only" role="status">{announcement}</p>
  {#if toast}<div class="demo-toast"><span>[✓] {toast}</span><button class="icon-button" aria-label="Закрыть уведомление" onclick={() => toast=''}><span aria-hidden="true">×</span></button></div>{/if}
</section>

<section class="panel extended-demo" id={`${size}-navigation`}>
  <div class="section-heading"><h2>Навигация и раскрытие</h2><span class="kind">BREADCRUMBS / PAGES</span></div>
  <nav aria-label="Хлебные крошки"><ol class="breadcrumbs"><li><a href="#catalog">Библиотека</a></li><li><a href="#article">Заметки</a></li><li aria-current="page">Типографика</li></ol></nav>
  <p>Страница {page} из 5 · Заметки {page * 3 - 2}–{page * 3}</p>
  <nav class="sample-row pagination" aria-label="Страницы заметок"><button disabled={page===1} onclick={() => page--}>Назад</button>{#each [1,2,3,4,5] as n (n)}<button aria-label={`Страница ${n}`} aria-current={page === n ? 'page' : undefined} onclick={() => page=n}>{n}</button>{/each}<button disabled={page===5} onclick={() => page++}>Далее</button></nav>
  <h3>Аккордеон: разделы одной группы</h3>
  {#each ['Как выбрать плотность?', 'Когда показывать подсказку?', 'Как работает фокус?'] as title, i (title)}<details name={`${size}-accordion`}><summary>{title}</summary><p>{['S подходит для плотных форм. M — для основного содержимого. Размеры можно смешивать по задаче.', 'Короткий пример рядом с полем объясняет формат. Ошибка сообщает, что исправить.', 'Tab переносит фокус между элементами. Толстая рамка показывает текущий элемент.'][i]}</p></details>{/each}
  <h3>Collapsible: независимый блок</h3><details><summary>Показать технические подробности</summary><p>Этот блок раскрывается отдельно от аккордеона. Подходит для необязательных пояснений.</p></details>
</section>



<section class="panel feedback-panel extended-demo" id={`${size}-composed`}>
  <div class="section-heading"><h2>Составной пример: редактор</h2><span class="kind">LAYOUT / TOOLBAR</span></div>
  <div class="editor-example"><aside><h3>Настройки заметки</h3><label>Название<input bind:value={draft} /></label><label class="check-label"><input type="checkbox" checked /> Показывать дату</label><p class="hint">Боковая панель на узком экране становится верхним блоком.</p></aside><div><div class="sample-row" role="group" aria-label="Форматирование текста"><button aria-pressed={bold} onclick={() => bold=!bold}>Жирный</button><button aria-pressed={italic} onclick={() => italic=!italic}>Курсив</button><button class="primary" onclick={notify}>Сохранить</button></div><p class="hint">Toolbar — группа действий над текущим содержимым.</p><div class="editor-preview" style:font-weight={bold ? '700' : '400'} style:font-style={italic ? 'italic' : 'normal'}>{draft || 'Без названия'}</div></div></div>
  <details><summary>Как собирать другие экраны?</summary><p>Панель фильтров + список + пагинация; форма + модальное окно + закреплённые действия; статья + иллюстрации + примечания. Разделяемые панели пока оставляем правилом компоновки: minmax(0, 1fr), ограничение минимальной ширины и переход в одну колонку на телефоне. Перетаскивание границ в этот прототип не входит.</p></details>
</section>
