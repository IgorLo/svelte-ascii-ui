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
| Media | MusicPlayer |
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

## Reading text

Article supports the public Theme reading tokens. Inline Link and Badge additionally accept `size="inherit"` to match a source line, caption or paragraph; existing S/M/L defaults are preserved. See [reading text](composition.md#reading-text-without-enlarging-controls) and Storybook **Foundation / Reading typography** for independent text settings and representative compositions.

## Bottom drawer

Use `Drawer side="bottom"` for a modal detail sheet. It fills viewport width, grows with short content and limits long content to the visible viewport, with a scrollable body and a persistent header/footer. `size` continues to set width for left/right drawers; it does not narrow a bottom sheet. Centered Dialog and existing left/right Drawer defaults remain separate patterns.

The bottom drawer accounts for safe-area insets and responds to visual viewport changes where supported. The host page should include `viewport-fit=cover` in its viewport meta tag to expose device safe-area insets. The body reserves scroll clearance so focused framed inputs remain visible above footer actions. Native modal focus, Escape, backdrop dismissal and focus return remain in place; the background stays locked while a bottom modal is open. Pinch zoom does not reposition the sheet to chase the magnified visual viewport. Physical keyboard/safe-area behavior still needs testing on the intended devices. Drag-to-dismiss is not provided. See Storybook **Overlays / Drawer / Bottom** and **Bottom long content**.

## One Dialog across desktop and narrow layouts

Use `Dialog mobilePlacement="bottom"` when the same detail view or form should be centered on a wide screen and sit at the bottom on a narrow screen. At widths up to and including 600px, it uses the bottom-sheet geometry and scrolling; above 600px, its normal centered size applies. The application supplies one Dialog, one `open` binding and one content/form instance. Resizing an open Dialog keeps that DOM instance, input values and focus, and reveals the active control within the new content viewport.

`mobilePlacement` defaults to `center`, preserving centered confirmations. This is a presentation choice for the user task, not a requirement that every phone modal be a sheet. Drawer keeps explicit side placement; it does not accept this Dialog-only option. Bottom Dialog shares safe-area padding, visual-viewport handling, focus clearance and background scroll locking with the bottom Drawer. The [bottom-drawer device requirements](#bottom-drawer) still apply, including actual-device keyboard testing.

See Storybook **Overlays / Dialog / Responsive details** and **Responsive long content**. Change the viewport while the dialog stays open and a field contains edited text; no consumer media query or conditional Dialog/Drawer rendering is needed.


## Music player

`MusicPlayer` is a compact play/pause button, marquee, thin progress rail and cassette-icon opener. The cassette contains previous/next, shuffle, seek, volume, mute, motion pause and close controls. It uses Theme colors and the existing S controls (44px touch targets); the primary cassette play button uses L. Width belongs to the host composition, up to the player's compact 480px row. There is no queue editor, autoplay or persistence.

```svelte
<script lang="ts">
  import { MusicPlayer, Theme, type MusicTrack } from 'svelte-ascii-ui';
  import recording from './assets/recording.mp3?url';
  import press from './assets/press.wav?url';
  let shuffle = $state(true);
  const tracks: MusicTrack[] = [
    { id: 'evening', title: 'Evening recording', artist: 'Artist', src: recording },
    { id: 'rain', title: 'Rain recording', src: '/audio/rain.mp3' },
  ];
</script>
<Theme palette="plum">
  <MusicPlayer {tracks} bind:shuffle clickSound={press} />
</Theme>
```

Each track needs a stable unique `id`, `title` and `src`; `artist` is optional. `src` accepts a URL string or a Blob/File, so a host can pass selected files directly: `{ id: 'local', title: file.name, src: file }`. The host owns file selection and playlist loading. The component creates and revokes its own Blob URLs; it does not revoke host-supplied URL strings.

The music element has no source until the user requests playback. Thereafter only the selected track is attached; switching does not preload other tracks. Browser buffering and byte-range requests depend on the audio format and serving host, so this is not a streaming service or a guarantee that the current file is downloaded in pieces. Remote sources need to be playable by the browser; serve local project assets through the application's normal public/imported-asset pipeline.

`shuffle` and `volume` support binding. Shuffle visits each track once per cycle, avoids repeating the same track across the cycle boundary, and previous/next follow the visited navigation history when going back. With zero or one track shuffle is disabled and effectively off. A supplied `shuffle=true` is retained for later playlist expansion. A single recording repeats after it ends; an empty playlist disables playback. Replacing the playlist preserves the current stable ID when possible, otherwise selects the first remaining track, continuing only if playback was already requested. An empty replacement stops music. Replacing a source under the same ID reloads that source.

Music volume defaults to `0.4` and is normalized to 0–1. `clickSound` is optional and independent of music; omitted means silent buttons. Its `clickVolume` defaults to `1/3`. Seek, volume and mute/unmute do not play feedback. Feedback failures do not prevent the player's action. The library contains no bundled recording or click sound; Storybook supplies its demo audio separately.

Pass `labels` to translate individual visible and accessible strings; `MusicPlayerLabels` and the Storybook API are the complete reference. The cassette is one native modal: centered on wider screens and bottom-aligned at widths up to 600px, with focus containment, Escape/backdrop dismissal and focus return. Closing the cassette does not pause or recreate the music. Click the cassette reels, or focus them and press Enter/Space, to pause or resume the marquee and reel animation without stopping music. There is no separate animation transport icon; reduced-motion preferences disable animation. Multiple instances keep independent media and history; starting one does not automatically stop another.

See **Media / MusicPlayer** for playlist, single-track, empty, long-title, shuffled, unavailable-audio and silent-feedback states, and **Media / MusicPlayer examples** for local Files and multiple instances. Automated browser checks cover real PCM playback, public controls, source replacement and ownership, modal focus and responsive composition. Physical mobile devices, screen readers and the consumer's own audio host require separate retesting.
