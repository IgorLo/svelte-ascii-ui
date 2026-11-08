# Compact scale prototype: decisions pending

This experiment lives on `docs/compact-scale-comparison`. Library defaults remain unchanged until visual approval. Run Storybook and open Examples / Compact Scale / Comparison.

## Current comparison

- Three text scales: 13px, 12px compact, and 15px large. Reduce labels and control text together; preserve optical centering.
- Narrow-screen input text remains 16px. Coarse-pointer targets remain at least 44px.
- Checkbox and Switch non-shrinking geometry is fixed in the library via PR #14. This prototype uses that implementation; it has no local shrink-prevention override.
- NumberInput stepper buttons must be equal squares, independent of plus/minus glyph width.
- Select chevrons and icon-only actions need a consistent icon box and optical alignment independent of the text font.
- Pixelarticons is the preferred visual candidate in the current review. Small/compact icon boxes use 18px artwork, large uses 24px; preserve the button dimensions. Stepper text must not create a second layout row beside the SVG.
- Stepper SVGs are explicitly centered independently of grid tracks. Select uses a square trailing icon area with text padding reserved for it; its old zero-size glyph must not create an anonymous row before the SVG. Optional center guides help check optical alignment.
- The compact input text is optically raised 1px without changing field height. The three treatments are candidates for S/M/L; public sizes have not been renamed.
- Compare free SVG icon candidates before selecting a set. Preserve the selected files' license and copyright notice; do not import paid variants or the whole catalog.

## After approval

Use a shared, fixed SVG icon box with `currentColor` for built-in controls. Keep accessible names on the buttons and hide decorative SVGs from assistive technology. Preserve Button/IconButton snippet extension points. Vendor only the chosen small asset subset with its MIT notice; an icon font or a whole-catalog runtime dependency is unnecessary.

Move the selected treatment into the reusable components rather than copying story overrides into applications. Inspect Checkbox/Switch, NumberInput, Select, IconButton, button icon snippets and other directional controls for the same causes. Preserve native semantics, names, keyboard/focus behavior, disabled/loading states and forced colors.

Decide whether the resulting scale warrants another public size, or revised existing sizes, with explicit compatibility notes. Verify S/M (and any approved new size), long text, custom fonts, built-in palettes, narrow layouts and coarse pointers. Add public-boundary regressions for the confirmed shrinking and unequal-stepper defects, then update stories, design guidance and Changesets together.

This checklist is a handoff for the experiment, not approval to change the entire library or publish a release.
