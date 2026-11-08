---
"svelte-ascii-ui": minor
---

Replace the bundled DotGothic16 font with Monocraft and use it as the default Theme font. The `fonts.css` import path and `Theme.font` override remain unchanged. Applications that explicitly selected `DotGothic16 UI` must load that font themselves or remove the override to use Monocraft. Text metrics and wrapping change with the new default.
