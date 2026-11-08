# Svelte ASCII UI

Svelte 5 component library with ASCII frames, optional DotGothic16 typography, configurable palettes, keyboard focus, S/M controls and responsive Storybook examples. The npm registry release is not published yet; install the local tarball in another project.

## Working with agents

- **Using or migrating an application:** read the installed version's [consumer guide](docs/agents/using.md), including the short instruction to add to the application's own agent rules.
- **Reporting a problem or missing capability:** follow the [feedback workflow and issue template](docs/agents/feedback.md). Show the owner the complete draft and obtain approval before publishing an issue.
- **Changing this library:** follow the [maintenance workflow](docs/agents/maintaining.md), including documentation updates in the same change. Repository sessions also read the root `AGENTS.md`.

These guides ship with the package so they stay tied to the installed version. Installing the package does not automatically activate them in an agent session; use the consumer guide's explicit project pointer. Internal component styles are not public extension points.

## Run

```sh
npm install
npm run storybook
```

Open http://localhost:6006. Each component has Controls, named states and an API page. The palette toolbar switches Phosphor/Paper/Plum. Use the viewport toolbar for narrow screens. Snippets and callbacks have composed examples rather than JSON editors.

The original visual specimen remains at `npm run dev` (5173). It is a historical visual reference; production integrations import the library, not prototype/example files.

## Install

```sh
# In this repository:
npm pack
# In your Svelte project:
npm install /absolute/path/to/svelte-ascii-ui-0.1.0.tgz
```

Use Svelte 5.57 or later. Svelte is a peer dependency. There are no other runtime dependencies; Storybook and experimental fonts are development-only.

```svelte
<script lang="ts">
  import { Theme, Button, Input, Field } from 'svelte-ascii-ui';
  import 'svelte-ascii-ui/styles.css';
  import 'svelte-ascii-ui/fonts.css'; // optional bundled OFL DotGothic16 subset
  let name = $state('Новая заметка');
</script>

<Theme palette="phosphor">
  <Field label="Название" hint="Короткое, но узнаваемое.">
    {#snippet children(control)}
      <Input {...control} bind:value={name} name="title" />
    {/snippet}
  </Field>
  <Button label="Сохранить" variant="primary" onclick={() => console.log(name)} />
</Theme>
```

Import styles once. Theme scopes tokens and frame SVGs around a screen or application. Native forms use `type="submit"` on their submit Button; default is button. Supply visible labels or aria-labels.

## Themes

```svelte
<Theme palette="plum" colors={{ accent: '#70cfff', background: '#141b24' }}>
  <!-- application -->
</Theme>
```

Colors: background, surface, text, muted, accent, danger, warning. Theme regenerates matching frame images. Its `font` prop selects another loaded font. Text can wrap differently; frame geometry is independent. The optional font entry includes its OFL license.

S/M controls are 36/48 CSS pixels high; coarse pointers have at least 44px targets. Article has no S/M variant and occupies available width. Width constraints belong to the page. See [design guide](docs/design-system.md).

See the [complete component inventory and verification guide](docs/components.md). The catalogue keeps composed examples alongside individual components.

## ASCII background

Background fills its parent's dimensions; give the parent a height. Defaults: cellWidth=14, cellHeight=18, color=#c4ed83, opacity=.35, speed=.35, fps=12, paused=false. `pattern` receives x/y cell centers in CSS pixels, row/column, grid/surface dimensions and speed-scaled time. Return `{ character, opacity? }` or null. Keep callbacks pure and inexpensive.

```svelte
<script lang="ts">
  import { Background, createSineWaves } from 'svelte-ascii-ui';
  const pattern = createSineWaves({ wavelength: 500, amplitude: 100,
    spacing: 500, wavelengthVariability: .5, waveRandomness: .9, seed: 42 });
</script>
<div style="height: 300px"><Background {pattern} /></div>
```

createAmbientWaves supplies soft interference; createSineWaves supplies rotated bands. Variability/randomness range from 0 to 1; zero disables the effect. Seed is deterministic. Randomize in the app's onMount if desired, never during SSR or every frame. For a page background use an isolated parent and a fixed inset:0, z-index:-1 wrapper. Provide a pause control for indefinite motion.

Canvas pauses offscreen, in hidden tabs, for reduced motion, at zero opacity or zero size. FPS changes cadence, not speed. A ~20,000-cell guard enlarges cells on very large surfaces; this does not guarantee a time budget for arbitrary callbacks.

## Build and verify

```sh
npm ci
npx playwright install chromium --only-shell
npm run check
npm test
npm run build:lib
npm run build:demo
npm run build:storybook
npm run test:package
```

`npm test` runs animation/scheduler tests and browser interaction tests in headless Chromium. `test:package` builds the tarball, checks its contents and documentation links, installs it in the consumer fixture, and checks types, client build and SSR. It does not publish anything. Browser installations can use Playwright's `PLAYWRIGHT_BROWSERS_PATH` environment variable; use the same value when installing and testing.

GitHub Actions runs these checks plus demo and Storybook builds on pushes and pull requests. Configure the `verify` job as a required status check in repository branch rules to prevent merging failures. Failure screenshots are uploaded as artifacts. This is a behavioral baseline, not exhaustive component, visual or accessibility coverage.

Outputs: dist (library), demo-dist (visual specimen), storybook-static (static catalogue). The tarball contains dist, package metadata/README and the selected guidance listed in package.json. Stories, prototype files and fixtures stay out. Inspect `npm pack --dry-run --json` when changing package contents.

Version 0.1.0 APIs may evolve with real project use. Accessibility checks are not certification: applications own labels, content, palette contrast and page structure.
