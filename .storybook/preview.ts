import type { Preview } from '@storybook/svelte-vite';
import StoryTheme from './StoryTheme.svelte';
import '../src/lib/theme.css';
import '../src/lib/fonts.css';
const preview: Preview = {
  decorators: [(_story,context)=>({Component:StoryTheme,props:{palette:context.globals.palette}})],
  globalTypes: { palette: { description:'Палитра',toolbar:{title:'Палитра',items:['phosphor','paper','plum'],dynamicTitle:true} } },
  initialGlobals: { palette:'phosphor' },
  parameters: { layout:'fullscreen', controls:{expanded:true}, a11y:{test:'todo'}, options:{storySort:{order:['Introduction','Foundation','Actions','Forms','Feedback','Overlays','Navigation','Content','Effects','Examples']}} },
};
export default preview;

