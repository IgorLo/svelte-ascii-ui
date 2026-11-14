# Changelog

## 0.4.0

### Minor Changes

- Add `MusicPlayer` with a compact cassette opener and responsive cassette controls. Supply audio URLs or Blobs, set the initial shuffle state, seek, adjust volume, and navigate playback history. Shuffle avoids repeats within each cycle and is disabled for empty or single-track playlists. Playback starts manually and loads only the selected track. Optional button feedback has an independent volume, defaulting to one third; seeking and volume controls stay silent. Click the cassette reels or use Enter/Space to pause visual animation while music keeps playing. Theme colors, translated labels, reduced motion, and independent instances are supported. Storybook and installed-package examples document the public component.

## 0.3.0

### Minor Changes

- Add `Dialog mobilePlacement="bottom"` for one form or detail view that stays centered above 600px and opens as a bottom sheet on narrower screens. Resizing preserves the same content, input values and focus, and keeps the active control visible. The default centered presentation remains unchanged.
- Add `Drawer side="bottom"` for a full-width panel with natural short-content height, a scrollable long body, persistent header/footer, safe-area padding, visual-viewport handling and background scroll locking. Existing left/right placement and size behavior remain available.
- Add Theme reading tokens for independently configuring body and Article size, weight and line height, and `size="inherit"` for inline Link and Badge. Existing defaults and explicit control sizes remain unchanged; nested Themes honor their own body text size.
- Add `Select showPlaceholder={false}` to show only supplied options, independently of the current value and native required validation. The default remains `true`; pass a matching initial value when an initial selection is required.
- Add the opt-in `aui-scrollbar` class for themed native scrolling. Chromium and WebKit use a 6px gutter, a square full-width thumb, a subtle dark track and one outward-pointing pixel arrow at each end. Firefox retains native geometry with theme colors; forced-colors retains system treatment.

### Patch Changes

- Keep the middle strokes of the small Checkbox frame visible without enlarging its mark or control.
- Align Slider and Range endcaps and dashed rails, color the terminal tail and cap when selection reaches the minimum or maximum, and avoid muted traces at fractional display scales. Numeric tick labels stay on one line; custom prose labels wrap within the scale and reserve their height.
- Expand gallery, Storybook, public usage documentation and installed-package/SSR examples for the supported controls, reading typography and responsive overlays. Add a README cover and gallery screenshots for component states and all three palettes.
- Require focused temporary before/after demos for component visual approval, and clarify that incoming UI reports describe the end-to-end workflow and desktop/mobile expectations before proposing a component.

## 0.2.0

### Minor Changes

- Add S/M/L sizes throughout the library. S and M use 13px text; L uses 15px. Default M is now more compact. **Migration:** use L for the previous spacious M treatment and review existing S/M layouts after upgrading. Touch controls retain at least 44px targets; text inputs on narrow screens retain 16px text.
- Replace the default DotGothic16 font with Monocraft: Light (300) for body and controls, SemiBold (600) for headings and emphasis. The optional `svelte-ascii-ui/fonts.css` entry bundles Light, Regular and SemiBold. **Migration:** the import path stays unchanged; remove an explicit `DotGothic16 UI` override to use Monocraft, or load your own font and keep `Theme.font`. Text metrics and wrapping change.
- Add `Icon` and named icons for `Button` and `IconButton`, using a small MIT-licensed Pixelarticons subset without a runtime dependency. Custom icon snippets and glyphs remain supported. NumberInput steppers stay square; Select icons, loaders and related navigation actions use consistent alignment.
- Add `Popover triggerVariant="compact"` for contextual help beside a label, with native keyboard behavior, visible focus and larger touch targets. The existing button trigger remains the default.

### Patch Changes

- Give text fields, selects and file inputs a subtle fill, primary buttons an accent-tinted fill, and Progress a visible track even at zero. Fills derive from existing theme colors and stay inside ASCII frames, both on the page and inside Panel.
- Add hover feedback to editable fields, Checkbox, Switch, RadioGroup and FileInput without moving their layout. Preserve invalid, disabled, read-only and keyboard-focus states; danger buttons retain their danger color on hover. FileInput now shows its error frame for `aria-invalid`, even without an error message.
- Keep Checkbox marks square and Switch marks at their intended width beside wrapped labels in narrow containers, including on touch devices.
- Replace duplicated demo controls and temporary experiments with a gallery built from public components. Storybook covers S/M/L, surfaces, compact help and score compositions. Document density, semantic colors, numerical summaries and supported extension points.
- Remove unused font-comparison packages, duplicate demo font assets and the unused direct user-event development dependency.
- Add contributor guidance for design review, shared-cause issue diagnosis and verified issue closure. Use Changesets to collect independent changes on develop and prepare one version per release. GitHub Release publication checks require matching notes, an unused stable version and explicit human approval for major increases.

## [0.1.0] - 2026-11-08

### Added
- Svelte 5 components with ASCII-style frames, compact and medium controls, three palettes and configurable theme colors.
- Form controls, file selection, sliders, dialogs, drawers, tooltips, navigation and loading, error and empty states.
- Article typography, expandable images and configurable animated ASCII backgrounds.
- Storybook examples, integration and maintenance guides, TypeScript declarations and an optional DotGothic16 font.
- MIT license and regression checks for browser interactions, animation scheduling and installed-package rendering.
