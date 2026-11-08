---
"svelte-ascii-ui": minor
---

Adopt S/M/L control sizes across the library: compact S and medium M use 13px text, while L uses 15px. Default M controls are more compact. The previous large M treatment moves to L; use L where a spacious control is still needed, and review existing S/M layouts after upgrading. Touch targets remain at least 44px, and narrow-screen text inputs retain 16px text.

Use bundled Monocraft Light (300) for body and controls and SemiBold (600) for headings and emphasis. The optional fonts.css entry includes Light, Regular and SemiBold. Custom Theme.font overrides remain supported.

Add a small licensed SVG Icon component and named icons for Button and IconButton, preserving custom snippets and glyphs. NumberInput steppers are square, Select icons and loaders are centered, and related navigation and close actions use the same Pixelarticons subset. No runtime dependency is added.

Replace historical demo controls and temporary comparison pages with a gallery built from public components. Storybook exposes all three sizes and permanent composition examples.
