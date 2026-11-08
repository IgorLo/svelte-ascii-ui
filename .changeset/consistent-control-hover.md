---
"svelte-ascii-ui": patch
---

Editable fields, Checkbox, Switch, RadioGroup and FileInput provide hover feedback without moving their layout. Invalid, disabled, read-only and keyboard-focus states retain their distinct treatment. Danger buttons keep their danger color on hover.

FileInput now renders its error frame when `aria-invalid` is true, as well as when an error message is supplied.
