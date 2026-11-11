# Component inventory

Public imports come from `svelte-ascii-ui`. Wrap the application or a section in `Theme`. See each Storybook Docs page for prop types, Controls and state examples.

| Area | Public components |
| --- | --- |
| Foundation | Theme, Panel, Separator |
| Actions | Button, IconButton, Icon, Link |
| Forms | Field, Input, Textarea, Select, Checkbox, RadioGroup, Switch, ToggleGroup, NumberInput, SearchInput, PasswordInput, Combobox, MultiSelect, TagInput, FileInput, Slider, Range |
| Feedback | Loader, Progress, Skeleton, Badge, Alert, Toast, EmptyState, DataState |
| Overlays | Dialog, Drawer, Tooltip, Popover, DropdownMenu, ContextMenu |
| Navigation | Tabs, Breadcrumbs, Pagination, Accordion, Collapsible, Toolbar |
| Content | Article, Quote, Callout, Figure |
| Effects | Background; createSineWaves and createAmbientWaves factories |

## Composition and state ownership

- Components with a control `size` support `s`, `m`, `l`. Pass matching sizes to related controls; defaults remain component-owned. Dialog/Drawer window sizes and Article typography are separate.
- Button `icon`/`iconEnd` accept `plus`, `minus`, `chevron-down`, `close`, `refresh`, `info`, or a Svelte snippet. IconButton accepts an `icon` name and requires its accessible `label`; custom `children` and `glyph` still work. Icon is decorative by default; supply `label` when it independently conveys information.

- `bind:value` controls inputs and selection; checkboxes and switches use `bind:checked`. Checkbox also supports `bind:indeterminate`.
- Range has independent `bind:lower` and `bind:upper` values. Progress takes a normalized 0–1 value.
- Field's child snippet receives an ID, description and invalid attributes to spread onto the actual input.
- Popover's `triggerVariant="compact"` shows a small `[?]` help trigger with `label` as its accessible name. Its native button keeps a 24px minimum target (44px with a coarse pointer) in normal layout flow; allow room for that target beside labels and other actions. A `trigger` snippet replaces only the button content, so do not nest an interactive element. The default `button` variant and S/M/L sizing are available. Essential instructions still belong beside the field.
- Dialog/Drawer use `bind:open`, a required accessible title and header/body/footer snippets. Window size is separate from control size.
- Figure has an optional expanded image dialog. Article's width is owned by the page; the demo limits it for readability.
- Loader is decorative: put a text status or `aria-busy` on the loading region. Skeleton is hidden from assistive technology for the same reason.
- Command palette and editor are composed examples, not additional monolithic dependencies.
- Theme owns semantic colors and frame tokens. Snippets and callbacks are edited in code; serializable props have Storybook Controls.

## Deliberately excluded

The current version does not include tables, drop zones, upload queues, galleries, specialized date/color inputs, clipboard/code-block tools or resizable-pane controllers. FileInput handles file selection; Figure handles images with optional expansion.

## Verification

`npm test` exercises deterministic animation patterns and frame scheduling, plus Chromium regression tests for action guards, form defaults/events/reset/submission, keyboard selection and range boundaries, modal focus/dismissal, tooltips, file selection/clearing, and error/retry composition. Tests use public component APIs and accessible roles rather than internal CSS selectors. `npm run test:package` verifies the packed artifact and its installed consumer, including SSR.

Storybook's Examples/Form contracts and Examples/Editor/Save and retry also contain replayable interaction assertions. Forms have submission/reset and retry examples. Run the catalogue's `/story-smoke.html` page to load every story and report rendering failures; this all-story smoke page and the Storybook play functions are not part of the automated browser suite. CI builds the catalogue and runs the separate behavioral tests. This baseline is not an accessibility or behavioral certification of every component/state.

The accessibility addon runs axe checks per story. Inconclusive results require manual inspection. Keyboard and focus checks complement automation; actual screen-reader and physical mobile-device testing remain separate from desktop browser checks.

## Public native scrollbar style

`aui-scrollbar` is an opt-in class provided by the Theme stylesheet, not a ScrollArea component. Add it to an application-owned scroll container under Theme. See [native scroll containers](composition.md#native-scroll-containers) for keyboard naming, layout ownership and platform fallbacks.

## Optional native Select choices

`Select showPlaceholder={false}` omits the inserted empty choice. Supply a bound initial value matching an enabled option when a visible initial selection is required. On initial render an empty or unmatched bound value remains unselected; the component does not silently choose the first option. Native form reset is a separate action: if no option matches the initial value, the browser selects the first enabled option and the binding follows that value. With the default `showPlaceholder={true}`, `placeholder` supplies the empty option label and an optional Select can return to an empty value.

`required` independently controls native form validity. It does not show or hide choices. Bindings, `name`/FormData and native form reset remain supported; reset restores the matching initial selection. See Storybook **Forms / Select / Options only**, **Optional** and **Required**.
