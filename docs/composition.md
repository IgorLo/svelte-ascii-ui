# Composing dense forms, surfaces and numerical summaries

Use the public components with application-owned layout. The [design guide](design-system.md) defines the visual rules; the [consumer guide](agents/using.md) defines extension and ownership boundaries.

## Density: first separate spacing from control geometry

Choose S for compact groups, M for everyday controls and L for prominent actions. Pass the same size to related controls explicitly; a Theme size does not replace an individual component's size default. Start with 12px between compact groups and 24px between normal groups. Use a responsive grid that collapses without squeezing labels:

```css
.preferences {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 24px;
}
.field-group {
  display: grid;
  gap: 12px;
  min-width: 0;
}
```

Keep labels, hints and errors in Field and avoid wrapping every field in another Panel. A plain heading inside a Panel is often enough. Panel's title/header adds a divider and section spacing; use it for a distinct section rather than repeating it for each control.

S/M/L describe complete control treatments, not exact rendered heights. The ASCII border occupies layout space; content line height, font metrics and border widths can make a control taller than its minimum. A narrow layout also keeps text inputs at a readable font size, and coarse-pointer controls retain a 44px minimum. Keep spacing and control sizing separate; choose the supported size instead of overriding internal CSS.

Storybook **Foundation / Control sizes** presents S/M/L using the public components. S separates a 6px layout inset from 9px artwork to preserve recognizable dash and corner shapes. M uses a 9px frame, and L uses 12px. Review label wrapping, focus, touch targets and font changes in real compositions.

## Surfaces: know which role changes

Theme.colors accepts semantic colors. Its current responsibilities are:

| Theme color | Current use |
| --- | --- |
| background | Base for control fills and floating overlay backgrounds; the application may also use it for its page |
| surface | Toast background; it does not automatically fill every control or panel |
| text | Main text; mixed with background for Panel (3.5%), fields (7%) and progress tracks (6%) |
| muted | Secondary content and structural ASCII artwork |
| accent | Primary action and selected/success emphasis; mixed at 10% with background for primary button fills |
| danger / warning | Semantic feedback, accompanied by meaningful text |

Theme itself does not paint a page background. Set an application-owned page background where appropriate. Changing background affects fields and overlays as well as any page that uses that color. A nested Theme can scope a palette change, but changes all roles within that scope; it is not an independent field-surface setting.

Default and danger buttons start transparent. Primary buttons have an accent-tinted fill; text fields, selects and file inputs have a subtle neutral fill. Progress keeps a visible track even at zero. These fills stop inside the ASCII frame so the dashes remain separate from the surface.

On hover and keyboard focus, fields increase the text mix to 10% and 12%; primary buttons increase the accent mix to 16% and 18%. Invalid frames retain their error color on hover, and disabled controls do not receive hover feedback. The same rules apply on the page and inside Panel. Storybook **Foundation / Surfaces** shows the states in all palettes and sizes. There is no independent field/track surface token or extra fill prop: use the existing semantic colors to configure the palette.

If the public color roles cannot express a needed treatment, follow the [feedback workflow](agents/feedback.md) before introducing an exception.

## Numerical summaries: value, scale, meaning

Use Panel for the group, Badge for a written status, and Separator between related sections. A score needs its value, range, direction and basis. The application owns thresholds and domain interpretation; the kit supplies presentation.

```svelte
<script lang="ts">
  import { Badge, Panel, Separator } from 'svelte-ascii-ui';
</script>

<Panel title="Collection quality" size="s">
  <p>Metadata completeness: <strong>82 out of 100</strong></p>
  <Badge label="Ready for review" tone="success" size="s" />
  <p>Higher means more complete records. 82 of 100 records have all required metadata.</p>
  <Separator />
  <p>Review threshold: 80. 18 records still need an author or publication date.</p>
</Panel>
```

This supported recipe appears in **Examples / Score composition**. Status stays understandable without color. Do not put the number only inside a small Badge or rely on a tinted rectangle to explain its meaning.

Progress has progressbar semantics and a normalized value from 0 to 1. Use it for completion of work, such as importing records. A quality rating, temperature, allocation or contribution to a score is a measurement, not task completion. A labelled numeric value is often clearest. When a graphical bounded measurement is useful, use a labelled native meter with the actual scale:

```html
<label for="completeness">Metadata completeness: 82 out of 100</label>
<meter id="completeness" min="0" max="100" value="82">82 out of 100</meter>
```

Native meter appearance varies by browser. Thresholds such as low, high and optimum should only be set when the application's domain gives them a clear meaning.

Keep action placement in the application layout. Panel footer is ordinary document flow, not a sticky action bar. If a page needs persistent actions, account for the scroll container, visible focus, mobile safe areas and unobscured content rather than relying on Panel to create that behavior.
