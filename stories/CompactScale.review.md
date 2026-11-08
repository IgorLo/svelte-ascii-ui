# Compact scale prototype: decisions pending

This experiment lives on `docs/compact-scale-comparison`. Library defaults remain unchanged until visual approval. Run Storybook and open Examples / Compact Scale / Comparison.

## Current comparison

- Three text scales: 13px, 13px compact, and 15px large. The compact variant keeps smaller spacing, with text raised from 12px for readability. Demo body text uses Monocraft Light 300; headings and emphasis use SemiBold 600.
- Narrow-screen input text remains 16px. Coarse-pointer targets remain at least 44px.
- Checkbox and Switch non-shrinking geometry is fixed in the library via PR #14. This prototype uses that implementation; it has no local shrink-prevention override.
- NumberInput stepper buttons must be equal squares, independent of plus/minus glyph width.
- Select chevrons and icon-only actions need a consistent icon box and optical alignment independent of the text font.
- Pixelarticons is the preferred visual candidate in the current review. Small/compact icon boxes use 18px artwork, large uses 24px; preserve the button dimensions. Stepper text must not create a second layout row beside the SVG.
- Stepper SVGs are explicitly centered independently of grid tracks. Select uses a square trailing icon area with text padding reserved for it; its old zero-size glyph must not create an anonymous row before the SVG. Optional center guides help check optical alignment.
- Compact input text uses symmetric vertical padding with Monocraft; the former 1px upward adjustment has been removed. The three treatments are candidates for S/M/L; public sizes have not been renamed.
- Compare free SVG icon candidates before selecting a set. Preserve the selected files' license and copyright notice; do not import paid variants or the whole catalog.

## After approval

Select chevrons and stepper icons use geometric centering with no optical translation. The former 1px corrections and their toggle have been removed after review. The frame SVG is symmetric; raster checks of the large plus/minus at 100% showed matching frame and icon centers. Do not introduce a global frame translation without a reproducible asymmetric case.

Monocraft is approved as the default font for the library and demos. The font picker and rejected font assets are removed. The unmodified font and OFL notice are bundled under src/lib/fonts; the optional fonts.css entry and Theme.font override remain supported. The size/icon prototype still needs final visual review before its implementation is moved into public components.

Use a shared, fixed SVG icon box with `currentColor` for built-in controls. Keep accessible names on the buttons and hide decorative SVGs from assistive technology. Preserve Button/IconButton snippet extension points. Vendor only the chosen small asset subset with its MIT notice; an icon font or a whole-catalog runtime dependency is unnecessary.

Move the selected treatment into the reusable components rather than copying story overrides into applications. Inspect Checkbox/Switch, NumberInput, Select, IconButton, button icon snippets and other directional controls for the same causes. Preserve native semantics, names, keyboard/focus behavior, disabled/loading states and forced colors.

Decide whether the resulting scale warrants another public size, or revised existing sizes, with explicit compatibility notes. Verify S/M (and any approved new size), long text, custom fonts, built-in palettes, narrow layouts and coarse pointers. Add public-boundary regressions for the confirmed shrinking and unequal-stepper defects, then update stories, design guidance and Changesets together.

This checklist is a handoff for the experiment, not approval to change the entire library or publish a release.
