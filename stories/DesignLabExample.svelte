<script lang="ts">
  import { Badge, Button, Checkbox, Field, Input, Panel, Progress, Separator, Theme } from '../src/lib';
  import type { Palette, Size } from '../src/lib';
  import { asciiFrame, palettes } from '../src/lib/theme';

  let { palette = 'phosphor', concern = 'density', size = 's' }: {
    palette?: Palette;
    concern?: 'density' | 'surfaces' | 'composition';
    size?: Size;
  } = $props();
  let message = $state('');
  // Private helper used only for this authorized story experiment.
  const experimentalFrame = $derived(asciiFrame(palettes[palette].muted, 1, 1.4));
  const experimentalAccent = $derived(asciiFrame(palettes[palette].accent, 1, 1.4));
  const densities = [
    { id: 'baseline-s', title: 'Current S', size: 's', detail: '12px between fields. Public defaults.' },
    { id: 'baseline-m', title: 'Current M', size: 'm', detail: '24px between fields. Public defaults.' },
    { id: 'spacing', title: 'Experiment: spacing only', size: 's', detail: '8px between fields; same S controls and frames.' },
    { id: 'frame', title: 'Experiment: compact frame', size: 's', detail: 'Same 12px gaps. 6px layout inset, 9px ASCII artwork, stronger ink; same text size.' },
  ] as const;
  const surfaces = [
    { id: 'transparent', title: 'Current surfaces', detail: 'Transparent primary action and progress; field uses background.' },
    { id: 'primary', title: 'Experiment: primary tint', detail: 'Only the primary action gains a subtle accent fill.' },
    { id: 'field-track', title: 'Experiment: field + track', detail: 'Only the field and progress gain a surface fill.' },
  ] as const;
</script>

<Theme {palette}>
  <main class="design-lab" style:--lab-frame={experimentalFrame} style:--lab-accent={experimentalAccent}>
    <header>
      <p class="eyebrow">Composition lab / {concern}</p>
      <h1>{concern === 'density' ? 'Density without losing the ASCII grid' : concern === 'surfaces' ? 'Compare surface roles independently' : 'Make a score understandable'}</h1>
      <p class="intro">{concern === 'composition' ? 'A supported recipe using public components. Labels explain the value, scale and status.' : 'Experimental treatments are local to this story. They are comparisons, not supported theme options or proposed new defaults.'}</p>
    </header>

    {#if concern === 'density'}
      <div class={['comparison', concern]}>
        {#each densities as sample (sample.id)}
          <section class={['sample', sample.id]} aria-label={sample.title}>
            <h2>{sample.title}</h2>
            <p class="description">{sample.detail}</p>
            <Panel size={sample.size}>
              <form class={['sample-form', sample.size]} onsubmit={(event) => { event.preventDefault(); message = sample.title + ': preferences applied.'; }}>
                <h3>Reading preferences</h3>
                <Field label="Collection name">
                  {#snippet children(control)}<Input {...control} size={sample.size} defaultValue="Weekend reading" />{/snippet}
                </Field>
                <Field label="Notification email">
                  {#snippet children(control)}<Input {...control} size={sample.size} type="email" placeholder="reader@example.com" />{/snippet}
                </Field>
                <Checkbox size={sample.size} label="Include archived items" />
                <Button size={sample.size} type="submit" variant="primary" label="Apply preferences" />
              </form>
            </Panel>
          </section>
        {/each}
      </div>
      <p class="note">Compare frame space separately from layout gaps. Text stays readable; touch controls keep a 44px minimum. S and M retain their public names and meanings.</p>
    {:else if concern === 'surfaces'}
      <div class={['comparison', concern]}>
        {#each surfaces as sample (sample.id)}
          <section class={['sample', sample.id]} aria-label={sample.title}>
            <h2>{sample.title}</h2>
            <p class="description">{sample.detail}</p>
            <Panel {size}>
              <div class={['sample-form', { m: size === 'm' }]}>
                <Field label="Archive name">
                  {#snippet children(control)}<Input {...control} {size} defaultValue="Reading archive" />{/snippet}
                </Field>
                <Button {size} variant="primary" label="Save archive" onclick={() => message = sample.title + ': archive saved.'} />
                <div>
                  <p>Importing records · 60%</p>
                  <Progress {size} value={0.6} label="Importing records" />
                </div>
              </div>
            </Panel>
          </section>
        {/each}
      </div>
      <p class="note">Use Storybook's palette control for phosphor, paper and plum. A primary button and a progress track serve different purposes; one fill rule need not govern both.</p>
    {:else}
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
        <p class="note">This is a measured value, not task progress. A labelled number is sufficient here; use a labelled native meter when a bounded graphical measurement is useful. Reserve Progress for completion of work.</p>
      </div>
    {/if}
    <p class="status" role="status">{message}</p>
  </main>
</Theme>

<style>
  .design-lab { padding: clamp(12px, 3vw, 32px); background: var(--bg); min-block-size: 100vh; }
  header { margin-block-end: 28px; }
  h1 { font-size: 1.5rem; line-height: 1.4; margin: 8px 0; }
  h2, h3 { font-size: 1rem; line-height: 1.5; margin: 0; }
  p { margin: 0; }
  .eyebrow, .description, .note { color: var(--muted); }
  .eyebrow { font-size: .875rem; }
  .intro { max-inline-size: 74ch; }
  .comparison { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 19rem), 1fr)); gap: 24px; align-items: start; }
  .comparison.density { grid-template-columns: repeat(auto-fit, minmax(min(100%, 26rem), 1fr)); }
  .sample { min-inline-size: 0; }
  .description { margin-block: 8px 16px; font-size: .875rem; }
  .sample-form { display: grid; gap: 12px; }
  .sample-form.m { gap: 24px; }
  .spacing .sample-form { gap: 8px; }
  .note { margin-block-start: 24px; max-inline-size: 80ch; font-size: .875rem; }
  .status { margin-block-start: 16px; }
  .recipe { max-inline-size: 48rem; }
  .score-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
  .score { margin-block: 8px; }
  .score strong { font-size: 2rem; line-height: 1.2; }
  .score span { color: var(--muted); }
  dl { margin: 16px 0 0; display: grid; gap: 16px; }
  dt { color: var(--muted); font-size: .875rem; }
  dd { margin: 0; overflow-wrap: anywhere; }

  /* Authorized design experiment only. These internal selectors are not a consumer recipe. */
  .frame :global(.aui-frame),
  .frame :global(input.aui-control),
  .frame :global(.aui-button) { --control-frame: 6px; border-image-width: 9px; }
  .frame :global(input.aui-control),
  .frame :global(.aui-button) { border-image-source: var(--lab-frame); }
  .frame :global(.aui-button[data-variant='primary']),
  .frame :global(input.aui-control:hover) { border-image-source: var(--lab-accent); }
  .frame :global(input.aui-control:focus-visible),
  .frame :global(.aui-button:focus-visible) { border-image-source: var(--ascii-focus); outline: 2px dashed var(--accent); outline-offset: 3px; }
  .primary :global(.aui-button[data-variant='primary']:not(:hover):not(:focus-visible)) { background: color-mix(in srgb, var(--accent) 10%, var(--bg)); }
  .field-track :global(input.aui-control:not(:hover):not(:focus-visible)),
  .field-track :global(.ascii-progress) { background: var(--surface); }
  @media (forced-colors: active) {
    .frame :global(.aui-frame),
    .frame :global(input.aui-control),
    .frame :global(.aui-button) { border-image: none; }
    .frame :global(input.aui-control:focus-visible),
    .frame :global(.aui-button:focus-visible) { outline-color: Highlight; }
    .primary :global(.aui-button[data-variant='primary']:not(:hover):not(:focus-visible)),
    .field-track :global(input.aui-control:not(:hover):not(:focus-visible)),
    .field-track :global(.ascii-progress) { background: Canvas; }
  }
</style>
