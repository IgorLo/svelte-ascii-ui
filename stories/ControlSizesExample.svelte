<script lang="ts">
  import { Button, Checkbox, Field, Icon, IconButton, Input, NumberInput, Panel, RadioGroup, Select, Switch, Textarea, Theme } from '../src/lib';
  import type { Palette, Size } from '../src/lib';

  let { palette = 'phosphor' }: { palette?: Palette } = $props();
  let feedback = $state('');
  const sizes: { size: Size; title: string; description: string; gap: number }[] = [
    { size: 's', title: 'S · компактный', description: 'Текст 13 px, компактные поля и отступы.', gap: 10 },
    { size: 'm', title: 'M · стандартный', description: 'Текст 13 px, больше места внутри компонентов.', gap: 12 },
    { size: 'l', title: 'L · крупный', description: 'Текст 15 px, крупные элементы управления.', gap: 24 },
  ];
  const collections = [{ value: 'personal', label: 'Личная коллекция' }, { value: 'shared', label: 'Общая коллекция редакции' }];
  const modes = [{ value: 'draft', label: 'Сохранить как черновик' }, { value: 'review', label: 'Передать на проверку' }];
</script>

<Theme {palette}>
  <main lang="ru">
    <header>
      <h1>Размеры компонентов</h1>
      <p>Три размера одной системы. На сенсорном экране области нажатия увеличиваются, а текст полей на узком экране остаётся 16 px.</p>
    </header>
    <div class="sizes">
      {#each sizes as sample (sample.size)}
        <section aria-label={sample.title}>
          <h2>{sample.title}</h2>
          <p class="description">{sample.description}</p>
          <Theme {palette} size={sample.size}>
            <Panel size={sample.size} title="Новая подборка">
              <form style:gap={`${sample.gap}px`} onsubmit={(event) => { event.preventDefault(); feedback = `Размер ${sample.size.toUpperCase()}: подборка сохранена.`; }}>
                <Field label="Название подборки" hint="Название видно другим участникам.">
                  {#snippet children(control)}<Input {...control} size={sample.size} defaultValue="Книги на выходные" />{/snippet}
                </Field>
                <Field label="Коллекция">
                  {#snippet children(control)}<Select {...control} size={sample.size} options={collections} value="personal" />{/snippet}
                </Field>
                <Field label="Количество материалов">
                  {#snippet children(control)}<NumberInput {...control} size={sample.size} value={12} min={0} max={100} incrementLabel="Добавить материал" decrementLabel="Убрать материал" />{/snippet}
                </Field>
                <Field label="Электронная почта редактора" error="Укажите полный адрес.">
                  {#snippet children(control)}<Input {...control} size={sample.size} type="email" defaultValue="reader@" />{/snippet}
                </Field>
                <Field label="Описание">
                  {#snippet children(control)}<Textarea {...control} size={sample.size} rows={2} placeholder="Несколько слов о подборке" />{/snippet}
                </Field>
                <Checkbox size={sample.size} label="Получать уведомления об изменениях во всех выбранных коллекциях" />
                <Switch size={sample.size} label="Показывать архивные материалы" />
                <RadioGroup size={sample.size} name={`save-mode-${sample.size}`} label="После сохранения" options={modes} value="draft" />
                <div class="actions">
                  <Button size={sample.size} type="submit" variant="primary" label="Сохранить">
                    {#snippet icon()}<Icon name="plus" />{/snippet}
                  </Button>
                  <IconButton size={sample.size} label="Информация о подборке" icon="info" onclick={() => feedback = 'Подборка объединяет выбранные материалы.'} />
                </div>
                <Button size={sample.size} fullWidth label="Сохранить и отправить всем участникам редакции" />
                <div class="actions">
                  <Button size={sample.size} disabled label="Опубликовать" />
                  <Button size={sample.size} loading label="Проверка" />
                </div>
                <Select size={sample.size} aria-label="Загрузка коллекций" options={[]} loading />
              </form>
            </Panel>
          </Theme>
        </section>
      {/each}
    </div>
    <p class="feedback" role="status">{feedback}</p>
  </main>
</Theme>

<style>
  main { padding: clamp(12px, 2vw, 24px); }
  header { max-inline-size: 75ch; margin-block-end: 24px; }
  h1 { font-size: 1.5rem; margin-block: 0 12px; }
  h2 { font-size: 1.125rem; margin: 0; }
  p { margin: 0; }
  .sizes { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr)); gap: 24px; align-items: start; }
  section { min-inline-size: 0; }
  .description { color: var(--muted); margin-block: 8px 16px; font-size: .875rem; }
  form { display: grid; }
  .actions { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .feedback { margin-block-start: 16px; }
</style>
