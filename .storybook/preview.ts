import type { Preview } from '@storybook/svelte-vite';
import { palettes, type Palette } from '../src/lib/theme';
import StoryTheme from './StoryTheme.svelte';
import '../src/lib/theme.css';
import '../src/lib/fonts.css';
const preview: Preview = {
  decorators: [(_story, context) => {
    const palette: Palette = context.globals.palette ?? 'phosphor';
    const root = document.documentElement;
    root.classList.add('aui-scrollbars');
    root.style.setProperty('--muted', palettes[palette].muted);
    root.style.setProperty('--accent', palettes[palette].accent);
    return { Component: StoryTheme, props: { palette } };
  }],
  globalTypes: { palette: { description:'Палитра',toolbar:{title:'Палитра',items:['phosphor','paper','plum'],dynamicTitle:true} } },
  initialGlobals: { palette:'phosphor' },
  parameters: { layout:'fullscreen', controls:{expanded:true}, a11y:{test:'todo'}, options:{storySort:{order:['Introduction','Foundation','Actions','Forms','Feedback','Overlays','Navigation','Content','Effects','Examples']}} },
};
export default preview;

