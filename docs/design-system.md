# Building interfaces with ASCII UI

## Content and states
Choose the primary task, then list ready, empty, loading, updating and error
states. Retry preserves user input. Prefer native form submission and validation.
Use existing components before introducing new controls.

## Geometry
Use S for dense forms and tool panels, M for primary actions. Keep related groups
at one size. Start with 12px spacing in compact groups and 24px in normal groups.
The square art grid is independent of font metrics. Never size buttons by text
character counts. Use Panel for groups, Separator between related sections and
space between unrelated sections. Avoid nested frames when a heading suffices.
Structural borders are quieter than interactive borders. Focus is brighter and
thicker without changing layout.

## Responsive layout
Use repeat(auto-fit,minmax(min(100%,18rem),1fr)) for cards and minmax(0,1fr) for
content beside a sidebar. Collapse sidebars or use Drawer on small screens.
Controls fill their container; constrain widths at page level. Labels wrap.
Dialog window size is independent of control size; its footer stays visible as
the body scrolls. Drawer is a modal panel, not permanent navigation. Resizable
panes are a composition recipe, not a shipped drag library.

## Typography and media
DotGothic16 is optional. Theme.font selects a loaded font; decoration uses its
own monospace font. Article handles semantic HTML; Quote, Callout and Figure
compose inside. Article fills available width; a readable example column is
around 68ch. Informative images need meaningful alt; decoration uses empty alt.

## Colors and interaction
Override semantic colors through Theme.colors, not hard-coded page accents.
Check custom palette text/focus contrast. Status needs text as well as color.
Use Link for navigation, Button for action, IconButton with an accessible label.
Field connects labels/hints/errors. Essential instructions belong beside the
field, not only in Tooltip. Keep errors until corrected. Loading must not submit
twice. Error/action toasts remain until dismissed. Keyboard focus must stay
visible and return to overlay triggers.

Native Select suits short lists. Combobox adds search; MultiSelect chooses several
values. Empty, no matches, loading failure and disabled options are distinct.
Indeterminate Checkbox means part of a group is selected. RadioGroup chooses one.

## Motion
Provide pause for indefinite movement and respect reduced motion. Fix seed and
pause animations in screenshots. One viewport canvas is sufficient; do not place
an independent animated background on every panel. Default 12 fps limits repeated
work but cannot shorten one expensive custom callback.

## Agent usage
For imports, ownership, extension points and migration checks, follow the
[consumer guide](agents/using.md). For suspected kit problems, use the
[feedback workflow](agents/feedback.md). These are the authoritative operational
rules; this document defines the visual and interaction principles.
