# Building interfaces with ASCII UI

## Content and states
Choose the primary task, then list ready, empty, loading, updating and error
states. Retry preserves user input. Prefer native form submission and validation.
Use existing components before introducing new controls.

## Geometry
Use S for dense forms and tool panels, M for everyday controls and L for prominent
actions or spacious forms. Keep related groups at one size. Start with 10px spacing
in compact groups, 12px in medium groups and 24px in large groups.
The square art grid is independent of font metrics. Never size buttons by text
character counts. Use Panel for groups, Separator between related sections and
space between unrelated sections. Avoid nested frames when a heading suffices.
Structural borders are quieter than interactive borders. Focus is brighter and
thicker without changing layout.

| Size | Text | Minimum control height | Checkbox mark | Switch mark |
| --- | --- | --- | --- | --- |
| S | 13px | 32px | 26 × 26px | 50 × 26px |
| M | 13px | 39px | 30 × 30px | 54 × 30px |
| L | 15px | 48px | 40 × 40px | 64 × 40px |

Checkbox marks stay square, including beside wrapped labels. Narrow containers
do not compress choice marks. On coarse
pointers, the surrounding choice target remains at least 44px tall without
enlarging the mark.

For dense forms, surface roles and numerical summaries, use the
[composition guide](composition.md). Storybook's Foundation / Control sizes shows
all three supported treatments using the public components.

## Responsive layout
Use repeat(auto-fit,minmax(min(100%,18rem),1fr)) for cards and minmax(0,1fr) for
content beside a sidebar. Collapse sidebars or use Drawer on small screens.
Controls fill their container; constrain widths at page level. Labels wrap.
Dialog window size is independent of control size; its footer stays visible as
the body scrolls. Drawer is a modal panel, not permanent navigation. Resizable
panes are a composition recipe, not a shipped drag library.

## Typography and media
The optional bundled Monocraft family uses Light (300) for body and control text,
Regular (400) when explicitly requested, and SemiBold (600) for headings and emphasis.
The font import loads local files; no external font service is required.
Theme.font selects a loaded font; decoration uses its
own monospace font. Article handles semantic HTML; Quote, Callout and Figure
compose inside. Article fills available width; a readable example column is
around 68ch. Informative images need meaningful alt; decoration uses empty alt.

## Colors and interaction
Override semantic colors through Theme.colors, not hard-coded page accents.
Check custom palette text/focus contrast. Status needs text as well as color.
Fields and progress tracks use quiet neutral fills; primary buttons use an
accent-tinted fill. Derive these surfaces from the existing semantic colors and
clip them inside ASCII frames. Keep the same treatment on the page and in Panel;
see [surface roles and states](composition.md#surfaces-know-which-role-changes).
Use Link for navigation, Button for action, IconButton with an accessible label.
Built-in action icons use a small MIT-licensed Pixelarticons subset, centered in
fixed SVG boxes: 18px in S/M and 24px in L. Button accepts a named icon or a snippet;
IconButton stays square, and NumberInput steppers follow the field height. Custom
snippets and glyphs remain supported. Frames are independent SVG artwork, with no
optical translation applied to icons.
Field connects labels/hints/errors. Essential instructions belong beside the
field, not only in Tooltip. Keep errors until corrected. Loading must not submit
twice. Error/action toasts remain until dismissed. Keyboard focus must stay
visible and return to overlay triggers.

On hover-capable pointers, editable fields and choice targets gain frame or
surface emphasis without changing geometry or selection. Disabled and read-only
fields do not advertise editing. Invalid fields retain their error frame on hover;
keyboard focus remains distinct. Danger buttons retain their danger color.
Use Popover's compact trigger for contextual help beside a label; its native
button keeps an accessible name and a separate focus indicator.

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

## Scrollbars

Native scrolling belongs to the application container. The public `aui-scrollbar` class provides square, full-width thumbs and a quiet black track at 12% opacity in Chromium/WebKit, using a 16px gutter and small pixel arrows on native scrollbar buttons. Firefox uses theme colors with system geometry. Keep native scrolling and a visible keyboard focus indication for focusable scroll regions. Forced-colors and unsupported styling use system treatment. See the [composition example](composition.md#native-scroll-containers) for engine limits and opt-in scope.

## Control artwork

Checkbox frame tiles fit the available mark using complete rescaled repeats. A small mark must keep its middle strokes without increasing the selected control size. Slider and Range share geometric endcaps and a dashed rail on one axis, independent of font glyph metrics; their native inputs, hit areas and thumb-to-value positions remain unchanged. The art uses 1px strokes and 4px dash/gap segments, checked at small/wide scales and multiple raster densities. A selected interval includes its terminal tail and endcap when it reaches the minimum or maximum; Range endcaps outside the selected interval stay muted. Numeric tick labels stay whole and centered, even in a host that allows arbitrary text wrapping. Custom text labels wrap within bounded space, align inward near the endpoints and reserve their height. Keep labels concise enough to distinguish neighboring ticks. CSS zoom, DPR and native browser zoom are separate checks. See Storybook **Forms / Control artwork** for S/M/L comparisons.

## Reading typography

Body and long Article text can use a separate reading scale while controls retain their S/M/L geometry. Theme text tokens and `size="inherit"` for inline Link/Badge are documented in the [composition guide](composition.md#reading-text-without-enlarging-controls). Existing compact defaults remain supported. Compare longer reading text at 16–18px with Regular 400 using real content; this is a design starting point, not a universal accessibility threshold. Keep sources and adjacent dates at one scale, permit wrapping and preserve browser text enlargement.

## Modal detail sheets

Use one `Dialog mobilePlacement="bottom"` when the same task should be a centered window on wide screens and a bottom sheet at widths up to 600px. Keep one content/form instance and preserve state and focus as the viewport changes. Centered confirmations remain available through the default `center` mode. Use `Drawer side="bottom"` when the intended pattern is bottom-aligned at every width. Short sheets use content height; long sheets scroll while keeping header/footer actions accessible. Preserve safe-area space and keyboard focus. The [component guidance](components.md#one-dialog-across-desktop-and-narrow-layouts) describes the responsive contract and device-testing limits.
