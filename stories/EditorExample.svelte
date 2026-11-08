<script lang="ts">
  import { Button, Panel, Field, Input, Textarea, Select, TagInput, Checkbox, Alert, DataState } from '../src/lib';
  let { size = 's' }: { size?: 's' | 'm' } = $props();
  let title = $state('Ночь в терминале');
  let body = $state('Тихие волны символов на фоне. Несколько строк о новом проекте.');
  let tags = $state(['ASCII', 'Заметки']);
  let saving = $state(false);
  let saved = $state(false);
  let fail = $state(false);
  let error = $state(false);
  async function save() {
    saving = true; saved = false; error = false;
    await new Promise(resolve => setTimeout(resolve, 700));
    saving = false; error = fail; saved = !fail;
  }
</script>

<div class="editor">
  <Panel title="Редактор заметки" {size}>
    <form onsubmit={(event) => { event.preventDefault(); void save(); }}>
      <Field label="Заголовок" required requiredText="*">
        {#snippet children(control)}<Input {...control} {size} bind:value={title} required name="title" />{/snippet}
      </Field>
      <Field label="Текст" hint="Форматирование определяется вашим редактором.">
        {#snippet children(control)}<Textarea {...control} {size} bind:value={body} rows={5} />{/snippet}
      </Field>
      <Field label="Публикация">
        {#snippet children(control)}<Select {...control} {size} options={[{value:'draft',label:'Черновик'},{value:'public',label:'Опубликовано'}]} value="draft" />{/snippet}
      </Field>
      <Field label="Теги">
        {#snippet children(control)}<TagInput {...control} {size} bind:value={tags} />{/snippet}
      </Field>
      <Checkbox {size} label="Имитировать ошибку сохранения" bind:checked={fail} />
      <div class="actions"><Button {size} type="submit" variant="primary" loading={saving} label="Сохранить" /><span aria-live="polite">{saved ? 'Сохранено' : ''}</span></div>
      {#if error}<Alert title="Не удалось сохранить" message="Текст сохранён в форме. Попробуйте ещё раз." tone="danger" live />{/if}
    </form>
  </Panel>
  <DataState state={saving ? 'updating' : 'ready'}>
    <Panel title="Предпросмотр" {size}><h2>{title}</h2><p>{body}</p><small>{tags.join(' / ')}</small></Panel>
  </DataState>
</div>
<style>
  .editor { display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24px;max-width:1000px }
  form {display:grid;gap:16px} .actions{display:flex;align-items:center;gap:12px}
  h2{font-size:1.15em;font-weight:400}p{white-space:pre-wrap;overflow-wrap:anywhere}small{color:var(--muted)}
  @media(max-width:680px){.editor{grid-template-columns:minmax(0,1fr)}}
</style>
